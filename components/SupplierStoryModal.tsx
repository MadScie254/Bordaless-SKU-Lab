
import React from 'react';
import { Supplier } from '../types';
import { MOCK_SUPPLIER_STORIES } from '../constants';
import { CloseIcon } from './icons';

interface SupplierStoryModalProps {
  supplier: Supplier;
  onClose: () => void;
}

const SupplierStoryModal: React.FC<SupplierStoryModalProps> = ({ supplier, onClose }) => {
  const story = MOCK_SUPPLIER_STORIES[supplier.id];

  if (!story) {
    return (
       <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
            <p className="text-primary">Story coming soon for {supplier.name}.</p>
       </div>
    );
  }

  return (
    <div 
        className="fixed inset-0 bg-background z-[100] animate-fade-in overflow-y-auto"
    >
        <button onClick={onClose} className="fixed top-4 right-4 z-20 text-white bg-black/50 p-2 rounded-full hover:opacity-80 transition-opacity">
            <CloseIcon className="h-8 w-8" />
        </button>

        <div className="relative h-[60vh] w-full">
            <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
                 <h1 className="text-4xl md:text-6xl font-bold text-primary">{story.title}</h1>
                 <p className="text-xl md:text-2xl text-text-muted mt-2">A Story from {supplier.name}</p>
            </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <p className="text-lg text-text-base leading-relaxed whitespace-pre-line">
                {story.content}
            </p>
        </div>
    </div>
  );
};

export default SupplierStoryModal;
