import axios from 'axios';
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
    // Realiza a requisição HTTP usando axios
    const response = await axios.get(url);
    
    // Verifica se a resposta foi bem-sucedida
    if (response.status === 200) {
      console.log('Conexão bem-sucedida!');
      console.log('Status da resposta:', response.status);
    } else {
      console.error('Falha na conexão. Status:', response.status);
    }
    
    // Obtém o HTML da resposta
    const html = response.data;
    
    // Usa cheerio para fazer parsing do HTML
    const $ = cheerio.load(html);
        
    // Seletor da div que você deseja verificar
    const divSelector = 'div.listagemProdutos'; // Substitua pelo seletor apropriado

    // Verifica se a div contém uma ul
    const hasUl = $(divSelector).find('ul').length > 0;

    if (hasUl) {
      console.log('A div contém uma ul.');
    } else {
      console.log('A div não contém uma ul.');
    }
    
  } catch (error) {
    console.error('Erro ao buscar ou processar dados:', error);
  }
};

export default scrapeData;
