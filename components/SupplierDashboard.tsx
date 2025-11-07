
import React, { useState } from 'react';
import { ProductBatch } from '../types';
import VerificationWizard from './VerificationWizard';
import { PlusIcon } from './icons';
import ProductCard from './ProductCard';

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
        <h2 className="text-3xl font-bold text-primary-cyan">[SUPPLIER_DASH]</h2>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-lime text-black font-bold border-2 border-black hover:bg-black hover:text-primary-lime hover:border-primary-lime transition-all duration-200 shadow-brutalist hover:shadow-none"
        >
          <PlusIcon />
          CREATE NEW SKU
        </button>
      </div>

      <div className="p-4 border border-dark-gray bg-black/20">
         <h3 className="text-xl mb-4">MANAGE YOUR SKUS</h3>
         {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                 <div key={product.id} className="border border-dark-gray p-4 bg-black/30">
                    <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover mb-3" />
                    <h4 className="font-bold truncate">{product.title}</h4>
                    <p className="text-sm text-medium-gray">Status: <span className={product.status === 'available' ? 'text-primary-lime' : 'text-yellow-400'}>{product.status.toUpperCase()}</span></p>
                    <p className="text-sm text-medium-gray">QTY: {product.qtyAvailable}</p>
                 </div>
              ))}
            </div>
         ) : (
             <div className="text-medium-gray">
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
