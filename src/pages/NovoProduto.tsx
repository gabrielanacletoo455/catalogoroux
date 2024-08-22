import React, { useState, useEffect, ChangeEvent } from 'react';
import Logo from '@/assets/logo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Importando o ícone de loading
import { ProdutoEstoque } from '@/@types/Produtos';
import { CriarProduto } from '@/services/Produtos';
import { uploadImagesToFirebase } from '@/utils/upload';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CriarCategoria, GetCategorias } from '@/services/Categorias'; // Importe a função GetCategorias
import { CategoriasType } from '@/@types/Categorias';
import { CriarFornecedor, GetFornecedores } from '@/services/Forncedores';
import { FornecedorType } from '@/@types/Fornecedor';

interface GetCategoriasResponse {
    items: CategoriasType[];
}

const NovoProduto: React.FC = () => {
    const navigate = useNavigate();
    const [nomeProduto, setNomeProduto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [novaCategoria, setNovaCategoria] = useState('');



    const [custo, setCusto] = useState('');
    const [preco, setPreco] = useState('');

    const [fornecedor, setFornecedor] = useState('');
    const [fornecedores, setFornecedores] = useState<FornecedorType[]>([]);
    const [novoFornecedor, setNovoFornecedor] = useState('');
    
    const [quantidade, setQuantidade] = useState('');
    const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
    const [imagens, setImagens] = useState<File[]>([]);
    const [imagensURLs, setImagensURLs] = useState<{ file: File; url: string; loading: boolean }[]>([]);
    const [etapa, setEtapa] = useState(1);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalFornecedorAberto, setmodalFornecedorAberto] = useState(false);
    const [_imagensCarregadas, setImagensCarregadas] = useState<boolean>(false);
    const [categorias, setCategorias] = useState<CategoriasType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response: GetCategoriasResponse = await GetCategorias();
                const responseFornecedores = await GetFornecedores();
                console.log('responseFornecedores:', responseFornecedores?.items);
                if (response) {
                    setCategorias(response.items);
                }

                if (responseFornecedores) {
                    setFornecedores(responseFornecedores.items);
                }
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };

        fetchCategorias();
    }, []);

    const formatarPreco = (value: string) => {
        const numero = Number(value.replace(/[^0-9]/g, '')) / 100;
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const novosArquivos = Array.from(e.target.files).slice(0, 5 - imagens.length);
            const novosURLs: { file: File; url: string; loading: boolean }[] = [];
            let carregamentoConcluido = true;

            for (const file of novosArquivos) {
                novosURLs.push({ file, url: '', loading: true });

                setImagensURLs(prev => [...prev, { file, url: '', loading: true }]);

                try {
                    const url = await uploadImagesToFirebase([file]);
                    setImagensURLs(prev =>
                        prev.map(img =>
                            img.file === file ? { ...img, url: url[0], loading: false } : img
                        )
                    );
                } catch (error) {
                    console.error('Erro ao fazer upload da imagem:', error);
                    carregamentoConcluido = false;
                    setImagensURLs(prev =>
                        prev.map(img =>
                            img.file === file ? { ...img, loading: false } : img
                        )
                    );
                }
            }

            setImagens([...imagens, ...novosArquivos]);

            const todasImagensCarregadas = !imagensURLs.some(img => img.loading);
            setImagensCarregadas(todasImagensCarregadas && carregamentoConcluido);
        }
    };

    // Atualize o cálculo do lucro
