import { Loader2 } from 'lucide-react';
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

const NovaVenda = () => {
    const [step, setStep] = useState(1); // Controle de etapas
    const [clientes, setClientes] = useState<ClienteType[]>([]);
    const [vendedores, setVendedores] = useState<VendedorType[]>([]);
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [selectedCliente, setSelectedCliente] = useState<ClienteType | null>(null);
    const [selectedProdutos, setSelectedProdutos] = useState<{ produto: ProdutoEstoque; quantidade: number }[]>([]);
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorType | null>(null);
    const [desconto, setDesconto] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [_error, setError] = useState<string | null>(null);

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

    const handleNextStep = () => {
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

    const handlePrevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleVendedorSelection = (vendedor: VendedorType) => {
        const senhaDigitada = prompt('Digite a senha do vendedor:');
        if (senhaDigitada === vendedor.senha) {
            setSelectedVendedor(vendedor);
            handleNextStep();
        } else {
            alert('Senha incorreta!');
        }
    };

    const handleProdutoSelection = (produto: ProdutoEstoque) => {
        const quantidadeStr = prompt('Digite a quantidade do produto:');
        const quantidade = parseInt(quantidadeStr || '0', 10);
        if (quantidade > 0) {
            setSelectedProdutos((prev) => [...prev, { produto, quantidade }]);
        } else {
            alert('Quantidade inválida!');
        }
    };

    if (loading) {
        return <div className='flex justify-center items-center h-screen'><Loader2 className='w-10 h-10 animate-spin' /></div>;
    }

    return (
        <div className="w-full flex flex-col">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>

            {step === 1 && (
                <div className='flex flex-col h-[500px] overflow-auto items-center mx-auto w-[95%]'>
                    <h1 className='tracking-tighter'>Selecione o Cliente</h1>
                    <Input placeholder='Pesquisar' className="my-3 w-[90%]" />
                    {clientes.map((cliente) => (
                        <Card className='shadow-lg w-[90%] mt-2 h-24 tracking-tighter text-sm p-5' 
                        key={cliente.id} onClick={() => {
                            setSelectedCliente(cliente);
                        }}>
                            <p>{cliente.nome}</p>
                            <p>{cliente.celular}</p>
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
                    <h2 className='tracking-tighter'>Selecione o Vendedor</h2>
                    {vendedores.map((vendedor) => (
                        <Button key={vendedor.id} onClick={() => handleVendedorSelection(vendedor)}>
                            {vendedor.nome}
                        </Button>
                    ))}
                    {vendedores.length === 0 && <p>Nenhum vendedor encontrado.</p>}
                </div>
            )}

            {step === 4 && selectedVendedor && selectedProdutos.length > 0 && (
                <div className='flex flex-col h-[500px] overflow-auto items-center mx-auto w-[95%]'>
                    <h2 className='tracking-tighter'>Relatório da Venda</h2>
                    <p>Cliente: {selectedCliente?.nome}</p>
                    <ul>
                        {selectedProdutos.map(({ produto, quantidade }) => (
                            <li key={produto.id}>
                                <p>Produto: {produto.nome}</p>
                                <p>Quantidade: {quantidade}</p>
                                <p>Preço Unitário: R${Number(produto.preco)}</p>
                                <p>Total: R${Number(produto.preco) * quantidade}</p>
                            </li>
                        ))}
                    </ul>
                    <p>Desconto (%): <Input type="number" value={desconto} onChange={(e) => setDesconto(parseInt(e.target.value))} /></p>
                    <p>Total Geral: R${(selectedProdutos.reduce((total, { produto, quantidade }) => {
    const preco = Number(produto.preco); // Garanta que preco é um número
    const quant = Number(quantidade); // Garanta que quantidade é um número
    return total + (preco * quant);
}, 0) * (1 - (Number(desconto) / 100))).toFixed(2)}</p>

                </div>
            )}

            <div className='flex justify-between p-4'>
                {step > 1 && <Button onClick={handlePrevStep}>Voltar</Button>}
                <Button
                    onClick={handleNextStep}
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
