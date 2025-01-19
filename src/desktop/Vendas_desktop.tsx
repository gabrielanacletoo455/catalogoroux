import Menu_lateral from "./menu_lateral"



const Vendas_desktop = () => {
  return (
    <div className="flex justify-between items-center h-screen">
        <Menu_lateral />

        <div className="flex flex-col items-center justify-center w-full h-full bg-white">
            <h1 className="text-3xl font-bold mb-4">Vendas</h1>
            <p>Em construção</p>
        </div>
    </div>
  )
}

export default Vendas_desktop