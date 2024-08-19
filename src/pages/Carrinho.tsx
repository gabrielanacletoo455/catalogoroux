//import { Loader2 } from 'lucide-react';
import Logo from '@/assets/banner.jpeg';
//import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Carrinho = () => {
    const location = useLocation();
    const carrinho = location.state?.carrinho 
  

    // const [loading, setLoading] = useState(false);
 
    // if(loading) return <div className="flex justify-center items-center h-screen">
    //     <Loader2 className="w-10 h-10 text-blue-500" />
    // </div>

    return (
        <div className="w-full flex flex-col">
            <Link to="/">
                <img src={Logo} className='pb-1' />
            </Link>
            <div>
                <h2 className="text-lg font-bold mb-4">Itens no Carrinho:</h2>
                <ul>

{carrinho.map((item: { produto: { nome: string, preco: number }, quantidade: number }, index: number) => (
    <li key={index} className="border-b py-2">
                            <p className="font-semibold">{item.produto.nome}</p>
                            <p>Quantidade: {item.quantidade}</p>
                            <p>Preço: {item.produto.preco}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Carrinho;
