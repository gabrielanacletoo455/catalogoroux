import { ClienteType } from "@/@types/Cliente";
import { ProdutoEstoque } from "@/@types/Produtos";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection, updateDoc, doc, deleteDoc} from "firebase/firestore";
const stockCollectionRef = collection(db, "produtos");

export async function GetProdutos() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ProdutoEstoque[];

        return { items: stockData }
    } catch (error) {
        console.log(error);
    }
}

export async function CriarProduto(Item: ClienteType) {
    const newItem: ClienteType = {
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



export async function AtualizarProduto(produto: ProdutoEstoque) {
    try {
        const { id, ...fornecedorData } = produto; 
        const stockCollectionRef = collection(db, "produtos");
        await updateDoc(doc(stockCollectionRef, id), fornecedorData);
        return { status: 200, message: "produto atualizado com sucesso" };
    } catch (error) {
        console.error('Erro ao atualizar o produto: ', error);
        return { status: 500, message: 'Erro ao atualizar o produto' };
    }
}

export async function ExcluirProduto(categoriaId: string) {
    try {
        const categoriaDocRef = doc(stockCollectionRef, categoriaId);
        await deleteDoc(categoriaDocRef);
        return { status: 200, message: 'Produto excluído com sucesso!' };
    } catch (error) {
        console.error('Erro ao excluir o Produto: ', error);
        return { status: 500, message: 'Erro ao excluir a Produto' };
    }
}