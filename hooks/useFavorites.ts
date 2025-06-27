import { useState, useEffect, useCallback } from 'react';
import { Folder } from '../types';

interface FavoriteFolder {
  id: string;
  name: string;
  path?: string;
  color: string;
  textColor?: string;
  responsible?: string;
  addedAt: string;
  originalFolderId: string | number;
  icon?: string;
  iconType?: 'preset' | 'custom' | 'modern';
}

// Hook para usar favoritos em outros componentes
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteFolder[]>([]);

  // Carregar favoritos do localStorage de forma segura
  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorite-folders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      // Em caso de erro, limpar localStorage corrompido
      localStorage.removeItem('favorite-folders');
      setFavorites([]);
    }
  }, []);

  // Função recursiva para encontrar pasta por ID
  const findFolderById = useCallback((folders: Folder[], id: string | number): Folder | null => {
    if (!folders || !Array.isArray(folders)) return null;
    
    for (const folder of folders) {
      if (folder && folder.id === id) return folder;
      if (folder && folder.subFolders && Array.isArray(folder.subFolders)) {
        const found = findFolderById(folder.subFolders, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Verificar se uma pasta está nos favoritos
  const isFavorite = useCallback((folderId: string | number): boolean => {
    if (!folderId || !Array.isArray(favorites)) return false;
    return favorites.some(fav => fav && fav.originalFolderId === folderId);
  }, [favorites]);

  // Salvar favoritos no localStorage de forma segura
  const saveFavoritesToStorage = useCallback((favs: FavoriteFolder[]) => {
    try {
      if (Array.isArray(favs)) {
        localStorage.setItem('favorite-folders', JSON.stringify(favs));
        setFavorites(favs);
      }
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, []);

  // Adicionar/remover dos favoritos
  const toggleFavorite = useCallback((folder: Folder) => {
    if (!folder || !folder.id) return;

    try {
      if (isFavorite(folder.id)) {
        // Remover dos favoritos
        const updatedFavorites = favorites.filter(fav => fav && fav.originalFolderId !== folder.id);
        saveFavoritesToStorage(updatedFavorites);
      } else {
        // Adicionar aos favoritos
        const newFavorite: FavoriteFolder = {
          id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: folder.name || 'Pasta sem nome',
          path: folder.path,
          color: folder.color || 'bg-blue-500',
          textColor: folder.textColor,
          responsible: folder.responsible,
          addedAt: new Date().toLocaleDateString('pt-BR'),
          originalFolderId: folder.id,
          icon: folder.icon,
          iconType: folder.iconType
        };
        const updatedFavorites = [...favorites, newFavorite];
        saveFavoritesToStorage(updatedFavorites);
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
    }
  }, [favorites, isFavorite, saveFavoritesToStorage]);

  return { 
    favorites: favorites || [], 
    isFavorite, 
    toggleFavorite,
    findFolderById 
  };
};

export type { FavoriteFolder }; 