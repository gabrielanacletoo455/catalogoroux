import React, { useEffect, useState } from 'react';
import Logo from '@/assets/logo.jpeg';
import { ProdutoEstoque } from '@/@types/Produtos';
import Whatsapp from '@/assets/whatsapp.png';
import { GetProdutos } from '@/services/Produtos';
import Carrinho from '@/components/Carrinho';
import { ShoppingCart, Loader2 } from 'lucide-react'; // Importa o ícone Loader
import { GetCategorias } from '@/services/Categorias';
import { CategoriasType } from '@/@types/Categorias';

const Catalogo: React.FC = () => {
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [categorias, setCategorias] = useState<CategoriasType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
    const [carrinho, setCarrinho] = useState<ProdutoEstoque[]>([]);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const data = await GetProdutos();
                if (data && data.items) {
                    setProdutos(data.items);
                }
            } catch (err) {
                setError('Erro ao carregar produtos.');
            }
        };

        const fetchCategorias = async () => {
            try {
                const data = await GetCategorias();
                if (data && data.items) {
                    // Assegura que os dados têm as propriedades corretas
                    const categoriasData: CategoriasType[] = data.items.map((cat: any) => ({
                        id: cat.id,
                        nome: cat.nome,
                        createdAt: cat.createdAt || null,
                        updatedAt: cat.updatedAt || null,
                    }));
                    setCategorias(categoriasData);
                }
            } catch (err) {
                setError('Erro ao carregar categorias.');
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
        fetchCategorias();
    }, []);

    const adicionarAoCarrinho = (produto: ProdutoEstoque) => {
        setCarrinho([...carrinho, produto]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={48} className="animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    const produtosFiltrados = categoriaSelecionada
        ? produtos.filter((produto) => produto.categoria === categoriaSelecionada)
        : produtos;

    return (
        <div className="relative w-full flex flex-col min-h-screen">
            <img src={Logo} className='pb-1' alt="Logo" />

            {/* Container flex para filtro e carrinho */}
            <div className="flex justify-between p-4 items-">
                <div className="flex-1 items-center justify-between">
                    {/* <label htmlFor="categoria" className="block text-lg font-semibold mb-2">Filtrar por Categoria:</label> */}
                    <select
                        id="categoria"
                        value={categoriaSelecionada}
                        onChange={(e) => setCategoriaSelecionada(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="">Todas as Categorias</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.nome}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <Carrinho />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
                {produtosFiltrados
                    .filter((produto) => produto.quantidade > 0)
                    .map((produto) => {
                        const fotoPrincipal = (produto.imagens && produto.imagens.length > 0) ? produto.imagens[0] : 'placeholder-image-url';

                        return (
                            <div key={produto.id} className="border rounded-lg p-4 shadow-md">
                                <img
                                    src={fotoPrincipal}
                                    alt={produto.nome}
                                    className="w-full h-24 object-cover mb-2"
                                />
                                <h3 className="text-lg font-bold truncate">{produto.nome}</h3>
                                <p className="text-xl font-semibold">{produto.preco}</p>
                                <p className={`text-sm ${produto.quantidade < 3 ? 'text-red-500' : ''}`}>
                                    Quantidade: {produto.quantidade}
                                </p>
                                <button
                                    className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-green-600"
                                    onClick={() => adicionarAoCarrinho(produto)}
                                >
                                    <ShoppingCart size={20} />
                                    <span>Adicionar ao Carrinho</span>
                                </button>
                            </div>
                        );
                    })}
            </div>

            <a
                href="https://wa.me/140991971264"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-0 right-0 m-4"
            >
                <img
                    src={Whatsapp}
                    alt="WhatsApp"
                    className="w-16 h-16"
                />
            </a>
        </div>
    );
};

export default Catalogo;
