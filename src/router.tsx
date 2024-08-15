import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import { Loader2 } from 'lucide-react'
import Catalogo from './pages/Catalogo'
import Clientes from './pages/Clientes'
import ListaClientes from './pages/subPages/ListaClientes'


const router = createBrowserRouter([
  { path: '/', element: <Home />},
  { path: '/catalogo', element: <Catalogo />},
  { path: '/clientes', element: <Clientes />},
  { path: '/fornecedores', element: <Home />},
  { path: '/produtos', element: <Home />},
  { path: '/categorias', element: <Home />},
  { path: '/receber', element: <Home />},
  { path: '/vendedores', element: <Home />},
  { path: '/despesas', element: <Home />},
  { path: '/vendas', element: <Home />},
  { path: '/estoque', element: <Home />},
  { path: '/pedidos', element: <Home />},
  { path: '/listaclientes', element: <ListaClientes />},

])

export default function Router() {
  
  return (
    <Suspense fallback={<Loader2 size={48} className="animate-spin" />}>
        <RouterProvider router={router} />
    </Suspense>
  )
}