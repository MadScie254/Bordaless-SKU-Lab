
import React from 'react';
import { Supplier } from '../types';
import Modal from './Modal';
import { ShieldIcon, StarIcon, WorldIcon, MessageIcon } from './icons';

interface SupplierProfileModalProps {
  supplier: Supplier;
  onClose: () => void;
  onShowStory: (supplierId: string) => void;
}

const SupplierProfileModal: React.FC<SupplierProfileModalProps> = ({ supplier, onClose, onShowStory }) => {
  const statusColors = {
    Verified: 'text-primary',
    Pending: 'text-yellow-400',
    Unverified: 'text-red-500',
  };

  return (
    <Modal title="Supplier Profile" onClose={onClose}>
      <div className="min-w-[30vw]">
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-primary">{supplier.name}</h3>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <WorldIcon />
            <span>{supplier.country}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="border border-border bg-surface-1 p-3">
            <p className={`text-xl font-bold ${statusColors[supplier.verificationStatus]}`}>{supplier.verificationStatus}</p>
            <p className="text-xs text-text-muted flex items-center justify-center gap-1"><ShieldIcon className="h-4 w-4" /> STATUS</p>
          </div>
          <div className="border border-border bg-surface-1 p-3">
            <p className="text-xl font-bold text-primary flex items-center justify-center gap-1">
              {supplier.rating.toFixed(1)} <StarIcon className="h-4 w-4" />
            </p>
            <p className="text-xs text-text-muted">RATING</p>
          </div>
          <div className="border border-border bg-surface-1 p-3">
            <p className="text-xl font-bold text-primary">{new Date(supplier.memberSince).getFullYear()}</p>
            <p className="text-xs text-text-muted">MEMBER SINCE</p>
          </div>
        </div>
        
        <div>
            <h4 className="font-bold text-secondary mb-2">ABOUT THE SUPPLIER</h4>
            <p className="text-sm text-text-base bg-surface-2 p-4 border border-border">{supplier.bio}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
             <button
                onClick={() => onShowStory(supplier.id)}
                className="w-full px-4 py-3 bg-surface-2 text-primary font-bold border-2 border-border hover:bg-background hover:border-primary transition-all duration-200">
                READ FULL STORY
            </button>
             <button
                className="w-full px-4 py-3 bg-secondary text-black font-bold border-2 border-secondary/50 hover:bg-background hover:text-secondary hover:border-secondary transition-all duration-200 flex items-center justify-center gap-2">
                <MessageIcon /> CONTACT SUPPLIER
            </button>
        </div>

      </div>
    </Modal>
  );
};

export default SupplierProfileModal;
