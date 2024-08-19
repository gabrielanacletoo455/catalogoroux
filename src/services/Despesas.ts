import { CategoriasType } from "@/@types/Categorias";
import { ClienteType } from "@/@types/Cliente";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection, deleteDoc, doc} from "firebase/firestore";
const stockCollectionRef = collection(db, "despesas");

export async function GetDespesa() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        return { items: stockData };
    } catch (error) {
        console.log(error);
        return { items: [] }; // Retorna um array vazio em caso de erro
    }
}


export async function CriarDespesa(Item: CategoriasType) {
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

export async function ExcluirDespesa(despesaId: string) {
    try {
        const categoriaDocRef = doc(stockCollectionRef, despesaId);
        await deleteDoc(categoriaDocRef);
        return { status: 200, message: 'Despesa excluída com sucesso!' };
    } catch (error) {
        console.error('Erro ao excluir a despesa: ', error);
        return { status: 500, message: 'Erro ao excluir a despesa' };
    }
}