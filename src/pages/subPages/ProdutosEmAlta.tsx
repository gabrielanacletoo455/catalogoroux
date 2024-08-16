import Logo from '@/assets/logo.jpeg'
import { useEffect, useState } from 'react';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Loader2 } from 'lucide-react';

import { Link } from 'react-router-dom';
import { ProdutoEstoque } from '@/@types/Produtos';
import { GetProdutos } from '@/services/Produtos';

;

const ProdutosEmAlta = () => {
    const [loading, setLoading] = useState(false);
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);


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

    const produtosComAltaQuantidade = produtos.filter((p) => p.quantidade > 5);

    if(loading) {
        return <div className='w-full h-screen flex items-center justify-center'>
            <Loader2 className='w-10 h-10 animate-spin' />
        </div>
    }
    return (
        <div className="w-full flex flex-col capitalize">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>
            
            <div className="overflow-auto h-[430px] p-1">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Nome</th>
                                <th className="border p-2">Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtosComAltaQuantidade.length > 0 ? (
                                produtosComAltaQuantidade.map((produtos) => (
                                    <tr key={produtos.id} className="hover:bg-gray-200">
                                        <td className="border p-2">{produtos.nome}</td>
                                        <td className="border p-2 text-center text-green-600 font-bold">{produtos.quantidade}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="border p-2 text-center">Nenhuma categoria encontrada</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
            onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default ProdutosEmAlta;
