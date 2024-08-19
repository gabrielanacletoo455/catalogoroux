import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProdutoEstoque } from '@/@types/Produtos';

const ProdutoDetalhe: React.FC = () => {
    const location = useLocation();
    const produto = location.state as ProdutoEstoque;

    return (
        <div className="p-4">
            <img
                src={(produto.imagens && produto.imagens.length > 0) ? produto.imagens[0] : 'placeholder-image-url'}
                alt={produto.nome}
                className="w-full h-64 object-contain mb-4"
            />
            <h2 className="text-2xl font-bold">{produto.nome}</h2>
            <p className="text-xl font-semibold mt-2">{produto.preco}</p>
            <p className="mt-4">{produto.descricao}</p>
        </div>
    );
};

export default ProdutoDetalhe;
