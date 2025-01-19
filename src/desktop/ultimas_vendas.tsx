

const Ultimas_vendas = () => {
  return (
    <div className="p-5">
        <h1>Ultimas vendas</h1>
        <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="border p-2">Data</th>
                    <th className="border p-2">Nome do Cliente</th>
                    <th className="border p-2">Valor</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr >
                    <td className="border p-2 text-center">20/11/2024</td>
                    <td className="border p-2 text-center">Tester beta</td>
                    <td className="border p-2 text-center">R$ 119,00</td>
                    <td className="border p-2 text-center">Paga</td>
                    <td className="border p-2 text-center">
                <button className="bg-blue-500 text-white p-1 rounded">
                    Ver Detalhes
                </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Ultimas_vendas