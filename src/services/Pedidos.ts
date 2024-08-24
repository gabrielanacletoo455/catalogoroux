
import { PedidosType } from "@/@types/Pedidos";
import { ProdutoEstoque } from "@/@types/Produtos";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection, updateDoc, doc, deleteDoc} from "firebase/firestore";
const stockCollectionRef = collection(db, "pedidos");

export async function GetPedidos() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ProdutoEstoque[];

        return { items: stockData }
    } catch (error) {
        console.log(error);
        return { items: [] }; // Retorna um array vazio em caso de erro

    }
}

export async function CriarPedido(Item: PedidosType) {
    const newItem: PedidosType = {
        ...Item,
        createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    try {
        const docRef = await addDoc(stockCollectionRef, newItem);
        if (docRef) {
            const newItemWithId = { ...newItem, id: docRef.id };
            return { status: 201, result: newItemWithId };
        }
    } catch (error) {
        console.error('Error adding document: ', error);
    }
    return null; // Retorna null em caso de erro
}



export async function AtualizarPedido(pedido: PedidosType) {
    try {
        const { id, ...fornecedorData } = pedido; 
        const stockCollectionRef = collection(db, "pedidos");
        await updateDoc(doc(stockCollectionRef, id), fornecedorData);
        return { status: 200, message: "pedido atualizado com sucesso" };
    } catch (error) {
        console.error('Erro ao atualizar o pedido: ', error);
        return { status: 500, message: 'Erro ao atualizar o pedido' };
    }
}

export async function ExcluirPedido(categoriaId: string) {
    try {
        const categoriaDocRef = doc(stockCollectionRef, categoriaId);
        await deleteDoc(categoriaDocRef);
        return { status: 200, message: 'pedido excluído com sucesso!' };
    } catch (error) {
        console.error('Erro ao excluir o pedido: ', error);
        return { status: 500, message: 'Erro ao excluir a pedido' };
    }
}

