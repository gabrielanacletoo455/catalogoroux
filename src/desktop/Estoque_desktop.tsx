import { Link } from "react-router-dom"


const Estoque_desktop = () => {
  return (
    <div className='flex align-center justify-between border p-1 px-2 bg-red-800 text-white tracking-tighter'>
        <Link to="/" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Início</Link>
        <Link to="/clientes" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Gerar Excel</Link>
        <Link to="/fornecedores" className="cursor-pointer hover:bg-red-600 p-2 rounded-md">Mais vendidos</Link>
    </div>
  )
}

export default Estoque_desktop