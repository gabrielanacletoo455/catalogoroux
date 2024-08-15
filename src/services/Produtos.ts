import { ClienteType } from "@/@types/Cliente";
import { ProdutoEstoque } from "@/@types/Produtos";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection} from "firebase/firestore";
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