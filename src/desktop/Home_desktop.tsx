import { ProdutoEstoque } from "@/@types/Produtos";
import { Input } from "@/components/ui/input";
import { GetProdutos } from "@/services/Produtos";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import Cards_home from "./Cards_Home";
import { useNavigate } from "react-router-dom";

const Home_desktop = () => {
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const navigate = useNavigate();


  const handleRowClick = (produto: ProdutoEstoque) => {
    navigate(`/produto/${produto.id}`, { state: produto });
  };

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const data = await GetProdutos();
      if (data && data.items) {
        setProdutos(data.items);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPesquisa(value);
  };


  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
    <Cards_home />
    <div className="flex h-screen flex-col w-[98%] mx-auto">
      
      <Input
        name="pesquisa"
        placeholder="Pesquisar produto..."
        value={pesquisa}
        onChange={handleinputChange}
        className="my-2"
      />

      <div className="overflow-x-auto mt-5 tracking-tighter">
          <div className="w-full text-end">
              <span className="mr-4 bg-slate-700 text-white px-2 py-1 rounded-sm mt-2">Total de produtos: {produtos.length}</span>
          </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black text-center">Nome</TableHead>
              <TableHead className="text-black text-center">Custo</TableHead>
              <TableHead className="text-black text-center">Preço</TableHead>
              <TableHead className="text-black text-center">Lucro</TableHead>
              <TableHead className="text-black text-center">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtosFiltrados.map((produto) => (
              <TableRow key={produto.id}
              onClick={() => handleRowClick(produto)} className="cursor-pointer hover:bg-gray-100">
                <TableCell className={`${produto.quantidade < 3 ? 'bg-red-800 text-white text-center': 'text-center'}`}>{produto.nome}</TableCell>
                <TableCell className={`${produto.quantidade < 3 ? 'bg-red-800 text-white text-center': 'text-center'}`}>{produto.custo}</TableCell>
                <TableCell className={`${produto.quantidade < 3 ? 'bg-red-800 text-white text-center': 'text-center'}`}>{produto.preco}</TableCell>
                <TableCell className={`${produto.quantidade < 3 ? 'bg-red-800 text-white text-center': 'text-center'}`}>{produto.lucro}</TableCell>
                <TableCell className={`${produto.quantidade < 3 ? 'bg-red-800 text-white text-center': 'text-center'}`}> {produto.quantidade}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>



    </div>
    </>
  );
};

export default Home_desktop;
