import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Tipo para os dados do produto que você deseja extrair
export interface Product {
  title: string;
  link: string;
}

// Função para realizar scraping
const scrapeData = async (query: string): Promise<void> => {
  const url = `https://www.virtualmake.com.br/buscar?q=${encodeURIComponent(query)}&Buscar=`;

  try {
    // Realiza a requisição HTTP usando node-fetch
    const response = await fetch(url);
    
    // Verifica se a resposta foi bem-sucedida
    if (response.ok) {
      console.log('Conexão bem-sucedida!');
      console.log('Status da resposta:', response.status);
    } else {
      console.error('Falha na conexão. Status:', response.status);
    }
    
    // Obtém o HTML da resposta
    const html = await response.text();
    
    // Usa cheerio para fazer parsing do HTML
    const $ = cheerio.load(html);
    
    // Aqui você pode adicionar a lógica para processar os dados com cheerio
    // Por enquanto, apenas confirmamos que o HTML foi carregado
    console.log('HTML carregado com sucesso.');
    
  } catch (error) {
    console.error('Erro ao buscar ou processar dados:', error);
  }
};

export default scrapeData;
