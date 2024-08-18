import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Logo from '@/assets/logo.jpeg';
import { Link } from 'react-router-dom';
import { GetVendas, ExcluirVenda } from '@/services/Vendas';
import { VendasType } from '@/@types/Vendas';
import { AtualizarProduto, GetProdutos } from '@/services/Produtos';

const Vendas = () => {
    const [loading, setLoading] = useState(false);
    const [vendas, setVendas] = useState<VendasType[]>([]);
    const [filteredVendas, setFilteredVendas] = useState<VendasType[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedVenda, setSelectedVenda] = useState<VendasType | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchVendas = async () => {
        try {
            setLoading(true);
            const response = await GetVendas();
            if (response && Array.isArray(response.items)) {
                setVendas(response.items as VendasType[]);
                setFilteredVendas(response.items as VendasType[]);
            } else {
                console.error('Resposta da API inválida ou sem vendas.');
            }
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendas();
    }, []);


    const convertToDate = (dateStr: string): string => {
        if (!dateStr) return '';
    
        // Verifica o formato da data e a converte para o formato yyyy-MM-dd
        if (dateStr.includes('/')) {
            // Formato dd/MM/yyyy
            const [day, month, year] = dateStr.split('/').map(part => parseInt(part, 10));
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
                console.error('Data inválida:', dateStr);
                return '';
            }
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        } else if (dateStr.includes('-')) {
            // Formato yyyy-MM-dd
            return dateStr;
        } else {
            console.error('Formato de data desconhecido:', dateStr);
            return '';
        }
    };
    
    
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value;
        setSelectedDate(date);
    
        if (date) {
            const selectedDateFormatted = convertToDate(date);
    
            const filtered = vendas.filter(venda => {
                if (venda.createdAt) {
                    const vendaDateFormatted = convertToDate(venda.createdAt);
                    return vendaDateFormatted === selectedDateFormatted;
                }
                return false;
            });
    
            setFilteredVendas(filtered);
        } else {
            setFilteredVendas(vendas);
        }
    };
    
    
    

    const handleVendaClick = (venda: VendasType) => {
        setSelectedVenda(venda);
    };

    const handleCloseModal = () => {
        setSelectedVenda(null);
    };

    const handleDeleteVenda = async () => {
        if (selectedVenda) {
            setDeleting(true);
            try {
                const response = await ExcluirVenda(selectedVenda.id!);
                if (response.status === 200) {
                    const produtosResponse = await GetProdutos();
                    if (produtosResponse && produtosResponse.items) {
                        const produtos = produtosResponse.items;
                        const promessas = selectedVenda.produtos.map(async ({ produto, quantidade }) => {
                            const produtoNoBanco = produtos.find(p => p.id === produto.id);
                            if (produtoNoBanco) {
                                const novaQuantidade = produtoNoBanco.quantidade + quantidade;
                                const produtoAtualizado = { ...produtoNoBanco, quantidade: novaQuantidade };
                                return AtualizarProduto(produtoAtualizado);
                            }
                            return null;
                        });
                        await Promise.all(promessas);
                    }

                    const updatedVendas = vendas.filter(venda => venda.id !== selectedVenda.id);
                    setVendas(updatedVendas);
                    setFilteredVendas(updatedVendas);
                    setSelectedVenda(null);
                }
            } catch (error) {
                console.error('Erro ao excluir venda:', error);
            } finally {
                setDeleting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <Loader2 className='w-10 h-10 animate-spin' />
            </div>
        );
    }

    console.log('vendas', vendas);
    return (
        <div className="w-full flex flex-col text-xs tracking-tighter">
            <Link to="/">
                <img src={Logo} className='pb-1' alt="Logo" />
            </Link>

        <div className='flex items-center justify-around'>
            <span>filtrar por data</span>
        <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
        </div>

            {filteredVendas.length === 0 ? (
                <p className="text-center text-gray-500">Nenhuma venda encontrada para a data selecionada.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">Data</th>
                            <th className="border p-2">Nome do Cliente</th>
                            <th className="border p-2">Valor Total</th>
                            <th className="border p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendas.map(venda => (
                            <tr key={venda.id}>
                                <td className="border p-2">{venda.createdAt}</td>
                                <td className="border p-2">{venda.cliente?.nome || 'N/A'}</td>
                                <td className="border p-2">{venda.total || 'N/A'}</td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleVendaClick(venda)}
                                        className="bg-blue-500 text-white p-1 rounded"
                                    >
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedVenda && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded w-3/4 max-w-3xl">
                        <h2 className="text-xl font-bold">Detalhes da Venda</h2>
                        <p><strong>Data:</strong> {selectedVenda.createdAt ? new Date(selectedVenda.createdAt).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Nome do Cliente:</strong> {selectedVenda.cliente?.nome || 'N/A'}</p>
                        <p><strong>Nome do Vendedor:</strong> {selectedVenda.vendedor?.nome || 'N/A'}</p>
                        <p><strong>Valor Total:</strong> {selectedVenda.total || 'N/A'}</p>
                        <p><strong>Desconto:</strong> {selectedVenda.desconto || 'N/A'}</p>
                        <h3 className="text-lg font-semibold">Itens:</h3>
                        <ul>
                            {selectedVenda.produtos.length > 0 ? (
                                selectedVenda.produtos.map(({ produto, quantidade, precoUnitario, total }, index) => (
                                    <li key={index}>
                                        {produto?.nome || 'N/A'} - Quantidade: {quantidade || 'N/A'} - Preço Unitário: {precoUnitario || 'N/A'} - Total: {total || 'N/A'}
                                    </li>
                                ))
                            ) : (
                                <li>N/A</li>
                            )}
                        </ul>
                        <div>
                            <button
                                onClick={handleDeleteVenda}
                                className="bg-red-500 text-white p-2 rounded mt-4"
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <span className="flex items-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </span>
                                ) : (
                                    'Deletar'
                                )}
                            </button>
                        </div>
                        <button
                            onClick={handleCloseModal}
                            className="bg-gray-500 text-white p-2 rounded mt-4"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendas;
