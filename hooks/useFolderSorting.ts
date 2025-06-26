import { useState, useEffect, useMemo, useCallback } from 'react';
import { Folder } from '../types';
import { SortConfig, SortField, SortDirection } from '../components/FolderSortControls';

// Função auxiliar para extrair valor de ordenação
function getSortValue(folder: Folder, field: SortField): any {
  switch (field) {
    case 'name':
      return folder.name?.toLowerCase() || '';
    
    case 'responsible':
      return folder.responsible?.toLowerCase() || '';
    
    case 'createdAt':
      return new Date(folder.createdAt || '').getTime() || 0;
    
    case 'updatedAt':
      return new Date(folder.updatedAt || '').getTime() || 0;
    
    case 'size':
      // Calcular tamanho baseado no número de subpastas
      return folder.subFolders?.length || 0;
    
    case 'color':
      return folder.color || '';
    
    case 'tags':
      return folder.tags?.length || 0;
    
    default:
      return '';
  }
}

// Função de comparação para ordenação
function compareValues(a: any, b: any, direction: SortDirection): number {
  if (a === b) return 0;
  
  // Tratar valores nulos/undefined
  if (a == null && b == null) return 0;
  if (a == null) return direction === 'asc' ? -1 : 1;
  if (b == null) return direction === 'asc' ? 1 : -1;
  
  // Comparação numérica
  if (typeof a === 'number' && typeof b === 'number') {
    return direction === 'asc' ? a - b : b - a;
  }
  
  // Comparação de strings
  const aStr = String(a);
  const bStr = String(b);
  
  if (direction === 'asc') {
    return aStr.localeCompare(bStr, 'pt-BR', { numeric: true });
  } else {
    return bStr.localeCompare(aStr, 'pt-BR', { numeric: true });
  }
}

export function useFolderSorting(folders: Folder[]) {
  // Estado da configuração de ordenação
  const [sortConfig, setSortConfig] = useState<SortConfig>(() => {
    const saved = localStorage.getItem('folder-sort-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback para configuração padrão se JSON inválido
      }
    }
    
    return {
      field: 'name' as SortField,
      direction: 'asc' as SortDirection
    };
  });

  // Histórico de ordenações para undo/redo
  const [sortHistory, setSortHistory] = useState<SortConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Estatísticas de ordenação
  const [sortStats, setSortStats] = useState({
    totalSorts: 0,
    mostUsedField: 'name',
    lastSortTime: null as Date | null
  });

  // Salvar configuração quando muda
  useEffect(() => {
    localStorage.setItem('folder-sort-config', JSON.stringify(sortConfig));
    
    // Atualizar estatísticas
    setSortStats(prev => ({
      totalSorts: prev.totalSorts + 1,
      mostUsedField: sortConfig.field,
      lastSortTime: new Date()
    }));
    
  }, [sortConfig]);

  // Folders ordenados - usando useMemo para performance
  const sortedFolders = useMemo(() => {
    if (!folders || folders.length === 0) return [];
    
    console.log(`🔄 Aplicando ordenação: ${sortConfig.field} (${sortConfig.direction})`);
    
    const sorted = [...folders].sort((a, b) => {
      // Ordenação principal
      const aValue = getSortValue(a, sortConfig.field);
      const bValue = getSortValue(b, sortConfig.field);
      
      const primaryResult = compareValues(aValue, bValue, sortConfig.direction);
      
      // Se valores principais são iguais, usar ordenação secundária
      if (primaryResult === 0 && sortConfig.secondary) {
        const aSecondary = getSortValue(a, sortConfig.secondary.field);
        const bSecondary = getSortValue(b, sortConfig.secondary.field);
        
        return compareValues(aSecondary, bSecondary, sortConfig.secondary.direction);
      }
      
      return primaryResult;
    });
    
    console.log(`✅ Ordenação aplicada: ${sorted.length} pastas ordenadas`);
    return sorted;
  }, [folders, sortConfig]);

  // Função para alterar ordenação
  const updateSort = useCallback((newSortConfig: SortConfig) => {
    // Adicionar ao histórico se diferente da configuração atual
    if (JSON.stringify(newSortConfig) !== JSON.stringify(sortConfig)) {
      setSortHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(sortConfig);
        return newHistory.slice(-10); // Manter últimas 10 ordenações
      });
      setHistoryIndex(prev => Math.min(prev + 1, 9));
    }
    
    setSortConfig(newSortConfig);
  }, [sortConfig, historyIndex]);

  // Funções de undo/redo
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < sortHistory.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      const previousSort = sortHistory[historyIndex];
      setSortConfig(previousSort);
      setHistoryIndex(prev => prev - 1);
    }
  }, [canUndo, sortHistory, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      const nextSort = sortHistory[historyIndex + 1];
      setSortConfig(nextSort);
      setHistoryIndex(prev => prev + 1);
    }
  }, [canRedo, sortHistory, historyIndex]);

  // Função para ordenação rápida por campo
  const quickSort = useCallback((field: SortField, direction?: SortDirection) => {
    const newDirection = direction || (sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc');
    
    updateSort({
      field,
      direction: newDirection
    });
  }, [sortConfig, updateSort]);

  // Função para aplicar preset de ordenação
  const applyPreset = useCallback((preset: 'alphabetical' | 'recent' | 'responsibility' | 'size') => {
    let newConfig: SortConfig;
    
    switch (preset) {
      case 'alphabetical':
        newConfig = { field: 'name', direction: 'asc' };
        break;
      
      case 'recent':
        newConfig = { field: 'updatedAt', direction: 'desc' };
        break;
      
      case 'responsibility':
        newConfig = { 
          field: 'responsible', 
          direction: 'asc',
          secondary: { field: 'name', direction: 'asc' }
        };
        break;
      
      case 'size':
        newConfig = { 
          field: 'size', 
          direction: 'desc',
          secondary: { field: 'name', direction: 'asc' }
        };
        break;
      
      default:
        return;
    }
    
    updateSort(newConfig);
  }, [updateSort]);

  // Função para inverter direção atual
  const toggleDirection = useCallback(() => {
    updateSort({
      ...sortConfig,
      direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  }, [sortConfig, updateSort]);

  // Função para adicionar ordenação secundária
  const addSecondarySort = useCallback((field: SortField, direction: SortDirection = 'asc') => {
    if (field === sortConfig.field) return; // Não pode ser igual ao campo principal
    
    updateSort({
      ...sortConfig,
      secondary: { field, direction }
    });
  }, [sortConfig, updateSort]);

  // Função para remover ordenação secundária
  const removeSecondarySort = useCallback(() => {
    updateSort({
      field: sortConfig.field,
      direction: sortConfig.direction
    });
  }, [sortConfig, updateSort]);

  // Análise de performance da ordenação
  const getSortAnalysis = useCallback(() => {
    const analysis = {
      totalFolders: folders.length,
      sortField: sortConfig.field,
      sortDirection: sortConfig.direction,
      hasSecondarySort: !!sortConfig.secondary,
      uniqueValues: new Set(folders.map(f => getSortValue(f, sortConfig.field))).size,
      sortEfficiency: 0,
      recommendations: [] as string[]
    };
    
    // Calcular eficiência da ordenação
    analysis.sortEfficiency = (analysis.uniqueValues / Math.max(analysis.totalFolders, 1)) * 100;
    
    // Gerar recomendações
    if (analysis.sortEfficiency < 20) {
      analysis.recommendations.push('Considere adicionar ordenação secundária para melhor organização');
    }
    
    if (sortConfig.field === 'name' && analysis.totalFolders > 20) {
      analysis.recommendations.push('Para muitas pastas, considere ordenar por categoria ou responsável primeiro');
    }
    
    if (!sortConfig.secondary && analysis.totalFolders > 10) {
      analysis.recommendations.push('Ordenação secundária por nome melhoraria a organização');
    }
    
    return analysis;
  }, [folders, sortConfig]);

  // Função para resetar para ordenação padrão
  const resetToDefault = useCallback(() => {
    updateSort({
      field: 'name',
      direction: 'asc'
    });
  }, [updateSort]);

  // Função para obter estatísticas de uso
  const getUsageStats = useCallback(() => {
    const stats = localStorage.getItem('folder-sort-stats');
    return stats ? JSON.parse(stats) : sortStats;
  }, [sortStats]);

  // Função para exportar configuração de ordenação
  const exportSortConfig = useCallback(() => {
    return {
      config: sortConfig,
      history: sortHistory,
      stats: sortStats,
      analysis: getSortAnalysis(),
      timestamp: new Date().toISOString()
    };
  }, [sortConfig, sortHistory, sortStats, getSortAnalysis]);

  // Função para importar configuração de ordenação
  const importSortConfig = useCallback((importData: any) => {
    try {
      if (importData.config) {
        setSortConfig(importData.config);
      }
      if (importData.history) {
        setSortHistory(importData.history);
      }
      if (importData.stats) {
        setSortStats(importData.stats);
      }
      return true;
    } catch (error) {
      console.error('Erro ao importar configuração de ordenação:', error);
      return false;
    }
  }, []);

  return {
    // Estado principal
    sortConfig,
    sortedFolders,
    
    // Funções de controle
    updateSort,
    quickSort,
    applyPreset,
    toggleDirection,
    
    // Ordenação secundária
    addSecondarySort,
    removeSecondarySort,
    
    // Histórico
    canUndo,
    canRedo,
    undo,
    redo,
    sortHistory,
    
    // Utilitários
    resetToDefault,
    getSortAnalysis,
    getUsageStats,
    exportSortConfig,
    importSortConfig,
    
    // Estatísticas
    sortStats
  };
} 