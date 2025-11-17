
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="border border-border bg-surface-1 overflow-hidden">
      <div className="bg-surface-2 aspect-w-4 aspect-h-3 animate-pulse"></div>
      <div className="p-4 border-t border-border">
        <div className="h-3 w-1/3 bg-surface-2 rounded mb-2 animate-pulse"></div>
        <div className="h-5 w-3/4 bg-surface-2 rounded mb-3 animate-pulse"></div>
        <div className="flex justify-between items-baseline">
          <div className="h-6 w-1/2 bg-surface-2 rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-surface-2 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
