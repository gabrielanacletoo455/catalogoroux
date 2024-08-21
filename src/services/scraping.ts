import axios from 'axios';
import * as cheerio from 'cheerio';

// Tipo para os dados do produto que você deseja extrair
export interface Product {
  title: string;
  link: string;
  imageUrl: string;
  discountedPrice: string;
}

// Função única para realizar scraping nos sites especificados
const scrapeData = async (query: string): Promise<Product[]> => {
  const virtualMakeURL = `https://www.virtualmake.com.br/buscar?q=${encodeURIComponent(query)}&Buscar=`;
  const idmDistribuicoesURL = `https://www.idmdistribuicoes.com.br/loja/busca.php?loja=1149105&palavra_busca=${encodeURIComponent(query)}`;

  // Função para scraping de um site específico
  const scrapeWebsite = async (url: string, site: string): Promise<Product[]> => {
    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        console.error(`Falha na conexão com ${site}. Status:`, response.status);
        return [];
      }

      const html = response.data;
      const $ = cheerio.load(html);
      const products: Product[] = [];

      if (site === 'VirtualMake') {
        const ulSelector = 'ul[data-produtos-linha="4"]';

        $(ulSelector).find('li').each((index, element) => {
          const productElement = $(element);
          const title = productElement.find('.info-produto a').text().trim() || '';
          const link = productElement.find('.info-produto a').attr('href')?.trim() || '';
          const imageUrl = productElement.find('.imagem-produto img').attr('src')?.trim() || '';
          const discountedPrice = productElement.find('.desconto-a-vista .cor-secundaria').first().text().trim();

          if (discountedPrice) {
            products.push({ title, link, imageUrl, discountedPrice });
          }
        });
      } else if (site === 'IDMDistribuicoes') {
        const ulSelector = '.showcase-catalog .list-product.flex.f-wrap';

        $(ulSelector).find('li.item.flex').each((index, element) => {
          const productElement = $(element);
          const title = productElement.find('.image a').attr('title')?.trim() || '';
          const link = productElement.find('.image a').attr('href')?.trim() || '';
          const imageUrl = productElement.find('.image img.primary-image').attr('src')?.trim() || '';
          const discountedPrice = productElement.find('.current-price').text().trim();

          if (discountedPrice) {
            products.push({ title, link, imageUrl, discountedPrice });
          }
        });
      }

      return products;
    } catch (error) {
      console.error(`Erro ao buscar ou processar dados de ${site}:`, error);
      return [];
    }
  };

  // Execute scraping para ambos os sites
  const virtualMakeProducts = await scrapeWebsite(virtualMakeURL, 'VirtualMake');
  const idmDistribuicoesProducts = await scrapeWebsite(idmDistribuicoesURL, 'IDMDistribuicoes');

  // Combine os resultados dos dois sites
  const allProducts = [...virtualMakeProducts, ...idmDistribuicoesProducts];
  return allProducts;
};

// Chamada de exemplo
scrapeData('Agua Micelar Melu').then(products => {
  console.log(JSON.stringify(products, null, 2));
});

export default scrapeData;
