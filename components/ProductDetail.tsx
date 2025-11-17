import React, { useState } from 'react';
import { ProductBatch, Order } from '../types';
import LandedCostCalculator from './LandedCostCalculator';
import OrderTracker from './OrderTracker';
import { BackIcon, CubeIcon, FingerprintIcon, MessageIcon, VideoCameraIcon, CubeTransparentIcon } from './icons';
import Product3DViewer from './Product3DViewer';


const ProvenanceTimeline: React.FC<{ product: ProductBatch }> = ({ product }) => (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center mt-1">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
        <div>
          <h4 className="font-bold">Batch Created</h4>
          <p className="text-xs text-text-muted">Supplier initiated new SKU verification.</p>
        </div>
      </div>
       <div className="border-l-2 border-dashed border-border h-6 ml-3"></div>
       <div className="flex items-start gap-3">
         <div className="w-6 h-6 bg-secondary/20 border-2 border-secondary rounded-full flex items-center justify-center mt-1">
           <div className="w-2 h-2 bg-secondary rounded-full"></div>
         </div>
         <div>
           <h4 className="font-bold">Live Video Sample Verified</h4>
           <p className="text-xs text-text-muted">Timestamped media hashed for provenance.</p>
         </div>
       </div>
       <div className="border-l-2 border-dashed border-border h-6 ml-3"></div>
       <div className="flex items-start gap-3">
         <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${product.mlQualityScore ? 'bg-primary/20 border-2 border-primary' : 'bg-surface-2 border-2 border-border'}`}>
           <div className={`w-2 h-2 rounded-full ${product.mlQualityScore ? 'bg-primary' : 'bg-text-muted'}`}></div>
         </div>
         <div>
           <h4 className="font-bold">ML Quality Score: Grade {product.mlQualityScore || 'Pending'}</h4>
           <p className="text-xs text-text-muted">Automated visual inspection completed.</p>
         </div>
       </div>
    </div>
);


const ProductDetail: React.FC<{ 
    product: ProductBatch; 
    onBack: () => void; 
    onSelectSupplier: (supplierId: string) => void;
    onShowStory: (supplierId: string) => void;
    onPlaceOrder: (product: ProductBatch) => void;
    activeOrder: Order | null;
}> = ({ product, onBack, onSelectSupplier, onShowStory, onPlaceOrder, activeOrder }) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState<'media' | '3d'>('media');

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-secondary hover:underline">
        <BackIcon />
        BACK TO DISCOVERY
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Media */}
        <div className="lg:col-span-3">
          {product.modelUrl && (
            <div className="flex border-b border-border mb-4">
              <button 
                onClick={() => setActiveTab('media')}
                className={`px-4 py-2 text-lg font-bold transition-colors ${activeTab === 'media' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-base'}`}
              >
                Media
              </button>
              <button
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-2 px-4 py-2 text-lg font-bold transition-colors ${activeTab === '3d' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-base'}`}
              >
                <CubeTransparentIcon /> 3D View
              </button>
            </div>
          )}

          {activeTab === 'media' || !product.modelUrl ? (
            <>
              <div className="border border-border aspect-w-16 aspect-h-9 mb-4 bg-surface-1">
                <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    onClick={() => setMainImage(img)}
                    className={`cursor-pointer w-full h-full object-cover border-2 ${mainImage === img ? 'border-primary' : 'border-border hover:border-text-muted'}`}
                  />
                ))}
                <div className="flex items-center justify-center border-2 border-dashed border-border bg-surface-1 text-text-muted">
                    <p className="text-xs text-center">Video Sample</p>
                </div>
              </div>
            </>
          ) : (
            <div className="border border-border aspect-w-16 aspect-h-9 bg-black">
              <Product3DViewer modelUrl={product.modelUrl} />
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <p className="text-sm text-secondary mb-1">{product.category.toUpperCase()}</p>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-sm text-text-muted">
                by <span onClick={() => onSelectSupplier(product.supplierId)} className="underline cursor-pointer hover:text-secondary">{product.supplierId}</span>
                {' // '}
                <span onClick={() => onShowStory(product.supplierId)} className="underline cursor-pointer hover:text-primary">Read Story</span>
            </p>
          </div>
          <p className="text-text-muted mb-6">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-center">
             <div className="border border-border bg-surface-1 p-3">
                <p className="text-2xl font-bold text-primary">${product.unitPriceUSD.toFixed(2)}</p>
                <p className="text-xs text-text-muted">UNIT PRICE (USD)</p>
             </div>
             <div className="border border-border bg-surface-1 p-3">
                <p className="text-2xl font-bold text-primary">{product.moq}</p>
                <p className="text-xs text-text-muted">MINIMUM ORDER (MOQ)</p>
             </div>
             <div className="border border-border bg-surface-1 p-3">
                <p className="text-2xl font-bold text-primary">{product.qtyAvailable}</p>
                <p className="text-xs text-text-muted">QTY AVAILABLE</p>
             </div>
             <div className="border border-border bg-surface-1 p-3">
                <p className="text-2xl font-bold text-primary">{product.leadTimeDays}</p>
                <p className="text-xs text-text-muted">LEAD TIME (DAYS)</p>
             </div>
          </div>

          <div className="border border-border bg-surface-1 p-4 mb-6">
            <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2"><CubeIcon />SPECIFICATIONS</h3>
            <ul className="space-y-1 text-sm">
                {Object.entries(product.specs).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                        <span className="text-text-muted">{key}:</span>
                        <span>{value}</span>
                    </li>
                ))}
                 <li className="flex justify-between">
                    <span className="text-text-muted">Materials:</span>
                    <span>{product.materials.join(', ')}</span>
                </li>
            </ul>
          </div>

          <div className="border border-border bg-surface-1 p-4 mb-6">
            <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2"><FingerprintIcon />PROVENANCE &amp; QC</h3>
            <ProvenanceTimeline product={product} />
          </div>
          
          <LandedCostCalculator product={product} />

          {activeOrder ? (
            <OrderTracker order={activeOrder} />
          ) : (
            <div className="mt-6">
               <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2"><MessageIcon/>NEGOTIATE &amp; ORDER</h3>
               <textarea className="w-full bg-surface-2 border border-border p-2 text-text-base focus:border-primary focus:outline-none" rows={3} placeholder="Use the SKU-Bot to draft an offer..."></textarea>
               <div className="grid grid-cols-2 gap-2 mt-2">
                  <button 
                    onClick={() => alert('Live inspection request sent! The supplier will be notified to schedule a call.')}
                    className="w-full px-4 py-3 bg-surface-2 text-secondary font-bold border-2 border-border hover:bg-background hover:border-secondary transition-all duration-200 flex items-center justify-center gap-2">
                    <VideoCameraIcon /> REQUEST LIVE INSPECTION
                  </button>
                  <button 
                    onClick={() => onPlaceOrder(product)}
                    className="w-full px-4 py-3 bg-primary text-black font-bold border-2 border-primary/50 hover:bg-background hover:text-primary hover:border-primary transition-all duration-200 shadow-glow-primary hover:shadow-none">
                     MAKE OFFER
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;