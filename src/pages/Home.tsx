import { Link } from 'react-router-dom';
import Clientes from '@/assets/equipe.png';
import Fornecedores from '@/assets/fornecedor.png';
import Estoque from '@/assets/caixa.png';
import Categorias from '@/assets/etiqueta-de-preco.png';
import Vendedores from '@/assets/vendedor.png';
import Despesas from '@/assets/despesas.png';
import Vendas from '@/assets/pos-terminal.png';
import Catalogo from '@/assets/lendo-um-livro.png';
import Informacoes from '@/assets/definicoes.png';
import Presente from '@/assets/presente.png';
import Logo from '@/assets/banner.jpeg';
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
  { icon: Vendas, label: 'Vendas', link: '/vendas' },
  { icon: Vendedores, label: 'Vendedores', link: '/vendedores' },
  { icon: Despesas, label: 'Despesas', link: '/despesas' },
  { icon: Presente, label: 'Pedidos', link: '/pedidos' },
  { icon: Informacoes, label: 'Informações', link: '/informacoes' },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      <header className="bg-white shadow-md md:p-4 md:hidden">
        <img src={Logo} alt="Logo" className="mx-auto md:w-32 w-full" />
      </header>


<main className="flex-grow p-4">
  <div className="grid grid-cols-3 gap-4 text-center md:flex md:flex-wrap md:justify-center">
    {menuItems.map((item, index) => (
      <Link
        to={item.link}
        key={index}
        className="flex flex-col items-center justify-center p-4 md:w-72 shadow-lg md:py-4 md:px-1 rounded-md border border-gray-300"
      >
        {typeof item.icon === 'string' ? (
          <img
            src={item.icon}
            alt={item.label}
            className="w-9 h-9 sm:w-16 sm:h-16 rounded-md"
          />
        ) : (
          <item.icon size={32} className="sm:w-16 sm:h-16 rounded-md" />
        )}
        <span className="mt-2 text-sm sm:text-base">{item.label}</span>
      </Link>
    ))}
    <div className="flex flex-col items-center justify-center p-2">
      <img src={Catalogo} alt="Catálogo" className="w-11 h-11 rounded-md" />
      <Link
        to="/catalogo"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 mt-2"
      >
        <span className="underline text-blue-600 text-sm sm:text-base">Catálogo</span>
      </Link>
    </div>
  </div>
</main>


      <footer className="fixed bottom-4 right-4 bg-red-700 text-white p-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
        <Link to="/novavenda" className="flex items-center justify-center w-full h-full">
          <PlusCircle size={20} />
        </Link>
      </footer>
    </div>
  );
};

export default Home;
