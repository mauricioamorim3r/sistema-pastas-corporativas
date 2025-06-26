import React, { useState, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

export type SortField = 'name' | 'responsible' | 'category' | 'createdAt' | 'updatedAt' | 'size' | 'color' | 'tags';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
  secondary?: {
    field: SortField;
    direction: SortDirection;
  };
}

interface SortOption {
  field: SortField;
  label: string;
  icon: string;
  description: string;
}

interface FolderSortControlsProps {
  currentSort: SortConfig;
  onSortChange: (sortConfig: SortConfig) => void;
  className?: string;
  compact?: boolean;
}

const SORT_OPTIONS: SortOption[] = [
  {
    field: 'name',
    label: 'Nome',
    icon: '🔤',
    description: 'Ordenar por nome da pasta'
  },
  {
    field: 'responsible',
    label: 'Responsável',
    icon: '👤',
    description: 'Ordenar por responsável'
  },
  {
    field: 'category',
    label: 'Categoria',
    icon: '📁',
    description: 'Ordenar por categoria'
  },
  {
    field: 'createdAt',
    label: 'Data Criação',
    icon: '📅',
    description: 'Ordenar por data de criação'
  },
  {
    field: 'updatedAt',
    label: 'Modificado',
    icon: '🕐',
    description: 'Ordenar por última modificação'
  },
  {
    field: 'size',
    label: 'Tamanho',
    icon: '📊',
    description: 'Ordenar por número de subpastas'
  },
  {
    field: 'color',
    label: 'Cor',
    icon: '🎨',
    description: 'Ordenar por cor da pasta'
  },
  {
    field: 'tags',
    label: 'Tags',
    icon: '🏷️',
    description: 'Ordenar por número de tags'
  }
];

export const FolderSortControls: React.FC<FolderSortControlsProps> = ({
  currentSort,
  onSortChange,
  className = '',
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Salvar configuração de ordenação no localStorage
  useEffect(() => {
    localStorage.setItem('folder-sort-config', JSON.stringify(currentSort));
  }, [currentSort]);

  const handleFieldChange = (field: SortField) => {
    const newSort: SortConfig = {
      field,
      direction: currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc'
    };
    
    onSortChange(newSort);
  };

  const handleDirectionToggle = () => {
    const newSort: SortConfig = {
      ...currentSort,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
    };
    
    onSortChange(newSort);
  };

  const handleSecondarySort = (field: SortField) => {
    if (field === currentSort.field) return; // Não pode ser igual ao campo principal
    
    const newSort: SortConfig = {
      ...currentSort,
      secondary: {
        field,
        direction: 'asc'
      }
    };
    
    onSortChange(newSort);
  };

  const clearSecondarySort = () => {
    const newSort: SortConfig = {
      field: currentSort.field,
      direction: currentSort.direction
    };
    
    onSortChange(newSort);
  };

  const getCurrentSortOption = () => {
    return SORT_OPTIONS.find(option => option.field === currentSort.field);
  };

  const getSecondarySortOption = () => {
    if (!currentSort.secondary) return null;
    return SORT_OPTIONS.find(option => option.field === currentSort.secondary!.field);
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Modo compacto - apenas campo atual e direção */}
        <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
          <span className="text-lg mr-2">{getCurrentSortOption()?.icon}</span>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300 mr-2">
            {getCurrentSortOption()?.label}
          </span>
          <button
            onClick={handleDirectionToggle}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
            title={currentSort.direction === 'asc' ? 'Crescente → Decrescente' : 'Decrescente → Crescente'}
          >
            {currentSort.direction === 'asc' ? (
              <ChevronUpIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          ⚙️ Opções
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🔄</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Ordenação de Pastas
          </h3>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={isExpanded ? 'Recolher' : 'Expandir'}
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Campo principal atual */}
      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCurrentSortOption()?.icon}</span>
          <div>
            <div className="font-medium text-blue-800 dark:text-blue-200">
              {getCurrentSortOption()?.label}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {getCurrentSortOption()?.description}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleDirectionToggle}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-lg transition-colors"
        >
          {currentSort.direction === 'asc' ? (
            <>
              <ChevronUpIcon className="w-4 h-4" />
              <span className="text-sm font-medium">A→Z</span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Z→A</span>
            </>
          )}
        </button>
      </div>

      {/* Campo secundário (se existir) */}
      {currentSort.secondary && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-lg">↳</span>
            <span className="text-lg">{getSecondarySortOption()?.icon}</span>
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">
                Depois por: {getSecondarySortOption()?.label}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Ordenação secundária
              </div>
            </div>
          </div>
          
          <button
            onClick={clearSecondarySort}
            className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 rounded transition-colors"
          >
            ✕ Remover
          </button>
        </div>
      )}

      {/* Opções de ordenação */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Separador */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              🎯 Escolher Campo Principal
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.field}
                  onClick={() => handleFieldChange(option.field)}
                  className={`
                    p-3 rounded-lg text-left transition-all duration-200
                    ${currentSort.field === option.field
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ordenação secundária */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                🔗 Ordenação Secundária
              </h4>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showAdvanced ? 'Ocultar' : 'Mostrar opções'}
              </button>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS
                  .filter(option => option.field !== currentSort.field)
                  .map((option) => (
                  <button
                    key={`secondary-${option.field}`}
                    onClick={() => handleSecondarySort(option.field)}
                    className={`
                      p-2 rounded text-left transition-colors text-sm
                      ${currentSort.secondary?.field === option.field
                        ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Presets rápidos */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              ⚡ Presets Rápidos
            </h4>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSortChange({ field: 'name', direction: 'asc' })}
                className="px-3 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors"
              >
                📝 Alfabético A-Z
              </button>
              
              <button
                onClick={() => onSortChange({ field: 'updatedAt', direction: 'desc' })}
                className="px-3 py-2 text-sm bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-800/50 text-orange-700 dark:text-orange-300 rounded-lg transition-colors"
              >
                ⏰ Recente primeiro
              </button>
              
              <button
                onClick={() => onSortChange({ field: 'responsible', direction: 'asc', secondary: { field: 'name', direction: 'asc' } })}
                className="px-3 py-2 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-800/50 text-teal-700 dark:text-teal-300 rounded-lg transition-colors"
              >
                👥 Por responsável
              </button>
              
              <button
                onClick={() => onSortChange({ field: 'category', direction: 'asc', secondary: { field: 'name', direction: 'asc' } })}
                className="px-3 py-2 text-sm bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors"
              >
                📂 Por categoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderSortControls; 