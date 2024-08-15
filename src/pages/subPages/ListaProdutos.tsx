import React, { useEffect, useState } from 'react';
import Logo from '@/assets/Roux3.png';
import { ProdutoEstoque } from '@/@types/Produtos';
import Whatsapp from '@/assets/icones/whatsapp-svgrepo-com.svg';

const ListaProdutos: React.FC = () => {
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const data = await GetProdutos();
                if (data && data.items) {
                    setProdutos(data.items);
                }
            } catch (err) {
                setError('Erro ao carregar produtos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="relative w-full flex flex-col min-h-screen">
            <img src={Logo} className='pb-1' alt="Logo" />

            {produtos.length === 0 ? (
                <div className="text-center mt-4 text-lg font-semibold">
                    Nenhum produto cadastrado.
                </div>
            ) : (
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {produtos.map((produto) => (
                                <tr key={produto.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={(produto.imagens && produto.imagens.length > 0) ? produto.imagens[0] : 'placeholder-image-url'}
                                            alt={produto.nome}
                                            className="w-6 h-6 object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {produto.nome.length > 20 ? produto.nome.substring(0, 20) + '...' : produto.nome}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {produto.preco}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className={produto.quantidade < 3 ? 'text-red-500' : 'text-gray-900'}>
                                            {produto.quantidade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <a
                href="https://wa.me/140991971264"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-0 right-0 m-4"
            >
                <img
                    src={Whatsapp}
                    alt="WhatsApp"
                    className="w-12 h-12"
                />
            </a>
        </div>
    );
};

export default ListaProdutos;
