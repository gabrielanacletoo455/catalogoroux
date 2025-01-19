import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProdutoEstoque } from '@/@types/Produtos';
import Logo from '@/assets/banner.jpeg';
import { AtualizarProduto, ExcluirProduto } from '@/services/Produtos';
import { Button } from '@/components/ui/button';

const ProdutoDetalhe: React.FC = () => {
    const location = useLocation();
    const produto = location.state as ProdutoEstoque;
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isEditing, setIsEditing] = useState(false);
    const [editedProduto, setEditedProduto] = useState<ProdutoEstoque>(produto);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNextImage = () => {
        if (produto.imagens && currentImageIndex < produto.imagens.length - 1) {
            setCurrentImageIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousImage = () => {
        if (produto.imagens && currentImageIndex > 0) {
            setCurrentImageIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedProduto({ ...editedProduto, [name]: value });
    };

    const handleSave = async () => {
        const response = await AtualizarProduto(editedProduto);
        if (response.status === 200) {
            alert(response.message);
            setIsEditing(false);
            navigate('/');
        } else {
            alert('Erro ao atualizar o produto.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            const response = await ExcluirProduto(produto.id!);
            if (response.status === 200) {
                alert(response.message);
                navigate('/');
            } else {
                alert('Erro ao excluir o produto.');
            }
        }
    };

    const currentImage =
        produto.imagens && produto.imagens.length > 0
            ? produto.imagens[currentImageIndex]
            : 'placeholder-image-url';

    return (
        <div className="w-full">
            {isDesktop ? (
                <div className="flex align-center justify-between border p-1 px-2 bg-red-800 text-white tracking-tighter mb-3">
                    <Link to="/" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Inicio</Link>
                    <Link to="/estoque" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Estoque</Link>
                    <Link to="/clientes" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Clientes</Link>
                    <Link to="/fornecedores" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Fornecedores</Link>
                </div>
            ) : (
                <Link to="/"><img src={Logo} className="pb-1" alt="Logo" /></Link>
            )}

            <div className="flex flex-col items-center w-[80%] mx-auto">
                <img
                    src={currentImage}
                    alt={produto.nome}
                    className="w-full h-64 object-contain mb-4"
                />
                {produto.imagens && produto.imagens.length > 1 && (
                    <div className="flex justify-between w-full mb-4">
                        <button
                            onClick={handlePreviousImage}
                            disabled={currentImageIndex === 0}
                            className="bg-gray-800 text-white p-2 rounded disabled:opacity-50">
                            Anterior
                        </button>
                        <button
                            onClick={handleNextImage}
                            disabled={currentImageIndex === produto.imagens.length - 1}
                            className="bg-gray-800 text-white p-2 rounded disabled:opacity-50">
                            Próximo
                        </button>
                    </div>
                )}

                {isEditing ? (
                    <div className="w-full flex flex-col space-y-2">
                        <input
                            type="text"
                            name="nome"
                            value={editedProduto.nome}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="preco"
                            value={editedProduto.preco}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        />
                        <textarea
                            name="descricao"
                            value={editedProduto.descricao}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="categoria"
                            value={editedProduto.categoria}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="number"
                            name="quantidade"
                            value={editedProduto.quantidade}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        />
                        <button onClick={handleSave} className="bg-green-600 text-white p-2 rounded">
                            Salvar
                        </button>
                        <button onClick={handleEditToggle} className="bg-gray-600 text-white p-2 rounded">
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="w-full flex flex-col space-y-2 text-left">
                        <h2 className="text-lg font-bold">Nome: {produto.nome}</h2>
                        <p>Preço: {produto.preco}</p>
                        <p>Descrição: {produto.descricao}</p>
                        <p>Categoria: {produto.categoria}</p>
                        <p>Quantidade: {produto.quantidade}</p>
                        <div className="flex space-x-4 mt-4">
                            <Button onClick={handleEditToggle}>
                                Editar
                            </Button>
                            <Button onClick={handleDelete} variant="destructive">
                                Excluir
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProdutoDetalhe;
