import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from '@/assets/logo.jpeg';
import { AtualizarFornecedor, GetFornecedores } from "@/services/Forncedores";
import { FornecedorType } from "@/@types/Fornecedor";
import ModalFornecedores from "@/components/ModalEditarFornecedor";

const ListaFornecedores = () => {
    const [fornecedores, setFornecedores] = useState<FornecedorType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFornecedor, setSelectedFornecedor] = useState<FornecedorType | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const data = await GetFornecedores();
            if (data && data.items) {
                setFornecedores(data.items);
            }
        } catch (error) {
            setError('Erro ao buscar fornecedores. Tente novamente mais tarde.');
            console.error('Erro ao buscar fornecedores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClienteClick = (fornecedor: FornecedorType) => {
        setSelectedFornecedor(fornecedor);
        setShowModal(true);
    };

    const handleFornecedorUpdate = async (updateFornecedor: FornecedorType): Promise<{ status: number; message: string }> => {
        try {
            const response = await AtualizarFornecedor(updateFornecedor);
            setFornecedores(prevFornecedores => prevFornecedores.map(fornecedor => 
                fornecedor.id === updateFornecedor.id ? updateFornecedor : fornecedor
            ));
            return response;
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error);
            return { status: 500, message: 'Erro ao atualizar fornecedor' };
        } finally {
            setShowModal(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    // Função para filtrar clientes com base no termo de busca
    const filteredClientes = fornecedores.filter(fornecedor => {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        const nomeMatch = fornecedor.nome?.toLowerCase().includes(normalizedSearchTerm);
        const celularMatch = fornecedor.celular?.replace(/\D/g, '').includes(normalizedSearchTerm);
        return nomeMatch || celularMatch;
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
                                <th className="border w-[115px]">Celular</th>
                                <th className="border p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.length > 0 ? (
                                filteredClientes.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-gray-200">
                                        <td className="border p-2">{cliente.nome?.substring(0, 13) + '...'}</td>
                                        <td className="border p-2">
                                            {cliente.celular ? (
                                                <a 
                                                    href={`https://wa.me/${cliente.celular.replace(/\D/g, '')}`}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {cliente.celular}
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">Número não disponível</span>
                                            )}
                                        </td>
                                        <td className="border p-2 text-center">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleClienteClick(cliente)}
                                            >
                                                Editar
                                            </button>
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
            {showModal && selectedFornecedor && (
                <ModalFornecedores 
                    fornecedor={selectedFornecedor} 
                    onClose={() => setShowModal(false)} 
                    onSave={handleFornecedorUpdate} 
                />
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

export default ListaFornecedores;
