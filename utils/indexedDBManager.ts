interface DBConfig {
  name: string;
  version: number;
  stores: {
    [key: string]: {
      keyPath: string;
      autoIncrement?: boolean;
      indexes?: { [indexName: string]: string | string[] };
    };
  };
}

interface BackupData {
  id?: number;
  timestamp: string;
  type: 'manual' | 'auto' | 'scheduled';
  data: any;
  description?: string;
}

export class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private dbName = 'pastas-corporativas-db';
  private dbVersion = 3;
  
  private dbConfig: DBConfig = {
    name: this.dbName,
    version: this.dbVersion,
    stores: {
      // Store principal de pastas
      folders: {
        keyPath: 'id',
        indexes: {
          'name': 'name',
          'responsible': 'responsible',
          'category': 'category',
          'createdAt': 'createdAt',
          'updatedAt': 'updatedAt',
          'parentId': 'parentId',
          'tags': 'tags',
          'color': 'color'
        }
      },
      
      // Store de favoritos
      favorites: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          'folderId': 'folderId',
          'addedAt': 'addedAt',
          'userId': 'userId'
        }
      },
      
      // Store de configurações
      settings: {
        keyPath: 'key',
        indexes: {
          'category': 'category',
          'updatedAt': 'updatedAt'
        }
      },
      
      // Store de layouts/templates
      layouts: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          'name': 'name',
          'createdAt': 'createdAt',
          'category': 'category',
          'isDefault': 'isDefault'
        }
      },
      
      // Store de histórico
      history: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          'timestamp': 'timestamp',
          'action': 'action',
          'entityType': 'entityType',
          'entityId': 'entityId'
        }
      },
      
      // Store de monitoramento
      monitoring: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          'folderId': 'folderId',
          'timestamp': 'timestamp',
          'type': 'type',
          'status': 'status'
        }
      },
      
      // Store de backups automáticos
      backups: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          'timestamp': 'timestamp',
          'type': 'type'
        }
      },
      
      // Store para sincronização offline
      pendingSync: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          'timestamp': 'timestamp',
          'operation': 'operation',
          'entity': 'entity'
        }
      },
      
      // Store de busca/índices para performance
      searchIndex: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: {
          'term': 'term',
          'entityId': 'entityId',
          'entityType': 'entityType',
          'relevance': 'relevance'
        }
      }
    }
  };

  // Inicializar IndexedDB
  async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB: Falha ao abrir banco', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB: Banco inicializado com sucesso');
        
        // Configurar handlers de erro
        this.db.onerror = (event) => {
          console.error('IndexedDB: Erro no banco:', event);
        };
        
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log('IndexedDB: Atualizando estrutura do banco');
        
        // Criar/atualizar object stores
        Object.entries(this.dbConfig.stores).forEach(([storeName, config]) => {
          let store: IDBObjectStore;
          
          if (db.objectStoreNames.contains(storeName)) {
            // Store já existe, verificar se precisa de atualizações
            store = (event.target as IDBOpenDBRequest).transaction!.objectStore(storeName);
          } else {
            // Criar novo store
            store = db.createObjectStore(storeName, {
              keyPath: config.keyPath,
              autoIncrement: config.autoIncrement || false
            });
          }
          
          // Criar índices
          if (config.indexes) {
            Object.entries(config.indexes).forEach(([indexName, keyPath]) => {
              if (!store.indexNames.contains(indexName)) {
                store.createIndex(indexName, keyPath, { unique: false });
              }
            });
          }
        });
      };
    });
  }

  // Operações CRUD genéricas
  async create(storeName: string, data: any): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Adicionar timestamps
      const timestamp = new Date().toISOString();
      const dataWithTimestamp = {
        ...data,
        createdAt: data.createdAt || timestamp,
        updatedAt: timestamp
      };
      
      const request = store.add(dataWithTimestamp);
      
      request.onsuccess = () => {
        console.log(`IndexedDB: Item criado em ${storeName}:`, request.result);
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error(`IndexedDB: Erro ao criar em ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async read(storeName: string, key: any): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName: string, data: any): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Atualizar timestamp
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      const request = store.put(dataWithTimestamp);
      
      request.onsuccess = () => {
        console.log(`IndexedDB: Item atualizado em ${storeName}`);
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error(`IndexedDB: Erro ao atualizar em ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async delete(storeName: string, key: any): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => {
        console.log(`IndexedDB: Item deletado de ${storeName}`);
        resolve(true);
      };
      
      request.onerror = () => {
        console.error(`IndexedDB: Erro ao deletar de ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Busca avançada com índices
  async searchByIndex(storeName: string, indexName: string, value: any): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Busca com range
  async searchByRange(storeName: string, indexName: string, lowerBound: any, upperBound: any): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const range = IDBKeyRange.bound(lowerBound, upperBound);
      const request = index.getAll(range);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Busca full-text personalizada
  async fullTextSearch(term: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const searchTerms = term.toLowerCase().split(' ').filter(t => t.length > 0);
    const results = new Map<string, any>();
    
    // Buscar em múltiplos campos das pastas
    const folders = await this.getAll('folders');
    
    folders.forEach(folder => {
      let relevance = 0;
      const searchableText = `
        ${folder.name || ''} 
        ${folder.responsible || ''} 
        ${folder.category || ''} 
        ${(folder.tags || []).join(' ')}
      `.toLowerCase();
      
      searchTerms.forEach(searchTerm => {
        const termRelevance = this.calculateRelevance(searchableText, searchTerm, folder);
        relevance += termRelevance;
      });
      
      if (relevance > 0) {
        results.set(folder.id, { ...folder, _relevance: relevance });
      }
    });
    
    // Ordenar por relevância
    return Array.from(results.values())
      .sort((a, b) => b._relevance - a._relevance);
  }

  private calculateRelevance(text: string, term: string, item: any): number {
    let relevance = 0;
    
    // Correspondência exata no nome (peso 10)
    if (item.name?.toLowerCase().includes(term)) {
      relevance += 10;
    }
    
    // Correspondência no responsável (peso 5)
    if (item.responsible?.toLowerCase().includes(term)) {
      relevance += 5;
    }
    
    // Correspondência em tags (peso 3)
    if (item.tags?.some((tag: string) => tag.toLowerCase().includes(term))) {
      relevance += 3;
    }
    
    // Correspondência em categoria (peso 2)
    if (item.category?.toLowerCase().includes(term)) {
      relevance += 2;
    }
    
    // Correspondência parcial em texto geral (peso 1)
    if (text.includes(term)) {
      relevance += 1;
    }
    
    return relevance;
  }

  // Sistema de backup automático
  async createBackup(type: 'manual' | 'auto' | 'scheduled', description?: string): Promise<number> {
    const timestamp = new Date().toISOString();
    
    // Coletar todos os dados
    const [folders, favorites, settings, layouts, history] = await Promise.all([
      this.getAll('folders'),
      this.getAll('favorites'),
      this.getAll('settings'),
      this.getAll('layouts'),
      this.getAll('history')
    ]);
    
    const backupData: BackupData = {
      timestamp,
      type,
      description,
      data: {
        folders,
        favorites,
        settings,
        layouts,
        history,
        version: this.dbVersion,
        created: timestamp
      }
    };
    
    const backupId = await this.create('backups', backupData);
    
    // Limpar backups antigos (manter últimos 10)
    await this.cleanOldBackups();
    
    return backupId;
  }

  async restoreBackup(backupId: number): Promise<boolean> {
    try {
      const backup = await this.read('backups', backupId);
      if (!backup) throw new Error('Backup não encontrado');
      
      const { folders, favorites, settings, layouts, history } = backup.data;
      
      // Limpar dados atuais
      await this.clearAllData();
      
      // Restaurar dados
      await Promise.all([
        ...folders.map((folder: any) => this.create('folders', folder)),
        ...favorites.map((fav: any) => this.create('favorites', fav)),
        ...settings.map((setting: any) => this.create('settings', setting)),
        ...layouts.map((layout: any) => this.create('layouts', layout)),
        ...history.map((hist: any) => this.create('history', hist))
      ]);
      
      console.log('IndexedDB: Backup restaurado com sucesso');
      return true;
    } catch (error) {
      console.error('IndexedDB: Erro ao restaurar backup:', error);
      return false;
    }
  }

  private async cleanOldBackups(): Promise<void> {
    const backups = await this.getAll('backups');
    
    // Ordenar por timestamp (mais recente primeiro)
    backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Remover backups excedentes (manter últimos 10)
    const toDelete = backups.slice(10);
    
    for (const backup of toDelete) {
      await this.delete('backups', backup.id);
    }
  }

  // Migração de dados do localStorage
  async migrateFromLocalStorage(): Promise<boolean> {
    try {
      console.log('IndexedDB: Iniciando migração do localStorage...');
      
      // Verificar se já foi migrado
      const migrationFlag = await this.read('settings', 'migration_completed');
      if (migrationFlag) {
        console.log('IndexedDB: Migração já foi concluída anteriormente');
        return true;
      }
      
      // Migrar folders
      const foldersData = localStorage.getItem('folders');
      if (foldersData) {
        const folders = JSON.parse(foldersData);
        for (const folder of folders) {
          await this.create('folders', folder);
        }
        console.log(`IndexedDB: Migrados ${folders.length} folders`);
      }
      
      // Migrar favorites
      const favoritesData = localStorage.getItem('favorite-folders');
      if (favoritesData) {
        const favorites = JSON.parse(favoritesData);
        for (const folderId of favorites) {
          await this.create('favorites', {
            folderId,
            addedAt: new Date().toISOString(),
            userId: 'default'
          });
        }
        console.log(`IndexedDB: Migrados ${favorites.length} favoritos`);
      }
      
      // Migrar settings
      const settingsKeys = [
        'theme', 'appTitle', 'appLogo', 'folderNavigatorTitle',
        'custom-responsibles', 'custom-tags', 'edited-default-responsibles',
        'edited-default-tags', 'app-settings', 'folder-monitoring-settings'
      ];
      
      for (const key of settingsKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          await this.create('settings', {
            key,
            value,
            category: 'user',
            updatedAt: new Date().toISOString()
          });
        }
      }
      
      // Migrar layouts
      const layoutsData = localStorage.getItem('saved-layouts');
      if (layoutsData) {
        const layouts = JSON.parse(layoutsData);
        for (const layout of layouts) {
          await this.create('layouts', layout);
        }
        console.log(`IndexedDB: Migrados ${layouts.length} layouts`);
      }
      
      // Marcar migração como concluída
      await this.create('settings', {
        key: 'migration_completed',
        value: 'true',
        category: 'system',
        updatedAt: new Date().toISOString()
      });
      
      // Criar backup inicial
      await this.createBackup('auto', 'Backup automático pós-migração');
      
      console.log('IndexedDB: Migração concluída com sucesso!');
      return true;
      
    } catch (error) {
      console.error('IndexedDB: Erro durante migração:', error);
      return false;
    }
  }

  // Limpar todos os dados
  async clearAllData(): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const storeNames = Object.keys(this.dbConfig.stores);
      
      for (const storeName of storeNames) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
      
      console.log('IndexedDB: Todos os dados foram limpos');
      return true;
    } catch (error) {
      console.error('IndexedDB: Erro ao limpar dados:', error);
      return false;
    }
  }

  // Estatísticas do banco
  async getStats(): Promise<any> {
    const stats: any = {};
    
    const storeNames = Object.keys(this.dbConfig.stores);
    
    for (const storeName of storeNames) {
      const data = await this.getAll(storeName);
      stats[storeName] = {
        count: data.length,
        size: JSON.stringify(data).length
      };
    }
    
    stats.totalSize = Object.values(stats).reduce((sum: number, store: any) => sum + store.size, 0);
    stats.totalRecords = Object.values(stats).reduce((sum: number, store: any) => sum + store.count, 0);
    
    return stats;
  }

  // Fechar conexão
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('IndexedDB: Conexão fechada');
    }
  }
}

// Singleton instance
let dbManager: IndexedDBManager | null = null;

export async function getDBManager(): Promise<IndexedDBManager> {
  if (!dbManager) {
    dbManager = new IndexedDBManager();
    await dbManager.init();
    
    // Executar migração se necessário
    await dbManager.migrateFromLocalStorage();
  }
  
  return dbManager;
}

export function closeDBManager(): void {
  if (dbManager) {
    dbManager.close();
    dbManager = null;
  }
} 