import { Loader2 } from 'lucide-react';
import Logo from '@/assets/banner.jpeg';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PedidosType } from '@/@types/Pedidos';
import { GetPedidos, CriarPedido, AtualizarPedido, ExcluirPedido } from '@/services/Pedidos';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Pedidos = () => {
    const [loading, setLoading] = useState(false);
    const [pedidos, setPedidos] = useState<PedidosType[]>([]);
    const [formData, setFormData] = useState<PedidosType>({
        cliente: { nome: '' }, // Inicialmente vazio
        produtos: [], // Lista de produtos
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const data = await GetPedidos();
            if (data && data.items) {
                setPedidos(data.items as unknown as PedidosType[]); // Certifique-se de que data.items é um PedidosType[]
            }
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        const result = await CriarPedido(formData);
        if (result && result.status === 201) {
            setPedidos(prev => [...prev, result.result as PedidosType]);
            resetForm();
        }
    };

    const handleUpdate = async () => {
        if (editingId) {
            const result = await AtualizarPedido({ ...formData, id: editingId });
            if (result && result.status === 200) {
                setPedidos(prev => prev.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
                resetForm();
            }
        }
    };

    const handleDelete = async (id: string) => {
        const result = await ExcluirPedido(id);
        if (result && result.status === 200) {
            setPedidos(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleEditClick = (pedido: PedidosType) => {
        setEditingId(pedido.id || '');
        setFormData(pedido);
    };

    const resetForm = () => {
        setFormData({
            cliente: { nome: '' },
            produtos: []
        });
        setEditingId(null);
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loader2 className="w-10 h-10 text-blue-500" />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col">
            <Link to="/">
                <img src={Logo} className='pb-1' alt="Logo" />
            </Link>

            <div>
                <div className="mt-2 p-2 mx-auto">
                
                    <div className='flex items-center justify-between'>
                    <h1 className="text-3xl tracking-tighter font-bold">Pedidos</h1>

                <div>
                    <Button onClick={() => setShow(!show)}>Cadastrar pedido</Button>

                    {show && (
                        <div>
<Input
                        type="text"
                        placeholder="Cliente"
                        value={formData.cliente.nome || ''}
                        onChange={(e) => setFormData({ ...formData, cliente: { nome: e.target.value } })}
                        className="border p-2 w-full mb-2"
                    />
                    <textarea
                        placeholder="Descrição do produto"
                        value={formData.produtos.map(p => p.nome).join(', ')} // Ajuste para acessar nome diretamente
                        onChange={(e) => setFormData({
                            ...formData,
                            produtos: [{ nome: e.target.value, quantidade: 1 }] // Ajuste para corresponder ao tipo correto
                        })}
                        className="border p-2 w-full mb-2"
                    />
                    
                    <button
                        onClick={editingId ? handleUpdate : handleCreate}
                        className="bg-green-700 text-white p-2" >
                        {editingId ? 'Atualizar Pedido' : 'Criar Pedido'}
                    </button>
                        </div>
                    )}
             
                </div>
                    </div>
                   
                </div>

                <Card className='w-[95%]'>
                    {pedidos.map(pedido => (
                        <div key={pedido.id} className="border p-2 mb-2">
                            <div>Cliente: {pedido.cliente.nome}</div>
                            <div>Produtos: {pedido.produtos.map(p => p.nome).join(', ')}</div>
                            <button onClick={() => handleEditClick(pedido)} className="bg-blue-700 text-white p-1 mr-2">Editar</button>
                            <button onClick={() => handleDelete(pedido.id || '')} className="bg-red-700 text-white p-1">Excluir</button>
                        </div>
                    ))}
                </Card>
            </div>

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
                onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Pedidos;
