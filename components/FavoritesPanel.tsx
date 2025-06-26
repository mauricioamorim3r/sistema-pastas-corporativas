import React, { useState, useEffect } from 'react';
import { Star, Search, X } from 'lucide-react';
import { Folder } from '../types';
import { IconRenderer } from '../utils/iconUtils';
import { FavoriteFolder } from '../hooks/useFavorites';

interface FavoritesPanelProps {
  isVisible: boolean;
  onClose: () => void;
  allFolders: Folder[];
  onSelectFolder: (folder: Folder) => void;
  selectedFolder: Folder | null;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  isVisible,
  onClose,
  allFolders,
  onSelectFolder,
  selectedFolder
}) => {
  const [favorites, setFavorites] = useState<FavoriteFolder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Carregar favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favorite-folders');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  }, []);

  // Salvar favoritos no localStorage
  const saveFavoritesToStorage = (favs: FavoriteFolder[]) => {
    localStorage.setItem('favorite-folders', JSON.stringify(favs));
    setFavorites(favs);
  };

  // Função recursiva para encontrar pasta por ID
  const findFolderById = (folders: Folder[], id: string | number): Folder | null => {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      if (folder.subFolders) {
        const found = findFolderById(folder.subFolders, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Verificar se uma pasta está nos favoritos
  const isFavorite = (folderId: string | number): boolean => {
    return favorites.some(fav => fav.originalFolderId === folderId);
  };

  // Adicionar/remover dos favoritos
  const toggleFavorite = (folder: Folder) => {
    if (isFavorite(folder.id)) {
      // Remover dos favoritos
      const updatedFavorites = favorites.filter(fav => fav.originalFolderId !== folder.id);
      saveFavoritesToStorage(updatedFavorites);
    } else {
      // Adicionar aos favoritos
      const newFavorite: FavoriteFolder = {
        id: `fav-${Date.now()}`,
        name: folder.name,
        path: folder.path,
        color: folder.color,
        textColor: folder.textColor,
        responsible: folder.responsible,
        addedAt: new Date().toLocaleDateString('pt-BR'),
        originalFolderId: folder.id
      };
      saveFavoritesToStorage([...favorites, newFavorite]);
    }
  };

  // Filtrar favoritos com base na busca
  const filteredFavorites = favorites.filter(fav =>
    fav.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (fav.responsible && fav.responsible.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (fav.path && fav.path.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Selecionar pasta favorita
  const handleSelectFavorite = (favorite: FavoriteFolder) => {
    const originalFolder = findFolderById(allFolders, favorite.originalFolderId);
    if (originalFolder) {
      onSelectFolder(originalFolder);
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Favoritos</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Busca */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar favoritos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Lista de Favoritos */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchQuery ? (
              <>
                <Search size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum favorito encontrado</p>
                <p className="text-xs">Tente termos diferentes</p>
              </>
            ) : (
              <>
                <Star size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum favorito salvo</p>
                <p className="text-xs">Clique na estrela ao lado das pastas para adicioná-las aos favoritos</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFavorites.map((favorite) => {
              const originalFolder = findFolderById(allFolders, favorite.originalFolderId);
              const isCurrentlySelected = selectedFolder?.id === favorite.originalFolderId;
              
              return (
                <div
                  key={favorite.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isCurrentlySelected
                      ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleSelectFavorite(favorite)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div 
                        className={`w-8 h-8 rounded-lg ${favorite.color} ${favorite.textColor || 'text-white'} flex items-center justify-center flex-shrink-0`}
                      >
                        <IconRenderer 
                          iconId={favorite.icon || originalFolder?.icon || 'folder'}
                          iconType={favorite.iconType || originalFolder?.iconType || 'preset'}
                          size={20}
                        />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">
                          {favorite.name}
                        </div>
                        {favorite.responsible && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {favorite.responsible}
                          </div>
                        )}
                        {favorite.path && (
                          <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                            {favorite.path}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {!originalFolder && (
                        <span 
                          className="text-xs text-red-500 dark:text-red-400"
                          title="Pasta original não encontrada"
                        >
                          ⚠️
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (originalFolder) {
                            toggleFavorite(originalFolder);
                          } else {
                            // Remover favorito órfão
                            const updatedFavorites = favorites.filter(fav => fav.id !== favorite.id);
                            saveFavoritesToStorage(updatedFavorites);
                          }
                        }}
                        className="p-1 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded transition-colors"
                        title="Remover dos favoritos"
                      >
                        <Star size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Adicionado em {favorite.addedAt}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer com estatísticas */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {favorites.length} pasta(s) nos favoritos
          {searchQuery && ` • ${filteredFavorites.length} encontrada(s)`}
        </div>
      </div>
    </div>
  );
}; 