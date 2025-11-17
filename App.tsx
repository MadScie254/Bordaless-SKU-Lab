
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import SupplierDashboard from './components/SupplierDashboard';
import ProductDetail from './components/ProductDetail';
import { ProductBatch, Supplier, Order } from './types';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from './constants';
import SupplierProfileModal from './components/SupplierProfileModal';
import Chatbot from './components/Chatbot';
import CommandPalette from './components/CommandPalette';
import { useSounds } from './hooks/useSounds';
import MarketTrends from './components/MarketTrends';
import SupplierStoryModal from './components/SupplierStoryModal';

type View = 'discovery' | 'dashboard' | 'detail' | 'market';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [view, setView] = useState<View>('discovery');
  const [selectedProduct, setSelectedProduct] = useState<ProductBatch | null>(null);
  const [products, setProducts] = useState<ProductBatch[]>(MOCK_PRODUCTS);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedStorySupplier, setSelectedStorySupplier] = useState<Supplier | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [theme, setTheme] = useState<Theme>('dark');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playClick, playToggleOn, playToggleOff, playAddFavorite } = useSounds(soundEnabled);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound) {
      setSoundEnabled(JSON.parse(savedSound));
    }
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    newTheme === 'dark' ? playToggleOff() : playToggleOn();
  }, [theme, playToggleOn, playToggleOff]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newState = !prev;
      localStorage.setItem('soundEnabled', JSON.stringify(newState));
      newState ? playToggleOn() : playToggleOff();
      return newState;
    });
  }, [playToggleOn, playToggleOff]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteIds(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(productId)) {
        newFavs.delete(productId);
        playToggleOff();
      } else {
        newFavs.add(productId);
        playAddFavorite();
      }
      localStorage.setItem('favoriteProducts', JSON.stringify(Array.from(newFavs)));
      return newFavs;
    });
  }, [playAddFavorite, playToggleOff]);


  const handleProductSelect = useCallback((product: ProductBatch) => {
    setSelectedProduct(product);
    setView('detail');
    playClick();
  }, [playClick]);

  const handleBackToDiscovery = useCallback(() => {
    setSelectedProduct(null);
    setView('discovery');
    playClick();
  }, [playClick]);
  
  const navigate = useCallback((newView: 'discovery' | 'dashboard' | 'market') => {
    setView(newView);
    setSelectedProduct(null);
    setIsCommandPaletteOpen(false);
    playClick();
  }, [playClick]);

  const handleAddProduct = useCallback((newProduct: ProductBatch) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  }, []);
  
  const handleSelectSupplier = useCallback((supplierId: string) => {
    const supplier = MOCK_SUPPLIERS.find(s => s.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
    }
  }, []);

  const handleShowStory = useCallback((supplierId: string) => {
    const supplier = MOCK_SUPPLIERS.find(s => s.id === supplierId);
    if (supplier) {
        setSelectedSupplier(null); // Close the small modal
        setSelectedStorySupplier(supplier);
    }
  }, []);

  const handlePlaceOrder = useCallback((product: ProductBatch) => {
    // In a real app, this would involve a complex process.
    // Here, we'll just create a mock order.
    setActiveOrder({
        id: `order_${Date.now()}`,
        product: product,
        status: 'Production',
    });
    // Maybe play a sound
  }, []);

  const renderContent = () => {
    const pageKey = view === 'detail' ? `detail-${selectedProduct?.id}` : view;
    
    let content;
    switch (view) {
      case 'discovery':
        content = <ProductGrid products={products} onProductSelect={handleProductSelect} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} playSound={playClick} />;
        break;
      case 'dashboard':
        content = <SupplierDashboard products={products.filter(p=>p.supplierId === 'supp_current_user')} onAddProduct={handleAddProduct} />;
        break;
      case 'market':
        content = <MarketTrends />;
        break;
      case 'detail':
        content = selectedProduct ? <ProductDetail product={selectedProduct} onBack={handleBackToDiscovery} onSelectSupplier={handleSelectSupplier} onShowStory={handleShowStory} onPlaceOrder={handlePlaceOrder} activeOrder={activeOrder?.product.id === selectedProduct.id ? activeOrder : null} /> : <ProductGrid products={products} onProductSelect={handleProductSelect} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} playSound={playClick}/>;
        break;
      default:
        content = <ProductGrid products={products} onProductSelect={handleProductSelect} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} playSound={playClick}/>;
        break;
    }

    return (
        <div key={pageKey} className="animate-page-transition">
            {content}
        </div>
    )
  };

  return (
    <div className="bg-background text-text-base min-h-screen font-mono flex flex-col">
      <Header 
        currentView={view} 
        setView={navigate} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
      {selectedSupplier && (
        <SupplierProfileModal 
          supplier={selectedSupplier} 
          onClose={() => setSelectedSupplier(null)} 
          onShowStory={handleShowStory}
        />
      )}
      {selectedStorySupplier && (
        <SupplierStoryModal 
            supplier={selectedStorySupplier}
            onClose={() => setSelectedStorySupplier(null)}
        />
      )}
      <Chatbot productContext={view === 'detail' ? selectedProduct : null} />
      {isCommandPaletteOpen && (
          <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} navigate={navigate} />
      )}
    </div>
  );
};

export default App;
