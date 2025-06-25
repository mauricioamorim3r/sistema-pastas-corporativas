import { FolderType, LayoutTemplate } from '../types';

export class BrowserDatabaseManager {
  private dbName = 'organizador-db';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.addDefaultTemplates();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Object store para templates
        if (!db.objectStoreNames.contains('templates')) {
          const templateStore = db.createObjectStore('templates', { keyPath: 'name' });
          templateStore.createIndex('category', 'category', { unique: false });
          templateStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Object store para dados de sessão
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
        }

        // Object store para configurações
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Object store para monitoramento
        if (!db.objectStoreNames.contains('monitoring')) {
          const monitoringStore = db.createObjectStore('monitoring', { keyPath: 'id', autoIncrement: true });
          monitoringStore.createIndex('folderId', 'folderId', { unique: false });
          monitoringStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveTemplate(template: Omit<LayoutTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    if (!this.db) return false;

    try {
      const templateWithTimestamp: LayoutTemplate = {
        ...template,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const transaction = this.db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(templateWithTimestamp);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      return false;
    }
  }

  async updateTemplate(templateName: string, template: Omit<LayoutTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    if (!this.db) return false;

    try {
      // Primeiro busca o template existente para manter o createdAt
      const existing = await this.loadTemplate(templateName);
      if (!existing) return false;

      const updatedTemplate: LayoutTemplate = {
        ...template,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString()
      };

      const transaction = this.db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(updatedTemplate);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      return false;
    }
  }

  async loadTemplate(name: string): Promise<LayoutTemplate | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      
      return new Promise<LayoutTemplate | null>((resolve, reject) => {
        const request = store.get(name);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      return null;
    }
  }

  async listTemplates(): Promise<LayoutTemplate[]> {
    if (!this.db) return [];

    try {
      const transaction = this.db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      
      return new Promise<LayoutTemplate[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Erro ao listar templates:', error);
      return [];
    }
  }

  async deleteTemplate(name: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar template:', error);
      return false;
    }
  }

  async saveCurrentSession(folders: FolderType[], settings: any = {}): Promise<boolean> {
    if (!this.db) return false;

    try {
      const sessionData = {
        folders,
        settings,
        timestamp: new Date().toISOString()
      };

      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.add(sessionData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
      return false;
    }
  }

  async saveSetting(key: string, value: any): Promise<boolean> {
    if (!this.db) return false;

    try {
      const settingData = {
        key,
        value: JSON.stringify(value),
        updatedAt: new Date().toISOString()
      };

      const transaction = this.db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(settingData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  }

  async loadSetting(key: string): Promise<any> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      
      return new Promise<any>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? JSON.parse(result.value) : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      return null;
    }
  }

  private async addDefaultTemplates(): Promise<void> {
    try {
      const templates = await this.listTemplates();
      if (templates.length > 0) return; // Já existem templates

      const defaultTemplates = [
        {
          name: "book anp",
          description: "Template para organização ANP com estrutura de livros e regulamentações",
          category: "regulatory" as const,
          folders: [
            {
              id: "anp-root",
              name: "ANP - Agência Nacional do Petróleo",
              color: "bg-blue-600",
              textColor: "text-white",
              icon: "book",
              iconType: "preset" as const,
              subFolders: [
                {
                  id: "anp-laws",
                  name: "Leis e Decretos",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "gavel",
                  iconType: "preset" as const,
                  level: 1,
                  tags: ["regulamentação", "legislação"],
                  responsible: "Jurídico"
                },
                {
                  id: "anp-resolutions",
                  name: "Resoluções",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "file-text",
                  iconType: "preset" as const,
                  level: 1,
                  tags: ["resoluções", "normativo"],
                  responsible: "Regulatório"
                },
                {
                  id: "anp-technical",
                  name: "Normas Técnicas",
                  color: "bg-orange-600",
                  textColor: "text-white",
                  icon: "settings",
                  iconType: "preset" as const,
                  level: 1,
                  tags: ["técnico", "normas"],
                  responsible: "Técnico"
                },
                {
                  id: "anp-procedures",
                  name: "Procedimentos",
                  color: "bg-indigo-600",
                  textColor: "text-white",
                  icon: "list",
                  iconType: "preset" as const,
                  level: 1,
                  tags: ["procedimentos", "operacional"],
                  responsible: "Operações"
                }
              ],
              level: 0,
              tags: ["anp", "petróleo", "regulação"],
              responsible: "Coordenador ANP"
            }
          ]
        },
        {
          name: "Corporativo Básico",
          description: "Estrutura básica para organização corporativa",
          category: "business" as const,
          folders: [
            {
              id: "corp-root",
              name: "Documentos Corporativos",
              color: "bg-gray-600",
              textColor: "text-white",
              icon: "building",
              iconType: "preset" as const,
              subFolders: [
                {
                  id: "corp-admin",
                  name: "Administrativo",
                  color: "bg-blue-500",
                  textColor: "text-white",
                  icon: "clipboard",
                  iconType: "preset" as const,
                  level: 1,
                  tags: ["administrativo"],
                  responsible: "Admin"
                },
                {
                  id: "corp-finance",
                  name: "Financeiro",
                  color: "bg-green-500",
                  textColor: "text-white",
                  icon: "dollar-sign",
                  iconType: "preset" as const,
                  level: 1,
                  tags: ["financeiro"],
                  responsible: "CFO"
                }
              ],
              level: 0,
              tags: ["corporativo"],
              responsible: "Gerência"
            }
          ]
        }
      ];

      for (const template of defaultTemplates) {
        await this.saveTemplate(template);
      }

      console.log('✅ Templates padrão adicionados ao IndexedDB');
    } catch (error) {
      console.error('Erro ao adicionar templates padrão:', error);
    }
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
let dbInstance: BrowserDatabaseManager | null = null;

export async function getBrowserDatabase(): Promise<BrowserDatabaseManager> {
  if (!dbInstance) {
    dbInstance = new BrowserDatabaseManager();
    await dbInstance.init();
  }
  return dbInstance;
}

export function closeBrowserDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
} 