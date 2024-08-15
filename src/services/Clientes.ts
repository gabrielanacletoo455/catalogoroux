import { ClienteType } from "@/@types/Cliente";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection, updateDoc, doc} from "firebase/firestore";
const stockCollectionRef = collection(db, "clientes");

export async function GetClientes() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        return { items: stockData }
    } catch (error) {
        console.log(error);
    }
}

export async function CriarCliente(Item: ClienteType) {
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

export async function AtualizarCliente(cliente: ClienteType) {
    try {
        const { id, ...clienteData } = cliente; 
        const stockCollectionRef = collection(db, "clientes");
        await updateDoc(doc(stockCollectionRef, id), clienteData);
        return { status: 200, message: "Cliente atualizado com sucesso" };
    } catch (error) {
        console.error('Erro ao atualizar o cliente: ', error);
        return { status: 500, message: 'Erro ao atualizar o cliente' };
    }
}