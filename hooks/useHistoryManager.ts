import { useState, useCallback, useRef } from 'react';
import { Folder } from '../types';
import { captureError } from '../sentry';

interface HistoryAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE' | 'IMPORT' | 'BATCH';
  timestamp: number;
  description: string;
  data: {
    before: any;
    after: any;
    targetId?: string | number;
    parentId?: string | number;
  };
}

interface HistoryState {
  past: HistoryAction[];
  present: Folder[];
  future: HistoryAction[];
}

interface UseHistoryManagerReturn {
  // Estado
  folders: Folder[];
  canUndo: boolean;
  canRedo: boolean;
  history: HistoryAction[];
  
  // Ações
  setFolders: (folders: Folder[]) => void;
  undo: () => void;
  redo: () => void;
  addAction: (action: Omit<HistoryAction, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  
  // Ações específicas com histórico automático
  createFolder: (folder: Folder, parentId?: string | number) => void;
  updateFolder: (folder: Folder) => void;
  deleteFolder: (folderId: string | number) => void;
  moveFolder: (folderId: string | number, newParentId?: string | number) => void;
  importFolders: (importedFolders: Folder[]) => void;
}

const MAX_HISTORY_SIZE = 50;

export const useHistoryManager = (initialFolders: Folder[] = []): UseHistoryManagerReturn => {
  const [historyState, setHistoryState] = useState<HistoryState>({
    past: [],
    present: initialFolders,
    future: []
  });

  const actionIdRef = useRef(0);

  // Função para gerar ID único da ação
  const generateActionId = () => `action-${++actionIdRef.current}-${Date.now()}`;

  // Função recursiva para clonar profundamente folders
  const deepCloneFolders = (folders: Folder[]): Folder[] => {
    return folders.map(folder => ({
      ...folder,
      subFolders: folder.subFolders ? deepCloneFolders(folder.subFolders) : []
    }));
  };

  // Função para encontrar pasta por ID
  const findFolderById = (folders: Folder[], id: string | number): { folder: Folder; parent?: Folder; index: number } | null => {
    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];
      if (folder.id === id) {
        return { folder, index: i };
      }
      if (folder.subFolders) {
        const found = findFolderById(folder.subFolders, id);
        if (found) {
          return { ...found, parent: folder };
        }
      }
    }
    return null;
  };

  // Função para adicionar ação ao histórico
  const addAction = useCallback((action: Omit<HistoryAction, 'id' | 'timestamp'>) => {
    const newAction: HistoryAction = {
      ...action,
      id: generateActionId(),
      timestamp: Date.now()
    };

    setHistoryState(prevState => {
      const newPast = [...prevState.past, newAction];
      
      // Limitar tamanho do histórico
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: prevState.present,
        future: [] // Limpar futuro quando nova ação é adicionada
      };
    });
  }, []);

  // Função para reverter ação
  const revertAction = (action: HistoryAction, folders: Folder[]): Folder[] => {
    try {
      switch (action.type) {
        case 'CREATE':
          // Remover pasta criada
          return removeFolderFromTree(folders, action.data.targetId!);
        
        case 'DELETE':
          // Restaurar pasta deletada
          return restoreFolderToTree(folders, action.data.before, action.data.parentId);
        
        case 'UPDATE':
          // Restaurar estado anterior
          return updateFolderInTree(folders, action.data.before);
        
        case 'MOVE':
          // Mover pasta de volta para posição original
          return moveFolderInTree(folders, action.data.targetId!, action.data.before.parentId);
        
        case 'IMPORT':
          // Remover pastas importadas
          const importedIds = action.data.after.map((f: Folder) => f.id);
          return folders.filter(f => !importedIds.includes(f.id));
        
        case 'BATCH':
          // Reverter ações em lote (implementação complexa)
          return action.data.before;
        
        default:
          return folders;
      }
    } catch (error) {
      captureError(error as Error, { 
        context: 'revertAction', 
        actionType: action.type, 
        actionId: action.id 
      });
      return folders; // Retorna estado atual se houver erro
    }
  };

  // Função para aplicar ação
  const applyAction = (action: HistoryAction, folders: Folder[]): Folder[] => {
    switch (action.type) {
      case 'CREATE':
        return restoreFolderToTree(folders, action.data.after, action.data.parentId);
      
      case 'DELETE':
        return removeFolderFromTree(folders, action.data.targetId!);
      
      case 'UPDATE':
        return updateFolderInTree(folders, action.data.after);
      
      case 'MOVE':
        return moveFolderInTree(folders, action.data.targetId!, action.data.after.parentId);
      
      case 'IMPORT':
        return [...folders, ...action.data.after];
      
      case 'BATCH':
        return action.data.after;
      
      default:
        return folders;
    }
  };

  // Funções auxiliares para manipulação da árvore
  const removeFolderFromTree = (folders: Folder[], folderId: string | number): Folder[] => {
    return folders.filter(folder => {
      if (folder.id === folderId) {
        return false;
      }
      if (folder.subFolders) {
        folder.subFolders = removeFolderFromTree(folder.subFolders, folderId);
      }
      return true;
    });
  };

  const restoreFolderToTree = (folders: Folder[], folder: Folder, parentId?: string | number): Folder[] => {
    if (!parentId) {
      return [...folders, folder];
    }

    return folders.map(f => {
      if (f.id === parentId) {
        return {
          ...f,
          subFolders: [...(f.subFolders || []), folder]
        };
      }
      if (f.subFolders) {
        return {
          ...f,
          subFolders: restoreFolderToTree(f.subFolders, folder, parentId)
        };
      }
      return f;
    });
  };

  const updateFolderInTree = (folders: Folder[], updatedFolder: Folder): Folder[] => {
    return folders.map(folder => {
      if (folder.id === updatedFolder.id) {
        return updatedFolder;
      }
      if (folder.subFolders) {
        return {
          ...folder,
          subFolders: updateFolderInTree(folder.subFolders, updatedFolder)
        };
      }
      return folder;
    });
  };

  const moveFolderInTree = (folders: Folder[], folderId: string | number, newParentId?: string | number): Folder[] => {
    const found = findFolderById(folders, folderId);
    if (!found) return folders;

    // Remover da posição atual
    let newFolders = removeFolderFromTree(folders, folderId);
    
    // Adicionar na nova posição
    newFolders = restoreFolderToTree(newFolders, found.folder, newParentId);
    
    return newFolders;
  };

  // Ações principais
  const undo = useCallback(() => {
    setHistoryState(prevState => {
      if (prevState.past.length === 0) return prevState;

      const lastAction = prevState.past[prevState.past.length - 1];
      const newPresent = revertAction(lastAction, prevState.present);

      return {
        past: prevState.past.slice(0, -1),
        present: newPresent,
        future: [lastAction, ...prevState.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistoryState(prevState => {
      if (prevState.future.length === 0) return prevState;

      const nextAction = prevState.future[0];
      const newPresent = applyAction(nextAction, prevState.present);

      return {
        past: [...prevState.past, nextAction],
        present: newPresent,
        future: prevState.future.slice(1)
      };
    });
  }, []);

  const setFolders = useCallback((folders: Folder[]) => {
    setHistoryState(prevState => ({
      ...prevState,
      present: folders
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState(prevState => ({
      past: [],
      present: prevState.present,
      future: []
    }));
  }, []);

  // Ações específicas com histórico automático
  const createFolder = useCallback((folder: Folder, parentId?: string | number) => {
    const newFolders = restoreFolderToTree(historyState.present, folder, parentId);
    
    addAction({
      type: 'CREATE',
      description: `Pasta "${folder.name}" criada`,
      data: {
        before: null,
        after: folder,
        targetId: folder.id,
        parentId
      }
    });

    setHistoryState(prevState => ({
      ...prevState,
      present: newFolders
    }));
  }, [historyState.present, addAction]);

  const updateFolder = useCallback((folder: Folder) => {
    const found = findFolderById(historyState.present, folder.id);
    if (!found) return;

    const newFolders = updateFolderInTree(historyState.present, folder);
    
    addAction({
      type: 'UPDATE',
      description: `Pasta "${folder.name}" atualizada`,
      data: {
        before: found.folder,
        after: folder,
        targetId: folder.id
      }
    });

    setHistoryState(prevState => ({
      ...prevState,
      present: newFolders
    }));
  }, [historyState.present, addAction]);

  const deleteFolder = useCallback((folderId: string | number) => {
    const found = findFolderById(historyState.present, folderId);
    if (!found) return;

    const newFolders = removeFolderFromTree(historyState.present, folderId);
    
    addAction({
      type: 'DELETE',
      description: `Pasta "${found.folder.name}" excluída`,
      data: {
        before: found.folder,
        after: null,
        targetId: folderId,
        parentId: found.parent?.id
      }
    });

    setHistoryState(prevState => ({
      ...prevState,
      present: newFolders
    }));
  }, [historyState.present, addAction]);

  const moveFolder = useCallback((folderId: string | number, newParentId?: string | number) => {
    const found = findFolderById(historyState.present, folderId);
    if (!found) return;

    const newFolders = moveFolderInTree(historyState.present, folderId, newParentId);
    
    addAction({
      type: 'MOVE',
      description: `Pasta "${found.folder.name}" movida`,
      data: {
        before: { parentId: found.parent?.id },
        after: { parentId: newParentId },
        targetId: folderId
      }
    });

    setHistoryState(prevState => ({
      ...prevState,
      present: newFolders
    }));
  }, [historyState.present, addAction]);

  const importFolders = useCallback((importedFolders: Folder[]) => {
    const newFolders = [...historyState.present, ...importedFolders];
    
    addAction({
      type: 'IMPORT',
      description: `${importedFolders.length} pasta(s) importada(s)`,
      data: {
        before: historyState.present,
        after: importedFolders
      }
    });

    setHistoryState(prevState => ({
      ...prevState,
      present: newFolders
    }));
  }, [historyState.present, addAction]);

  return {
    folders: historyState.present,
    canUndo: historyState.past.length > 0,
    canRedo: historyState.future.length > 0,
    history: historyState.past,
    setFolders,
    undo,
    redo,
    addAction,
    clearHistory,
    createFolder,
    updateFolder,
    deleteFolder,
    moveFolder,
    importFolders
  };
}; 