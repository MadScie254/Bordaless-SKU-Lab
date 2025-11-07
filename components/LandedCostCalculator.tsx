
import React, { useState, useMemo } from 'react';
import { ProductBatch } from '../types';
import { TruckIcon } from './icons';

interface LandedCostCalculatorProps {
  product: ProductBatch;
}

const LandedCostCalculator: React.FC<LandedCostCalculatorProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(product.moq);
  const [destination, setDestination] = useState('USA');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= product.moq) {
      setQuantity(val);
    } else if (e.target.value === '') {
        setQuantity(0);
    }
  };

  const calculatedCosts = useMemo(() => {
    const productCost = product.unitPriceUSD * quantity;
    const shippingCost = quantity * 3.5; // Mock shipping cost
    const dutiesAndTaxes = productCost * 0.08; // Mock duties
    const insuranceCost = productCost * 0.01; // Mock insurance
    const totalLandedCost = productCost + shippingCost + dutiesAndTaxes + insuranceCost;
    return { productCost, shippingCost, dutiesAndTaxes, insuranceCost, totalLandedCost };
  }, [quantity, product.unitPriceUSD]);

  return (
    <div className="border border-dark-gray p-4">
      <h3 className="text-lg font-bold text-primary-cyan mb-3 flex items-center gap-2"><TruckIcon />ESTIMATED LANDED COST</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="quantity" className="block text-xs text-medium-gray mb-1">QUANTITY</label>
          <input
            type="number"
            id="quantity"
            min={product.moq}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full bg-black p-2 border border-dark-gray focus:border-primary-lime outline-none"
          />
        </div>
        <div>
          <label htmlFor="destination" className="block text-xs text-medium-gray mb-1">DESTINATION</label>
          <select
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-black p-2 border border-dark-gray focus:border-primary-lime outline-none"
          >
            <option>USA</option>
            <option>EU</option>
            <option>UK</option>
            <option>Canada</option>
          </select>
        </div>
      </div>
      {quantity >= product.moq && (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-medium-gray">Product Cost:</span>
                <span>${calculatedCosts.productCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-medium-gray">Est. Shipping:</span>
                <span>${calculatedCosts.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-medium-gray">Est. Duties & Taxes:</span>
                <span>${calculatedCosts.dutiesAndTaxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-medium-gray">Insurance:</span>
                <span>${calculatedCosts.insuranceCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg border-t border-dark-gray pt-2 mt-2">
                <span className="font-bold text-primary-lime">TOTAL LANDED COST:</span>
                <span className="font-bold text-primary-lime">${calculatedCosts.totalLandedCost.toFixed(2)}</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default LandedCostCalculator;
