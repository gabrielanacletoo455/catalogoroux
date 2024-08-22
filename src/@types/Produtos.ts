export interface ProdutoEstoque {
    id?: string;
    nome: string;
    categoria: string;
    custo: string;
    lucro: string;
    preco: string;
    descricao?: string;
    quantidade: number;
    informacoes?: string;
    createdAt: string | null;
    updatedAt?: string | null;
    imagens: string[]; // Adicione este campo
}
