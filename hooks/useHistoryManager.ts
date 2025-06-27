import React from 'react';
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
    insertPosition?: { type: 'before' | 'after', targetId: string | number };
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
  moveFolder: (folderId: string | number, newParentId?: string | number | null, insertPosition?: { type: 'before' | 'after', targetId: string | number }) => void;
  importFolders: (importedFolders: Folder[]) => void;
  saveCurrentLayout: (layoutName: string) => Promise<boolean>;
}

const MAX_HISTORY_SIZE = 50;

export const useHistoryManager = (initialFolders: Folder[] = []): UseHistoryManagerReturn => {
  // Verificação de segurança para React
  if (!React || !React.useState) {
    console.error('❌ React não está disponível ou useState é null');
    throw new Error('React hooks não estão disponíveis');
  }

  const [historyState, setHistoryState] = React.useState<HistoryState>(() => {
    try {
      return {
        past: [],
        present: Array.isArray(initialFolders) ? initialFolders : [],
        future: []
      };
    } catch (error) {
      console.error('❌ Erro ao inicializar estado do histórico:', error);
      return {
        past: [],
        present: [],
        future: []
      };
    }
  });

  const actionIdRef = React.useRef(0);

  // Função para gerar ID único da ação
  const generateActionId = React.useCallback(() => {
    try {
      return `action-${++actionIdRef.current}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    } catch (error) {
      console.error('❌ Erro ao gerar ID da ação:', error);
      return `action-fallback-${Date.now()}`;
    }
  }, []);

  // Função recursiva para clonar profundamente folders
  const deepCloneFolders = React.useCallback((folders: Folder[]): Folder[] => {
    try {
      if (!Array.isArray(folders)) {
        console.warn('⚠️ deepCloneFolders: entrada não é array:', folders);
        return [];
      }
      
      return folders.map(folder => ({
        ...folder,
        subFolders: folder.subFolders ? deepCloneFolders(folder.subFolders) : []
      }));
    } catch (error) {
      console.error('❌ Erro ao clonar pastas:', error);
      captureError(error as Error, { context: 'deepCloneFolders' });
      return [];
    }
  }, []);

  // Função para encontrar pasta por ID
  const findFolderById = React.useCallback((folders: Folder[], id: string | number): { folder: Folder; parent?: Folder; index: number } | null => {
    try {
      if (!Array.isArray(folders) || (!id && id !== 0)) {
        return null;
      }

      for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        if (folder && folder.id === id) {
          return { folder, index: i };
        }
        if (folder && folder.subFolders) {
          const found = findFolderById(folder.subFolders, id);
          if (found) {
            return { ...found, parent: folder };
          }
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar pasta por ID:', error);
      captureError(error as Error, { context: 'findFolderById', folderId: id });
      return null;
    }
  }, []);

  // Função para adicionar ação ao histórico
  const addAction = React.useCallback((action: Omit<HistoryAction, 'id' | 'timestamp'>) => {
    try {
      const newAction: HistoryAction = {
        ...action,
        id: generateActionId(),
        timestamp: Date.now()
      };

      setHistoryState(prevState => {
        try {
          const newPast = [...(prevState.past || []), newAction];
          
          // Limitar tamanho do histórico
          if (newPast.length > MAX_HISTORY_SIZE) {
            newPast.shift();
          }

          return {
            past: newPast,
            present: prevState.present || [],
            future: [] // Limpar futuro quando nova ação é adicionada
          };
        } catch (error) {
          console.error('❌ Erro ao atualizar estado do histórico:', error);
          return prevState;
        }
      });
    } catch (error) {
      console.error('❌ Erro ao adicionar ação ao histórico:', error);
      captureError(error as Error, { context: 'addAction', actionType: action.type });
    }
  }, [generateActionId]);

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
          return moveFolderInTree(folders, action.data.targetId!, action.data.before.parentId, action.data.before.insertPosition);
        
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
        return moveFolderInTree(folders, action.data.targetId!, action.data.after.parentId, action.data.after.insertPosition);
      
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
    console.log('🗑️ removeFolderFromTree chamado para pasta:', folderId);
    
    const result: Folder[] = [];
    
    for (const folder of folders) {
      if (folder.id === folderId) {
        console.log('🗑️ Removendo pasta:', folder.name);
        // Não adiciona esta pasta ao resultado (efetivamente removendo)
        continue;
      }
      
      // Para outras pastas, processa subpastas se existirem
      if (folder.subFolders && folder.subFolders.length > 0) {
        const updatedSubFolders = removeFolderFromTree(folder.subFolders, folderId);
        if (updatedSubFolders.length !== folder.subFolders.length) {
          console.log('🗑️ Pasta removida de subpastas de:', folder.name);
        }
        result.push({
          ...folder,
          subFolders: updatedSubFolders
        });
      } else {
        result.push(folder);
      }
    }
    
    return result;
  };

  const restoreFolderToTree = (folders: Folder[], folder: Folder, parentId?: string | number | null): Folder[] => {
    console.log('🔄 restoreFolderToTree chamado:', { folder: folder.name, parentId });
    
    if (!parentId) {
      console.log('🏠 Adicionando pasta ao nível raiz');
      return [...folders, folder];
    }

    console.log('📁 Procurando pasta pai:', parentId);
    
    // Função recursiva separada para evitar loops infinitos
    const updateFolder = (currentFolders: Folder[]): Folder[] => {
      return currentFolders.map(f => {
        if (f.id === parentId) {
          console.log('📁 Pasta pai encontrada:', f.name);
          return {
            ...f,
            subFolders: [...(f.subFolders || []), folder]
          };
        }
        if (f.subFolders && f.subFolders.length > 0) {
          const updatedSubFolders = updateFolder(f.subFolders);
          // Só atualiza se houve mudança nas subpastas
          if (updatedSubFolders !== f.subFolders) {
            console.log('📁 Pasta adicionada em subpasta de:', f.name);
            return {
              ...f,
              subFolders: updatedSubFolders
            };
          }
        }
        return f;
      });
    };

    return updateFolder(folders);
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

  const moveFolderInTree = (folders: Folder[], folderId: string | number, newParentId?: string | number | null, insertPosition?: { type: 'before' | 'after', targetId: string | number }): Folder[] => {
    console.log('🔄 moveFolderInTree chamado:', { folderId, newParentId, insertPosition });
    
    const found = findFolderById(folders, folderId);
    if (!found) {
      console.warn('❌ moveFolderInTree: Pasta não encontrada');
      return folders;
    }
    
    console.log('📁 moveFolderInTree: Pasta encontrada:', found.folder.name);

    // VERIFICAÇÃO CRÍTICA: Se há posição específica de inserção (reordenação)
    if (insertPosition) {
      console.log('🔄 Executando reordenação com insertPosition:', insertPosition);
      
      // Para reordenação, verificar se a pasta alvo ainda existe APÓS a remoção
      const foldersCopy = [...folders];
      const targetExists = findFolderById(foldersCopy, insertPosition.targetId);
      if (!targetExists) {
        console.warn('❌ Pasta alvo para reordenação não encontrada:', insertPosition.targetId);
        return folders;
      }

      // Remover da posição atual
      let newFolders = removeFolderFromTree(folders, folderId);
      
      // Verificar se a pasta alvo ainda existe após a remoção
      const targetAfterRemoval = findFolderById(newFolders, insertPosition.targetId);
      if (!targetAfterRemoval) {
        console.warn('❌ Pasta alvo desapareceu após remoção - cancelando operação');
        return folders; // Retorna estado original
      }
      
      // Inserir na nova posição
      newFolders = insertFolderAtPosition(newFolders, found.folder, insertPosition);
      console.log('✅ Reordenação concluída com sucesso');
      return newFolders;
    } else {
      // Movimento normal (mudar de pasta pai)
      console.log('🔄 Executando movimento normal para parentId:', newParentId);
      
      // Remover da posição atual
      let newFolders = removeFolderFromTree(folders, folderId);
      
      // Adicionar na nova posição
      newFolders = restoreFolderToTree(newFolders, found.folder, newParentId);
      console.log('✅ Movimento normal concluído com sucesso');
      return newFolders;
    }
  };

  // Nova função para inserir pasta em posição específica (reordenação)
  const insertFolderAtPosition = (folders: Folder[], folderToInsert: Folder, position: { type: 'before' | 'after', targetId: string | number }): Folder[] => {
    console.log('🎯 insertFolderAtPosition chamado:', { folderToInsert: folderToInsert.name, position });
    
    const targetFound = findFolderById(folders, position.targetId);
    if (!targetFound) {
      console.warn('❌ insertFolderAtPosition: Pasta alvo não encontrada');
      return [...folders, folderToInsert]; // Adiciona no final se não encontrar o alvo
    }

    console.log('🎯 Pasta alvo encontrada:', targetFound.folder.name, 'no índice:', targetFound.index);

    // Se a pasta alvo está no nível raiz
    if (!targetFound.parent) {
      console.log('🏠 Inserindo no nível raiz');
      const newFolders = [...folders];
      const targetIndex = targetFound.index;
      const insertIndex = position.type === 'before' ? targetIndex : targetIndex + 1;
      
      console.log('📍 Índices - target:', targetIndex, 'insert:', insertIndex);
      newFolders.splice(insertIndex, 0, folderToInsert);
      
      console.log('✅ Inserção no nível raiz concluída');
      return newFolders;
    }

    // Se a pasta alvo está dentro de uma pasta pai
    console.log('📁 Inserindo em pasta pai:', targetFound.parent.name);
    return folders.map(folder => {
      if (folder.id === targetFound.parent!.id) {
        const newSubFolders = [...(folder.subFolders || [])];
        const targetIndex = targetFound.index;
        const insertIndex = position.type === 'before' ? targetIndex : targetIndex + 1;
        
        console.log('📍 Índices em pasta pai - target:', targetIndex, 'insert:', insertIndex);
        newSubFolders.splice(insertIndex, 0, folderToInsert);
        
        console.log('✅ Inserção em pasta pai concluída');
        return {
          ...folder,
          subFolders: newSubFolders
        };
      }
      if (folder.subFolders) {
        const updatedSubFolders = insertFolderInSubFolders(folder.subFolders, folderToInsert, position, targetFound.parent!.id);
        if (updatedSubFolders !== folder.subFolders) {
          return {
            ...folder,
            subFolders: updatedSubFolders
          };
        }
      }
      return folder;
    });
  };

  // Função auxiliar para inserir em subpastas recursivamente
  const insertFolderInSubFolders = (subFolders: Folder[], folderToInsert: Folder, position: { type: 'before' | 'after', targetId: string | number }, targetParentId: string | number): Folder[] => {
    console.log('🔍 insertFolderInSubFolders:', { 
      folderToInsert: folderToInsert.name, 
      position, 
      targetParentId,
      subFoldersCount: subFolders.length 
    });
    
    for (let i = 0; i < subFolders.length; i++) {
      const folder = subFolders[i];
      
      if (folder.id === targetParentId) {
        console.log('🎯 Pasta pai encontrada em subFolders:', folder.name);
        
        const targetFound = findFolderById([folder], position.targetId);
        if (targetFound) {
          console.log('🎯 Pasta alvo encontrada em subFolders, inserindo...');
          
          const newSubFolders = [...(folder.subFolders || [])];
          const targetIndex = targetFound.index;
          const insertIndex = position.type === 'before' ? targetIndex : targetIndex + 1;
          
          console.log('📍 Inserindo em índice:', insertIndex);
          newSubFolders.splice(insertIndex, 0, folderToInsert);
          
          const result = subFolders.map((f, idx) => idx === i ? { ...f, subFolders: newSubFolders } : f);
          console.log('✅ insertFolderInSubFolders concluído');
          return result;
        } else {
          console.warn('❌ Pasta alvo não encontrada em subFolders de:', folder.name);
        }
      }
      
      if (folder.subFolders && folder.subFolders.length > 0) {
        console.log('🔄 Procurando recursivamente em:', folder.name);
        const updated = insertFolderInSubFolders(folder.subFolders, folderToInsert, position, targetParentId);
        if (updated !== folder.subFolders) {
          console.log('📁 Subpasta atualizada em:', folder.name);
          return subFolders.map((f, idx) => idx === i ? { ...f, subFolders: updated } : f);
        }
      }
    }
    
    console.warn('❌ insertFolderInSubFolders: Pasta pai não encontrada');
    return subFolders;
  };

  // Ações principais
  const undo = React.useCallback(() => {
    try {
      setHistoryState(prevState => {
        try {
          if (!prevState.past || prevState.past.length === 0) {
            console.warn('⚠️ Não há ações para desfazer');
            return prevState;
          }

          const lastAction = prevState.past[prevState.past.length - 1];
          const newPresent = revertAction(lastAction, prevState.present || []);

          return {
            past: prevState.past.slice(0, -1),
            present: newPresent,
            future: [lastAction, ...(prevState.future || [])]
          };
        } catch (error) {
          console.error('❌ Erro ao desfazer ação:', error);
          return prevState;
        }
      });
    } catch (error) {
      console.error('❌ Erro na função undo:', error);
      captureError(error as Error, { context: 'undo' });
    }
  }, []);

  const redo = React.useCallback(() => {
    try {
      setHistoryState(prevState => {
        try {
          if (!prevState.future || prevState.future.length === 0) {
            console.warn('⚠️ Não há ações para refazer');
            return prevState;
          }

          const nextAction = prevState.future[0];
          const newPresent = applyAction(nextAction, prevState.present || []);

          return {
            past: [...(prevState.past || []), nextAction],
            present: newPresent,
            future: prevState.future.slice(1)
          };
        } catch (error) {
          console.error('❌ Erro ao refazer ação:', error);
          return prevState;
        }
      });
    } catch (error) {
      console.error('❌ Erro na função redo:', error);
      captureError(error as Error, { context: 'redo' });
    }
  }, []);

  const setFolders = React.useCallback((folders: Folder[]) => {
    try {
      if (!Array.isArray(folders)) {
        console.warn('⚠️ setFolders: entrada não é array:', folders);
        return;
      }

      setHistoryState(prevState => ({
        ...prevState,
        present: folders
      }));
    } catch (error) {
      console.error('❌ Erro ao definir pastas:', error);
      captureError(error as Error, { context: 'setFolders' });
    }
  }, []);

  const clearHistory = React.useCallback(() => {
    try {
      setHistoryState(prevState => ({
        past: [],
        present: prevState.present || [],
        future: []
      }));
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
      captureError(error as Error, { context: 'clearHistory' });
    }
  }, []);

  // Ações específicas com histórico automático
  const createFolder = React.useCallback((folder: Folder, parentId?: string | number) => {
    try {
      if (!folder || !folder.id) {
        console.warn('⚠️ createFolder: pasta inválida:', folder);
        return;
      }

      const newFolders = restoreFolderToTree(historyState.present || [], folder, parentId);
      
      addAction({
        type: 'CREATE',
        description: `Pasta "${folder.name || 'Sem nome'}" criada`,
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
    } catch (error) {
      console.error('❌ Erro ao criar pasta:', error);
      captureError(error as Error, { context: 'createFolder', folderId: folder?.id });
    }
  }, [historyState.present, addAction]);

  const updateFolder = React.useCallback((folder: Folder) => {
    try {
      if (!folder || !folder.id) {
        console.warn('⚠️ updateFolder: pasta inválida:', folder);
        return;
      }

      const found = findFolderById(historyState.present || [], folder.id);
      if (!found) {
        console.warn('⚠️ updateFolder: pasta não encontrada:', folder.id);
        return;
      }

      const newFolders = updateFolderInTree(historyState.present || [], folder);
      
      addAction({
        type: 'UPDATE',
        description: `Pasta "${folder.name || 'Sem nome'}" atualizada`,
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
    } catch (error) {
      console.error('❌ Erro ao atualizar pasta:', error);
      captureError(error as Error, { context: 'updateFolder', folderId: folder?.id });
    }
  }, [historyState.present, addAction, findFolderById]);

  const deleteFolder = React.useCallback((folderId: string | number) => {
    try {
      if (!folderId && folderId !== 0) {
        console.warn('⚠️ deleteFolder: ID inválido:', folderId);
        return;
      }

      const found = findFolderById(historyState.present || [], folderId);
      if (!found) {
        console.warn('⚠️ deleteFolder: pasta não encontrada:', folderId);
        return;
      }

      const newFolders = removeFolderFromTree(historyState.present || [], folderId);
      
      addAction({
        type: 'DELETE',
        description: `Pasta "${found.folder.name || 'Sem nome'}" excluída`,
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
    } catch (error) {
      console.error('❌ Erro ao excluir pasta:', error);
      captureError(error as Error, { context: 'deleteFolder', folderId });
    }
  }, [historyState.present, addAction, findFolderById]);

  const moveFolder = React.useCallback((folderId: string | number, newParentId?: string | number | null, insertPosition?: { type: 'before' | 'after', targetId: string | number }) => {
    console.log('🚀 moveFolder iniciado:', { folderId, newParentId, insertPosition });
    
    const found = findFolderById(historyState.present, folderId);
    if (!found) {
      console.warn('❌ Pasta não encontrada:', folderId);
      return;
    }

    console.log('📁 Pasta encontrada para movimentação:', found.folder.name);

    // Validar se movimento é permitido (evitar loops)
    if (newParentId && newParentId === folderId) {
      console.warn('❌ Não é possível mover uma pasta para si mesma');
      return;
    }

    // Verificar se target é descendente de source (evitar loops)
    if (newParentId && isDescendantOf(historyState.present, newParentId, folderId)) {
      console.warn('❌ Não é possível mover uma pasta para dentro de suas subpastas');
      return;
    }

    // VERIFICAÇÃO CRÍTICA: Criar uma cópia do estado atual para teste
    const foldersBeforeMove = [...historyState.present];
    console.log('💾 Backup do estado atual criado');
    
    // Executar movimentação
    const newFolders = moveFolderInTree(historyState.present, folderId, newParentId, insertPosition);
    
    // VERIFICAÇÃO CRÍTICA: Verificar se a pasta ainda existe no resultado
    const movedFolderExists = findFolderById(newFolders, folderId);
    if (!movedFolderExists) {
      console.error('❌ CRÍTICO: Pasta desapareceu após movimentação - cancelando operação');
      console.error('Estado antes:', foldersBeforeMove.length, 'pastas');
      console.error('Estado depois:', newFolders.length, 'pastas');
      return; // Não atualiza o estado se a pasta foi perdida
    }

    console.log('✅ Pasta confirmada após movimentação:', movedFolderExists.folder.name);
    
    addAction({
      type: 'MOVE',
      description: `Pasta "${found.folder.name}" movida`,
      data: {
        before: { parentId: found.parent?.id },
        after: { parentId: newParentId, insertPosition },
        targetId: folderId
      }
    });

    setHistoryState(prevState => ({
      ...prevState,
      present: newFolders
    }));
    
    console.log('✅ moveFolder concluído com sucesso');
  }, [historyState.present, addAction]);

  // Função auxiliar para verificar se uma pasta é descendente de outra
  const isDescendantOf = (folders: Folder[], potentialDescendantId: string | number, ancestorId: string | number): boolean => {
    const found = findFolderById(folders, ancestorId);
    if (!found?.folder.subFolders) return false;
    
    return searchInSubFolders(found.folder.subFolders, potentialDescendantId);
  };

  const searchInSubFolders = (subFolders: Folder[], targetId: string | number): boolean => {
    for (const folder of subFolders) {
      if (folder.id === targetId) return true;
      if (folder.subFolders && searchInSubFolders(folder.subFolders, targetId)) {
        return true;
      }
    }
    return false;
  };

  // Função para salvar layout atual
  const saveCurrentLayout = React.useCallback(async (layoutName: string) => {
    try {
      if (!layoutName || typeof layoutName !== 'string') {
        console.warn('⚠️ saveCurrentLayout: nome do layout inválido:', layoutName);
        return false;
      }

      const { getBrowserDatabase } = await import('../utils/browserDatabase');
      const db = await getBrowserDatabase();
      
      const success = await db.saveCurrentLayout(layoutName, historyState.present || [], {
        timestamp: new Date().toISOString(),
        totalFolders: (historyState.present || []).length,
        responsibles: Array.from(new Set((historyState.present || []).map(f => f.responsible).filter(Boolean)))
      });

      if (success) {
        addAction({
          type: 'BATCH',
          description: `Layout "${layoutName}" salvo com sucesso`,
          data: {
            before: historyState.present || [],
            after: historyState.present || []
          }
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao salvar layout:', error);
      captureError(error as Error, { context: 'saveCurrentLayout', layoutName });
      return false;
    }
  }, [historyState.present, addAction]);

  const importFolders = React.useCallback((importedFolders: Folder[]) => {
    try {
      if (!Array.isArray(importedFolders)) {
        console.warn('⚠️ importFolders: entrada não é array:', importedFolders);
        return;
      }

      const newFolders = [...(historyState.present || []), ...importedFolders];
      
      addAction({
        type: 'IMPORT',
        description: `${importedFolders.length} pasta(s) importada(s)`,
        data: {
          before: historyState.present || [],
          after: importedFolders
        }
      });

      setHistoryState(prevState => ({
        ...prevState,
        present: newFolders
      }));
    } catch (error) {
      console.error('❌ Erro ao importar pastas:', error);
      captureError(error as Error, { context: 'importFolders' });
    }
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
    importFolders,
    saveCurrentLayout
  };
}; 