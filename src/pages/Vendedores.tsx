
import { Loader2 } from 'lucide-react';
import Lista from '@/assets/lista-de-tarefas.png';
import Logo from '@/assets/logo.jpeg'
import { useState } from 'react';
import InfoClient from '@/assets/infocliente.png';
import Telefones from '@/assets/chamada-telefonica.png';
import Vendedor from '@/assets/vendedor.png'
import { Link } from 'react-router-dom';
//import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CriarVendedor } from '@/services/Vendedores';
// import jsPDF from 'jspdf';



const formatPhoneNumber = (number: string) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return number;
};

const Vendedores = () => {
    const [show, setShow] = useState(false);
    const [vendedor, setVendedores] = useState({
        nome: '',
        senha: '',
        celular: '',
        emoji: '',
    });
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setShow(!show);
    };

    const handleinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVendedores((prev) => ({
            ...prev,
            [name]: value
        }))
    };



    const handleSave = async () => {
        setLoading(true);
        try {
            // Formatar números de telefone antes de salvar
            const formattedFornecedor = {
                ...vendedor,
                celular: formatPhoneNumber(vendedor.celular)
            };

            await CriarVendedor(formattedFornecedor);
            alert('Vendedor cadastrado com sucesso!');
            setShow(false);
        } catch (error) {
            console.error('Erro ao criar vendedor:', error);
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
                            <img src={InfoClient} className='w-5 mr-2' /><span className='text-sm'>Informações do vendedor</span>
                        </div>
                        <Input
                            name="nome"
                            placeholder='Nome'
                            value={vendedor.nome}
                            onChange={handleinputChange}
                            className='my-1'
                        />
                            <Input
                            name="senha"
                            placeholder='Senha'
                            value={formatPhoneNumber(vendedor.senha)}
                            onChange={handleinputChange}
                            className='my-2'
                        />
                        {/* <Separator className='my-3' /> */}
                        <div className='flex w-full items-center mt-2'>
                            <img src={Telefones} className='w-6 mr-2' /><span className='text-sm'>Contatos do vendedor</span>
                        </div>

                        <Input
                            name="celular"
                            placeholder='Celular'
                            value={formatPhoneNumber(vendedor.celular)}
                            onChange={handleinputChange}
                            className='my-2'
                        />

                        <Input
                            name="emoji"
                            placeholder='Emoji'
                            value={vendedor.emoji}
                            onChange={handleinputChange}
                            className='my-2'
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
                    <img src={Vendedor} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Adicionar vendedor</span>
                </button>
                <Link to="/listavendedores" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Lista} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Listar vendedores</span>
                </Link>
            </div>

            <div className="flex flex-wrap justify-between">
            </div>

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
            onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Vendedores;
