

function Menu_lateral() {
  return (
    <div className="flex flex-col bg-slate-900 h-screen p-5 ">
        <nav>
            <ul className="text-white">
                <li className="my-1 hover:bg-slate-700 w-full p-3">
                    <a href="/">Home</a>
                </li>
                <li className="my-1 hover:bg-slate-700 w-full p-3">
                    <a href="/vendas_desktop">Vendas</a>
                </li>
                <li className="my-1 hover:bg-slate-700 w-full p-3">
                    <a href="/estoque_desktop">Estoque</a>
                </li>
                <li className="my-1 hover:bg-slate-700 w-full p-3">
                    <a href="/fornecedores_desktop">Fornecedores</a>
                </li>
                <li className="my-1 hover:bg-slate-700 w-full p-3">
                    <a href="/clientes_desktop">Clientes</a>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Menu_lateral