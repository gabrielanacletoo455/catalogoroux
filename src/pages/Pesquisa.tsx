import { useState } from 'react';

import scrapeData, { Product } from '@/services/scraping';

const Pesquisa = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>('');

  const handleSearch = async () => {
    const results = await scrapeData(query);
    // setProducts(results);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Pesquisar produtos"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              {product.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pesquisa;
