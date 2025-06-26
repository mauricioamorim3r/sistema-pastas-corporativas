import { useState, useEffect, useCallback, useRef } from 'react';
import { getDBManager } from '../utils/indexedDBManager';

export interface BackupConfig {
  enabled: boolean;
  interval: number; // em minutos
  maxBackups: number;
  includeHistory: boolean;
  includeSettings: boolean;
  includeLayouts: boolean;
  compressionEnabled: boolean;
  cloudSyncEnabled: boolean;
}

export interface BackupInfo {
  id: number;
  timestamp: string;
  type: 'manual' | 'auto' | 'scheduled' | 'cloud';
  size: number;
  description?: string;
  version: string;
  checksum?: string;
}

export interface BackupStats {
  totalBackups: number;
  lastBackupTime: Date | null;
  nextBackupTime: Date | null;
  totalSize: number;
  avgBackupSize: number;
  successRate: number;
  failedBackups: number;
}

const DEFAULT_CONFIG: BackupConfig = {
  enabled: true,
  interval: 30, // 30 minutos
  maxBackups: 10,
  includeHistory: true,
  includeSettings: true,
  includeLayouts: true,
  compressionEnabled: true,
  cloudSyncEnabled: false
};

export function useAutoBackup() {
  const [config, setConfig] = useState<BackupConfig>(() => {
    const saved = localStorage.getItem('auto-backup-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [stats, setStats] = useState<BackupStats>({
    totalBackups: 0,
    lastBackupTime: null,
    nextBackupTime: null,
    totalSize: 0,
    avgBackupSize: 0,
    successRate: 100,
    failedBackups: 0
  });

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar backups existentes
  const loadBackups = useCallback(async () => {
    try {
      const dbManager = await getDBManager();
      const allBackups = await dbManager.getAll('backups');
      
      const backupInfos: BackupInfo[] = allBackups.map(backup => ({
        id: backup.id,
        timestamp: backup.timestamp,
        type: backup.type,
        size: JSON.stringify(backup.data).length,
        description: backup.description,
        version: backup.data.version || '1.0',
        checksum: generateChecksum(backup.data)
      }));

      setBackups(backupInfos);
      
      // Calcular estatísticas
      if (backupInfos.length > 0) {
        const totalSize = backupInfos.reduce((sum, backup) => sum + backup.size, 0);
        const lastBackup = backupInfos.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];

        setStats(prev => ({
          ...prev,
          totalBackups: backupInfos.length,
          lastBackupTime: new Date(lastBackup.timestamp),
          totalSize,
          avgBackupSize: totalSize / backupInfos.length,
          nextBackupTime: config.enabled ? 
            new Date(new Date(lastBackup.timestamp).getTime() + config.interval * 60 * 1000) : 
            null
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
      setLastError('Falha ao carregar lista de backups');
    }
  }, [config.enabled, config.interval]);

  // Gerar checksum simples para validação
  const generateChecksum = (data: any): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  };

  // Criar backup manual
  const createManualBackup = useCallback(async (description?: string): Promise<boolean> => {
    setIsBackingUp(true);
    setLastError(null);

    try {
      const dbManager = await getDBManager();
      
      console.log('🔄 Iniciando backup manual...');
      const backupId = await dbManager.createBackup('manual', description || 'Backup manual criado pelo usuário');
      
      console.log(`✅ Backup manual criado com ID: ${backupId}`);
      
      // Recarregar lista de backups
      await loadBackups();
      
      // Atualizar estatísticas de sucesso
      setStats(prev => ({
        ...prev,
        successRate: (prev.successRate * prev.totalBackups + 100) / (prev.totalBackups + 1)
      }));

      return true;
    } catch (error) {
      console.error('Erro ao criar backup manual:', error);
      setLastError(`Falha ao criar backup: ${error}`);
      
      // Atualizar estatísticas de falha
      setStats(prev => ({
        ...prev,
        failedBackups: prev.failedBackups + 1,
        successRate: (prev.successRate * prev.totalBackups) / (prev.totalBackups + 1)
      }));

      return false;
    } finally {
      setIsBackingUp(false);
    }
  }, [loadBackups]);

  // Criar backup automático
  const createAutoBackup = useCallback(async (): Promise<boolean> => {
    if (!config.enabled || isBackingUp) return false;

    setIsBackingUp(true);
    setLastError(null);

    try {
      const dbManager = await getDBManager();
      
      console.log('🤖 Iniciando backup automático...');
      
      // Verificar se realmente precisa fazer backup (mudanças desde último backup)
      const shouldBackup = await shouldCreateBackup();
      if (!shouldBackup) {
        console.log('⏭️ Backup pulado - sem mudanças significativas');
        setIsBackingUp(false);
        return true;
      }

      const backupId = await dbManager.createBackup('auto', 'Backup automático do sistema');
      
      console.log(`✅ Backup automático criado com ID: ${backupId}`);
      
      // Recarregar lista de backups
      await loadBackups();
      
      // Limpar backups antigos se necessário
      await cleanOldBackups();

      return true;
    } catch (error) {
      console.error('Erro ao criar backup automático:', error);
      setLastError(`Falha no backup automático: ${error}`);
      
      setStats(prev => ({
        ...prev,
        failedBackups: prev.failedBackups + 1
      }));

      return false;
    } finally {
      setIsBackingUp(false);
    }
  }, [config.enabled, isBackingUp, loadBackups]);

  // Verificar se deve criar backup (detectar mudanças)
  const shouldCreateBackup = useCallback(async (): Promise<boolean> => {
    try {
      const dbManager = await getDBManager();
      
      // Obter hash dos dados atuais
      const currentData = {
        folders: await dbManager.getAll('folders'),
        settings: await dbManager.getAll('settings'),
        layouts: config.includeLayouts ? await dbManager.getAll('layouts') : [],
        history: config.includeHistory ? await dbManager.getAll('history') : []
      };
      
      const currentChecksum = generateChecksum(currentData);
      
      // Comparar com último backup
      if (backups.length > 0) {
        const lastBackup = backups[0];
        if (lastBackup.checksum === currentChecksum) {
          return false; // Dados iguais, não precisa backup
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar necessidade de backup:', error);
      return true; // Em caso de erro, fazer backup por precaução
    }
  }, [config.includeLayouts, config.includeHistory, backups]);

  // Limpar backups antigos
  const cleanOldBackups = useCallback(async () => {
    try {
      const dbManager = await getDBManager();
      const allBackups = await dbManager.getAll('backups');
      
      // Ordenar por timestamp (mais recente primeiro)
      allBackups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Remover backups excedentes
      const toDelete = allBackups.slice(config.maxBackups);
      
      for (const backup of toDelete) {
        await dbManager.delete('backups', backup.id);
        console.log(`🗑️ Backup antigo removido: ${backup.id}`);
      }
      
      if (toDelete.length > 0) {
        await loadBackups(); // Recarregar lista atualizada
      }
    } catch (error) {
      console.error('Erro ao limpar backups antigos:', error);
    }
  }, [config.maxBackups, loadBackups]);

  // Restaurar backup
  const restoreBackup = useCallback(async (backupId: number): Promise<boolean> => {
    setIsBackingUp(true);
    setLastError(null);

    try {
      const dbManager = await getDBManager();
      
      console.log(`🔄 Restaurando backup ID: ${backupId}`);
      const success = await dbManager.restoreBackup(backupId);
      
      if (success) {
        console.log('✅ Backup restaurado com sucesso');
        await loadBackups();
        return true;
      } else {
        setLastError('Falha ao restaurar backup');
        return false;
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      setLastError(`Erro na restauração: ${error}`);
      return false;
    } finally {
      setIsBackingUp(false);
    }
  }, [loadBackups]);

  // Deletar backup específico
  const deleteBackup = useCallback(async (backupId: number): Promise<boolean> => {
    try {
      const dbManager = await getDBManager();
      await dbManager.delete('backups', backupId);
      
      console.log(`🗑️ Backup deletado: ${backupId}`);
      await loadBackups();
      return true;
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      setLastError(`Erro ao deletar backup: ${error}`);
      return false;
    }
  }, [loadBackups]);

  // Exportar backup para arquivo
  const exportBackup = useCallback(async (backupId: number): Promise<string | null> => {
    try {
      const dbManager = await getDBManager();
      const backup = await dbManager.read('backups', backupId);
      
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      // Criar arquivo para download
      const exportData = {
        ...backup,
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Criar link de download
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backup.timestamp.split('T')[0]}-${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return url;
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      setLastError(`Erro na exportação: ${error}`);
      return null;
    }
  }, []);

  // Importar backup de arquivo
  const importBackup = useCallback(async (file: File): Promise<boolean> => {
    setIsBackingUp(true);
    setLastError(null);

    try {
      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);
      
      // Validar estrutura do backup
      if (!backupData.data || !backupData.timestamp) {
        throw new Error('Arquivo de backup inválido');
      }

      const dbManager = await getDBManager();
      
      // Criar novo backup com dados importados
      const newBackupData = {
        timestamp: new Date().toISOString(),
        type: 'manual',
        description: `Backup importado de ${file.name}`,
        data: backupData.data
      };

      await dbManager.create('backups', newBackupData);
      
      console.log('✅ Backup importado com sucesso');
      await loadBackups();
      return true;
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      setLastError(`Erro na importação: ${error}`);
      return false;
    } finally {
      setIsBackingUp(false);
    }
  }, [loadBackups]);

  // Atualizar configuração
  const updateConfig = useCallback((newConfig: Partial<BackupConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('auto-backup-config', JSON.stringify(updatedConfig));
  }, [config]);

  // Configurar intervalo automático
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (config.enabled && config.interval > 0) {
      intervalRef.current = setInterval(() => {
        createAutoBackup();
      }, config.interval * 60 * 1000); // Converter minutos para milissegundos

      console.log(`⏰ Backup automático configurado para ${config.interval} minutos`);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config.enabled, config.interval, createAutoBackup]);

  // Carregar backups na inicialização
  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  // Verificar integridade dos backups
  const verifyBackups = useCallback(async (): Promise<{ valid: number; invalid: number; errors: string[] }> => {
    const result = { valid: 0, invalid: 0, errors: [] as string[] };

    try {
      const dbManager = await getDBManager();
      const allBackups = await dbManager.getAll('backups');

      for (const backup of allBackups) {
        try {
          // Verificar estrutura básica
          if (!backup.data || !backup.timestamp) {
            result.invalid++;
            result.errors.push(`Backup ${backup.id}: estrutura inválida`);
            continue;
          }

          // Verificar checksum se disponível
          const currentChecksum = generateChecksum(backup.data);
          const backupInfo = backups.find(b => b.id === backup.id);
          
          if (backupInfo?.checksum && backupInfo.checksum !== currentChecksum) {
            result.invalid++;
            result.errors.push(`Backup ${backup.id}: checksum inválido`);
            continue;
          }

          result.valid++;
        } catch (error) {
          result.invalid++;
          result.errors.push(`Backup ${backup.id}: erro de validação - ${error}`);
        }
      }
    } catch (error) {
      result.errors.push(`Erro geral na verificação: ${error}`);
    }

    return result;
  }, [backups]);

  return {
    // Estado
    config,
    backups,
    stats,
    isBackingUp,
    lastError,

    // Funções principais
    createManualBackup,
    createAutoBackup,
    restoreBackup,
    deleteBackup,

    // Import/Export
    exportBackup,
    importBackup,

    // Configuração
    updateConfig,

    // Utilitários
    loadBackups,
    cleanOldBackups,
    verifyBackups,

    // Limpeza de erro
    clearError: () => setLastError(null)
  };
} 