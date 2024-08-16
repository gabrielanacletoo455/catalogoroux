import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from '@/assets/logo.jpeg';
import { GetCategorias, ExcluirCategoria } from "@/services/Categorias";
import { CategoriasType } from "@/@types/Categorias";
import { GetSenhas } from "@/services/Senhas";
import { SenhasType } from "@/@types/Senhas";

const ListaCategorias = () => {
    const [categorias, setCategorias] = useState<CategoriasType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const data = await GetCategorias();
            if (data && data.items) {
                setCategorias(data.items);
            }
        } catch (error) {
            setError('Erro ao buscar categorias. Tente novamente mais tarde.');
            console.error('Erro ao buscar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSenhas = async (): Promise<SenhasType[]> => {
        try {
            const data = await GetSenhas();
            return data.items || [];
        } catch (error) {
            console.error('Erro ao buscar senhas:', error);
            return [];
        }
    };
    

    const handleExcluirCategoria = async (categoriaId: string) => {
        const senhaDigitada = prompt('Digite a senha para confirmar a exclusão:');
        
        if (senhaDigitada) {
            const senhas = await fetchSenhas();
            const senhaValida = senhas.some(s => s.senha === senhaDigitada);

            if (senhaValida) {
                try {
                    const response = await ExcluirCategoria(categoriaId);
                    if (response.status === 200) {
                        setCategorias(prevCategorias => prevCategorias.filter(categoria => categoria.id !== categoriaId));
                    } else {
                        setError(response.message);
                    }
                } catch (error) {
                    console.error('Erro ao excluir categoria:', error);
                    setError('Erro ao excluir categoria. Tente novamente mais tarde.');
                }
            } else {
                setShowError(true);
            }
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    // Função para filtrar categorias com base no termo de busca
    const filteredCategorias = categorias.filter(categoria => {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        return categoria.nome?.toLowerCase().includes(normalizedSearchTerm);
    });

    return (
        <div className="w-full flex flex-col text-xs">
            <Link to="/">
                <img src={Logo} className='pb-1' alt="Logo" />
            </Link>
            <div className="mb-4 p-2">
                <input
                    type="text"
                    placeholder="Buscar por nome ou telefone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="loader"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">
                    {error}
                </div>
            ) : (
                <div className="overflow-auto h-[500px] p-1">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Nome</th>
                                <th className="border p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategorias.length > 0 ? (
                                filteredCategorias.map((categoria) => (
                                    <tr key={categoria.id} className="hover:bg-gray-200">
                                        <td className="border p-2">{categoria.nome}</td>
                                        <td className="border p-2 text-center">
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleExcluirCategoria(categoria.id!)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="border p-2 text-center">Nenhuma categoria encontrada</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showError && (
                <div className="fixed inset-0 bg-slate-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%] text-center">
                        <p className="text-red-500">Senha incorreta. Você não tem permissão para excluir esta categoria.</p>
                        <button
                            className="mt-4 bg-red-700 text-white p-2 rounded"
                            onClick={() => setShowError(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <button
                className="bg-red-700 text-white text-base p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
                onClick={() => window.history.back()}
            >
                Voltar
            </button>
        </div>
    );
};

export default ListaCategorias;
