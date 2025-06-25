import React from 'react';
import { Move3D } from 'lucide-react';

interface ResizeIndicatorProps {
  isVisible: boolean;
  leftWidth: number;
  rightWidth: number;
}

export const ResizeIndicator: React.FC<ResizeIndicatorProps> = ({
  isVisible,
  leftWidth,
  rightWidth,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="bg-gray-900 bg-opacity-90 text-white rounded-lg px-4 py-2 shadow-xl">
        <div className="flex items-center space-x-2">
          <Move3D size={16} />
          <span className="text-sm font-medium">
            {Math.round(leftWidth)}% | {Math.round(rightWidth)}%
          </span>
        </div>
      </div>
    </div>
  );
}; 