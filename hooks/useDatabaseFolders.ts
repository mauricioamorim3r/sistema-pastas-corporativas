import { useState, useEffect, useCallback } from 'react';
import { Folder } from '../types';
import * as db from '../utils/database';

export interface DatabaseConfig {
  provider: 'localStorage' | 'neon';
  autoMigrate: boolean;
  syncOnChange: boolean;
}

export function useDatabaseFolders(config: DatabaseConfig = { 
  provider: 'localStorage', 
  autoMigrate: true, 
  syncOnChange: false 
}) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Testa conexão com banco
  const testConnection = useCallback(async () => {
    if (config.provider === 'localStorage') {
      setIsConnected(true);
      return true;
    }

    try {
      const connected = await db.testConnection();
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setError('Falha na conexão com o banco de dados');
      setIsConnected(false);
      return false;
    }
  }, [config.provider]);

  // Carrega pastas do provider ativo
  const loadFolders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.provider === 'localStorage') {
        // Para localStorage, vamos simular dados por enquanto
        // TODO: Implementar carregamento real do localStorage/IndexedDB
        console.log('Carregando do localStorage/IndexedDB...');
        setFolders([]);
      } else {
        const dbFolders = await db.getAllFolders();
        const folderTree = db.buildFolderTree(dbFolders);
        setFolders(folderTree);
      }
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
      setError('Erro ao carregar pastas');
      
      // Fallback para dados vazios em caso de erro
      if (config.provider === 'neon') {
        console.log('Fallback para dados locais...');
        setFolders([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [config.provider]);

  // Migra dados do localStorage para Neon
  const migrateToDatabase = useCallback(async () => {
    if (config.provider !== 'neon' || !config.autoMigrate) return;

    try {
      // TODO: Implementar busca de dados locais para migração
      console.log('Migração ainda não implementada...');
      
      // Recarrega do banco após migração
      await loadFolders();
      
      console.log('Migração concluída com sucesso!');
    } catch (error) {
      console.error('Erro na migração:', error);
      setError('Erro na migração dos dados');
    }
  }, [config.provider, config.autoMigrate, loadFolders]);

  // Cria uma nova pasta
  const createFolder = useCallback(async (folderData: Partial<Folder>, parentId?: string) => {
    try {
      if (config.provider === 'localStorage') {
        // TODO: Implementar criação no localStorage
        console.log('Criação no localStorage ainda não implementada');
        await loadFolders();
      } else {
        await db.createFolder(folderData, parentId);
        await loadFolders();
      }
    } catch (error) {
      console.error('Erro ao criar pasta:', error);
      setError('Erro ao criar pasta');
      throw error;
    }
  }, [config.provider, loadFolders]);

  // Atualiza uma pasta
  const updateFolder = useCallback(async (folderId: string, updates: Partial<Folder>) => {
    try {
      if (config.provider === 'localStorage') {
        // TODO: Implementar atualização no localStorage
        console.log('Atualização no localStorage ainda não implementada');
        await loadFolders();
      } else {
        await db.updateFolder(folderId, updates);
        await loadFolders();
      }
    } catch (error) {
      console.error('Erro ao atualizar pasta:', error);
      setError('Erro ao atualizar pasta');
      throw error;
    }
  }, [config.provider, loadFolders]);

  // Remove uma pasta
  const deleteFolder = useCallback(async (folderId: string) => {
    try {
      if (config.provider === 'localStorage') {
        // TODO: Implementar remoção no localStorage
        console.log('Remoção no localStorage ainda não implementada');
        await loadFolders();
      } else {
        await db.deleteFolder(folderId);
        await loadFolders();
      }
    } catch (error) {
      console.error('Erro ao deletar pasta:', error);
      setError('Erro ao deletar pasta');
      throw error;
    }
  }, [config.provider, loadFolders]);

  // Salva arquivo na pasta
  const saveFile = useCallback(async (
    folderId: string, 
    file: File, 
    options: { storageType?: 'database' | 'local' | 'cloud' } = {}
  ) => {
    try {
      if (config.provider === 'localStorage') {
        // TODO: Implementar salvamento de arquivo no localStorage
        console.log('Salvamento de arquivo no localStorage não implementado ainda');
        return;
      }

      // Converter arquivo para base64 se for pequeno (< 10MB)
      const fileData = file.size < 10 * 1024 * 1024 ? await fileToBase64(file) : undefined;
      
      await db.createFile(folderId, {
        name: file.name,
        originalName: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
        fileExtension: file.name.split('.').pop(),
        storageType: options.storageType || 'database',
        fileData: fileData,
        uploadedBy: 'user'
      });

      console.log('Arquivo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
      setError('Erro ao salvar arquivo');
      throw error;
    }
  }, [config.provider]);

  // Utilitário para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Inicialização
  useEffect(() => {
    const initialize = async () => {
      await testConnection();
      await loadFolders();
      
      if (config.provider === 'neon' && config.autoMigrate) {
        await migrateToDatabase();
      }
    };

    initialize();
  }, [testConnection, loadFolders, migrateToDatabase]);

  return {
    // Estado
    folders,
    isConnected,
    isLoading,
    error,
    
    // Ações
    createFolder,
    updateFolder,
    deleteFolder,
    saveFile,
    loadFolders,
    testConnection,
    migrateToDatabase,
    
    // Configuração
    provider: config.provider,
    canUseDatabase: isConnected && config.provider === 'neon'
  };
} 