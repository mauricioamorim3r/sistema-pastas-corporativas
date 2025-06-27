import React, { useState } from 'react';
import { ChevronDown, ArrowUpDown, RefreshCw, Wand2, Info } from 'lucide-react';
import { SortCriteria, SORT_CRITERIA_LABELS } from '../types';

interface FolderSortControlsProps {
  currentCriteria: SortCriteria;
  currentCriteriaLabel: string;
  isInCustomMode: boolean;
  canApplyAutoSort: boolean;
  availableCriteria: SortCriteria[];
  onChangeCriteria: (criteria: SortCriteria, applyToSubfolders: boolean) => void;
  onResetToAutoSort: (criteria?: SortCriteria) => void;
  className?: string;
  disabled?: boolean;
}

export const FolderSortControls: React.FC<FolderSortControlsProps> = ({
  currentCriteria,
  currentCriteriaLabel,
  isInCustomMode,
  canApplyAutoSort,
  availableCriteria,
  onChangeCriteria,
  onResetToAutoSort,
  className = '',
  disabled = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSubfolderOption, setShowSubfolderOption] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<SortCriteria | null>(null);

  // Função para aplicar critério selecionado
  const handleApplyCriteria = (criteria: SortCriteria, applyToSubfolders: boolean = false) => {
    onChangeCriteria(criteria, applyToSubfolders);
    setIsDropdownOpen(false);
    setShowSubfolderOption(false);
    setSelectedCriteria(null);
  };

  // Função para mostrar opção de subpastas
  const handleCriteriaSelect = (criteria: SortCriteria) => {
    if (criteria === SortCriteria.CUSTOM_MANUAL) {
      handleApplyCriteria(criteria);
      return;
    }

    setSelectedCriteria(criteria);
    setShowSubfolderOption(true);
  };

  // Ícone baseado no modo atual
  const getCurrentIcon = () => {
    if (isInCustomMode) {
      return <Wand2 size={16} className="text-purple-600 dark:text-purple-400" />;
    } else if (canApplyAutoSort) {
      return <ArrowUpDown size={16} className="text-blue-600 dark:text-blue-400" />;
    } else {
      return <ArrowUpDown size={16} className="text-gray-500" />;
    }
  };

  // Cor do badge baseado no modo
  const getBadgeColor = () => {
    if (isInCustomMode) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    } else if (canApplyAutoSort) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    } else {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botão Principal de Ordenação */}
      <div className="flex items-center space-x-2">
        {/* Dropdown de Critérios */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className={`
              flex items-center space-x-2 px-3 py-2 text-sm font-medium 
              bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
              rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isDropdownOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
            `}
            title={`Ordenação atual: ${currentCriteriaLabel}`}
          >
            {getCurrentIcon()}
            <span className="hidden sm:inline">{currentCriteriaLabel}</span>
            <span className="sm:hidden">Ordenar</span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown de Opções */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 mb-2">
                  Critérios de Ordenação
                </div>
                
                {availableCriteria.map((criteria) => (
                  <button
                    key={criteria}
                    onClick={() => handleCriteriaSelect(criteria)}
                    className={`
                      w-full text-left px-3 py-2 text-sm rounded-md
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-150
                      ${currentCriteria === criteria 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{SORT_CRITERIA_LABELS[criteria]}</span>
                      {currentCriteria === criteria && (
                        <div className={`w-2 h-2 rounded-full ${isInCustomMode ? 'bg-purple-500' : 'bg-blue-500'}`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Badge de Status */}
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor()}`}>
          {isInCustomMode ? 'Manual' : 'Auto'}
        </div>

        {/* Botão de Reset (apenas se estiver em modo personalizado) */}
        {isInCustomMode && (
          <button
            onClick={() => onResetToAutoSort(SortCriteria.ALPHABETICAL_ASC)}
            disabled={disabled}
            className="
              p-2 text-gray-500 dark:text-gray-400 
              hover:text-blue-600 dark:hover:text-blue-400 
              hover:bg-gray-100 dark:hover:bg-gray-700 
              rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            title="Resetar para ordenação alfabética"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </div>

      {/* Modal de Confirmação para Subpastas */}
      {showSubfolderOption && selectedCriteria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Info size={24} className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Aplicar Ordenação
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Deseja aplicar "{SORT_CRITERIA_LABELS[selectedCriteria]}" também às subpastas?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleApplyCriteria(selectedCriteria, false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Apenas Nível Atual
              </button>
              <button
                onClick={() => handleApplyCriteria(selectedCriteria, true)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Incluir Subpastas
              </button>
            </div>
            
            <button
              onClick={() => {
                setShowSubfolderOption(false);
                setSelectedCriteria(null);
                setIsDropdownOpen(false);
              }}
              className="mt-3 w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Overlay para fechar dropdown */}
      {(isDropdownOpen || showSubfolderOption) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsDropdownOpen(false);
            setShowSubfolderOption(false);
            setSelectedCriteria(null);
          }}
        />
      )}
    </div>
  );
};
