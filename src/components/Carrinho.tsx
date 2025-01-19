import { ProdutoEstoque } from "@/@types/Produtos";

interface CarrinhoProps {
  produtos: ProdutoEstoque[];
}

const Carrinho = ({ produtos }: CarrinhoProps) => {
  return (
    <div className="p-4 h-64 overflow-auto box-border tracking-tighter">
      {produtos.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <>
<p>
  Total:{" "}
  {produtos.reduce((total, produto) => {
    const preco = Number(produto.preco);
    return total + (isNaN(preco) ? 0 : preco); // Soma apenas valores válidos
  }, 0)}
</p>
          <ul>
            {produtos.map((produto, index) => (
              <li key={index} className="flex justify-between my-2 border-b pb-2">
                <span>{produto.nome}</span>
                <span>{produto.preco}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Carrinho;
