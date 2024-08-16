import React, { useState } from 'react';
import { Button } from './ui/button';
import { FornecedorType } from '@/@types/Fornecedor';
import { Loader2 } from 'lucide-react';

interface ModalProps {
    fornecedor: FornecedorType;
    onClose: () => void;
    onSave: (fornecedor: FornecedorType) => Promise<{ status: number; message: string }>;
}

const ModalFornecedores: React.FC<ModalProps> = ({ fornecedor, onClose, onSave }) => {
    const [nome, setNome] = useState(fornecedor.nome);
    const [celular, setCelular] = useState(fornecedor.celular);
    const [telfixo, setTelfixo] = useState(fornecedor.telfixo);
    const [email, setEmail] = useState(fornecedor.email);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const updatedFornecedor = { ...fornecedor, nome, celular, telfixo, email };
            const response = await onSave(updatedFornecedor);
            
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
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg mb-4">Editar Fornecedor - {nome}</h2>
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
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="text"
                            className="border p-1 w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium">Telefone fixo</label>
                        <input
                            type="text"
                            className="border p-1 w-full"
                            value={telfixo}
                            onChange={(e) => setTelfixo(e.target.value)}
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
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            className="bg-red-700 text-white px-4 py-2 rounded"
                            disabled={loading}
                            onClick={handleSave}
                        >
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

export default ModalFornecedores;
