import { ClienteType } from "./Cliente";
import { ProdutoEstoque } from "./Produtos";
import { VendedorType } from "./Vendedores";

export interface VendasType {
    id?: string; // Gerado automaticamente pelo banco de dados
    cliente: ClienteType;
    vendedor: VendedorType;
    vencimento: string;
    produtos: {
        produto: ProdutoEstoque;
        quantidade: number;
        precoUnitario: number;
        total: number;
    }[];
    createdAt?: string | null;
    updatedAt?: string | null;
    desconto: number;
    total: number;
    status?: 'pendente' | 'paga' | 'cancelada';
}