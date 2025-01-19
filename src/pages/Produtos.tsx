import { Loader2 } from 'lucide-react';
import Execel from '@/assets/xlxs.png';
import Lista from '@/assets/estoque.png';
import Logo from '@/assets/banner26.png';
import EmAlta from '@/assets/estoque-pronto.png';
import EmBaixa from '@/assets/fora-de-estoque.png';
import Medalha from "@/assets/medalha-de-ouro.png";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import Adicionar from '@/assets/adicionar-produto.png';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { GetProdutos } from '@/services/Produtos';
import { ProdutoEstoque } from '@/@types/Produtos';

const Produtos = () => {
    const [loading, setLoading] = useState(false);
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);

    let valorTotalVenda = 0;

produtos.forEach(produto => {
    // Remove "R$" e converte o preço para número
    const precoNumerico = parseFloat(produto.preco.replace('R$', '').replace(',', '.'));
    
    // Multiplica o preço pela quantidade
    const valorTotalProduto = precoNumerico * produto.quantidade;
    
    // Soma ao valor total de venda
    valorTotalVenda += valorTotalProduto;
});


    let valorTotalEstoque = 0;

    produtos.forEach(produto => {
        // Remove "R$" e converte o preço para número
        const precoNumerico = parseFloat(produto.custo.replace('R$', '').replace(',', '.'));
        
        // Multiplica o preço pela quantidade
        const valorTotalProduto = precoNumerico * produto.quantidade;
        
        // Soma ao valor total do estoque
        valorTotalEstoque += valorTotalProduto;
    });

  
    const fetchProdutos = async () => {
        try {
            setLoading(true);
            const data = await GetProdutos();
            if (data && data.items) {
                setProdutos(data.items);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const generateExcel = async () => {
        setLoading(true);
        try {
            const response = await GetProdutos();
            if (response && response.items) {
                const items = response.items as ProdutoEstoque[];

                const worksheetData = [
                    ['Nome', 'Custo', 'Preço', 'Quantidade'],
                    ...items.map(produto => [
                        produto.nome,
                        produto.custo,
                        produto.preco,
                        produto.quantidade,
                    ])
                ];

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');

                XLSX.writeFile(workbook, 'lista_produtos.xlsx');
            } else {
                console.error('Resposta da API inválida ou sem produtos.');
            }
        } catch (error) {
            console.error('Erro ao gerar Excel:', error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className='w-full h-screen flex items-center justify-center'>
            <Loader2 className='w-10 h-10 animate-spin' />
        </div>
    }

    return (
        <div className="w-full flex flex-col capitalize">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>

            <div className="flex flex-wrap justify-between mb-4">
                <Link to="/novoproduto"
                    className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Adicionar} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Adicionar Produto</span>
                </Link>
                <Link to="/listaprodutos" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Lista} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Listar Produtos</span>
                </Link>

                <button onClick={generateExcel} className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Execel} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Gerar lista Excel</span>
                </button>
            </div>

            <div className="flex flex-wrap justify-between">
                <Link to="/emalta" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={EmAlta} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Produtos em alta</span>
                </Link>

                <Link to="/embaixa" className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={EmBaixa} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Produtos em baixa</span>
                </Link>
                <button className="flex-1 text-center p-4 rounded mb-2 mr-2 flex flex-col items-center">
                    <img src={Medalha} className='w-10' />
                    <span className="mt-2 text-sm tracking-tighter">Mais vendidos</span>
                </button>

            </div>

            <Card className='shadow-lg w-[90%] p-2 mx-auto rounded-sm text-xs'>
                <CardContent>
                    <div className='flex justify-between'>
                        <span>Quantidade de itens cadastrados</span> 
                        <span>{produtos.length}</span>
                    </div>
                    <div className='flex justify-between items-center w-[100%] mx-auto'>
                        <span>Valor total de estoque</span> 
                        <span>R$ {valorTotalEstoque.toFixed(2)}</span> 
                    </div>
         
                    {/* <div className='flex justify-between items-center w-[100%] mx-auto'>
                        <span>Valor de faturamento</span> 
                        <span>R$ {valorTotalVenda.toFixed(2)}</span> 
                    </div> */}

                </CardContent>
            </Card>

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
                onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Produtos;
