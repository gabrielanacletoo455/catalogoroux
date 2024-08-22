import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Logo from '@/assets/banner.jpeg';
import { Link } from 'react-router-dom';
import { GetVendas, ExcluirVenda } from '@/services/Vendas';
import { VendasType } from '@/@types/Vendas';
import { AtualizarProduto, GetProdutos } from '@/services/Produtos';
import * as XLSX from 'xlsx';
import Execel from '@/assets/xlxs.png';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Vendas = () => {
    const [loading, setLoading] = useState(false);
    const [vendas, setVendas] = useState<VendasType[]>([]);
    const [filteredVendas, setFilteredVendas] = useState<VendasType[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'todos' | 'pendente' | 'finalizada'>('todos');
    const [selectedVenda, setSelectedVenda] = useState<VendasType | null>(null);
    const [deleting, setDeleting] = useState(false);

    const formatarData = (data: string) => {
        data = data.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
        if (data.length > 2) data = data.replace(/(\d{2})(\d)/, "$1/$2");
        if (data.length > 4) data = data.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
        if (data.length > 8) data = data.substring(0, 10); // Garante que o ano não tenha mais que 4 dígitos
        return data;
    };

    const handleVencimentoChange = (e: { target: { value: string; }; }) => {
        const formattedDate = formatarData(e.target.value);
        setSelectedDate(formattedDate);
    };

    const handleStatusChange = (value: 'todos' | 'pendente' | 'finalizada') => {
        setSelectedStatus(value);
    };

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

    useEffect(() => {
        let filtered = vendas;
        if (selectedDate.trim() !== '') {
            filtered = filtered.filter(venda => 
                venda.createdAt && venda.createdAt.includes(selectedDate)
            );
        }
        if (selectedStatus !== 'todos') {
            filtered = filtered.filter(venda => 
                venda.status === selectedStatus
            );
        }
        setFilteredVendas(filtered);
    }, [selectedDate, selectedStatus, vendas]);

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

    const generateExcel = async () => {
        setLoading(true);
        try {
            const response = await GetVendas();
            if (response && response.items) {
                const items = response.items as VendasType[];

                const worksheetData = [
                    ['Cliente', 'Nome', 'Produtos', 'Total'],
                    ...items.map(venda => [
                        venda.cliente.nome,
                        venda.vendedor.nome,
                        venda.produtos.map(produto => `${produto.produto.nome} - ${produto.quantidade} un. (R$ ${produto.total})`).join('\n'),
                        venda.total,
                    ])
                ];

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas');

                XLSX.writeFile(workbook, 'lista_Vendas.xlsx');
            } else {
                console.error('Resposta da API inválida ou sem vendas.');
            }
        } catch (error) {
            console.error('Erro ao gerar Excel:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col text-xs tracking-tighter">
            <Link to="/">
                <img src={Logo} className='pb-1' alt="Logo" />
            </Link>

            <div className='flex items-center p-2 justify-between '>
                <div className='flex flex-col'>
                    <span>Filtrar por data</span>
                    <Input 
                        type="text" 
                        value={selectedDate} 
                        onChange={handleVencimentoChange} 
                        placeholder="DD/MM/YYYY"
                        className="p-1 border border-gray-300 rounded-md w-24"
                        maxLength={10} />
                </div>

                <div className='flex flex-col'>
                    <span>Filtrar por status</span>
                    <Select value={selectedStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="finalizada">Finalizada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <button onClick={generateExcel} className="text-center flex flex-col items-center">
                    <img src={Execel} className='w-8 h-8 mt-3' />
                </button>
            </div>

            {filteredVendas.length === 0 ? (
                <p className="text-center text-gray-500">Nenhuma venda encontrada para a data selecionada.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">Data</th>
                            <th className="border p-2">Nome do Cliente</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVendas.map(venda => (
                            <tr key={venda.id}>
                                <td className="border p-2">{venda.createdAt}</td>
                                <td className="border p-2">{venda.cliente?.nome || 'N/A'}</td>
                                <td className="border p-2 "> <span className={`${ venda.status === 'finalizada' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}`}>{venda.status}</span></td>
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
            <div className='flex justify-between items-center'>
                <p><strong>Data:</strong> {selectedVenda.createdAt}</p>
                <p><strong>Cliente:</strong> {selectedVenda.cliente.nome}</p>
            </div>

            <div className='flex justify-between items-center mt-2'>
                <p><strong>Venc.:</strong> {selectedVenda.vencimento}</p>
                <span className={
                    selectedVenda.status === 'pendente'
                        ? 'text-red-500 font-semibold'
                        : 'font-semibold text-green-500'
                }>
                    {selectedVenda.status}
                </span>
            </div>

            <div className='flex justify-between items-center mt-1'>
                <p><strong>Vendedor:</strong> {selectedVenda.vendedor.nome}</p>
                <p className='text-lg'><strong>Total:</strong> {selectedVenda.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>

            <div className='mt-4'>
                <h3 className="text-xs font-bold">Produtos</h3>
                <ul>
                    {selectedVenda.produtos.map((produto, index) => (
                        <li key={index} className="mt-2">
                            <hr />
                            {produto.produto.nome} - {produto.quantidade} un. (R$ {produto.total})
                            <hr />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleDeleteVenda}
                    className="bg-red-500 text-white p-2 rounded mr-2"
                    disabled={deleting}
                >
                    {deleting ? 'Excluindo...' : 'Excluir Venda'}
                </button>
                <button onClick={handleCloseModal} className="bg-gray-500 text-white p-2 rounded">
                    Fechar
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default Vendas;
