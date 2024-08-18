import { VendasType } from "@/@types/Vendas";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection, deleteDoc, doc, updateDoc} from "firebase/firestore";
import { AtualizarProduto, GetProdutos } from "./Produtos";
import { ProdutoEstoque } from "@/@types/Produtos";
const stockCollectionRef = collection(db, "vendas");

export async function GetVendas() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        return { items: stockData };
    } catch (error) {
        console.log(error);
        return { items: [] }; // Retorna um array vazio em caso de erro
    }
}


export async function CriarVenda(Item: VendasType) {
    const newItem: VendasType = {
        ...Item,
        createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    try {
        // Adicionar a nova venda ao banco de dados
        const docRef = await addDoc(stockCollectionRef, newItem);
        if (docRef) {
            const newItemWithId = { ...newItem, id: docRef.id };
            
            // Atualizar o estoque após criar a venda
            const produtosResponse = await GetProdutos();
            if (!produtosResponse || !produtosResponse.items) {
                console.error("Não foi possível obter os produtos.");
                return null;
            }

            const produtos = produtosResponse.items;
            const promessas = newItemWithId.produtos.map(async ({ produto, quantidade }) => {
                const produtoNoBanco = produtos.find((p: ProdutoEstoque) => p.id === produto.id);
                
                if (produtoNoBanco) {
                    const novaQuantidade = produtoNoBanco.quantidade - quantidade;
                    const produtoAtualizado: ProdutoEstoque = { ...produtoNoBanco, quantidade: novaQuantidade };
                    return AtualizarProduto(produtoAtualizado);
                } else {
                    console.error(`Produto com id ${produto.id} não encontrado.`);
                    return null;
                }
            });

            const resultados = await Promise.all(promessas);
            const sucesso = resultados.every(result => result?.status === 200);
            if (sucesso) {
                console.log("Estoque atualizado com sucesso.");
            } else {
                console.error("Houve um erro ao atualizar o estoque.");
            }

            return { status: 201, result: newItemWithId };
        }
    } catch (error) {
        console.error('Error adding document: ', error);
    }
    return null; // Retorna null em caso de erro
}


export async function AtualizarFornecedor(venda: VendasType) {
    try {
        const { id, ...vendaData } = venda; 
        const stockCollectionRef = collection(db, "vendas");
        await updateDoc(doc(stockCollectionRef, id), vendaData);
        return { status: 200, message: "Venda atualizada com sucesso" };
    } catch (error) {
        console.error('Erro ao atualizar o venda', error);
        return { status: 500, message: 'Erro ao atualizar a venda.' };
    }
}


export async function ExcluirVenda(vendaId: string) {
    try {
        const categoriaDocRef = doc(stockCollectionRef, vendaId);
        await deleteDoc(categoriaDocRef);
        return { status: 200, message: 'venda excluída com sucesso!' };
    } catch (error) {
        console.error('Erro ao excluir a vend ', error);
        return { status: 500, message: 'Erro ao excluir a venda' };
    }
}