import { SenhasType } from "@/@types/Senhas";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection} from "firebase/firestore";
const stockCollectionRef = collection(db, "senhas");

export async function GetSenhas() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        return { items: stockData }
    } catch (error) {
        console.log(error);
        return { items: [] }; 
    }
}

export async function CriarSenha(Item: SenhasType) {
    const newItem: SenhasType = {
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
