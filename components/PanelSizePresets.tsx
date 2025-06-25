import React from 'react';
import { LayoutPanelLeft, LayoutPanelTop, SplitSquareHorizontal } from 'lucide-react';

interface PanelSizePresetsProps {
  onPresetSelect: (leftWidth: number) => void;
  currentLeftWidth: number;
  isVisible: boolean;
}

export const PanelSizePresets: React.FC<PanelSizePresetsProps> = ({
  onPresetSelect,
  currentLeftWidth,
  isVisible
}) => {
  if (!isVisible) return null;

  const presets = [
    { name: 'Foco Navegador', icon: LayoutPanelLeft, width: 60, description: 'Mais espaço para navegação' },
    { name: 'Balanceado', icon: SplitSquareHorizontal, width: 40, description: 'Visão equilibrada' },
    { name: 'Foco Detalhes', icon: LayoutPanelTop, width: 25, description: 'Mais espaço para detalhes' },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 min-w-64">
      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3">Presets de Layout</h3>
      <div className="space-y-2">
        {presets.map((preset) => {
          const isActive = Math.abs(currentLeftWidth - preset.width) < 2;
          const Icon = preset.icon;
          
          return (
            <button
              key={preset.name}
              onClick={() => onPresetSelect(preset.width)}
              className={`
                w-full flex items-center p-2 rounded-lg transition-colors text-left
                ${isActive 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              <Icon size={16} className="mr-3 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium">{preset.name}</div>
                <div className="text-xs opacity-70">{preset.description}</div>
              </div>
              <div className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                {preset.width}%
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <strong>Dica:</strong> Arraste a barra central para ajustar manualmente ou dê duplo clique para resetar.
        </div>
      </div>
    </div>
  );
}; 