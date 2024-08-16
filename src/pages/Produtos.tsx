
import { Loader2 } from 'lucide-react';
import Execel from '@/assets/xlxs.png';
import PDF from '@/assets/pdf.png';
import Lista from '@/assets/estoque.png';
import Logo from '@/assets/logo.jpeg'
import EmAlta from '@/assets/estoque-pronto.png'
import EmBaixa from '@/assets/fora-de-estoque.png'
import Medalha from "@/assets/medalha-de-ouro.png"
import Valor from "@/assets/bolsa-de-dinheiro.png"

import { useState } from 'react';
import Adicionar from '@/assets/adicionar-produto.png'
import InfoClient from '@/assets/infocliente.png';
import Telefones from '@/assets/chamada-telefonica.png';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CriarCliente, GetClientes } from '@/services/Clientes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

interface Cliente {
    id: string;
    nome: string;
    apelido: string;
    cep: string;
    numero: string;
    rua: string;
    bairro: string;
    cidade: string;
    complemento: string;
    celular: string;
    telfixo: string;
    email: string;
    createdAt: string;
}

const formatPhoneNumber = (number: string) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
};

const Produtos = () => {
    const [show, setShow] = useState(false);
    const [cliente, setCliente] = useState({
        nome: '',
        apelido: '',
        cep: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        rua: '',
        telfixo: '',
        celular: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setShow(!show);
    };

    const handleinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCliente((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCepBlur = async () => {
        if (cliente.cep.length === 8) {
            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cliente.cep}/json/`);
                setCliente((prev) => ({
                    ...prev,
                    rua: data.logradouro || '',
                    bairro: data.bairro || '',
                    cidade: data.localidade || '',
                    complemento: data.complemento || ''
                }));
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Formatar números de telefone antes de salvar
            const formattedCliente = {
                ...cliente,
                telfixo: formatPhoneNumber(cliente.telfixo),
                celular: formatPhoneNumber(cliente.celular)
            };

            await CriarCliente(formattedCliente);
            alert('Cliente cadastrado com sucesso!');
            setShow(false);
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
        } finally {
            setLoading(false);
        }
    };


    const generatePDF = async () => {
        setLoading(true);
        try {
            // Obtenha os dados dos clientes
            const response = await GetClientes();
            console.log('response', response);
            if (response && response.items) {
                console.log('response.items', response.items);
                console.log('response', response.items);
                const items = response.items as Cliente[];  // Assegura que items é do tipo Cliente[]
    
                // Cria um novo documento PDF
                const doc = new jsPDF();
        
                // Adiciona o título
                doc.setFontSize(18);
                doc.text('Lista de Clientes', 14, 22);
        
                // Adiciona os dados dos clientes manualmente
                let y = 30; // Posição inicial Y para a tabela
                doc.setFontSize(12);
                doc.text('Nome', 14, y);
                doc.text('Apelido', 50, y);
                doc.text('CEP', 90, y);
                doc.text('Número', 120, y);
                doc.text('Complemento', 150, y);
                doc.text('Bairro', 180, y);
                doc.text('Cidade', 210, y);
                doc.text('Rua', 240, y);
                y += 10; // Espaço entre o cabeçalho e a primeira linha de dados
        
                // Adiciona cada linha de cliente
                items.forEach((cliente) => {
                    console.log('Adicionando cliente:', cliente);
                    doc.text(cliente.nome, 14, y);
                    doc.text(cliente.apelido, 50, y);
                    doc.text(cliente.cep, 90, y);
                    doc.text(cliente.numero, 120, y);
                    doc.text(cliente.complemento, 150, y);
                    doc.text(cliente.bairro, 180, y);
                    doc.text(cliente.cidade, 210, y);
                    doc.text(cliente.rua, 240, y);
                    y += 10; // Move para a próxima linha
                });
        
                // Salva o PDF
                doc.save('lista_clientes.pdf');
            } else {
                console.error('Resposta da API inválida ou sem clientes.');
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        } finally {
            setLoading(false);
        }
    };
    
    

    const generateExcel = async () => {
        setLoading(true);
        try {
            const response = await GetClientes();
            if (response && response.items) {
                const items = response.items as Cliente[];

                const worksheetData = [
                    ['Nome', 'Apelido', 'CEP', 'Número', 'Complemento', 'Bairro', 'Cidade', 'Rua'],
                    ...items.map(cliente => [
                        cliente.nome,
                        cliente.apelido,
                        cliente.cep,
                        cliente.numero,
                        cliente.complemento,
                        cliente.bairro,
                        cliente.cidade,
                        cliente.rua,
                    ])
                ];

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

                XLSX.writeFile(workbook, 'lista_clientes.xlsx');
            } else {
                console.error('Resposta da API inválida ou sem clientes.');
            }
        } catch (error) {
            console.error('Erro ao gerar Excel:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full flex flex-col capitalize">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>
            {show &&
                <div className="fixed inset-0 bg-slate-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%]">
                        <div className='flex w-full items-center'>
                            <img src={InfoClient} className='w-5 mr-2' /><span className='text-sm'>Informações do cliente</span>
                        </div>
                        <Input
                            name="nome"
                            placeholder='Nome'
                            value={cliente.nome}
                            onChange={handleinputChange}
                            className='my-1'
                        />
                        <Input
                            name="apelido"
                            placeholder='Apelido'
                            value={cliente.apelido}
                            onChange={handleinputChange}
                        />
                        <div className='flex my-2'>
                            <Input
                                name="cep"
                                type='number'
                                placeholder='CEP'
                                value={cliente.cep}
                                onChange={handleinputChange}
                                onBlur={handleCepBlur}
                                className='mr-2'
                            />
                            <Input
                                name="numero"
                                placeholder='Nº'
                                value={cliente.numero}
                                onChange={handleinputChange}
                            />
                        </div>
                        <Input
                            name="complemento"
                            placeholder='Complemento'
                            value={cliente.complemento}
                            onChange={handleinputChange}
                            className='my-1'
                        />
                        <Input
                            name="bairro"
                            placeholder='Bairro'
                            value={cliente.bairro}
                            onChange={handleinputChange}
                            className='my-2'
                        />
                        <Input
                            name="cidade"
                            placeholder='Cidade'
                            value={cliente.cidade}
                            onChange={handleinputChange}
                            className='my-2'
                        />
                        <Input
                            name="rua"
                            placeholder='Rua'
                            value={cliente.rua}
                            onChange={handleinputChange}
                        />
                        {/* <Separator className='my-3' /> */}
                        <div className='flex w-full items-center mt-2'>
                            <img src={Telefones} className='w-6 mr-2' /><span className='text-sm'>Contatos do cliente</span>
                        </div>
                        <Input
                            name="telfixo"
                            placeholder='Telefone fixo'
                            value={formatPhoneNumber(cliente.telfixo)}
                            onChange={handleinputChange}
                            className='my-2'
                        />
                        <Input
                            name="celular"
                            placeholder='Celular'
                            value={formatPhoneNumber(cliente.celular)}
                            onChange={handleinputChange}
                            className='my-2'
                        />
                        <Input
                            name="email"
                            placeholder='E-mail'
                            value={cliente.email}
                            onChange={handleinputChange}
                        />
                        <div className='w-full flex justify-between'>
                            <Button
                                onClick={showModal}
                                className="mt-4">
                                Cancelar
                            </Button>

                            <Button
                                onClick={handleSave}
                                className="mt-4 flex items-center justify-center bg-red-700"
                                disabled={loading}>
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Salvar'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            }

            <div className="flex flex-wrap justify-between mb-4">
                <Link to="/novoproduto"
                    className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Adicionar} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Adicionar Produto</span>
                </Link>
                <Link to="/listaprodutos" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Lista} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Listar Produtos</span>
                </Link>
                <button onClick={generatePDF} className="flex-1 text-center p-4 rounded mb-2 flex flex-col items-center">
                    <img src={PDF} className='w-7' />
                    <span className="mt-2 text-sm tracking-tighter">Gerar lista PDF</span>
                </button>
            </div>

            <div className="flex flex-wrap justify-between">
                <Link to="/emalta" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={EmAlta} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Produtos em alta</span>
                </Link>

                <Link to="/embaixa" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={EmBaixa} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Produtos em baixa</span>
                </Link>
                <button  onClick={generateExcel} className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Execel} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Gerar lista Excel</span>
                </button>
            </div>

            <div className="flex flex-wrap justify-between">
                <button className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Medalha} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Mais vendidos</span>
                </button>

                <button className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Valor} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Valores do estoque</span>
                </button>


            </div>


            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
            onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Produtos;
