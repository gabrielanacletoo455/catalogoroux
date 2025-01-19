import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Logo from '@/assets/banner26.png';
import { Link } from 'react-router-dom';
import { PedidosType } from '@/@types/Pedidos';
import { GetPedidos, CriarPedido, AtualizarPedido } from '@/services/Pedidos';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Pedidos = () => {
    const [loading, setLoading] = useState(false);
    const [pedidos, setPedidos] = useState<PedidosType[]>([]);
    const [formData, setFormData] = useState<PedidosType>({
        cliente: { nome: '' },
        produtos: [],
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [show, setShow] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [_selectedPedido, setSelectedPedido] = useState<PedidosType | null>(null);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const data = await GetPedidos();
            if (data && data.items) {
                setPedidos(data.items as unknown as PedidosType[]);
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
                setModalVisible(false);
            }
        }
    };

    // const handleDelete = async (id: string) => {
    //     const result = await ExcluirPedido(id);
    //     if (result && result.status === 200) {
    //         setPedidos(prev => prev.filter(p => p.id !== id));
    //     }
    // };

    const handleEditClick = (pedido: PedidosType) => {
        setSelectedPedido(pedido);
        setEditingId(pedido.id || '');
        setFormData(pedido);
        setModalVisible(true);
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
                                    value={formData.produtos.map(p => p.nome).join(', ')}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        produtos: [{ nome: e.target.value, quantidade: 1 }]
                                    })}
                                    className="border p-2 w-full mb-2"
                                />
                                
                                <Button
                                    onClick={editingId ? handleUpdate : handleCreate}
                                    className="bg-green-700 text-white p-2"
                                >
                                    {editingId ? 'Atualizar Pedido' : 'Criar Pedido'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Card className='w-[95%] mx-auto'>
                    {pedidos.map(pedido => (
                        <div key={pedido.id} className="p-2 mb-2">
                            <div className='flex items-center justify-between'>
                                {pedido.cliente.nome}
                                <Button 
                                    variant="link" 
                                    className="underline text-blue-600"
                                    onClick={() => handleEditClick(pedido)}
                                >
                                    Saber mais
                                </Button>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-lg w-[95%]">
                        <h2 className="text-2xl font-bold mb-4">Editar Pedido</h2>
                        <Input
                            type="text"
                            placeholder="Cliente"
                            value={formData.cliente.nome || ''}
                            onChange={(e) => setFormData({ ...formData, cliente: { nome: e.target.value } })}
                            className="border p-2 w-full mb-2"
                        />
                        <textarea
                            placeholder="Descrição do produto"
                            value={formData.produtos.map(p => p.nome).join(', ')}
                            onChange={(e) => setFormData({
                                ...formData,
                                produtos: [{ nome: e.target.value, quantidade: 1 }]
                            })}
                            className="border p-2 w-full mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button 
                                onClick={() => {
                                    handleUpdate();
                                    setModalVisible(false);
                                }}>
                                Atualizar Pedido
                            </Button>
                            <Button variant="destructive"
                                onClick={() => setModalVisible(false)}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <button 
                className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
                onClick={() => window.history.back()}
            >
                Voltar
            </button>
        </div>
    );
};

export default Pedidos;
