import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from '@/assets/banner26.png';
import { FornecedorType } from "@/@types/Fornecedor";
import { AtualizarVendedor, ExcluirVendedor, GetVendedores } from "@/services/Vendedores";
import { VendedorType } from "@/@types/Vendedores";
import ModalVendedor from "@/components/ModalEditarVendedor";
import EditarIcone from '@/assets/editar.png'
import Lixo from '@/assets/lixo.png'
import { SenhasType } from "@/@types/Senhas";
import { GetSenhas } from "@/services/Senhas";


const ListaVendedores = () => {
    const [vendedores, setVendedores] = useState<VendedorType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorType | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [_message, setMessage] = useState('');
    const [showError, setShowError] = useState<boolean>(false);

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const data = await GetVendedores();
            if (data && data.items) {
                setVendedores(data.items);
            }
        } catch (error) {
            setError('Erro ao buscar fornecedores. Tente novamente mais tarde.');
            console.error('Erro ao buscar fornecedores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClienteClick = (vendedor: VendedorType) => {
        setSelectedVendedor(vendedor);
        setShowModal(true);
    };


    const formatPhoneNumber = (phoneNumber: string) => {
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
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


    const handleExcluirVendedor = async (vendedorId: string) => {
        const senhaDigitada = prompt('Digite a senha para confirmar a exclusão:');

        if (senhaDigitada) {
            const senhas = await fetchSenhas();
            const senhaValida = senhas.some(s => s.senha === senhaDigitada);

            if (senhaValida) {
                try {
                    const response = await ExcluirVendedor(vendedorId);
                    if (response.status === 200) {
                        // Atualiza o estado removendo o produto excluído
                        setVendedores(prevVendedores => prevVendedores.filter(vendedor => vendedor.id !== vendedorId));
                        setLoading(false);
                        setMessage(response.message);
                    } else {
                        setError(response.message);
                    }
                } catch (error) {
                    console.error('Erro ao excluir cliente:', error);
                    setError('Erro ao excluir cliente. Tente novamente mais tarde.');
                }
            } else {
                setShowError(true);
            }
        }
    };

    const handleVendedorUpdate = async (updateVendedor: FornecedorType): Promise<{ status: number; message: string }> => {
        try {
            const response = await AtualizarVendedor(updateVendedor);
            setVendedores(prevFornecedores => prevFornecedores.map(vendedor =>
                vendedor.id === updateVendedor.id ? updateVendedor : vendedor
            ));
            return response;
        } catch (error) {
            console.error('Erro ao atualizar vendedor:', error);
            return { status: 500, message: 'Erro ao atualizar vendedor' };
        } finally {
            setShowModal(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    // Função para filtrar clientes com base no termo de busca
    const filteredClientes = vendedores.filter(vendedor => {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        const nomeMatch = vendedor.nome?.toLowerCase().includes(normalizedSearchTerm);
        const celularMatch = vendedor.celular?.replace(/\D/g, '').includes(normalizedSearchTerm);
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
                                filteredClientes.map((vendedor) => (
                                    <tr key={vendedor.id} className="hover:bg-gray-200">
                                        <td className="border p-2">
                                            {vendedor?.nome && vendedor.nome.length > 15
                                                ? vendedor.nome.substring(0, 15) + '...'
                                                : vendedor?.nome}
                                        </td>
                                        <td className="border p-2">
                                            {vendedor.celular ? (
                                                <a
                                                    href={`https://wa.me/${vendedor.celular.replace(/\D/g, '')}`}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    target="_blank"
                                                    rel="noopener noreferrer" >
                                                    {formatPhoneNumber(vendedor.celular)}
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">não disponível</span>
                                            )}
                                        </td>

                                        <td className="border p-2 text-center flex justify-center">
                                            <img src={EditarIcone} className="mr-5 w-6"
                                                onClick={() => handleClienteClick(vendedor)} />

                                            <img src={Lixo} className="w-6"
                                                onClick={() => handleExcluirVendedor(vendedor.id!)} />
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

            {showError && (
                <div className="fixed inset-0 bg-slate-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%] text-center">
                        <p className="text-red-500">Senha incorreta. Você não tem permissão para excluir este .</p>
                        <button
                            className="mt-4 bg-red-700 text-white p-2 rounded"
                            onClick={() => setShowError(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}


            {showModal && selectedVendedor && (
                <ModalVendedor
                    vendedor={selectedVendedor}
                    onClose={() => setShowModal(false)}
                    onSave={handleVendedorUpdate}
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

export default ListaVendedores;

