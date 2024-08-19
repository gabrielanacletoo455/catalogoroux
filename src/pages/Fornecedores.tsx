
import { Loader2 } from 'lucide-react';
//import Execel from '@/assets/xlxs.png';
//import PDF from '@/assets/pdf.png';
import Lista from '@/assets/lista-de-tarefas.png';
// import Saldo from '@/assets/divida.png';
import Logo from '@/assets/logo.jpeg'
import { useState } from 'react';
import Adicionar from '@/assets/caminhao-bau.png'
import InfoClient from '@/assets/infocliente.png';
import Telefones from '@/assets/chamada-telefonica.png';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import * as XLSX from 'xlsx'; 
import { Link } from 'react-router-dom';
//import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CriarFornecedor, GetFornecedores } from '@/services/Forncedores';
import Execel from '@/assets/xlxs.png';
import * as XLSX from 'xlsx'; 
import { FornecedorType } from '@/@types/Fornecedor';



const formatPhoneNumber = (number: string) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
};

const Fornecedores = () => {
    const [show, setShow] = useState(false);
    const [fornecedor, setfornecedor] = useState({
        nome: '',
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
        setfornecedor((prev) => ({
            ...prev,
            [name]: value
        }))
    };



    const handleSave = async () => {
        setLoading(true);
        try {
            // Formatar números de telefone antes de salvar
            const formattedFornecedor = {
                ...fornecedor,
                telfixo: formatPhoneNumber(fornecedor.telfixo),
                celular: formatPhoneNumber(fornecedor.celular)
            };

            await CriarFornecedor(formattedFornecedor);
            alert('Fornecedor cadastrado com sucesso!');
            setShow(false);
        } catch (error) {
            console.error('Erro ao criar fornecedor:', error);
        } finally {
            setLoading(false);
        }
    };


    const generateExcel = async () => {
        setLoading(true);
        try {
            const response = await GetFornecedores();
            if (response && response.items) {
                const items = response.items as FornecedorType[];

                const worksheetData = [
                    ['Nome', 'Email', 'Telefone', 'Celular'],
                    ...items.map(fornecedor => [
                        fornecedor.nome,
                        fornecedor.email,
                        fornecedor.telfixo,
                        fornecedor.celular,
                    ])
                ];

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Fornecedores');

                XLSX.writeFile(workbook, 'lista_fornecedores.xlsx');
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
        <div className="w-full flex flex-col">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>
            {show &&
                <div className="fixed inset-0 bg-slate-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%]">
                        <div className='flex w-full items-center'>
                            <img src={InfoClient} className='w-5 mr-2' /><span className='text-sm'>Informações do fornecedor</span>
                        </div>
                        <Input
                            name="nome"
                            placeholder='Nome'
                            value={fornecedor.nome}
                            onChange={handleinputChange}
                            className='my-1'
                        />
                       
                        {/* <Separator className='my-3' /> */}
                        <div className='flex w-full items-center mt-2'>
                            <img src={Telefones} className='w-6 mr-2' /><span className='text-sm'>Contatos do fornecedor</span>
                        </div>
                        <Input
                            name="telfixo"
                            placeholder='Telefone fixo'
                            value={formatPhoneNumber(fornecedor.telfixo)}
                            onChange={handleinputChange}
                            className='my-2'
                        />
                        <Input
                            name="celular"
                            placeholder='Celular'
                            value={formatPhoneNumber(fornecedor.celular)}
                            onChange={handleinputChange}
                            className='my-2'
                        />
                        <Input
                            name="email"
                            placeholder='E-mail'
                            value={fornecedor.email}
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
                    <img src={Adicionar} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Adicionar fornecedor</span>
                </button>
                <Link to="/listafornecedores" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Lista} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Listar fornecedores</span>
                </Link>
                <button  onClick={generateExcel} className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Execel} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Gerar lista Excel</span>
                </button>
            </div>

            <div className="flex flex-wrap justify-between">
                {/* <button className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Saldo} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Saldo Devedor</span>
                </button> */}
                {/* <button  onClick={generateExcel} className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Execel} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Gerar lista Excel</span>
                </button> */}
            </div>

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
            onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Fornecedores;
