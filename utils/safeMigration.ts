// Sistema de Migração Segura: localStorage → IndexedDB
// ATENÇÃO: Este sistema foi projetado para ser 100% seguro e não quebrar código existente

interface MigrationResult {
  success: boolean;
  itemsMigrated: number;
  errors: string[];
  backupCreated: boolean;
}

interface LocalStorageBackup {
  timestamp: string;
  version: string;
  data: Record<string, string>;
}

export class SafeMigrationManager {
  private dbName = 'organizador-db';
  private db: IDBDatabase | null = null;
  
  // Lista de chaves que devem ser migradas do localStorage
  private readonly MIGRATION_KEYS = [
    'favorite-folders',
    'color-settings', 
    'appTitle',
    'appLogo',
    'folderNavigatorTitle',
    'folder-monitoring-settings',
    'folder-monitorings'
  ] as const;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2); // Incrementa versão

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Cria object store para localStorage migrado (se não existe)
        if (!db.objectStoreNames.contains('localStorage_migrated')) {
          const localStorageStore = db.createObjectStore('localStorage_migrated', { keyPath: 'key' });
          localStorageStore.createIndex('migratedAt', 'migratedAt', { unique: false });
        }

        // Cria object store para backups de segurança
        if (!db.objectStoreNames.contains('migration_backups')) {
          const backupStore = db.createObjectStore('migration_backups', { keyPath: 'id', autoIncrement: true });
          backupStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // ETAPA 1: Criar backup completo do localStorage
  async createBackup(): Promise<boolean> {
    if (!this.db) return false;

    try {
      const backup: LocalStorageBackup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {}
      };

      // Copia TODOS os dados do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          backup.data[key] = localStorage.getItem(key) || '';
        }
      }

      const transaction = this.db.transaction(['migration_backups'], 'readwrite');
      const store = transaction.objectStore('migration_backups');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.add(backup);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('✅ Backup do localStorage criado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      return false;
    }
  }

  // ETAPA 2: Verificar se é seguro migrar
  async isSafeToMigrate(): Promise<{ safe: boolean; reason?: string }> {
    try {
      // Verifica se IndexedDB está funcionando
      if (!this.db) {
        return { safe: false, reason: 'IndexedDB não inicializado' };
      }

      // Verifica se já existe migração
      const existingMigration = await this.checkExistingMigration();
      if (existingMigration.hasMigration && existingMigration.isComplete) {
        return { safe: false, reason: 'Migração já foi realizada' };
      }

      // Verifica se localStorage tem dados para migrar
      const hasDataToMigrate = this.MIGRATION_KEYS.some(key => 
        localStorage.getItem(key) !== null
      );

      if (!hasDataToMigrate) {
        return { safe: false, reason: 'Nenhum dado para migrar' };
      }

      return { safe: true };
    } catch (error) {
      return { safe: false, reason: `Erro na verificação: ${error}` };
    }
  }

  // ETAPA 3: Migração individual de cada chave (uma por vez)
  async migrateSingleKey(key: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      itemsMigrated: 0,
      errors: [],
      backupCreated: false
    };

    if (!this.db) {
      result.errors.push('IndexedDB não inicializado');
      return result;
    }

    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        result.errors.push(`Chave '${key}' não encontrada no localStorage`);
        return result;
      }

      // Cria backup específico desta chave antes de migrar
      const backupResult = await this.createSingleKeyBackup(key, value);
      result.backupCreated = backupResult;

      // Migra para IndexedDB
      const migrationData = {
        key,
        value,
        originalSource: 'localStorage',
        migratedAt: new Date().toISOString(),
        validated: false
      };

      const transaction = this.db.transaction(['localStorage_migrated'], 'readwrite');
      const store = transaction.objectStore('localStorage_migrated');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(migrationData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Valida se a migração funcionou
      const validationResult = await this.validateMigration(key, value);
      if (!validationResult.valid) {
        result.errors.push(`Validação falhou: ${validationResult.reason}`);
        return result;
      }

      // Marca como validado
      await this.markAsValidated(key);

      result.success = true;
      result.itemsMigrated = 1;
      
      console.log(`✅ Chave '${key}' migrada com sucesso`);
      return result;

    } catch (error) {
      result.errors.push(`Erro na migração de '${key}': ${error}`);
      return result;
    }
  }

  // ETAPA 4: Migração completa (apenas se todas as individuais funcionaram)
  async migrateAll(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      itemsMigrated: 0,
      errors: [],
      backupCreated: false
    };

    // Verifica segurança primeiro
    const safetyCheck = await this.isSafeToMigrate();
    if (!safetyCheck.safe) {
      result.errors.push(safetyCheck.reason || 'Migração não é segura');
      return result;
    }

    // Cria backup completo
    result.backupCreated = await this.createBackup();
    if (!result.backupCreated) {
      result.errors.push('Falha ao criar backup - abortando migração');
      return result;
    }

    // Migra uma chave por vez
    for (const key of this.MIGRATION_KEYS) {
      const keyResult = await this.migrateSingleKey(key);
      
      if (keyResult.success) {
        result.itemsMigrated += keyResult.itemsMigrated;
      } else {
        result.errors.push(...keyResult.errors);
        // Para na primeira falha para evitar problemas
        break;
      }
    }

    result.success = result.itemsMigrated > 0 && result.errors.length === 0;
    return result;
  }

  // UTILITÁRIOS DE VALIDAÇÃO E RECUPERAÇÃO

  async validateMigration(key: string, originalValue: string): Promise<{ valid: boolean; reason?: string }> {
    try {
      const migratedValue = await this.getMigratedValue(key);
      if (migratedValue === null) {
        return { valid: false, reason: 'Valor não encontrado após migração' };
      }

      if (migratedValue !== originalValue) {
        return { valid: false, reason: 'Valor migrado difere do original' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, reason: `Erro na validação: ${error}` };
    }
  }

  async getMigratedValue(key: string): Promise<string | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(['localStorage_migrated'], 'readonly');
      const store = transaction.objectStore('localStorage_migrated');
      
      return new Promise<string | null>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      return null;
    }
  }

  async checkExistingMigration(): Promise<{ hasMigration: boolean; isComplete: boolean }> {
    if (!this.db) return { hasMigration: false, isComplete: false };

    try {
      const transaction = this.db.transaction(['localStorage_migrated'], 'readonly');
      const store = transaction.objectStore('localStorage_migrated');
      
      return new Promise<{ hasMigration: boolean; isComplete: boolean }>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          const results = request.result;
          const hasMigration = results.length > 0;
          const isComplete = this.MIGRATION_KEYS.every(key => 
            results.some(item => item.key === key && item.validated)
          );
          resolve({ hasMigration, isComplete });
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      return { hasMigration: false, isComplete: false };
    }
  }

  private async createSingleKeyBackup(key: string, value: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const backup = {
        key,
        value,
        timestamp: new Date().toISOString(),
        type: 'single-key-backup'
      };

      const transaction = this.db.transaction(['migration_backups'], 'readwrite');
      const store = transaction.objectStore('migration_backups');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.add(backup);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  private async markAsValidated(key: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['localStorage_migrated'], 'readwrite');
    const store = transaction.objectStore('localStorage_migrated');
    
    const getRequest = store.get(key);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.validated = true;
        store.put(data);
      }
    };
  }

  // MÉTODOS DE RECUPERAÇÃO EM CASO DE PROBLEMAS

  async rollbackMigration(): Promise<boolean> {
    if (!this.db) return false;

    try {
      // Remove dados migrados
      const transaction = this.db.transaction(['localStorage_migrated'], 'readwrite');
      const store = transaction.objectStore('localStorage_migrated');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('✅ Rollback realizado - dados migrados removidos');
      return true;
    } catch (error) {
      console.error('❌ Erro no rollback:', error);
      return false;
    }
  }

  async getStatus(): Promise<{
    hasBackup: boolean;
    migrationComplete: boolean;
    itemsMigrated: number;
    errors: string[];
  }> {
    const result: {
      hasBackup: boolean;
      migrationComplete: boolean;
      itemsMigrated: number;
      errors: string[];
    } = {
      hasBackup: false,
      migrationComplete: false,
      itemsMigrated: 0,
      errors: []
    };

    if (!this.db) {
      result.errors.push('IndexedDB não inicializado');
      return result;
    }

    try {
      // Verifica backups
      const backupTransaction = this.db.transaction(['migration_backups'], 'readonly');
      const backupStore = backupTransaction.objectStore('migration_backups');
      
      const backupCount = await new Promise<number>((resolve, reject) => {
        const request = backupStore.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      result.hasBackup = backupCount > 0;

      // Verifica migração
      const migrationCheck = await this.checkExistingMigration();
      result.migrationComplete = migrationCheck.isComplete;

      // Conta itens migrados
      const migrationTransaction = this.db.transaction(['localStorage_migrated'], 'readonly');
      const migrationStore = migrationTransaction.objectStore('localStorage_migrated');
      
      const migratedCount = await new Promise<number>((resolve, reject) => {
        const request = migrationStore.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      result.itemsMigrated = migratedCount;

    } catch (error) {
      result.errors.push(`Erro ao verificar status: ${error}`);
    }

    return result;
  }
}

// Instância singleton para uso seguro
let migrationManager: SafeMigrationManager | null = null;

export async function getSafeMigrationManager(): Promise<SafeMigrationManager> {
  if (!migrationManager) {
    migrationManager = new SafeMigrationManager();
    await migrationManager.init();
  }
  return migrationManager;
} 