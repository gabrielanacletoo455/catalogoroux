import { Link } from 'react-router-dom';
import Clientes from '@/assets/equipe.png'
import Fornecedores from '@/assets/fornecedor.png'
import Estoque from '@/assets/caixa.png'
import Receber from '@/assets/pagamento-em-dinheiro.png'
import Categorias from '@/assets/etiqueta-de-preco.png'
import Vendedores from '@/assets/vendedor.png'
import Despesas from '@/assets/despesas.png'
import Vendas from '@/assets/pos-terminal.png'
import Catalogo from '@/assets/lendo-um-livro.png'
import Informacoes from '@/assets/definicoes.png'
import Logo from '@/assets/logo.jpeg'
import { PlusCircle } from 'lucide-react';

// Defina o tipo para o ícone
type MenuItem = {
  icon: string | React.FC<any>; // Pode ser uma string (imagem) ou um componente React (ícone)
  label: string;
  link: string;
};

const menuItems: MenuItem[] = [
  { icon: Clientes, label: 'Clientes', link: '/clientes' },
  { icon: Fornecedores, label: 'Fornecedores', link: '/fornecedores' },
  { icon: Estoque, label: 'Produtos', link: '/produtos' },
  { icon: Categorias, label: 'Categorias', link: '/categorias' },
  { icon: Receber, label: 'A Receber', link: '/receber' },
  { icon: Vendedores, label: 'Vendedores', link: '/vendedores' },
  { icon: Despesas, label: 'Despesas', link: '/despesas' },
  { icon: Vendas, label: 'Todas as Vendas', link: '/vendas' },
  // { icon: Estoque, label: 'Vendas', link: '/estoque' },
  { icon: Informacoes, label: 'Informações', link: '/informacoes' },
];

const Home = () => {
  return (
    <div className="flex flex-col justify-between overflow-hidden tracking-tighter">
      <img src={Logo} alt="Logo" />
      <div className="grid grid-cols-3 gap-4 p-4 text-center">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index} className="flex flex-col items-center justify-center my-4">
            {typeof item.icon === 'string' ? (
              <img src={item.icon} alt={item.label} className="w-8 h-8" />
            ) : (
              <item.icon size={32} />
            )}
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="flex flex-col items-center justify-center">
        <img src={Catalogo}  className='w-10'/> 
          <Link to="/catalogo" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
          <span className='underline text-blue-600'>Catálogo</span>
          </Link>
         
        </div>
      </div>
      <button className="bg-red-700 text-white p-4 w-full absolute bottom-0 flex items-center justify-center space-x-2">
        <PlusCircle size={20} />
        <span>Nova Venda</span>
      </button>
    </div>
  );
};

export default Home;
