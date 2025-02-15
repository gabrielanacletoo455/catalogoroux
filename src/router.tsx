import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import { Loader2 } from 'lucide-react'
import Catalogo from './pages/Catalogo'
import Clientes from './pages/Clientes'
import ListaClientes from './pages/subPages/ListaClientes'
import Fornecedores from './pages/Fornecedores'
import ListaFornecedores from './pages/subPages/ListaFornecedores'
import Produtos from './pages/Produtos'
import NovoProduto from './pages/NovoProduto'
import Categorias from './pages/Categorias'
import ListaCategorias from './pages/subPages/ListaCategorias'
import ListaProdutos from './pages/subPages/ListaProdutos'
import ProdutosEmAlta from './pages/subPages/ProdutosEmAlta'
import ProdutosEmBaixa from './pages/subPages/ProdutosEmBaixa'
import Vendedores from './pages/Vendedores'
import ListaVendedores from './pages/subPages/ListaVendedores'
import NovaVenda from './pages/NovaVenda'
import Vendas from './pages/Vendas'
import Despesas from './pages/Despesas'
import ListaDespesas from './pages/subPages/ListaDespesas'
import Carrinho from './pages/Carrinho'
import ProdutoDetalhe from './pages/subPages/ProdutoDetalhe'
import Pesquisa from './pages/Pesquisa'
import Pedidos from './pages/Pedidos'
import Fornecedores_desktop from './desktop/Fornecedores_desktop'
import Estoque_desktop from './desktop/Estoque_desktop'
import Vendas_desktop from './desktop/Vendas_desktop'
import Clientes_desktop from './desktop/Clientes_desktop'


const router = createBrowserRouter([
  { path: '/', element: <Home />},
  { path: '/catalogo', element: <Catalogo />},
  { path: '/produto/:id', element: <ProdutoDetalhe />}, 

  { path: '/clientes', element: <Clientes />},
  { path: '/clientes_desktop', element: <Clientes_desktop />},
  { path: '/pedidos', element: <Pedidos />},

  
  
  { path: '/fornecedores', element: <Fornecedores />},
  { path: '/fornecedores_desktop', element: <Fornecedores_desktop />},

  
  
  { path: '/produtos', element: <Produtos />},
  { path: '/emalta', element: <ProdutosEmAlta />},
  { path: '/embaixa', element: <ProdutosEmBaixa />},
  { path: '/pesquisa', element: <Pesquisa />},

  
  { path: '/novoproduto', element: <NovoProduto />},
  { path: '/estoque', element: <Estoque_desktop />},
  { path: '/categorias', element: <Categorias />},
  
  { path: '/receber', element: <Home />},
  
  { path: '/vendedores', element: <Vendedores />},
  { path: '/vendas', element: <Vendas />},
  { path: '/vendas_desktop', element: <Vendas_desktop />},
  { path: '/novavenda', element: <NovaVenda />},
  { path: '/carrinho', element: <Carrinho />},

  { path: '/despesas', element: <Despesas />},
  
  
  { path: '/pedidos', element: <Home />},
  
  { path: '/listaclientes', element: <ListaClientes />},
  { path: '/listafornecedores', element: <ListaFornecedores />},
  { path: '/listacategorias', element: <ListaCategorias />},
  { path: '/listaprodutos', element: <ListaProdutos />},
  { path: '/listavendedores', element: <ListaVendedores />},
  { path: '/listadespesas', element: <ListaDespesas />},

  

])

export default function Router() {
  
  return (
    <Suspense fallback={<Loader2 size={48} className="animate-spin" />}>
        <RouterProvider router={router} />
    </Suspense>
  )
}