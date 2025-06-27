import { useState, useCallback, useMemo } from 'react';
import { Folder, SortCriteria, SortConfiguration, SortState, SortResult, SORT_CRITERIA_LABELS } from '../types';

// Estado padrão seguro
const DEFAULT_SORT_STATE: SortState = {
  globalSort: {
    criteria: SortCriteria.CUSTOM_MANUAL,
    direction: 'asc',
    preserveManualPositions: true,
    applyToSubfolders: false
  },
  levelSpecificSorts: {},
  lastManualChange: null,
  isCustomMode: true // Inicia em modo personalizado para não quebrar nada
};

/**
 * Hook para gerenciar ordenação de pastas de forma segura
 * Mantém compatibilidade total com drag & drop existente
 */
export const useFolderSorting = () => {
  const [sortState, setSortState] = useState<SortState>(() => {
    // Tenta carregar estado salvo, mas mantém padrão seguro se não encontrar
    try {
      const saved = localStorage.getItem('folder-sort-state');
      return saved ? { ...DEFAULT_SORT_STATE, ...JSON.parse(saved) } : DEFAULT_SORT_STATE;
    } catch {
      return DEFAULT_SORT_STATE;
    }
  });

  // Função para salvar estado com segurança
  const saveSortState = useCallback((newState: SortState) => {
    try {
      localStorage.setItem('folder-sort-state', JSON.stringify(newState));
    } catch (error) {
      console.warn('Não foi possível salvar estado de ordenação:', error);
    }
  }, []);

  // Função para aplicar critério de ordenação específico
  const applySortCriteria = useCallback((folders: Folder[], criteria: SortCriteria, direction: 'asc' | 'desc' = 'asc'): Folder[] => {
    if (!folders || folders.length === 0) return folders;
    
    // Se for modo personalizado, não ordena (mantém ordem atual)
    if (criteria === SortCriteria.CUSTOM_MANUAL) {
      return [...folders];
    }

    const sortedFolders = [...folders];

    switch (criteria) {
      case SortCriteria.ALPHABETICAL_ASC:
      case SortCriteria.ALPHABETICAL_DESC:
        sortedFolders.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
          return direction === 'desc' ? -comparison : comparison;
        });
        break;

      case SortCriteria.RESPONSIBLE_ASC:
      case SortCriteria.RESPONSIBLE_DESC:
        sortedFolders.sort((a, b) => {
          const responsibleA = a.responsible || '';
          const responsibleB = b.responsible || '';
          const comparison = responsibleA.localeCompare(responsibleB, 'pt-BR', { sensitivity: 'base' });
          return direction === 'desc' ? -comparison : comparison;
        });
        break;

      case SortCriteria.COLOR_GROUPED:
        sortedFolders.sort((a, b) => {
          const colorA = a.color || '';
          const colorB = b.color || '';
          return colorA.localeCompare(colorB);
        });
        break;

      case SortCriteria.TYPE_FOLDERS_FIRST:
        sortedFolders.sort((a, b) => {
          const hasSubA = (a.subFolders && a.subFolders.length > 0) ? 1 : 0;
          const hasSubB = (b.subFolders && b.subFolders.length > 0) ? 1 : 0;
          return hasSubB - hasSubA; // Pastas com subpastas primeiro
        });
        break;

      // Critérios mais avançados podem ser implementados depois
      case SortCriteria.DATE_CREATED_ASC:
      case SortCriteria.DATE_CREATED_DESC:
      case SortCriteria.FREQUENTLY_USED:
        // Por enquanto, ordena alfabeticamente como fallback
        sortedFolders.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
        break;

      default:
        break;
    }

    return sortedFolders;
  }, []);

  // Função para aplicar ordenação recursivamente mantendo estrutura
  const applySortToTree = useCallback((folders: Folder[], config: SortConfiguration): SortResult => {
    const processLevel = (levelFolders: Folder[]): Folder[] => {
      // Aplica ordenação no nível atual
      const sortedLevel = applySortCriteria(levelFolders, config.criteria, config.direction);
      
      // Se deve aplicar a subpastas também
      if (config.applyToSubfolders) {
        return sortedLevel.map(folder => {
          if (folder.subFolders && folder.subFolders.length > 0) {
            return {
              ...folder,
              subFolders: processLevel(folder.subFolders)
            };
          }
          return folder;
        });
      } else {
        return sortedLevel;
      }
    };

    const sortedFolders = processLevel(folders);
    
    return {
      sortedFolders,
      appliedCriteria: config.criteria,
      hadManualChanges: config.criteria === SortCriteria.CUSTOM_MANUAL,
      preservedPositions: []
    };
  }, [applySortCriteria]);

  // Função principal para ordenar pastas
  const sortFolders = useCallback((folders: Folder[], newCriteria?: SortCriteria): SortResult => {
    if (!folders || folders.length === 0) {
      return {
        sortedFolders: [],
        appliedCriteria: sortState.globalSort.criteria,
        hadManualChanges: false,
        preservedPositions: []
      };
    }

    const criteriaToUse = newCriteria || sortState.globalSort.criteria;
    
    const config: SortConfiguration = {
      ...sortState.globalSort,
      criteria: criteriaToUse
    };

    return applySortToTree(folders, config);
  }, [sortState.globalSort, applySortToTree]);

  // Função para alterar critério de ordenação
  const changeSortCriteria = useCallback((newCriteria: SortCriteria, applyToSubfolders: boolean = false) => {
    const newSortState: SortState = {
      ...sortState,
      globalSort: {
        ...sortState.globalSort,
        criteria: newCriteria,
        applyToSubfolders
      },
      isCustomMode: newCriteria === SortCriteria.CUSTOM_MANUAL
    };

    setSortState(newSortState);
    saveSortState(newSortState);
  }, [sortState, saveSortState]);

  // Função para marcar que houve mudança manual (drag & drop)
  const markManualChange = useCallback((folderId: string | number) => {
    const newSortState: SortState = {
      ...sortState,
      lastManualChange: String(folderId),
      isCustomMode: true,
      globalSort: {
        ...sortState.globalSort,
        criteria: SortCriteria.CUSTOM_MANUAL
      }
    };

    setSortState(newSortState);
    saveSortState(newSortState);
  }, [sortState, saveSortState]);

  // Função para resetar para ordenação automática
  const resetToAutoSort = useCallback((criteria: SortCriteria = SortCriteria.ALPHABETICAL_ASC) => {
    const newSortState: SortState = {
      ...sortState,
      globalSort: {
        ...sortState.globalSort,
        criteria
      },
      lastManualChange: null,
      isCustomMode: false
    };

    setSortState(newSortState);
    saveSortState(newSortState);
  }, [sortState, saveSortState]);

  // Memoize valores computados
  const currentCriteria = useMemo(() => sortState.globalSort.criteria, [sortState.globalSort.criteria]);
  const currentCriteriaLabel = useMemo(() => SORT_CRITERIA_LABELS[currentCriteria], [currentCriteria]);
  const isInCustomMode = useMemo(() => sortState.isCustomMode, [sortState.isCustomMode]);
  const canApplyAutoSort = useMemo(() => currentCriteria !== SortCriteria.CUSTOM_MANUAL, [currentCriteria]);

  // Lista de critérios disponíveis (pode ser filtrada conforme necessário)
  const availableCriteria = useMemo(() => [
    SortCriteria.CUSTOM_MANUAL,
    SortCriteria.ALPHABETICAL_ASC,
    SortCriteria.ALPHABETICAL_DESC,
    SortCriteria.RESPONSIBLE_ASC,
    SortCriteria.RESPONSIBLE_DESC,
    SortCriteria.COLOR_GROUPED,
    SortCriteria.TYPE_FOLDERS_FIRST
  ], []);

  return {
    // Estado atual
    currentCriteria,
    currentCriteriaLabel,
    isInCustomMode,
    canApplyAutoSort,
    availableCriteria,
    
    // Funções principais
    sortFolders,
    changeSortCriteria,
    markManualChange,
    resetToAutoSort,
    
    // Estado completo para casos avançados
    sortState,
    setSortState: (newState: SortState) => {
      setSortState(newState);
      saveSortState(newState);
    }
  };
}; 