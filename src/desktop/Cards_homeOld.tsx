import { ProdutoEstoque } from "@/@types/Produtos";
import { GetProdutos } from "@/services/Produtos";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Cards_home = () => {
//   const [loading, setLoading] = useState(false);
//   const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  
//   let valorTotalEstoque = 0;

//   produtos.forEach(produto => {
//       // Remove "R$" e converte o preço para número
//       const precoNumerico = parseFloat(produto.custo.replace('R$', '').replace(',', '.'));
      
//       // Multiplica o preço pela quantidade
//       const valorTotalProduto = precoNumerico * produto.quantidade;
      
//       // Soma ao valor total do estoque
//       valorTotalEstoque += valorTotalProduto;
//   });


//   const fetchProdutos = async () => {
//     try {
//         setLoading(true);
//         const data = await GetProdutos();
//         if (data && data.items) {
//             setProdutos(data.items);
//         }
//     } catch (error) {
//         console.error('Erro ao buscar produtos:', error);
//     } finally {
//         setLoading(false);
//     }
// };

// useEffect(() => {
//     fetchProdutos();
// }, []);

// if (loading) {
//   return <div className="w-full h-screen flex items-center justify-center">
//     <Loader2 className="w-10 h-10 animate-spin" />
//   </div>
// }
  return (
    <div className="grid grid-cols-4 gap-4 border w-full p-5 capitalize">
        <div className="shadow-xl border rounded-md h-28 justify-center items-center flex flex-col bg-red-700 text-white">
          <span className="tracking-tighter font-semibold ">Estoque</span>
            <p>453 Itens</p>
            <p>Valor: R$ 3480,00</p>
          {/* {produtos.length}
          R$ {valorTotalEstoque.toFixed(2)} */}
        </div>
        
        <div className="shadow-xl border rounded-md h-28 justify-center items-center flex flex-col bg-red-700 text-white">
          <span className="tracking-tighter font-semibold ">Relatórios</span>  
          {/* {produtos.length}
          R$ {valorTotalEstoque.toFixed(2)} */}
        </div>

        <div className="shadow-xl border rounded-md h-28 justify-center items-center flex flex-col bg-red-700 text-white">
          <span className="tracking-tighter font-semibold ">clientes</span> <br/> 
          {/* {produtos.length}
          R$ {valorTotalEstoque.toFixed(2)} */}
        </div>

        <div className="shadow-xl border rounded-md h-28 justify-center items-center flex flex-col bg-red-700 text-white">
          <span className="tracking-tighter font-semibold ">fornecedores</span> <br/> 
          {/* {produtos.length}
          R$ {valorTotalEstoque.toFixed(2)} */}
        </div>


    </div>
  )
}

export default Cards_home