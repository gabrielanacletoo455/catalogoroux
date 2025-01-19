import { ClienteType } from "@/@types/Cliente";
import { GetClientes, AtualizarCliente, ExcluirCliente } from "@/services/Clientes";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from '@/assets/banner26.png';
import Modal from "@/components/ModalEditarClient";
import { SenhasType } from "@/@types/Senhas";
import { GetSenhas } from "@/services/Senhas";
import EditarIcone from '@/assets/editar.png'
import Lixo  from '@/assets/lixo.png'


const ListaClientes = () => {
    const [clientes, setClientes] = useState<ClienteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCliente, setSelectedCliente] = useState<ClienteType | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
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
    
    const handleExcluirCliente = async (clientId: string) => {
        const senhaDigitada = prompt('Digite a senha para confirmar a exclusão:');
        
        if (senhaDigitada) {
            const senhas = await fetchSenhas();
            const senhaValida = senhas.some(s => s.senha === senhaDigitada);
    
            if (senhaValida) {
                try {
                    const response = await ExcluirCliente(clientId);
                    if (response.status === 200) {
                        // Atualiza o estado removendo o produto excluído
                        setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== clientId));
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
    
    const fetchClientes = async () => {
        try {
            setLoading(true);
            const data = await GetClientes();
            if (data && data.items) {
                setClientes(data.items);
            }
        } catch (error) {
            setError('Erro ao buscar clientes. Tente novamente mais tarde.');
            console.error('Erro ao buscar clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClienteClick = (cliente: ClienteType) => {
        setSelectedCliente(cliente);
        setShowModal(true);
    };

    const handleClienteUpdate = async (updatedCliente: ClienteType) => {
        try {
            await AtualizarCliente(updatedCliente);
            setClientes(prevClientes => prevClientes.map(cliente => 
                cliente.id === updatedCliente.id ? updatedCliente : cliente
            ));
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
        } finally {
            setShowModal(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    // Função para filtrar clientes com base no termo de busca
    const filteredClientes = clientes.filter(cliente => {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        const nomeMatch = cliente.nome?.toLowerCase().includes(normalizedSearchTerm);
        const apelidoMatch = cliente.apelido?.toLowerCase().includes(normalizedSearchTerm);
        const celularMatch = cliente.celular?.replace(/\D/g, '').includes(normalizedSearchTerm);
        return nomeMatch || apelidoMatch || celularMatch;
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
                                {/* <th className="border p-2">Apelido</th> */}
                                <th className="border w-[115px]">Celular</th>
                                <th className="border p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClientes.length > 0 ? (
                                filteredClientes.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-gray-200">
                                        <td className="border p-2">{cliente.nome}</td>
                                        {/* <td className="border p-2">{cliente.apelido?.substring(0, 11) + '...'}</td> */}
                                        <td className="border p-2">
                                            {cliente.celular ? (
                                                <a 
                                                    href={`https://wa.me/${cliente.celular.replace(/\D/g, '')}`}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    target="_blank" 
                                                    rel="noopener noreferrer">
                                                    {cliente.celular}
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">Não disponível</span>
                                            )}
                                        </td>
                                        <td className="border p-2 text-center flex">

                                        <img src={EditarIcone} className="mr-5 w-6"
                                                onClick={() => handleClienteClick(cliente)} />

                                            <img src={Lixo} className="w-6"
                                        onClick={() => handleExcluirCliente(cliente.id!)}/>
                                        
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

            {showModal && selectedCliente && (
                <Modal 
                    cliente={selectedCliente} 
                    onClose={() => setShowModal(false)} 
                    onSave={handleClienteUpdate}  />
            )}
            <button
                className="bg-red-700 text-white text-base p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
                onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default ListaClientes;
