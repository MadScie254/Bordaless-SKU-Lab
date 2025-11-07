
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import SupplierDashboard from './components/SupplierDashboard';
import ProductDetail from './components/ProductDetail';
import { ProductBatch, Supplier } from './types';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from './constants';
import SupplierProfileModal from './components/SupplierProfileModal';
import Chatbot from './components/Chatbot';

type View = 'discovery' | 'dashboard' | 'detail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('discovery');
  const [selectedProduct, setSelectedProduct] = useState<ProductBatch | null>(null);
  const [products, setProducts] = useState<ProductBatch[]>(MOCK_PRODUCTS);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleProductSelect = useCallback((product: ProductBatch) => {
    setSelectedProduct(product);
    setView('detail');
  }, []);

  const handleBackToDiscovery = useCallback(() => {
    setSelectedProduct(null);
    setView('discovery');
  }, []);

  const handleAddProduct = useCallback((newProduct: ProductBatch) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  }, []);
  
  const handleSelectSupplier = useCallback((supplierId: string) => {
    const supplier = MOCK_SUPPLIERS.find(s => s.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
    }
  }, []);

  const renderContent = () => {
    switch (view) {
      case 'discovery':
        return <ProductGrid products={products} onProductSelect={handleProductSelect} />;
      case 'dashboard':
        return <SupplierDashboard products={products.filter(p=>p.supplierId === 'supp_current_user')} onAddProduct={handleAddProduct} />;
      case 'detail':
        return selectedProduct ? <ProductDetail product={selectedProduct} onBack={handleBackToDiscovery} onSelectSupplier={handleSelectSupplier} /> : <ProductGrid products={products} onProductSelect={handleProductSelect} />;
      default:
        return <ProductGrid products={products} onProductSelect={handleProductSelect} />;
    }
  };

  return (
    <div className="bg-dark-bg text-light-gray min-h-screen font-mono flex flex-col">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
      {selectedSupplier && (
        <SupplierProfileModal 
          supplier={selectedSupplier} 
          onClose={() => setSelectedSupplier(null)} 
        />
      )}
      <Chatbot />
    </div>
  );
};

export default App;
