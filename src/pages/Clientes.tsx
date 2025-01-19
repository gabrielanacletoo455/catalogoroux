
import { Loader2 } from 'lucide-react';
import Execel from '@/assets/xlxs.png';
//import PDF from '@/assets/pdf.png';
import Lista from '@/assets/lista-de-tarefas.png';
import Saldo from '@/assets/divida.png';
import Logo from '@/assets/banner26.png';
import { useEffect, useState } from 'react';
import Adicionar from '@/assets/cliente.png'
import InfoClient from '@/assets/infocliente.png';
import Telefones from '@/assets/chamada-telefonica.png';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CriarCliente, GetClientes } from '@/services/Clientes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Clientes_desktop from '@/desktop/Clientes_desktop';
//import jsPDF from 'jspdf';

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

const Clientes = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
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

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    
      if (isDesktop) {
        return (
          <Clientes_desktop />
        )
      }
    
    return (
        <div className="w-full flex flex-col">
            <Link to="/" className='md:hidden'>
            <img src={Logo} alt="Logo" className="mx-auto md:w-32 w-full" />
            </Link>
            {show &&
                <div className="fixed inset-0 bg-slate-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%] md:h-[500px] md:overflow-auto">
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
                <button onClick={showModal}
                    className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Adicionar} className='w-10 md:w-16' />
                    <span className="mt-2 text-sm tracking-tighter">Adicionar Cliente</span>
                </button>
                <Link to="/listaclientes" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Lista} className='w-10 md:w-16' />
                    <span className="mt-2 text-sm tracking-tighter">Listar Clientes</span>
                </Link>
            </div>

            <div className="flex flex-wrap justify-between">
                <button className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Saldo} className='w-10 md:w-16' />
                    <span className="mt-2 text-sm tracking-tighter">Saldo Devedor</span>
                </button>
                <button  onClick={generateExcel} className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Execel} className='w-10 md:w-16' />
                    <span className="mt-2 text-sm tracking-tighter">Gerar lista Excel</span>
                </button>
            </div>

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
            onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Clientes;
