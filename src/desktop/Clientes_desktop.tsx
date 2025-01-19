import EditarIcone from '@/assets/editar.png'
import Lixo  from '@/assets/lixo.png'
import {  Loader2,  } from "lucide-react"
import { useState, useEffect } from "react"
import { ClienteType } from "@/@types/Cliente"
import { AtualizarCliente, CriarCliente, ExcluirCliente, GetClientes } from "@/services/Clientes"
import { SenhasType } from "@/@types/Senhas"
import { GetSenhas } from "@/services/Senhas"
import Modal from "@/components/ModalEditarClient"
import Cards_home from './Cards_Home';
import * as XLSX from 'xlsx'; 
import axios from 'axios'
import InfoClient from '@/assets/infocliente.png';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Telefones from '@/assets/chamada-telefonica.png';
import AddCliente from '@/assets/mais.png'
import IconeXLS from '@/assets/folhas.png'

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

const Clientes_desktop = () => {
    const [clientes, setClientes] = useState<ClienteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCliente, setSelectedCliente] = useState<ClienteType | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [_message, setMessage] = useState('');
    const [showError, setShowError] = useState<boolean>(false);
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

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

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


  return (
    <>
      <Cards_home />
        <div className="w-full flex flex-col text-xs">

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
                                onClick={() => setShow(false)}
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



            <div className=" p-2">
                <input
                    type="text"
                    placeholder="Buscar por nome ou telefone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />

                
        <div className="flex m-2 items-center  p-1 w-[100%] justify-end rounded-md">
                <button onClick={!show ? () => setShow(true) : () => setShow(false)}
                    className="text-center rounded mr-3 flex flex-col items-center">
                      <img src={AddCliente} className="w-7" title='Adicionar cliente'/>
                </button>

                <button onClick={!show ? () => setShow(true) : () => setShow(false)}
                    className="text-center flex flex-col items-center">
                      <img src={IconeXLS} className="w-7" title='Gerar planilha'/>
                </button>

            </div>
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
                                <th className="border ">Celular</th>
                                <th className="border p-2 md:w-[7%]">Ações</th>
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

                                        <img src={EditarIcone} className="mr-5 w-6 cursor-pointer"
                                                onClick={() => handleClienteClick(cliente)} />

                                            <img src={Lixo} className="w-6 cursor-pointer"
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

        </div>
    </>
  )
}

export default Clientes_desktop