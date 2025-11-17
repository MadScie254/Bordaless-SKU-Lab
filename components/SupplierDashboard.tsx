
import React, { useState } from 'react';
import { ProductBatch } from '../types';
import VerificationWizard from './VerificationWizard';
import { PlusIcon } from './icons';
import DashboardAnalyticsV2 from './DashboardAnalyticsV2';

interface SupplierDashboardProps {
  products: ProductBatch[];
  onAddProduct: (newProduct: ProductBatch) => void;
}

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ products, onAddProduct }) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleProductAdd = (newProduct: ProductBatch) => {
    onAddProduct(newProduct);
    setIsWizardOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-secondary">[SUPPLIER_DASH]</h2>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold border-2 border-primary/50 hover:bg-background hover:text-primary hover:border-primary transition-all duration-200 shadow-glow-primary hover:shadow-none"
        >
          <PlusIcon />
          CREATE NEW SKU
        </button>
      </div>
      
      <DashboardAnalyticsV2 />

      <div className="p-4 border border-border bg-surface-1 mt-8">
         <h3 className="text-xl mb-4 text-text-base">MANAGE YOUR SKUS</h3>
         {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                 <div key={product.id} className="border border-border p-4 bg-surface-2">
                    <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover mb-3" />
                    <h4 className="font-bold truncate text-text-base">{product.title}</h4>
                    <p className="text-sm text-text-muted">Status: <span className={product.status === 'available' ? 'text-primary' : 'text-yellow-400'}>{product.status.toUpperCase()}</span></p>
                    <p className="text-sm text-text-muted">QTY: {product.qtyAvailable}</p>
                 </div>
              ))}
            </div>
         ) : (
             <div className="text-text-muted py-8 text-center">
                <p>Your product listings will appear here once created.</p>
                <p>Click "CREATE NEW SKU" to start the verification process for a new product batch.</p>
             </div>
         )}
      </div>
      
      {isWizardOpen && (
        <VerificationWizard
          onClose={() => setIsWizardOpen(false)}
          onProductAdd={handleProductAdd}
        />
      )}
    </div>
  );
};

export default SupplierDashboard;
