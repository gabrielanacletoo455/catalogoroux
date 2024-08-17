import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { ProdutoEstoque } from '@/@types/Produtos';

interface ModalProps {
    produto: ProdutoEstoque;
    onClose: () => void;
    onSave: (produto: ProdutoEstoque) => Promise<{ status: number; message: string }>;
}

const ModalProdutos: React.FC<ModalProps> = ({ produto, onClose, onSave }) => {
    const [nome, setNome] = useState(produto.nome);
    const [quantidade, setQuantidade] = useState(produto.quantidade);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    

    
    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const updatedProduto = { ...produto, nome, quantidade};
            const response = await onSave(updatedProduto);
            
            if (response.status === 200) {
                setLoading(false);
                setMessage(response.message);
            } else {
                setLoading(false);
                setMessage('Erro ao atualizar fornecedor');
            }
        } catch (error) {
            setLoading(false);
            setMessage('Erro ao atualizar fornecedor');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-[85%]">
                <h2 className="text-lg mb-4">Editar Produto - {nome.substring(0, 20) + '...'}</h2>
                <form>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Nome</label>
                        <input
                            type="text"
                            className="border p-1 w-full"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium">Quantidade</label>
                        <input
                            type="number"
                            className="border p-1 w-full"
                            value={quantidade}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                        />
                    </div>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="default"
                            className="px-4 py-2 mr-2 rounded"
                            onClick={onClose}>
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            className="bg-red-700 text-white px-4 py-2 rounded"
                            disabled={loading}
                            onClick={handleSave} >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </>
                            ) : (
                                'Salvar'
                            )}
                        </Button>
                    </div>
                </form>
                {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
            </div>
           
        </div>
    );
};

export default ModalProdutos;
