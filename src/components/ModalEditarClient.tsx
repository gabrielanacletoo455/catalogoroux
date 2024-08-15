import React, { useState } from 'react';
import { ClienteType } from "@/@types/Cliente";
import { Button } from './ui/button';

interface ModalProps {
    cliente: ClienteType;
    onClose: () => void;
    onSave: (cliente: ClienteType) => void;
}

const Modal: React.FC<ModalProps> = ({ cliente, onClose, onSave }) => {
    const [nome, setNome] = useState(cliente.nome);
    const [apelido, setApelido] = useState(cliente.apelido);
    const [celular, setCelular] = useState(cliente.celular);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedCliente = { ...cliente, nome, apelido, celular };
        onSave(updatedCliente);
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg mb-4">Editar Cliente - {nome}</h2>
                <form onSubmit={handleSubmit}>
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
                        <label className="block text-sm font-medium">Apelido</label>
                        <input
                            type="text"
                            className="border p-1 w-full"
                            value={apelido}
                            onChange={(e) => setApelido(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium">Celular</label>
                        <input
                            type="text"
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
                            type="submit"
                            className="bg-red-700 text-white px-4 py-2 rounded">
                            Salvar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
