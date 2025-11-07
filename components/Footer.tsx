
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-bg border-t border-dark-gray mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-medium-gray">
        <p>&copy; {new Date().getFullYear()} BORDERLESS SKU LAB // A GODMODE_X INITIATIVE</p>
        <p className="text-xs mt-1">PLOWING LOCAL SUPPLY INTO GLOBAL REVENUE</p>
      </div>
    </footer>
  );
};

export default Footer;
