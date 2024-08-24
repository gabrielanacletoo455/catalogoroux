import { ClienteType } from "./Cliente";

export interface PedidosType {
    id?: string; 
    cliente: ClienteType;
    produtos: {
        nome: string;
        quantidade: number;
    }[];
    createdAt?: string | null;
    updatedAt?: string | null;
}