const calcularLucro = (preco: string, custo: string) => {
    const custoNum = toNumber(custo);
    const precoNum = toNumber(preco);
    return (precoNum - custoNum).toFixed(2);
};


    const handleAvancar = async () => {
        if (etapa === 1) {
            setEtapa(2);
        } else {
            if (imagensURLs.some(img => img.loading)) {
                alert('Todas as imagens devem ser carregadas antes de finalizar.');
                return;
            }
            const lucroValorAtualizado = calcularLucro(preco, custo)
            // Formatar o valor como reais (pt-BR)
            const formatador = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
            
            const lucroFormatado = formatador.format(parseFloat(lucroValorAtualizado));
            try {
                const imageURLs = imagensURLs.map(img => img.url).filter(url => url);
                const produto: ProdutoEstoque = {
                    nome: nomeProduto,
                    categoria: categoria || novaCategoria,
                    lucro: lucroFormatado,
                    custo: custo, // Certifique-se de que está correto
                    preco: preco, // Certifique-se de que está correto
                    quantidade: parseInt(quantidade, 10), // Converta para número
                    informacoes: informacoesAdicionais,
                    createdAt: new Date().toLocaleDateString('pt-BR'),
                    updatedAt: null, // Adicione se necessário
                    imagens: imageURLs, // Adicione aqui
                };

                console.log('Salvar no Firebase:', produto);

                const resultado = await CriarProduto(produto);
                if (resultado) {
                    setTimeout(() => {
                        navigate('/');
                    }, 2500);
                    alert('Produto salvo com sucesso!');
                } else {
                    alert('Erro ao salvar o produto.');
                }
            } catch (error) {
                console.error('Erro ao salvar o produto:', error);
                alert('Erro ao salvar o produto.');
            }
        }
    };

    const handleVoltar = () => {
        setEtapa(1);
    };

    const todosCamposPreenchidos = nomeProduto && (categoria || novaCategoria) && preco && quantidade;
    // Função para converter valores formatados para números
    const toNumber = (value: string) => {
        const numero = Number(value.replace(/[^0-9]/g, '')) / 100;
        return isNaN(numero) ? 0 : numero;
    };

    const custoNum = toNumber(custo);
    const precoNum = toNumber(preco);

    const lucro = (precoNum - custoNum).toFixed(2);
    const precoSugerido = (custoNum  / 0.6).toFixed(2);

    const handleSaveCategoria = async () => {
        try {
            setLoading(true);
    
            // Assumindo que CriarCategoria retorna { status: number; result: { id: string; nome: string; } }
            const response = await CriarCategoria({ nome: novaCategoria });
    
            if (response?.status === 201) {
                const novaCategoriaCriada = response.result; // Acesso correto baseado na estrutura da resposta
            
                if (novaCategoriaCriada.nome) { // Verifica se nome não é undefined ou null
                    setCategoria(novaCategoriaCriada.nome); // Atualiza a categoria selecionada
                    setCategorias(prevCategorias => [
                        ...prevCategorias,
                        novaCategoriaCriada
                    ]); // Adiciona a nova categoria à lista
                    setModalAberto(false);
                } else {
                    console.error('Nome da nova categoria está indefinido');
                }
            }
             else {
                console.error('Erro ao criar a categoria:', response);
            }
        } catch (error) {
            console.error('Erro ao criar a categoria:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleSaveFornecedor = async () => {
        try {
            setLoading(true);
    
            const response = await CriarFornecedor({ nome: novoFornecedor });
    
            if (response?.status === 201) {
                const novaFornecedorCriado = response.result; // Acesso correto baseado na estrutura da resposta
            
                if (novaFornecedorCriado.nome) { 
                    setFornecedor(novaFornecedorCriado.nome); 
                    setFornecedores(prevFornecedores => [
                        ...prevFornecedores,
                        { nome: novoFornecedor } // Create a new FornecedorType object
                      ]);
                    setmodalFornecedorAberto(false);
                } else {
                    console.error('Nome do novo fornecedor está indefinido');
                }
            }
             else {
                console.error('Erro ao criar a categoria:', response);
            }
        } catch (error) {
            console.error('Erro ao criar a categoria:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col tracking-tighter">
            <Link to="/">
                <img src={Logo} className='pb-1' alt="Logo" />
            </Link>

            {etapa === 1 && (
                <div className='w-[95%] flex flex-col items-center justify-center mx-auto space-y-4'>
                    <Input
                        placeholder='Nome do produto'
                        value={nomeProduto}
                        className='my-1'
                        onChange={(e) => setNomeProduto(e.target.value)}
                    />
                    <div className="flex w-full space-x-2">
                        <select
                            name="categoria"
                            className="flex-1 p-2 border rounded"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}>
                            <option value="">Selecione uma categoria</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                            ))}
                        </select>
                        <Button onClick={() => setModalAberto(true)}>Nova Categoria</Button>
                    </div>

                    <div className="flex w-full space-x-2">
                        <select
                            name="fornecedor"
                            className="flex-1 p-2 border rounded"
                            value={fornecedor}
                            onChange={(e) => setFornecedor(e.target.value)}>
                            <option value="">Selecione um fornecedor</option>
                            {fornecedores.map(fornecedor => (
                                <option key={fornecedor.id} value={fornecedor.nome}>{fornecedor.nome}</option>
                            ))}
                        </select>


                        <Button onClick={() => setmodalFornecedorAberto(true)}>Novo Fornecedor</Button>
                    </div>

                    <div className='flex items-center justify-between'>
                        <Input
                            placeholder='Custo'
                            type='text'
                            className='w-1/2 mr-2'
                            value={custo}
                            onChange={(e) => setCusto(formatarPreco(e.target.value))} />

                        <Input
                            placeholder='Venda'
                            type='text'
                            className='w-1/2 mr-2'
                            value={preco}
                            onChange={(e) => setPreco(formatarPreco(e.target.value))} />
                    </div>

                        <div className='flex w-full items-center'>
                        <Input
                        placeholder='Quantidade'
                        type="number"
                        className='w-32'
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}/>


                        <span className='mx-1'>Lucro: {formatarPreco(lucro)}</span>
                        <span>Preço sugerido: {formatarPreco(precoSugerido)} (40%)</span>
                        </div> 

                    {/* <textarea
                        placeholder='Informações adicionais'
                        className="p-2 w-full border rounded"
                        value={informacoesAdicionais}
                        onChange={(e) => setInformacoesAdicionais(e.target.value)}
                    /> */}
                    <Button variant="destructive" onClick={handleAvancar}
                        disabled={!todosCamposPreenchidos}>
                        Avançar
                    </Button>
                </div>
            )}

            {etapa === 2 && (
                <div className="w-[95%] flex flex-col items-center justify-center mx-auto space-y-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer text-blue-600 underline">
                        Adicionar Imagens (até 5)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {imagensURLs.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24">
                                {img.loading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                )}
                                <img
                                    src={img.url || URL.createObjectURL(img.file)}
                                    alt={`Preview ${idx + 1}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-between">
                        <Button onClick={handleVoltar}>
                            Voltar
                        </Button>
                        <Button onClick={handleAvancar}>
                            Finalizar
                        </Button>
                    </div>
                </div>
            )}


            {modalAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded">
                        <h2>Nova Categoria</h2>
                        <Input
                            placeholder='Nome da nova categoria'
                            value={novaCategoria}
                            onChange={(e) => setNovaCategoria(e.target.value)} />

                        <div className='flex items-center justify-between mt-3'>
                            <Button className='mr-2' onClick={() => setModalAberto(false)}>Cancelar</Button>


                            <Button variant="destructive"
                                onClick={() => {
                                    if (novaCategoria.trim()) {
                                        setCategoria(novaCategoria);
                                        setModalAberto(false);
                                        handleSaveCategoria();
                                    }}}>
                                                 {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Adicionar'
                                )}
                                </Button>
                        </div>
                    </div>
                </div>
            )}

{modalFornecedorAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded">
                        <h2>Novo Fornecedor</h2>
                        <Input
                            placeholder='Nome do novo fornecedor'
                            value={novoFornecedor}
                            onChange={(e) => setNovoFornecedor(e.target.value)} />

                        <div className='flex items-center justify-between mt-3'>
                            <Button className='mr-2' onClick={() => setmodalFornecedorAberto(false)}>Cancelar</Button>


                            <Button variant="destructive"
                                onClick={() => {
                                    if (novoFornecedor.trim()) {
                                        setFornecedor(novoFornecedor);
                                        setmodalFornecedorAberto(false);
                                        handleSaveFornecedor();
                                    }}}>
                                                 {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Adicionar'
                                )}
                                </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NovoProduto;
