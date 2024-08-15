import React, { useState, ChangeEvent } from 'react';
import Logo from '@/assets/Roux3.png';
import { useNavigate } from 'react-router-dom';

import { Loader2 } from 'lucide-react'; // Importando o ícone de loading
import { ProdutoEstoque } from '@/@types/Produtos';
import { CriarProduto } from '@/services/Produtos';
import { uploadImagesToFirebase } from '@/utils/upload';

const NovoProduto: React.FC = () => {
    const navigate = useNavigate();
    const [nomeProduto, setNomeProduto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [novaCategoria, setNovaCategoria] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
    const [imagens, setImagens] = useState<File[]>([]);
    const [imagensURLs, setImagensURLs] = useState<{ file: File; url: string; loading: boolean }[]>([]);
    const [etapa, setEtapa] = useState(1);
    const [modalAberto, setModalAberto] = useState(false);
    const [_imagensCarregadas, setImagensCarregadas] = useState<boolean>(false);

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
    
                // Atualiza o estado com a nova imagem e status de carregamento
                setImagensURLs(prev => [...prev, { file, url: '', loading: true }]);
    
                try {
                    const url = await uploadImagesToFirebase([file]);
                    // Atualiza o estado para definir a URL da imagem e parar o carregamento
                    setImagensURLs(prev => 
                        prev.map(img =>
                            img.file === file ? { ...img, url: url[0], loading: false } : img
                        )
                    );
                } catch (error) {
                    console.error('Erro ao fazer upload da imagem:', error);
                    carregamentoConcluido = false;
                    // Para o carregamento se ocorrer um erro
                    setImagensURLs(prev => 
                        prev.map(img =>
                            img.file === file ? { ...img, loading: false } : img
                        )
                    );
                }
            }
    
            // Adiciona os arquivos ao estado de imagens
            setImagens([...imagens, ...novosArquivos]);
    
            // Verifica se todas as imagens foram carregadas
            const todasImagensCarregadas = !imagensURLs.some(img => img.loading);
            setImagensCarregadas(todasImagensCarregadas && carregamentoConcluido);
        }
    };
    
    
    const handleAvancar = async () => {
        if (etapa === 1) {
            setEtapa(2);
        } else {
            if (imagensURLs.some(img => img.loading)) {
                alert('Todas as imagens devem ser carregadas antes de finalizar.');
                return;
            }
    
            try {
                const imageURLs = imagensURLs.map(img => img.url).filter(url => url);
                const produto: ProdutoEstoque = {
                    nome: nomeProduto,
                    categoria: categoria || novaCategoria,
                    custo: preco, // Certifique-se de que está correto
                    preco: preco, // Certifique-se de que está correto
                    quantidade: parseInt(quantidade, 10), // Converta para número
                    informacoes: informacoesAdicionais,
                    createdAt: new Date().toLocaleDateString('pt-BR'),
                    updatedAt: null, // Adicione se necessário
                    imagens: imageURLs, // Adicione aqui
                };
    
                console.log('Salvar no Firebase:', produto);
    
                // Criar o produto
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

    const todosCamposPreenchidos = nomeProduto && (categoria || novaCategoria) && preco && quantidade && informacoesAdicionais;

    return (
        <div className="w-full flex flex-col">
            <img src={Logo} className='pb-1' />

            {etapa === 1 && (
                <div className='w-[95%] flex flex-col items-center justify-center mx-auto space-y-4'>
                    <input
                        placeholder='Nome do produto'
                        value={nomeProduto}
                        onChange={(e) => setNomeProduto(e.target.value)}
                    />
                    <div className="flex w-full space-x-2">
                        <select
                            name="categoria"
                            className="flex-1 p-2 border rounded"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="Categoria 1">Categoria 1</option>
                            <option value="Categoria 2">Categoria 2</option>
                        </select>
                        <button  onClick={() => setModalAberto(true)}>Nova Categoria</button>
                    </div>
                    <input
                        placeholder='Preço'
                        type='text'
                        value={preco}
                        onChange={(e) => setPreco(formatarPreco(e.target.value))}
                    />
                    <input
                        placeholder='Quantidade'
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                    />
                    <textarea
                        placeholder='Informações adicionais'
                        className="p-2 w-full border rounded"
                        value={informacoesAdicionais}
                        onChange={(e) => setInformacoesAdicionais(e.target.value)}
                    />
                    <button
                        
                        onClick={handleAvancar}
                        disabled={!todosCamposPreenchidos}
                    >
                        Avançar
                    </button>
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
                        <button  onClick={handleVoltar}>
                            Voltar
                        </button>
                        <button  onClick={handleAvancar}>
                            Finalizar
                        </button>
                    </div>
                </div>
            )}

            <button
                
                onClick={() => window.history.back()}
                className="absolute w-full bottom-0 left-1/2 transform -translate-x-1/2 rounded-none h-20"
            >
                Voltar
            </button>

            {modalAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Adicionar Nova Categoria</h2>
                        <input
                            placeholder="Nome da nova categoria"
                            value={novaCategoria}
                            onChange={(e) => setNovaCategoria(e.target.value)}
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button  onClick={() => setModalAberto(false)}>Cancelar</button>
                            <button  onClick={() => { setCategoria(novaCategoria); setModalAberto(false); }}>Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NovoProduto;
