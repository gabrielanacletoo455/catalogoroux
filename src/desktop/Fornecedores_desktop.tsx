import Menu_lateral from "./menu_lateral"



const Fornecedores_desktop = () => {
  return (
    <div className="flex justify-between items-center h-screen">
        <Menu_lateral />

        <div className="flex flex-col items-center justify-center w-full h-full bg-white">
            <h1 className="text-3xl font-bold mb-4">Fornecedores</h1>
            <p>Em construção</p>
        </div>
    </div>
  )
}

export default Fornecedores_desktop