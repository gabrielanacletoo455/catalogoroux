import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { VendedorType } from '@/@types/Vendedores';

interface ModalProps {
    vendedor: VendedorType;
    onClose: () => void;
    onSave: (vendedor: VendedorType) => Promise<{ status: number; message: string }>;
}

const ModalVendedor: React.FC<ModalProps> = ({ vendedor, onClose, onSave }) => {
    const [nome, setNome] = useState(vendedor.nome);
    const [celular, setCelular] = useState(vendedor.celular);
    const [senha, setSenha] = useState(vendedor.senha);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const updatedVendedor = { ...vendedor, nome, celular, senha };
            const response = await onSave(updatedVendedor);
            
            if (response.status === 200) {
                setLoading(false);
                setMessage(response.message);
            } else {
                setLoading(false);
                setMessage('Erro ao atualizar vendedor');
            }
        } catch (error) {
            setLoading(false);
            setMessage('Erro ao atualizar vendedor');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center ">
            <div className="bg-white p-6 rounded shadow-md w-[90%]">
                <h2 className="text-lg mb-4">Editar Vendedor - {nome}</h2>
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
                        <label className="block text-sm font-medium">Senha</label>
                        <input
                            type="text"
                            className="border p-1 w-full"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium">Celular</label>
                        <input
                            type="number"
                            className="border p-1 w-full"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
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
                            onClick={handleSave}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="ml-2">Carregando</span>
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

export default ModalVendedor;
