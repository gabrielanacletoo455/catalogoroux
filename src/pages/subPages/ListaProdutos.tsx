import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from '@/assets/logo.jpeg';
import { AtualizarProduto, ExcluirProduto, GetProdutos } from "@/services/Produtos";
import { ProdutoEstoque } from "@/@types/Produtos";
import ModalProdutos from "@/components/ModalEditarProduto";
import { Loader2 } from 'lucide-react';
import { SenhasType } from "@/@types/Senhas";
import { GetSenhas } from "@/services/Senhas";
import EditarIcone from '@/assets/editar.png'
import Lixo  from '@/assets/lixo.png'


const ListaProdutos = () => {
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduto, setSelectedProduto] = useState<ProdutoEstoque | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchProdutos = async () => {
        try {
            setLoading(true);
            const data = await GetProdutos();
            if (data && data.items) {
                setProdutos(data.items);
            }
        } catch (error) {
            setError('Erro ao buscar produtos. Tente novamente mais tarde.');
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProdutoClick = (produto: ProdutoEstoque) => {
        setSelectedProduto(produto);
        setShowModal(true);
    };

    const handleProdutoUpdate = async (updatedProduto: ProdutoEstoque): Promise<{ status: number; message: string }> => {
        try {
            await AtualizarProduto(updatedProduto);
            setProdutos(prevProdutos => prevProdutos.map(produto => 
                produto.id === updatedProduto.id ? updatedProduto : produto
            ));
            return { status: 200, message: 'Produto atualizado com sucesso.' }; // Adicione esta linha
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return { status: 500, message: 'Erro ao atualizar produto.' }; // Adicione esta linha
        } finally {
            setShowModal(false);
        }
    };
    

    useEffect(() => {
        fetchProdutos();
    }, []);

    // Função para filtrar clientes com base no termo de busca
    const filteredProdutos = produtos.filter(produto => {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        const nomeMatch = produto.nome?.toLowerCase().includes(normalizedSearchTerm);
        return nomeMatch 
    });

    const [_message, setMessage] = useState('');
    const [showError, setShowError] = useState<boolean>(false);


    const fetchSenhas = async (): Promise<SenhasType[]> => {
        try {
            const data = await GetSenhas();
            return data.items || [];
        } catch (error) {
            console.error('Erro ao buscar senhas:', error);
            return [];
        }
    };
    
    const handleExcluirProduto = async (produtoId: string) => {
        const senhaDigitada = prompt('Digite a senha para confirmar a exclusão:');
        
        if (senhaDigitada) {
            const senhas = await fetchSenhas();
            const senhaValida = senhas.some(s => s.senha === senhaDigitada);
    
            if (senhaValida) {
                try {
                    const response = await ExcluirProduto(produtoId);
                    if (response.status === 200) {
                        // Atualiza o estado removendo o produto excluído
                        setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== produtoId));
                        setLoading(false);
                        setMessage(response.message);                    
                    } else {
                        setError(response.message);
                    }
                } catch (error) {
                    console.error('Erro ao excluir produto:', error);
                    setError('Erro ao excluir produto. Tente novamente mais tarde.');
                }
            } else {
                setShowError(true);
            }
        }
    };
    
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
                    <div className='w-full h-screen flex items-center justify-center'>
                    <Loader2 className='w-10 h-10 animate-spin' />
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">
                    {error}
                </div>
            ) : (
                <div className="overflow-auto h-[430px] p-1">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Nome</th>
                                <th className="border p-2">Quantidade</th>
                                <th className="border p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProdutos.length > 0 ? (
                                filteredProdutos.map((produto) => (
                                    <tr key={produto.id} className="hover:bg-gray-200">
                                        <td className="border p-2">{produto.nome?.substring(0, 20) + '...'}</td>
                                        <td className={`border p-2 text-center font-bold ${produto.quantidade < 5 ? 'text-red-500' : 'text-black'}`}>
                                        {produto.quantidade}
                                        </td>
                                        <td className="border p-2 text-center flex">
                                        <img src={EditarIcone} className="mr-5 w-6"
                                                onClick={() => handleProdutoClick(produto)}/>

                                        <img src={Lixo} className="w-6"
                                        onClick={() => handleExcluirProduto(produto.id!)}/>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="border p-2 text-center">Nenhum cliente encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {showModal && selectedProduto && (
                <ModalProdutos 
                    produto={selectedProduto} 
                    onClose={() => setShowModal(false)} 
                    onSave={handleProdutoUpdate} 
                />
            )}

{showError && (
                <div className="fixed inset-0 bg-slate-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%] text-center">
                        <p className="text-red-500">Senha incorreta. Você não tem permissão para excluir este produto.</p>
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
                onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default ListaProdutos;
