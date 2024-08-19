import React, { useEffect, useState } from 'react';
import Logo from '@/assets/banner.jpeg';
import { ProdutoEstoque } from '@/@types/Produtos';
import { GetProdutos } from '@/services/Produtos';
import { ShoppingCart, Loader2, X } from 'lucide-react'; // Importa o ícone X para remoção
import { GetCategorias } from '@/services/Categorias';
import { CategoriasType } from '@/@types/Categorias';
import { Button } from '@/components/ui/button';

import IconeCarrinho from '@/assets/sacolas-de-compras.png';
const Catalogo: React.FC = () => {
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [categorias, setCategorias] = useState<CategoriasType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
    const [carrinho, setCarrinho] = useState<{ produto: ProdutoEstoque; quantidade: number }[]>([]);
    const [carrinhoVisivel, setCarrinhoVisivel] = useState<boolean>(false);

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
        setCarrinho((prevCarrinho) => {
            const itemExistente = prevCarrinho.find(item => item.produto.id === produto.id);
            if (itemExistente) {
                if (itemExistente.quantidade < produto.quantidade) {  // Verifica se não ultrapassa o estoque
                    return prevCarrinho.map(item =>
                        item.produto.id === produto.id
                            ? { ...item, quantidade: item.quantidade + 1 }
                            : item
                    );
                } else {
                    alert("Quantidade indisponível.");
                    return prevCarrinho;
                }
            } else {
                return [...prevCarrinho, { produto, quantidade: 1 }];
            }
        });
    };

    const removerDoCarrinho = (produtoId: string) => {
        setCarrinho((prevCarrinho) =>
            prevCarrinho.filter(item => item.produto.id !== produtoId)
        );
    };

    const ajustarQuantidade = (produtoId: string, quantidade: number) => {
        setCarrinho((prevCarrinho) =>
            prevCarrinho.map(item => {
                if (item.produto.id === produtoId) {
                    if (quantidade <= item.produto.quantidade) {  // Verifica se a nova quantidade não ultrapassa o estoque
                        return { ...item, quantidade };
                    } else {
                        alert("Quantidade em estoque insuficiente.");
                        return item;
                    }
                }
                return item;
            })
        );
    };

    const toggleCarrinhoVisivel = () => {
        setCarrinhoVisivel(!carrinhoVisivel);
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


    const finalizarCompra = () => {
        const mensagem = carrinho.map(item => {
            return `📦 *Produto:* ${item.produto.nome}\n🔢 *Quantidade:* ${item.quantidade}\n💰 *Preço:* ${item.produto.preco}\n\n`;
        }).join('');

        const total = carrinho.reduce((total, { produto, quantidade }) => {
            const preco = Number(produto.preco.replace('R$', '').replace(',', '.'));
            return total + (preco * quantidade);
        }, 0).toFixed(2);

        const mensagemFinal = `Olá! 👋\n\nGostaria de finalizar a compra com os seguintes itens:\n\n${mensagem}🛒 *Total:* R$${total}\n\nPor favor, confirme os detalhes e me avise se precisar de mais alguma coisa. 😊\n\nAgradeço! 🙌`;

        const numeroWhatsApp = "14997791103";
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemFinal)}`;

        window.open(urlWhatsApp, '_blank');
    };


    return (
        <div className="relative w-full flex flex-col min-h-screen">
            <img src={Logo} className='pb-1' alt="Logo" />

            <div className="flex justify-between p-4 items-">
                <div className="flex-1 items-center justify-between">
                    <select
                        id="categoria"
                        value={categoriaSelecionada}
                        onChange={(e) => setCategoriaSelecionada(e.target.value)}
                        className="p-2 border rounded-md">
                        <option value="">Todas as Categorias</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.nome}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-2">
                {produtosFiltrados
                    .filter((produto) => produto.quantidade >= 0)
                    .map((produto) => {
                        // const fotoPrincipal = (produto.imagens && produto.imagens.length > 0) ? produto.imagens[0] : 'placeholder-image-url';

                        return (

                            <div key={produto.id} className="border rounded-lg p-4 shadow-md tracking-tighter">
                                <div className='flex w-full items-center justify-center'>
                                    <div className='flex w-[95%] overflow-x-auto '>
                                        {produto.imagens.map((imagem) => (
                                            <img src={imagem} className='w-24 h-24 mr-3 object-contain' />
                                        ))}
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold truncate">{produto.nome}</h3>
                                <p className="text-lg font-semibold">{produto.preco}</p>
                                <button
                                    className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-green-600"
                                    onClick={() => adicionarAoCarrinho(produto)}>
                                    <ShoppingCart size={20} />
                                    <span className='text-xs'>Adicionar ao Carrinho</span>
                                </button>
                            </div>
                        );
                    })}
            </div>

            <div className="fixed bottom-10 right-0 flex flex-col space-y-4 m-4">
                <a
                    onClick={toggleCarrinhoVisivel}
                    className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 relative flex items-center justify-center">
                    {/* <ShoppingCart size={32} /> */}
                    <img src={IconeCarrinho} className='w-11' />
                    {carrinho.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {carrinho.reduce((acc, item) => acc + item.quantidade, 0)}
                        </span>
                    )}
                </a>
            </div>

            {carrinhoVisivel && (
                <div className="fixed top-1/4 right-0 bg-white p-4 shadow-lg rounded-lg w-80">
                    <h2 className="text-lg font-bold mb-2">Carrinho</h2>

                    {/* Contêiner com overflow-auto */}
                    <div className="max-h-64 overflow-auto">
                        <ul>
                            {carrinho.map((item) => (
                                <li key={item.produto.id} className="border-b py-2 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{item.produto.nome}</p>
                                        <p className="text-sm">{item.produto.preco}</p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() => ajustarQuantidade(item.produto.id!, item.quantidade - 1)}
                                                disabled={item.quantidade <= 1}
                                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantidade}</span>
                                            <button
                                                onClick={() => ajustarQuantidade(item.produto.id!, item.quantidade + 1)}
                                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removerDoCarrinho(item.produto.id!)}
                                        className="text-red-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='flex w-full items-center justify-between mt-4'>
                        <p><b>Total:</b> R${carrinho.reduce((total, { produto, quantidade }) => {
                            const preco = Number(produto.preco.replace('R$', '').replace(',', '.'));
                            const quant = Number(quantidade);
                            return total + (preco * quant);
                        }, 0).toFixed(2)}</p>

                        <Button
                            variant="default"
                            onClick={toggleCarrinhoVisivel}
                            className="py-2 px-4 rounded">
                            Fechar
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={finalizarCompra}  // Chama a função de finalizar compra
                            className="bg-red-500 underline text-white ml-3 py-2 px-4 rounded">
                            Finalizar
                        </Button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Catalogo;
