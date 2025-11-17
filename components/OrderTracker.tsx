
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircleIcon } from './icons';

interface OrderTrackerProps {
  order: Order;
}

const STEPS: OrderStatus[] = ['Production', 'QC', 'Packaging', 'Export Prep', 'Shipped'];

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);

  useEffect(() => {
    // Simulate order progress for demonstration
    const currentStepIndex = STEPS.indexOf(currentStatus);
    if (currentStepIndex < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStatus(STEPS[currentStepIndex + 1]);
      }, 5000); // Advance every 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentStatus]);

  const currentStepIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-secondary mb-4">ORDER PROGRESS</h3>
      <div className="flex items-center">
        {STEPS.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index <= currentStepIndex ? 'bg-primary border-primary text-black' : 'bg-surface-2 border-border text-text-muted'
                }`}
              >
                {index < currentStepIndex ? <CheckCircleIcon className="h-6 w-6" /> : <span>{index + 1}</span>}
              </div>
              <p className={`text-xs mt-2 text-center ${index <= currentStepIndex ? 'text-primary' : 'text-text-muted'}`}>{step}</p>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-1 transition-all duration-500 mx-1 ${index < currentStepIndex ? 'bg-primary' : 'bg-border'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;
