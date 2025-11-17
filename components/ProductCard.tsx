
import React from 'react';
import { ProductBatch } from '../types';
import { HeartIcon } from './icons';

interface ProductCardProps {
  product: ProductBatch;
  onSelect: (product: ProductBatch) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

const QualityBadge: React.FC<{ score?: 'A' | 'B' | 'C' | 'D' }> = ({ score }) => {
  if (!score) return null;
  
  const scoreColors = {
    'A': 'bg-primary text-black',
    'B': 'bg-green-400 text-black',
    'C': 'bg-yellow-400 text-black',
    'D': 'bg-red-500 text-white',
  };

  return (
    <div className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-bold text-lg ${scoreColors[score]} border-2 border-background`}>
      {score}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, isFavorite, onToggleFavorite }) => {
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when favoriting
    onToggleFavorite(product.id);
  };

  return (
    <div 
      className="border border-border bg-surface-1 group relative overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-glow-primary hover:-translate-y-1"
      onClick={() => onSelect(product)}
    >
      <div className="aspect-w-4 aspect-h-3 overflow-hidden">
         <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
      </div>
      <QualityBadge score={product.mlQualityScore} />
      
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-3 left-3 p-2 bg-surface-glass backdrop-blur-sm rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon className={`h-6 w-6 transition-colors ${isFavorite ? 'text-primary fill-current' : 'text-primary/70'}`} />
      </button>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-secondary mb-1">{product.category.toUpperCase()}</p>
        <h3 className="text-lg font-bold text-text-base truncate">{product.title}</h3>
        <div className="mt-2 flex justify-between items-baseline">
          <p className="text-xl text-primary font-bold">${product.unitPriceUSD.toFixed(2)} <span className="text-sm text-text-muted font-normal">/unit</span></p>
          <p className="text-sm text-text-muted">MOQ: {product.moq}</p>
        </div>
      </div>
       <div className={`absolute bottom-0 left-0 w-full h-1 ${product.status === 'available' ? 'bg-primary' : 'bg-yellow-400'}`}></div>
    </div>
  );
};

export default ProductCard;