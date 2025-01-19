import { Link } from "react-router-dom"

const Cards_home = () => {
  return (
    <div className='flex position-fixed align-center justify-between border p-1 px-2 bg-red-800 text-white tracking-tighter m-0'>
        <Link to="/" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Início</Link>
        <Link to="/vendas" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Vendas</Link>
        <Link to="/novoproduto" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Adicionar Produto</Link>
        <Link to="/clientes" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Clientes</Link>
        <Link to="/fornecedores" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Fornecedores</Link>
    </div>
  )
}

export default Cards_home