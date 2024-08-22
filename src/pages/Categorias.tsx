import { Loader2 } from 'lucide-react';
import Lista from '@/assets/lista-de-tarefas.png';
import Logo from '@/assets/banner.jpeg';
import { useState, useEffect } from 'react';
import Adicionar from '@/assets/categoriare.png';
import InfoClient from '@/assets/infocliente.png';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CriarCategoria, GetCategorias } from '@/services/Categorias';
import { CategoriasType } from '@/@types/Categorias';

const Categorias = () => {
    const [show, setShow] = useState(false);
    const [categoria, setCategorias] = useState({ nome: '' });
    const [loading, setLoading] = useState(false);
    const [categoriasExistentes, setCategoriasExistentes] = useState<CategoriasType[]>([]);
    const [categoriaError, setCategoriaError] = useState<string | null>(null);

    // Função para buscar categorias existentes
    const fetchCategorias = async () => {
        try {
            const data = await GetCategorias();
            if (data && data.items) {
                setCategoriasExistentes(data.items);
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const showModal = () => {
        setShow(!show);
    };

    const handleinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategorias((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setCategoriaError(null);

        // Remove espaços em branco do nome da categoria
        const trimmedNome = categoria.nome.trim();

        // Atualiza o estado com o nome limpo
        const categoriaComNomeLimpo = { ...categoria, nome: trimmedNome };

        // Verificar se a categoria já existe
        const categoriaExistente = categoriasExistentes.some(c => c.nome?.toLowerCase() === trimmedNome.toLowerCase());
        
        if (categoriaExistente) {
            setCategoriaError('Categoria já existe!');
            setLoading(false);
            return;
        }

        try {
            await CriarCategoria(categoriaComNomeLimpo);
            alert('Categoria cadastrada com sucesso!');
            setShow(false);
            // Atualizar a lista de categorias
            await fetchCategorias();
        } catch (error) {
            console.error('Erro ao criar Categoria:', error);
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
                            <img src={InfoClient} className='w-5 mr-2' /><span className='text-sm'>Informações das Categorias</span>
                        </div>
                        <Input
                            name="nome"
                            placeholder='Nome'
                            value={categoria.nome}
                            onChange={handleinputChange}
                            className='my-1' />
                        {categoriaError && <div className="text-red-500 mt-2">{categoriaError}</div>}
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
                    <span className="mt-2 text-sm tracking-tighter">Adicionar categoria</span>
                </button>
                <Link to="/listacategorias" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Lista} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Listar categorias</span>
                </Link>
            </div>

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
                onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Categorias;
