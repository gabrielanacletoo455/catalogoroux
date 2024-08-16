import { FornecedorType } from "@/@types/Fornecedor";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection, updateDoc, doc} from "firebase/firestore";
const stockCollectionRef = collection(db, "fornecedores");

export async function GetFornecedores() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        return { items: stockData }
    } catch (error) {
        console.log(error);
    }
}

export async function CriarFornecedor(Item: FornecedorType) {
    const newItem: FornecedorType = {
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

export async function AtualizarFornecedor(fornecedor: FornecedorType) {
    try {
        const { id, ...fornecedorData } = fornecedor; 
        const stockCollectionRef = collection(db, "fornecedores");
        await updateDoc(doc(stockCollectionRef, id), fornecedorData);
        return { status: 200, message: "Fornecedor atualizado com sucesso" };
    } catch (error) {
        console.error('Erro ao atualizar o fornecedor: ', error);
        return { status: 500, message: 'Erro ao atualizar o fornecedor' };
    }
}