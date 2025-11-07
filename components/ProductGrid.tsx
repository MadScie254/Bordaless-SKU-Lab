
import React, { useState } from 'react';
import { ProductBatch } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ProductBatch[];
  onProductSelect: (product: ProductBatch) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => 
    filterCategory === 'all' || product.category === filterCategory
  );

  return (
    <div>
      <div className="mb-8 p-4 border border-dark-gray bg-black/20">
        <h2 className="text-2xl font-bold text-primary-cyan mb-2">[DISCOVERY_FEED]</h2>
        <p className="text-medium-gray mb-4">Live, verification-first micro-sourcing and export-prep marketplace.</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-medium-gray self-center">FILTER_BY_CATEGORY:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-3 py-1 border text-sm transition-colors duration-200 ${
                filterCategory === category
                  ? 'bg-primary-lime text-black border-primary-lime'
                  : 'border-dark-gray hover:bg-dark-gray'
              }`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
