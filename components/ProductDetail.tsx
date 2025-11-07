
import React, { useState } from 'react';
import { ProductBatch } from '../types';
import LandedCostCalculator from './LandedCostCalculator';
import { BackIcon, CheckCircleIcon, CubeIcon, FingerprintIcon, MessageIcon, ShieldIcon, TruckIcon, VideoCameraIcon } from './icons';


const ProvenanceTimeline: React.FC<{ product: ProductBatch }> = ({ product }) => (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-primary-lime/20 border-2 border-primary-lime rounded-full flex items-center justify-center mt-1">
          <div className="w-2 h-2 bg-primary-lime rounded-full"></div>
        </div>
        <div>
          <h4 className="font-bold">Batch Created</h4>
          <p className="text-xs text-medium-gray">Supplier initiated new SKU verification.</p>
        </div>
      </div>
       <div className="border-l-2 border-dashed border-dark-gray h-6 ml-3"></div>
       <div className="flex items-start gap-3">
         <div className="w-6 h-6 bg-primary-cyan/20 border-2 border-primary-cyan rounded-full flex items-center justify-center mt-1">
           <div className="w-2 h-2 bg-primary-cyan rounded-full"></div>
         </div>
         <div>
           <h4 className="font-bold">Live Video Sample Verified</h4>
           <p className="text-xs text-medium-gray">Timestamped media hashed for provenance.</p>
         </div>
       </div>
       <div className="border-l-2 border-dashed border-dark-gray h-6 ml-3"></div>
       <div className="flex items-start gap-3">
         <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${product.mlQualityScore ? 'bg-primary-lime/20 border-2 border-primary-lime' : 'bg-dark-gray border-2 border-medium-gray'}`}>
           <div className={`w-2 h-2 rounded-full ${product.mlQualityScore ? 'bg-primary-lime' : 'bg-medium-gray'}`}></div>
         </div>
         <div>
           <h4 className="font-bold">ML Quality Score: Grade {product.mlQualityScore || 'Pending'}</h4>
           <p className="text-xs text-medium-gray">Automated visual inspection completed.</p>
         </div>
       </div>
    </div>
);


const ProductDetail: React.FC<{ product: ProductBatch; onBack: () => void; onSelectSupplier: (supplierId: string) => void; }> = ({ product, onBack, onSelectSupplier }) => {
  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary-cyan hover:underline">
        <BackIcon />
        BACK TO DISCOVERY
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Media */}
        <div className="lg:col-span-3">
          <div className="border border-dark-gray aspect-w-16 aspect-h-9 mb-4">
            <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} thumbnail ${index + 1}`}
                onClick={() => setMainImage(img)}
                className={`cursor-pointer w-full h-full object-cover border-2 ${mainImage === img ? 'border-primary-lime' : 'border-dark-gray hover:border-medium-gray'}`}
              />
            ))}
             <div className="flex items-center justify-center border-2 border-dashed border-dark-gray bg-black/20 text-medium-gray">
                <p className="text-xs text-center">Video Sample</p>
             </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <p className="text-sm text-primary-cyan mb-1">{product.category.toUpperCase()}</p>
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-sm text-medium-gray">by <span onClick={() => onSelectSupplier(product.supplierId)} className="underline cursor-pointer hover:text-primary-cyan">{product.supplierId}</span></p>
          </div>
          <p className="text-medium-gray mb-6">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-center">
             <div className="border border-dark-gray p-3">
                <p className="text-2xl font-bold text-primary-lime">${product.unitPriceUSD.toFixed(2)}</p>
                <p className="text-xs text-medium-gray">UNIT PRICE (USD)</p>
             </div>
             <div className="border border-dark-gray p-3">
                <p className="text-2xl font-bold text-primary-lime">{product.moq}</p>
                <p className="text-xs text-medium-gray">MINIMUM ORDER (MOQ)</p>
             </div>
             <div className="border border-dark-gray p-3">
                <p className="text-2xl font-bold text-primary-lime">{product.qtyAvailable}</p>
                <p className="text-xs text-medium-gray">QTY AVAILABLE</p>
             </div>
             <div className="border border-dark-gray p-3">
                <p className="text-2xl font-bold text-primary-lime">{product.leadTimeDays}</p>
                <p className="text-xs text-medium-gray">LEAD TIME (DAYS)</p>
             </div>
          </div>

          <div className="border border-dark-gray p-4 mb-6">
            <h3 className="text-lg font-bold text-primary-cyan mb-3 flex items-center gap-2"><CubeIcon />SPECIFICATIONS</h3>
            <ul className="space-y-1 text-sm">
                {Object.entries(product.specs).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                        <span className="text-medium-gray">{key}:</span>
                        <span>{value}</span>
                    </li>
                ))}
                 <li className="flex justify-between">
                    <span className="text-medium-gray">Materials:</span>
                    <span>{product.materials.join(', ')}</span>
                </li>
            </ul>
          </div>

          <div className="border border-dark-gray p-4 mb-6">
            <h3 className="text-lg font-bold text-primary-cyan mb-3 flex items-center gap-2"><FingerprintIcon />PROVENANCE &amp; QC</h3>
            <ProvenanceTimeline product={product} />
          </div>
          
          <LandedCostCalculator product={product} />

          <div className="mt-6">
             <h3 className="text-lg font-bold text-primary-cyan mb-3 flex items-center gap-2"><MessageIcon/>NEGOTIATE &amp; ORDER</h3>
             <textarea className="w-full bg-black border border-dark-gray p-2 text-light-gray focus:border-primary-lime focus:outline-none" rows={3} placeholder="Send a message to the supplier..."></textarea>
             <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  onClick={() => alert('Live inspection request sent! The supplier will be notified to schedule a call.')}
                  className="w-full px-4 py-3 bg-dark-gray text-primary-cyan font-bold border-2 border-dark-gray hover:bg-black hover:text-primary-cyan hover:border-primary-cyan transition-all duration-200 flex items-center justify-center gap-2">
                  <VideoCameraIcon /> REQUEST LIVE INSPECTION
                </button>
                <button className="w-full px-4 py-3 bg-primary-lime text-black font-bold border-2 border-black hover:bg-black hover:text-primary-lime hover:border-primary-lime transition-all duration-200 shadow-brutalist hover:shadow-none">
                   MAKE OFFER
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
