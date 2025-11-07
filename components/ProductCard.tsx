
import React from 'react';
import { ProductBatch } from '../types';

interface ProductCardProps {
  product: ProductBatch;
  onSelect: (product: ProductBatch) => void;
}

const QualityBadge: React.FC<{ score?: 'A' | 'B' | 'C' | 'D' }> = ({ score }) => {
  if (!score) return null;
  
  const scoreColors = {
    'A': 'bg-primary-lime text-black',
    'B': 'bg-green-400 text-black',
    'C': 'bg-yellow-400 text-black',
    'D': 'bg-red-500 text-white',
  };

  return (
    <div className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-bold text-lg ${scoreColors[score]} border-2 border-dark-bg`}>
      {score}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div 
      className="border border-dark-gray bg-black/20 group relative overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary-lime hover:shadow-brutalist"
      onClick={() => onSelect(product)}
    >
      <div className="aspect-w-4 aspect-h-3">
         <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <QualityBadge score={product.mlQualityScore} />
      <div className="p-4 border-t border-dark-gray">
        <p className="text-xs text-primary-cyan mb-1">{product.category.toUpperCase()}</p>
        <h3 className="text-lg font-bold text-light-gray truncate">{product.title}</h3>
        <div className="mt-2 flex justify-between items-baseline">
          <p className="text-xl text-primary-lime font-bold">${product.unitPriceUSD.toFixed(2)} <span className="text-sm text-medium-gray font-normal">/unit</span></p>
          <p className="text-sm text-medium-gray">MOQ: {product.moq}</p>
        </div>
      </div>
       <div className={`absolute bottom-0 left-0 w-full h-1 ${product.status === 'available' ? 'bg-primary-lime' : 'bg-yellow-400'}`}></div>
    </div>
  );
};

export default ProductCard;
