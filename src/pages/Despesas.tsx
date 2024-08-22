import { Loader2 } from 'lucide-react';
import Lista from '@/assets/lista-de-tarefas.png';
import Logo from '@/assets/banner.jpeg';
import { useState, useEffect } from 'react';
import Adicionar from '@/assets/despesas2.png';
import InfoClient from '@/assets/infocliente.png';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DespesasType } from '@/@types/Despesas';
import { CriarDespesa, GetDespesa } from '@/services/Despesas';

const Despesas = () => {
    const [show, setShow] = useState(false);
    const [despesa, setDespesas] = useState({ nome: '', valor: '' });
    const [loading, setLoading] = useState(false);
    const [despesasExistentes, setDespesasExistentes] = useState<DespesasType[]>([]);
    const [despesaError, setDespesaError] = useState<string | null>(null);

    const fetchDespesas = async () => {
        try {
            const data = await GetDespesa();
            if (data && data.items) {
                setDespesasExistentes(data.items);
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchDespesas();
    }, []);

    const showModal = () => {
        setShow(!show);
    };

    const handleinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDespesas((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setDespesaError(null);

        const trimmedNome = despesa.nome.trim();
        const categoriaComNomeLimpo = { ...despesa, nome: trimmedNome };
        const categoriaExistente = despesasExistentes.some(c => c.nome?.toLowerCase() === trimmedNome.toLowerCase());

        if (categoriaExistente) {
            setDespesaError('Despesa já existe!');
            setLoading(false);
            setShow(false);
            setDespesas({ nome: '', valor: '' });
            return;
        }

        try {
            await CriarDespesa(categoriaComNomeLimpo);
            alert('Despesa cadastrada com sucesso!');
            setShow(false);
            await fetchDespesas();
        } catch (error) {
            console.error('Erro ao criar despesa:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatarPreco = (value: string) => {
        const numero = Number(value.replace(/[^0-9]/g, '')) / 100;
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
                            <img src={InfoClient} className='w-5 mr-2' /><span className='text-sm'>Despesa</span>
                        </div>
                        <Input
                            name="nome"
                            placeholder='Nome'
                            value={despesa.nome}
                            onChange={handleinputChange}
                            className='my-1' />

                        <Input
                            name="valor"
                            placeholder='Valor'
                            type='text'
                            value={despesa.valor}
                            onChange={(e) => setDespesas({ ...despesa, valor: formatarPreco(e.target.value) })}
                            className='my-2' />

                        {despesaError && <div className="text-red-500 mt-2">{despesaError}</div>}
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
                    <span className="mt-2 text-sm tracking-tighter">Adicionar nova despesa</span>
                </button>
                <Link to="/listadespesas" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Lista} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Listar despesas</span>
                </Link>
            </div>

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
                onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Despesas;
