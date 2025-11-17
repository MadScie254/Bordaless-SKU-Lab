
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ProductBatch, SearchFilters } from '../types';
import ProductCard from './ProductCard';
import Hero from './ui/Hero';
import SkeletonCard from './ui/SkeletonCard';
import AdvancedFilters from './AdvancedFilters';
import { parseSearchQuery } from '../services/geminiService';
import { useSounds } from '../hooks/useSounds';

interface ProductGridProps {
  products: ProductBatch[];
  onProductSelect: (product: ProductBatch) => void;
  favoriteIds: Set<string>;
  toggleFavorite: (productId: string) => void;
  playSound: (sound: 'click') => void;
}

type ViewMode = 'all' | 'favorites';

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect, favoriteIds, toggleFavorite, playSound }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [moqRange, setMoqRange] = useState<[number, number]>([0, 100]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const { playSearch } = useSounds(true);

  const countries = useMemo(() => [...Array.from(new Set(products.map(p => p.country)))], [products]);
  const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map(p => p.unitPriceUSD))), [products]);
  const maxMoq = useMemo(() => Math.ceil(Math.max(...products.map(p => p.moq))), [products]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
    setMoqRange([0, maxMoq]);
  }, [maxPrice, maxMoq]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAiSearch = useCallback(async (query: string) => {
      if (!query.trim()) return;
      setIsAiSearching(true);
      playSearch();
      try {
          const filters = await parseSearchQuery(query);
          setSearchTerm(filters.searchTerm || '');
          if (filters.countries) setSelectedCountries(filters.countries);
          if (filters.maxPrice || filters.minPrice) {
            setPriceRange([filters.minPrice || 0, filters.maxPrice || maxPrice]);
          }
          if (filters.maxMoq || filters.minMoq) {
            setMoqRange([filters.minMoq || 0, filters.maxMoq || maxMoq]);
          }
      } catch (error) {
          console.error("AI Search failed:", error);
          // Fallback to simple search
          setSearchTerm(query);
      } finally {
          setIsAiSearching(false);
      }
  }, [maxPrice, maxMoq, playSearch]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setMoqRange([0, maxMoq]);
    setSelectedCountries([]);
  }, [maxPrice, maxMoq]);

  const filteredAndSortedProducts = useMemo(() => {
    let processedProducts = viewMode === 'favorites' 
      ? products.filter(p => favoriteIds.has(p.id))
      : [...products];

    // Advanced Filters
    processedProducts = processedProducts.filter(p => 
        p.unitPriceUSD >= priceRange[0] && p.unitPriceUSD <= priceRange[1] &&
        p.moq >= moqRange[0] && p.moq <= moqRange[1]
    );

    if (selectedCountries.length > 0) {
        processedProducts = processedProducts.filter(p => selectedCountries.includes(p.country));
    }
    
    // Search term filter (applies after advanced filters)
    if (searchTerm.trim() !== '') {
      processedProducts = processedProducts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return processedProducts;
  }, [products, viewMode, favoriteIds, priceRange, moqRange, selectedCountries, searchTerm]);


  return (
    <div>
      <Hero />
      <div className="mb-8">
        <div className="flex border-b border-border">
          <button onClick={() => setViewMode('all')} className={`px-4 py-2 text-lg font-bold transition-colors ${viewMode === 'all' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-base'}`}>All Products</button>
          <button onClick={() => setViewMode('favorites')} className={`px-4 py-2 text-lg font-bold transition-colors ${viewMode === 'favorites' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-base'}`}>My Favorites ({favoriteIds.size})</button>
        </div>
      </div>
      
      {viewMode === 'all' && (
        <AdvancedFilters
            onSearch={handleAiSearch}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            moqRange={moqRange}
            setMoqRange={setMoqRange}
            countries={countries}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            maxPrice={maxPrice}
            maxMoq={maxMoq}
            isAiSearching={isAiSearching}
            resetFilters={resetFilters}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={onProductSelect}
                isFavorite={favoriteIds.has(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-surface-1 border border-border">
              <h3 className="text-2xl font-bold text-text-base">No Products Found</h3>
              <p className="text-text-muted mt-2">
                {viewMode === 'favorites' 
                  ? "You haven't saved any products yet. Click the heart icon to add them."
                  : "Try adjusting your filters or search query."
                }
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductGrid;