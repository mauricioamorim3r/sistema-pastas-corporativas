import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { Folder } from '../types';

export interface SearchFilters {
  query: string;
  responsible: string[];
  tags: string[];
  colors: string[];
  hasSubfolders: boolean | null;
  isFavorite: boolean | null;
}

export interface SearchResult extends Folder {
  _relevance: number;
  _matchedFields: string[];
}

interface SimpleSearchPanelProps {
  folders: Folder[];
  favorites: string[];
  onResults: (results: SearchResult[]) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  className?: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  responsible: [],
  tags: [],
  colors: [],
  hasSubfolders: null,
  isFavorite: null
};

export const SimpleSearchPanel: React.FC<SimpleSearchPanelProps> = ({
  folders,
  favorites,
  onResults,
  onFiltersChange,
  className = '',
  isExpanded,
  onToggleExpanded
}) => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    searchTime: 0,
    lastSearchQuery: ''
  });

  // Extrair valores únicos dos folders para filtros
  const uniqueValues = useMemo(() => {
    const responsibles = new Set<string>();
    const tags = new Set<string>();
    const colors = new Set<string>();

    folders.forEach(folder => {
      if (folder.responsible) responsibles.add(folder.responsible);
      if (folder.color) colors.add(folder.color);
      folder.tags?.forEach(tag => tags.add(tag));
    });

    return {
      responsibles: Array.from(responsibles).sort(),
      tags: Array.from(tags).sort(),
      colors: Array.from(colors).sort()
    };
  }, [folders]);

  // Função principal de busca
  const performSearch = useCallback(async () => {
    if (!filters.query && !hasActiveFilters()) {
      onResults([]);
      return;
    }

    setIsSearching(true);
    const startTime = performance.now();

    try {
      let results: SearchResult[] = folders.map(folder => ({
        ...folder,
        _relevance: 0,
        _matchedFields: []
      }));

      // Aplicar filtro de texto
      if (filters.query.trim()) {
        results = await searchByText(results, filters.query);
      }

      // Aplicar filtros específicos
      results = applyFilters(results);

      // Ordenar por relevância
      results.sort((a, b) => b._relevance - a._relevance);

      // Filtrar apenas resultados com relevância > 0 ou se há filtros ativos
      const filteredResults = results.filter(result => result._relevance > 0 || hasActiveFilters());

      const endTime = performance.now();
      const searchTime = endTime - startTime;

      setSearchStats({
        totalResults: filteredResults.length,
        searchTime: Math.round(searchTime),
        lastSearchQuery: filters.query
      });

      onResults(filteredResults);

    } catch (error) {
      console.error('Erro na busca:', error);
      onResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [filters, folders, onResults]);

  // Verificar se há filtros ativos além do texto
  const hasActiveFilters = useCallback(() => {
    return (
      filters.responsible.length > 0 ||
      filters.tags.length > 0 ||
      filters.colors.length > 0 ||
      filters.hasSubfolders !== null ||
      filters.isFavorite !== null
    );
  }, [filters]);

  // Busca por texto com diferentes pesos
  const searchByText = async (results: SearchResult[], query: string): Promise<SearchResult[]> => {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return results.map(folder => {
      let relevance = 0;
      const matchedFields: string[] = [];

      searchTerms.forEach(term => {
        // Busca no nome (peso 10)
        if (folder.name?.toLowerCase().includes(term)) {
          relevance += 10;
          matchedFields.push('name');
        }

        // Busca no responsável (peso 8)
        if (folder.responsible?.toLowerCase().includes(term)) {
          relevance += 8;
          matchedFields.push('responsible');
        }

        // Busca nas tags (peso 4)
        if (folder.tags?.some(tag => tag.toLowerCase().includes(term))) {
          relevance += 4;
          matchedFields.push('tags');
        }
      });

      return {
        ...folder,
        _relevance: relevance,
        _matchedFields: [...new Set(matchedFields)]
      };
    });
  };

  // Aplicar filtros específicos
  const applyFilters = (results: SearchResult[]): SearchResult[] => {
    return results.filter(folder => {
      // Filtro por responsável
      if (filters.responsible.length > 0 && !filters.responsible.includes(folder.responsible || '')) {
        return false;
      }

      // Filtro por tags
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => folder.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Filtro por ter subpastas
      if (filters.hasSubfolders !== null) {
        const hasSubfolders = (folder.subFolders?.length || 0) > 0;
        if (filters.hasSubfolders !== hasSubfolders) return false;
      }

      // Filtro por favorito
      if (filters.isFavorite !== null) {
        const isFavorite = favorites.includes(String(folder.id));
        if (filters.isFavorite !== isFavorite) return false;
      }

      return true;
    });
  };

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange?.(updated);
  }, [filters, onFiltersChange]);

  // Limpar filtros
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onFiltersChange?.(DEFAULT_FILTERS);
    onResults([]);
  };

  // Toggle de valores em arrays
  const toggleArrayValue = (array: string[], value: string): string[] => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  // Aplicar busca quando filtros mudam
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      {/* Header da busca */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              placeholder="Buscar pastas, responsáveis, tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {filters.query && (
              <button
                onClick={() => updateFilters({ query: '' })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button
            onClick={onToggleExpanded}
            className={`
              px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors
              ${hasActiveFilters() || isExpanded
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filtros</span>
            {hasActiveFilters() && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {Object.values(filters).filter(value => 
                  Array.isArray(value) ? value.length > 0 : value !== null && value !== ''
                ).length}
              </span>
            )}
          </button>
        </div>

        {/* Estatísticas da busca */}
        {(searchStats.totalResults > 0 || filters.query) && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>
                {isSearching ? 'Buscando...' : `${searchStats.totalResults} resultado(s) encontrado(s)`}
              </span>
              {searchStats.searchTime > 0 && (
                <span>em {searchStats.searchTime}ms</span>
              )}
            </div>
            
            {(filters.query || hasActiveFilters()) && (
              <button
                onClick={clearFilters}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Painel de filtros expandido */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            🔍 Filtros de Busca
          </h3>

          {/* Filtros por responsável */}
          {uniqueValues.responsibles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                👤 Responsáveis ({filters.responsible.length} selecionados)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded p-2">
                {uniqueValues.responsibles.map(responsible => (
                  <label key={responsible} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.responsible.includes(responsible)}
                      onChange={() => updateFilters({
                        responsible: toggleArrayValue(filters.responsible, responsible)
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {responsible}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Filtros por tags */}
          {uniqueValues.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🏷️ Tags ({filters.tags.length} selecionadas)
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded p-2">
                {uniqueValues.tags.map(tag => (
                  <label key={tag} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => updateFilters({
                        tags: toggleArrayValue(filters.tags, tag)
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Filtros especiais */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">⚡ Filtros Rápidos</h4>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filters.isFavorite === true}
                onChange={() => updateFilters({
                  isFavorite: filters.isFavorite === true ? null : true
                })}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                ⭐ Apenas favoritos
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filters.hasSubfolders === true}
                onChange={() => updateFilters({
                  hasSubfolders: filters.hasSubfolders === true ? null : true
                })}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                📁 Com subpastas
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSearchPanel; 