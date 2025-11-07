
import React from 'react';
import { Supplier } from '../types';
import Modal from './Modal';
import { CheckCircleIcon, ShieldIcon, StarIcon, WorldIcon } from './icons';

interface SupplierProfileModalProps {
  supplier: Supplier;
  onClose: () => void;
}

const SupplierProfileModal: React.FC<SupplierProfileModalProps> = ({ supplier, onClose }) => {
  const statusColors = {
    Verified: 'text-primary-lime',
    Pending: 'text-yellow-400',
    Unverified: 'text-red-500',
  };

  return (
    <Modal title="Supplier Profile" onClose={onClose}>
      <div className="min-w-[30vw]">
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-primary-lime">{supplier.name}</h3>
          <div className="flex items-center gap-2 text-medium-gray text-sm">
            <WorldIcon />
            <span>{supplier.country}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="border border-dark-gray p-3">
            <p className={`text-xl font-bold ${statusColors[supplier.verificationStatus]}`}>{supplier.verificationStatus}</p>
            <p className="text-xs text-medium-gray flex items-center justify-center gap-1"><ShieldIcon className="h-4 w-4" /> STATUS</p>
          </div>
          <div className="border border-dark-gray p-3">
            <p className="text-xl font-bold text-primary-lime flex items-center justify-center gap-1">
              {supplier.rating.toFixed(1)} <StarIcon className="h-4 w-4" />
            </p>
            <p className="text-xs text-medium-gray">RATING</p>
          </div>
          <div className="border border-dark-gray p-3">
            <p className="text-xl font-bold text-primary-lime">{new Date(supplier.memberSince).getFullYear()}</p>
            <p className="text-xs text-medium-gray">MEMBER SINCE</p>
          </div>
        </div>
        
        <div>
            <h4 className="font-bold text-primary-cyan mb-2">ABOUT THE SUPPLIER</h4>
            <p className="text-sm text-light-gray bg-black/20 p-4 border border-dark-gray">{supplier.bio}</p>
        </div>

      </div>
    </Modal>
  );
};

export default SupplierProfileModal;
