
import React, { ReactNode } from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div 
        className="bg-dark-bg border-2 border-primary-lime text-light-gray w-full max-w-2xl shadow-brutalist-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-primary-lime">
          <h2 className="text-2xl font-bold text-primary-cyan">{title}</h2>
          <button onClick={onClose} className="text-primary-lime hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
