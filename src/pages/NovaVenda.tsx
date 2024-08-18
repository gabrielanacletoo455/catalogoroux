import { Loader2, ShoppingCart } from 'lucide-react';
import Logo from '@/assets/logo.jpeg';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GetClientes } from '@/services/Clientes';
import { GetVendedores } from '@/services/Vendedores';
import { GetProdutos } from '@/services/Produtos';
import { ClienteType } from '@/@types/Cliente';
import { VendedorType } from '@/@types/Vendedores';
import { ProdutoEstoque } from '@/@types/Produtos';
import { Card } from '@/components/ui/card';
import Celular from "@/assets/chamada-telefonica.png";

const NovaVenda = () => {
    const [step, setStep] = useState<number>(1); 
    const [clientes, setClientes] = useState<ClienteType[]>([]);
    const [vendedores, setVendedores] = useState<VendedorType[]>([]);
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [selectedCliente, setSelectedCliente] = useState<ClienteType | null>(null);
    const [selectedProdutos, setSelectedProdutos] = useState<{ produto: ProdutoEstoque; quantidade: number }[]>([]);
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorType | null>(null);
    const [desconto, setDesconto] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [_error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const clientesData = await GetClientes();
                const produtosData = await GetProdutos();
                const vendedoresData = await GetVendedores();

                if (clientesData && produtosData && vendedoresData) {
                    setClientes(clientesData.items);
                    setProdutos(produtosData.items);
                    setVendedores(vendedoresData.items);
                }
            } catch (error) {
                setError('Erro ao buscar dados. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNextStep = (): void => {
        if (step === 1 && !selectedCliente) {
            alert('Por favor, selecione um cliente.');
            return;
        }
        if (step === 2 && selectedProdutos.length === 0) {
            alert('Por favor, selecione pelo menos um produto.');
            return;
        }
        if (step === 3 && !selectedVendedor) {
            alert('Por favor, selecione um vendedor.');
            return;
        }
        setStep((prevStep) => prevStep + 1);
    };
    
    const handlePrevStep = (): void => {
        setStep((prevStep) => prevStep - 1);
    };
    
    const handleVendedorSelection = (vendedor: VendedorType): void => {
        const senhaDigitada = prompt('Digite a senha do vendedor:');
        if (senhaDigitada === vendedor.senha) {
            setSelectedVendedor(vendedor);
            handleNextStep();
        } else {
            alert('Senha incorreta!');
        }
    };
    
    const handleProdutoSelection = (produto: ProdutoEstoque): void => {
        const quantidadeStr = prompt('Digite a quantidade do produto:');
        const quantidade = parseInt(quantidadeStr || '0', 10);
    
        if (quantidade > 0) {
            const estoque = produto.quantidade;
    
            if (quantidade > estoque) {
                alert(`A quantidade selecionada para ${produto.nome} excede o estoque disponível (${estoque} unidade(s)).`);
                return;
            }
    
            setSelectedProdutos((prev) => {
                const produtoExistente = prev.find(item => item.produto.id === produto.id);
    
                if (produtoExistente) {
                    // Atualiza a quantidade do produto existente
                    return prev.map(item => 
                        item.produto.id === produto.id 
                        ? { ...item, quantidade: item.quantidade + quantidade }
                        : item
                    );
                } else {
                    // Adiciona um novo produto
                    return [...prev, { produto, quantidade }];
                }
            });
        } else {
            alert('Quantidade inválida!');
        }
    };
    
    
 
    const verificarEstoque = (): boolean => {
        for (const { produto, quantidade } of selectedProdutos) {
            const estoque = produtos.find(p => p.id === produto.id)?.quantidade || 0;
            if (quantidade > estoque) {
                setError(`Quantidade de ${produto.nome} excede o estoque disponível.`);
                return false;
            }
        }
        return true;
    };
    
    if (loading) {
        return <div className='flex justify-center items-center h-screen'><Loader2 className='w-10 h-10 animate-spin' /></div>;
    }

    const emojis = ["😀", "😁", "🥰", "😍", "🤩", "🤪", "😜", "👽", "😴", "🤑", "🫢", "🫣", "😬", "🫨", "😪", "🤤", "😮", "🤓", "😎", "🥸", "🤠", "😵‍💫", "🤯", "🤗", "😝", "💃"];

    function getRandomEmoji() {
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    const handleFinalizarVenda = (): void => {
        if (verificarEstoque()) {
            // Lógica para finalizar a venda
            alert('Venda finalizada com sucesso!');
        } else {
            alert('Não foi possível finalizar a venda devido a problemas com o estoque.');
        }
    };


    const handleQuantidadeChange = (produtoId: string, novaQuantidade: number) => {
        setSelectedProdutos((prev) =>
            prev.map((item) =>
                item.produto.id === produtoId
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            )
        );
    };
    
    const handleRemoverItem = (produtoId: string) => {
        setSelectedProdutos((prev) => prev.filter((item) => item.produto.id !== produtoId));
    };


    return (
        <div className="w-full flex flex-col">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>

                {/* Ícone do Carrinho Flutuante */}
                <div className="fixed bottom-20 right-5 z-50">
    <Button onClick={() => setIsModalOpen(true)} className="bg-green-500 rounded-full p-3 shadow-lg">
        <ShoppingCart className="w-6 h-6 text-white" />
    </Button>
</div>


             {/* Modal com os Produtos Selecionados */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-lg text-sm tracking-tighter">
                    <h2 className="text-xl mb-4">Produtos Selecionados</h2>
                    <ul className='h-[350px] overflow-auto text-xs'>
                        {selectedProdutos.length > 0 ? (
                            <>
                                {selectedProdutos.map(({ produto, quantidade }) => {
                                    const precoUnitario = Number(produto.preco.replace('R$', '').replace(',', '.'));
                                    const totalProduto = precoUnitario * quantidade;
                                    return (
                                        <li key={produto.id} className="mb-4 p-2 border-b-2 border-gray-300 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-sm text-gray-700">Produto: <span className="text-black">{produto.nome}</span></p>
                                                <p className="font-bold text-sm text-gray-700">Preço Unitário: <span className="text-green-600">R${precoUnitario.toFixed(2)}</span></p>
                                                <p className="font-bold text-sm text-gray-700">Total deste Produto: <span className="text-red-600">R${totalProduto.toFixed(2)}</span></p>
                                            </div>
                                            <div className="flex items-center">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={quantidade}
                                                    onChange={(e) => handleQuantidadeChange(produto.id!, parseInt(e.target.value))}
                                                    className="w-16 text-center"
                                                />
                                                <Button onClick={() => handleRemoverItem(produto.id!)} className="ml-2 bg-red-500 text-white">
                                                    Remover
                                                </Button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </>
                        ) : (
                            <p>Nenhum produto adicionado.</p>
                        )}
                    </ul>
                    <div className="mt-4 flex justify-between">
                        <span className='font-semibold text-lg tracking-tighter'>Total Geral: R${selectedProdutos.reduce((acc, { produto, quantidade }) => {
                            const precoUnitario = Number(produto.preco.replace('R$', '').replace(',', '.'));
                            return acc + (precoUnitario * quantidade);
                        }, 0).toFixed(2)}</span>

                        <Button onClick={() => setIsModalOpen(false)} className="bg-red-500">
                            Fechar
                        </Button>
                    </div>
                </div>
            </div>
        )}
        
            
            {step === 1 && (
                <div className='flex flex-col h-[500px] overflow-auto items-center mx-auto w-[95%]'>
                    <h1 className='tracking-tighter'>Selecione o Cliente</h1>
                    <Input placeholder='Pesquisar' className="my-3 w-[90%]" />
                    {clientes.map((cliente) => (
                        <Card className='shadow-lg w-[95%] mt-2 h-24 tracking-tighter text-sm p-5'
                            key={cliente.id} onClick={() => {
                                setSelectedCliente(cliente);
                            }}>
                            <div className='flex w-full items-center justify-between'>
                                <div className='flex flex-col'>
                                <p className='text-xl tracking-tighter'>{cliente.nome}</p>
                                <div className='flex'>
                                <img src={Celular}  className='w-5 h-5' /> <span>{cliente.celular ? cliente.celular : 'Não disponível'}</span>
                                </div>
                                </div>
                                
                                <div>
                                <span className='text-3xl bg-teal-400 p-2 rounded-full'>
                                {getRandomEmoji()}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {clientes.length === 0 && <p>Nenhum cliente encontrado.</p>}
                </div>
            )}

            {step === 2 && selectedCliente && (
                <div className='flex flex-col h-[500px] overflow-auto items-center mx-auto w-[95%]'>
                    <h2 className='tracking-tighter'>Selecione o Produto</h2>
                    <Input placeholder='Pesquisar' className="my-3 w-[90%]" />
                    {produtos.map((produto) => (
                        <Card className='shadow-lg w-[90%] mt-2 h-[300px] tracking-tighter text-sm p-5'
                            key={produto.id} onClick={() => handleProdutoSelection(produto)}>
                            <div className='flex flex-col'>
                                <div className='flex w-[100%] justify-between items-center'>
                                    {produto.nome} - R${produto.preco} <br />
                                </div>
                                <div className='flex w-[95%] overflow-x-auto mt-5'>
                                    {produto.imagens.map((imagem) => (
                                        <img src={imagem} className='w-24 h-24 mr-3 object-contain' />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                    {produtos.length === 0 && <p>Nenhum produto encontrado.</p>}
                </div>
            )}

{step === 3 && selectedProdutos && (
    <div className='flex flex-col h-[500px] overflow-auto items-center mx-auto w-[95%]'>
        <h2 className='text-xl font-semibold mb-4 tracking-tighter'>Selecione o Vendedor</h2>
        <div className='flex flex-col space-y-4 w-full max-w-md'>
            {vendedores.length > 0 ? (
                vendedores.map((vendedor) => (
                    <div
                        key={vendedor.id}
                        className='flex flex-col items-center bg-white shadow-lg rounded-lg p-4 w-full'
                    >
                        <div
                            className='w-12 h-12 flex items-center justify-center rounded-full mb-2'
                            style={{ backgroundColor: '#f0f0f0' }} // Fundo colorido para o emoji
                        >
                            <span className='text-2xl'>{vendedor.emoji}</span>
                        </div>
                        <p className='text-lg font-semibold mb-2'>{vendedor.nome}</p>
                        <Button
                            onClick={() => handleVendedorSelection(vendedor)}
                            className='bg-green-500 text-white rounded-lg py-2 px-4'
                        >
                            Selecionar
                        </Button>
                    </div>
                ))
            ) : (
                <p>Nenhum vendedor encontrado.</p>
            )}
        </div>
    </div>
)}


            {step === 4 && selectedVendedor && selectedProdutos.length > 0 && (
                <div className='flex flex-col h-[500px] overflow-auto mx-auto w-[95%]'>
                    <h2 className='tracking-tighter text-xl'>Relatório da Venda</h2>
                    <hr />
                        <div className='flex justify-between'>
                        <span><b>Cliente:</b> {selectedCliente?.nome}</span> 
                        <span><b>Vendedor:</b> {selectedVendedor?.nome}</span>
                        </div>
                        <hr />
                    <ul className='h-[300px] mt-2 overflow-auto'>
                        {selectedProdutos.map(({ produto, quantidade }) => (
                            <li key={produto.id}>
                                <p>Produto: {produto.nome}</p>
                                <p>Quantidade: {quantidade}</p>
                                <p>Preço Unitário: R${Number(produto.preco.replace('R$', '').replace(',', '.'))}</p>
                                <p><b>Total:</b> R${Number(produto.preco.replace('R$', '').replace(',', '.')) * quantidade}</p>
                                <hr />
                            </li>
                        ))}
                    </ul>
                    <p>Desconto (%): <Input type="number" value={desconto} onChange={(e) => setDesconto(parseInt(e.target.value))} /></p>
                    <p><b>Total Geral:</b> R${(selectedProdutos.reduce((total, { produto, quantidade }) => {
                        const preco = Number(produto.preco.replace('R$', '').replace(',', '.')); // Garanta que preco é um número
                        const quant = Number(quantidade); // Garanta que quantidade é um número
                        return total + (preco * quant);
                    }, 0) * (1 - (Number(desconto) / 100))).toFixed(2)}</p>

                </div>
            )}

            <div className='flex justify-between p-4'>
                {step > 1 && <Button onClick={handlePrevStep}>Voltar</Button>}
                <Button
                    onClick={step === 4 ? handleFinalizarVenda : handleNextStep}
                    disabled={step === 1 && !selectedCliente ||
                        step === 2 && selectedProdutos.length === 0 ||
                        step === 3 && !selectedVendedor}
                >
                    {step < 4 ? 'Avançar' : 'Finalizar Venda'}
                </Button>

            </div>
        </div>
    );
};

export default NovaVenda;
