import { FornecedorType } from "@/@types/Fornecedor";
import { VendedorType } from "@/@types/Vendedores";
import { db } from "@/firebase/firebase.config";
import { addDoc, getDocs, collection, updateDoc, doc, deleteDoc} from "firebase/firestore";
const stockCollectionRef = collection(db, "vendedores");

export async function GetVendedores() {
    try {
        const getStock = await getDocs(stockCollectionRef);
        const stockData = getStock.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        return { items: stockData }
    } catch (error) {
        console.log(error);
    }
}

export async function CriarVendedor(Item: VendedorType) {
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

export async function AtualizarVendedor(vendedores: VendedorType) {
    try {
        const { id, ...fornecedorData } = vendedores; 
        const stockCollectionRef = collection(db, "vendedores");
        await updateDoc(doc(stockCollectionRef, id), fornecedorData);
        return { status: 200, message: "vendedores atualizado com sucesso" };
    } catch (error) {
        console.error('Erro ao atualizar o vendedores: ', error);
        return { status: 500, message: 'Erro ao atualizar o vendedores' };
    }
}

export async function ExcluirVendedor(vendedorId: string) {
    try {
        const categoriaDocRef = doc(stockCollectionRef, vendedorId);
        await deleteDoc(categoriaDocRef);
        return { status: 200, message: 'vendedor excluído com sucesso!' };
    } catch (error) {
        console.error('Erro ao excluir o vendedor: ', error);
        return { status: 500, message: 'Erro ao excluir a vendedor' };
    }
}