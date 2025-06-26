import { useState, useEffect } from 'react';
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

  const isFavorite = (folderId: string | number): boolean => {
    return favorites.some(fav => fav.originalFolderId === folderId);
  };

  const toggleFavorite = (folder: Folder) => {
    if (isFavorite(folder.id)) {
      const updatedFavorites = favorites.filter(fav => fav.originalFolderId !== folder.id);
      localStorage.setItem('favorite-folders', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } else {
      const newFavorite: FavoriteFolder = {
        id: `fav-${Date.now()}`,
        name: folder.name,
        path: folder.path,
        color: folder.color,
        textColor: folder.textColor,
        responsible: folder.responsible,
        addedAt: new Date().toLocaleDateString('pt-BR'),
        originalFolderId: folder.id,
        icon: folder.icon,
        iconType: folder.iconType
      };
      const updatedFavorites = [...favorites, newFavorite];
      localStorage.setItem('favorite-folders', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  return { favorites, isFavorite, toggleFavorite };
};

export type { FavoriteFolder }; 