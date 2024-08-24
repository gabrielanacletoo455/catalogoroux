
//import { Loader2 } from 'lucide-react';
import Logo from '@/assets/banner.jpeg';
// import { useState } from 'react';
import { Link } from 'react-router-dom';


const Pedidos = () => {
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




    return (
        <div className="w-full flex flex-col">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>
           

            <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2"
            onClick={() => window.history.back()}>
                Voltar
            </button>
        </div>
    );
};

export default Pedidos;
