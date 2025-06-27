import { FolderType, LayoutTemplate } from '../types';
import { captureError } from '../sentry';

export class BrowserDatabaseManager {
  private dbName = 'organizador-db';
  private dbVersion = 2; // Incrementar versão para migração
  private db: IDBDatabase | null = null;
  
  // Chaves específicas para migração do localStorage
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
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.addDefaultTemplates();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;

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

        // MIGRAÇÃO SEGURA: Novos object stores para localStorage migrado (versão 2)
        if (oldVersion < 2) {
          console.log('🔄 Iniciando migração segura localStorage → IndexedDB');
          
          // Object store para dados migrados do localStorage
          if (!db.objectStoreNames.contains('localStorage_migrated')) {
            const localStorageStore = db.createObjectStore('localStorage_migrated', { keyPath: 'key' });
            localStorageStore.createIndex('migratedAt', 'migratedAt', { unique: false });
            localStorageStore.createIndex('originalSource', 'originalSource', { unique: false });
          }

          // Object store para backups de segurança
          if (!db.objectStoreNames.contains('migration_backups')) {
            const backupStore = db.createObjectStore('migration_backups', { keyPath: 'id', autoIncrement: true });
            backupStore.createIndex('timestamp', 'timestamp', { unique: false });
            backupStore.createIndex('type', 'type', { unique: false });
          }
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
      if (import.meta.env.MODE === 'development') {
        console.error('Erro ao salvar template:', error);
      }
      captureError(error as Error, { context: 'saveTemplate', templateName: template.name });
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
      if (import.meta.env.MODE === 'development') {
        console.error('Erro ao atualizar template:', error);
      }
      captureError(error as Error, { context: 'updateTemplate', templateName });
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
      if (import.meta.env.MODE === 'development') {
        console.error('Erro ao carregar template:', error);
      }
      captureError(error as Error, { context: 'loadTemplate', templateName: name });
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

  private async cleanupOldTemplates(): Promise<void> {
    try {
      // Templates antigos em formato incorreto
      const templatesInMinusculo = ['book anp', 'Corporativo Básico'];
      
      // Forçar recriação dos templates principais para pegar estruturas atualizadas
      const forceRecreate = ['BOOK ANP', 'PAPA-TERRA MEDIÇÃO', 'CORPORATIVO BÁSICO'];
      
      for (const templateName of [...templatesInMinusculo, ...forceRecreate]) {
        await this.deleteTemplate(templateName);
        console.log(`🔄 Template removido: ${templateName}`);
      }
      
      // Limpar responsáveis padrão antigos do localStorage
      localStorage.removeItem('edited-default-responsibles');
      
      console.log('✅ Templates removidos para recriação com estruturas atualizadas');
    } catch (error) {
      console.error('Erro ao limpar templates antigos:', error);
    }
  }

  private async addDefaultTemplates(): Promise<void> {
    try {
      // Primeiro, limpar templates duplicados/antigos
      await this.cleanupOldTemplates();
      
      // Verificar se os templates corretos já existem
      const templates = await this.listTemplates();
      const templateNames = templates.map(t => t.name);
      const expectedTemplates = ['BOOK ANP', 'CORPORATIVO BÁSICO', 'PAPA-TERRA MEDIÇÃO'];
      
      // Verificar se precisamos recriar templates (sempre recrear após limpeza)
      const hasAllCorrectTemplates = expectedTemplates.every(name => templateNames.includes(name));
      if (hasAllCorrectTemplates && templates.length >= 3) {
        console.log('✅ Templates já existem com estruturas corretas');
        return;
      }

      const defaultTemplates = [
        {
          name: "BOOK ANP",
          description: "Estrutura completa para documentação ANP - Book de Medição",
          category: "regulatory" as const,
          folders: [
            {
              id: "memorial-descritivo",
              name: "01. MEMORIAL DESCRITIVO",
              color: "bg-blue-700",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "memorial"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "fluxograma-simplificado", 
              name: "02. FLUXOGRAMA SIMPLIFICADO",
              color: "bg-green-700",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "fluxograma"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "fluxograma-engenharia",
              name: "03. FLUXOGRAMA DE ENGENHARIA", 
              color: "bg-purple-700",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "engenharia"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "isometrico",
              name: "04. ISOMÉTRICO",
              color: "bg-orange-700", 
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "isometrico"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "arquivo-configuracao-cv",
              name: "05. CONFIGURAÇÃO COMPUTADOR DE VAZÃO",
              color: "bg-red-700",
              textColor: "text-white", 
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "configuracao"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "folha-dados",
              name: "06. FOLHA DE DADOS",
              color: "bg-indigo-700",
              textColor: "text-white",
              icon: "folder", 
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "dados"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "certificados-calibracao",
              name: "07. CERTIFICADOS DE CALIBRAÇÃO",
              color: "bg-pink-700",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "calibracao"], 
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "testes-estanqueidade",
              name: "08. TESTES DE ESTANQUEIDADE",
              color: "bg-cyan-700",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "testes"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "documentos-complementares",
              name: "09. DOCUMENTOS COMPLEMENTARES",
              color: "bg-gray-700",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "complementares"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "relatorios-medicao",
              name: "10. RELATÓRIOS DE MEDIÇÃO",
              color: "bg-yellow-600",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["anp", "relatorios"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            }
          ]
        },
        {
          name: "CORPORATIVO BÁSICO",
          description: "Estrutura corporativa completa para gestão de instalações e medição",
          category: "business" as const,
          folders: [
            {
              id: "corp-doc-geral",
              name: "1. Documentação Geral da Instalação",
              color: "bg-blue-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [
                {
                  id: "corp-memorial-calc",
                  name: "1.1 Memorial do Cálculo de Fechamento de Produção",
              color: "bg-blue-600",
              textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["memorial"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-memorial-desc",
                  name: "1.2 Memorial Descritivo da Instalação",
                  color: "bg-blue-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["memorial"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-fluxograma",
                  name: "1.3 Fluxograma (P&ID; PFD; Isométricos)",
                  color: "bg-blue-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["fluxograma"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-diagrama",
                  name: "1.4 Diagrama Esquemático",
                  color: "bg-blue-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["diagrama"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-arquitetura",
                  name: "1.5 Arquitetura do Sistema",
                  color: "bg-blue-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["arquitetura"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-folha-dados",
                  name: "1.6 Folha de Dados",
                  color: "bg-blue-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["dados"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-procedimentos",
                  name: "1.7 Procedimentos Gerais da Instalação",
                  color: "bg-blue-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["procedimentos"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-plano-lacres",
                  name: "1.8 Plano de Gerenciamento de Lacres e Proteção",
                  color: "bg-blue-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["lacres"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                }
              ],
              tags: ["documentação", "instalação"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-doc-medicao",
              name: "2. Documentação do Ponto de Medição",
              color: "bg-green-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [
                {
                  id: "corp-dados-diarios",
                  name: "2.1 Dados das medições diárias",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["medições"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-elemento-primario",
                  name: "2.2 Elemento Primário",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["elemento"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-elementos-secundarios",
                  name: "2.3 Elementos Secundários",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["elementos"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-incerteza",
                  name: "2.4 Avaliação da Incerteza do Sistema de Medição",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["incerteza"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-amostrador",
                  name: "2.5 Amostrador Automático",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["amostrador"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-analises",
                  name: "2.6 Relatórios de Análises Físico Químicas",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["análises"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-computador-vazao",
                  name: "2.7 Computador de Vazão",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["computador"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-teste-estanqueidade",
                  name: "2.8 Teste de estanqueidade de válvulas",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["teste"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-proc-operacionais",
                  name: "2.9 Procedimentos Operacionais",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["procedimentos"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-controle-lacres",
                  name: "2.10 Controle de lacres",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["controle"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-teste-poco",
                  name: "2.11 Teste de poço",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["teste"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-rotinas-medicao",
                  name: "2.12 Rotinas de Medição",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["rotinas"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-nfsm",
                  name: "2.13 NFSM",
                  color: "bg-green-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["nfsm"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                }
              ],
              tags: ["documentação", "medição"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-anp",
              name: "3. ANP",
              color: "bg-purple-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [
                {
                  id: "corp-waiver-xml",
                  name: "3.1 Waiver para envio de XML",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["waiver"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-plano-desenvolvimento",
                  name: "3.2 Plano de Desenvolvimento (PD)",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["plano"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-inspecao-anp",
                  name: "3.3 Inspeção ANP 04-2009",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["inspeção"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-i-simp",
                  name: "3.4 I-Simp",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["i-simp"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-extensao-teste",
                  name: "3.5 Extensão teste de Poço - Troca de válvula",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["extensão"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-pap",
                  name: "3.6 PAP",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["pap"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-autuacao-bmp",
                  name: "3.7 Autuação BMP 11_2024",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["autuação"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-aprovacao-cangoa",
                  name: "3.8 Aprovação da Metodologia de Cangoa",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["aprovação"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-aprovacao-metodologia",
                  name: "3.9 Aprovação de metodologia dos pontos estimados",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["metodologia"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-aprovacao-pontos",
                  name: "3.10 Aprovação dos pontos de medição",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["pontos"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-cancelamento-pontos",
                  name: "3.11 Cancelamento de Pontos de Medição",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["cancelamento"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                },
                {
                  id: "corp-upgrade-computadores",
                  name: "3.12 Upgrade dos computadores de vazão",
                  color: "bg-purple-600",
                  textColor: "text-white",
                  icon: "folder",
                  iconType: "modern" as const,
                  subFolders: [],
                  tags: ["upgrade"],
                  responsible: "Todos",
                  createdAt: "20/03/2025",
                  updatedAt: "24/06/2025"
                }
              ],
              tags: ["anp", "regulamentação"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-contratos",
              name: "4. Contratos",
              color: "bg-orange-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["contratos"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-gestao-processos",
              name: "5. Gestão Processos de Medição",
              color: "bg-red-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["gestão"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-fechamento-mensal",
              name: "6. Fechamento Mensal da Produção",
              color: "bg-indigo-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["fechamento"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-requisicoes",
              name: "7. Requisições",
              color: "bg-pink-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["requisições"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-assuntos-gerais",
              name: "8. Assuntos Gerais",
              color: "bg-gray-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["assuntos"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "corp-projetos",
              name: "9. Projetos",
              color: "bg-teal-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["projetos"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            }
          ]
        },
        {
          name: "PAPA-TERRA MEDIÇÃO",
          description: "Estrutura PAPA-TERRA - Sistema de Medição Operacional",
          category: "other" as const,
          folders: [
            {
              id: "ppt-xml",
              name: "00.XML",
              color: "bg-blue-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["xml", "dados"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-teste-poco",
              name: "01.Teste de Poço",
              color: "bg-green-800",
                  textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["teste", "poço"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-nfsm",
              name: "02.NFSM",
              color: "bg-purple-800",
                  textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["nfsm"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-bmp",
              name: "03.BMP",
              color: "bg-orange-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["bmp"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-analises-quimicas",
              name: "04.Análises Químicas",
              color: "bg-red-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["análises", "químicas"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-certificados",
              name: "05.Certificados",
              color: "bg-indigo-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["certificados"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-backup-cvs",
              name: "06.Backup-CV's",
              color: "bg-pink-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["backup", "cv"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-gestao-medicao",
              name: "07.Gestão Medição",
              color: "bg-gray-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["gestão", "medição"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-offloading",
              name: "08.Offloading",
              color: "bg-teal-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["offloading"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-comunicacao-anp",
              name: "09. Comunicação ANP",
              color: "bg-cyan-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["comunicação", "anp"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-controle-lacres",
              name: "10.Controle de Lacres",
              color: "bg-lime-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["controle", "lacres"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-pcs",
              name: "11.PCS",
              color: "bg-emerald-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["pcs"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-cuna-pev",
              name: "12.Cuna PEV e Contaminantes",
              color: "bg-amber-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["cuna", "pev", "contaminantes"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-contratos",
              name: "13.Contratos",
              color: "bg-yellow-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["contratos"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-compra-estoque",
              name: "14.Compra e Estoque de Materiais",
              color: "bg-stone-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["compra", "estoque", "materiais"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-projetos-melhorias",
              name: "15.Projetos e Melhorias",
              color: "bg-slate-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["projetos", "melhorias"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-reunioes-petrobras",
              name: "16.Reuniões Petrobrás",
              color: "bg-zinc-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["reuniões", "petrobrás"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
            },
            {
              id: "ppt-queima-extraordinaria",
              name: "17.Queima Extraordinária",
              color: "bg-neutral-800",
              textColor: "text-white",
              icon: "folder",
              iconType: "modern" as const,
              subFolders: [],
              tags: ["queima", "extraordinária"],
              responsible: "Todos",
              createdAt: "20/03/2025",
              updatedAt: "24/06/2025"
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

  // ==========================================
  // SISTEMA DE MIGRAÇÃO SEGURA - localStorage → IndexedDB
  // ==========================================

  // ETAPA 1: Verificar se migração é necessária e segura
  async checkMigrationStatus(): Promise<{
    needsMigration: boolean;
    hasBackup: boolean;
    itemsToMigrate: number;
    migrationComplete: boolean;
    errors: string[];
  }> {
    const result = {
      needsMigration: false,
      hasBackup: false,
      itemsToMigrate: 0,
      migrationComplete: false,
      errors: [] as string[]
    };

    if (!this.db) {
      result.errors.push('IndexedDB não inicializado');
      return result;
    }

    try {
      // Conta itens no localStorage que precisam ser migrados
      const itemsInLocalStorage = this.MIGRATION_KEYS.filter(key => 
        localStorage.getItem(key) !== null
      );
      result.itemsToMigrate = itemsInLocalStorage.length;

      // Verifica se já existe backup
      const backupTransaction = this.db.transaction(['migration_backups'], 'readonly');
      const backupStore = backupTransaction.objectStore('migration_backups');
      
      const backupCount = await new Promise<number>((resolve, reject) => {
        const request = backupStore.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      result.hasBackup = backupCount > 0;

      // Verifica se migração já foi feita
      const migrationTransaction = this.db.transaction(['localStorage_migrated'], 'readonly');
      const migrationStore = migrationTransaction.objectStore('localStorage_migrated');
      
      const migratedItems = await new Promise<any[]>((resolve, reject) => {
        const request = migrationStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const validatedItems = migratedItems.filter(item => item.validated);
      result.migrationComplete = validatedItems.length === this.MIGRATION_KEYS.length;

      // Determina se migração é necessária
      result.needsMigration = result.itemsToMigrate > 0 && !result.migrationComplete;

    } catch (error) {
      result.errors.push(`Erro ao verificar status: ${error}`);
    }

    return result;
  }

  // ETAPA 2: Criar backup COMPLETO do localStorage
  async createSafeBackup(): Promise<{ success: boolean; backupId?: number; error?: string }> {
    if (!this.db) return { success: false, error: 'IndexedDB não inicializado' };

    try {
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        type: 'complete-backup',
        data: {} as Record<string, string>
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
      
      const backupId = await new Promise<number>((resolve, reject) => {
        const request = store.add(backup);
        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
      });

      console.log('✅ Backup completo criado com ID:', backupId);
      return { success: true, backupId };
    } catch (error) {
      const errorMsg = `Erro ao criar backup: ${error}`;
      console.error('❌', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  // ETAPA 3: Migrar UMA chave por vez (super seguro)
  async migrateSingleKey(key: string): Promise<{
    success: boolean;
    validated: boolean;
    error?: string;
  }> {
    if (!this.db) return { success: false, validated: false, error: 'IndexedDB não inicializado' };

    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return { success: false, validated: false, error: `Chave '${key}' não encontrada` };
      }

      // Backup individual desta chave
      const singleBackup = {
        timestamp: new Date().toISOString(),
        type: 'single-key-backup',
        key,
        value
      };

      const backupTransaction = this.db.transaction(['migration_backups'], 'readwrite');
      const backupStore = backupTransaction.objectStore('migration_backups');
      await new Promise<void>((resolve, reject) => {
        const request = backupStore.add(singleBackup);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Migra para IndexedDB
      const migrationData = {
        key,
        value,
        originalSource: 'localStorage',
        migratedAt: new Date().toISOString(),
        validated: false
      };

      const migrationTransaction = this.db.transaction(['localStorage_migrated'], 'readwrite');
      const migrationStore = migrationTransaction.objectStore('localStorage_migrated');
      
      await new Promise<void>((resolve, reject) => {
        const request = migrationStore.put(migrationData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // VALIDAÇÃO: Verifica se o dado foi salvo corretamente
      const readTransaction = this.db.transaction(['localStorage_migrated'], 'readonly');
      const readStore = readTransaction.objectStore('localStorage_migrated');
      
      const savedData = await new Promise<any>((resolve, reject) => {
        const request = readStore.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!savedData || savedData.value !== value) {
        return { success: false, validated: false, error: 'Validação falhou - dados não coincidem' };
      }

      // Marca como validado
      savedData.validated = true;
      const validateTransaction = this.db.transaction(['localStorage_migrated'], 'readwrite');
      const validateStore = validateTransaction.objectStore('localStorage_migrated');
      
      await new Promise<void>((resolve, reject) => {
        const request = validateStore.put(savedData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log(`✅ Chave '${key}' migrada e validada com sucesso`);
      return { success: true, validated: true };

    } catch (error) {
      const errorMsg = `Erro na migração de '${key}': ${error}`;
      console.error('❌', errorMsg);
      return { success: false, validated: false, error: errorMsg };
    }
  }

  // ETAPA 4: Migração completa segura (só depois de testar cada chave)
  async performSafeMigration(): Promise<{
    success: boolean;
    itemsMigrated: number;
    errors: string[];
    backupCreated: boolean;
  }> {
    const result = {
      success: false,
      itemsMigrated: 0,
      errors: [] as string[],
      backupCreated: false
    };

    // Verifica status primeiro
    const status = await this.checkMigrationStatus();
    if (!status.needsMigration) {
      result.errors.push('Migração não é necessária ou já foi realizada');
      return result;
    }

    // Cria backup completo
    const backupResult = await this.createSafeBackup();
    if (!backupResult.success) {
      result.errors.push(backupResult.error || 'Falha ao criar backup');
      return result;
    }
    result.backupCreated = true;

    console.log('🔄 Iniciando migração segura...');

    // Migra uma chave por vez
    for (const key of this.MIGRATION_KEYS) {
      if (localStorage.getItem(key) !== null) {
        console.log(`🔄 Migrando: ${key}`);
        
        const keyResult = await this.migrateSingleKey(key);
        
        if (keyResult.success && keyResult.validated) {
          result.itemsMigrated++;
          console.log(`✅ ${key} migrado com sucesso`);
        } else {
          result.errors.push(keyResult.error || `Falha na migração de ${key}`);
          console.error(`❌ Falha na migração de ${key}:`, keyResult.error);
          // Para na primeira falha para evitar problemas
          break;
        }
      }
    }

    result.success = result.itemsMigrated > 0 && result.errors.length === 0;
    
    if (result.success) {
      console.log(`🎉 Migração concluída com sucesso! ${result.itemsMigrated} itens migrados`);
    } else {
      console.warn(`⚠️ Migração parcial ou com erros. ${result.itemsMigrated} itens migrados`);
    }

    return result;
  }

  // ETAPA 5: Método para RECUPERAR dados migrados (substituindo localStorage)
  async getMigratedValue(key: string): Promise<string | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(['localStorage_migrated'], 'readonly');
      const store = transaction.objectStore('localStorage_migrated');
      
      const result = await new Promise<any>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      return result ? result.value : null;
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.error(`Erro ao recuperar valor migrado '${key}':`, error);
      }
      return null;
    }
  }

  // ETAPA 6: Método para SALVAR dados (atualiza IndexedDB ao invés de localStorage)
  async saveMigratedValue(key: string, value: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const migrationData = {
        key,
        value,
        originalSource: 'application',
        migratedAt: new Date().toISOString(),
        validated: true
      };

      const transaction = this.db.transaction(['localStorage_migrated'], 'readwrite');
      const store = transaction.objectStore('localStorage_migrated');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(migrationData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.error(`Erro ao salvar valor migrado '${key}':`, error);
      }
      return false;
    }
  }

  // SEGURANÇA: Rollback em caso de problemas
  async rollbackMigration(): Promise<{ success: boolean; error?: string }> {
    if (!this.db) return { success: false, error: 'IndexedDB não inicializado' };

    try {
      const transaction = this.db.transaction(['localStorage_migrated'], 'readwrite');
      const store = transaction.objectStore('localStorage_migrated');
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      console.log('✅ Rollback realizado - dados migrados removidos');
      return { success: true };
    } catch (error) {
      const errorMsg = `Erro no rollback: ${error}`;
      console.error('❌', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async saveCurrentLayout(layoutName: string, folders: FolderType[], settings: any = {}): Promise<boolean> {
    if (!this.db) return false;

    try {
      const layoutData: LayoutTemplate = {
        name: layoutName,
        description: `Layout salvo automaticamente em ${new Date().toLocaleDateString('pt-BR')}`,
        category: 'business',
        folders: folders,
        settings: {
          ...settings,
          savedAt: new Date().toISOString(),
          totalFolders: this.countTotalFolders(folders),
          totalSubfolders: this.countTotalSubfolders(folders)
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const success = await this.saveTemplate(layoutData);
      
      if (success) {
        console.log(`Layout "${layoutName}" salvo com sucesso:`, layoutData);
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao salvar layout atual:', error);
      return false;
    }
  }

  private countTotalFolders(folders: FolderType[]): number {
    return folders.length;
  }

  private countTotalSubfolders(folders: FolderType[]): number {
    let count = 0;
    folders.forEach(folder => {
      if (folder.subFolders && folder.subFolders.length > 0) {
        count += folder.subFolders.length;
        count += this.countTotalSubfolders(folder.subFolders);
      }
    });
    return count;
  }

  // Função para mover pasta na hierarquia
  moveFolderInHierarchy(
    folders: FolderType[], 
    sourceFolderId: string | number, 
    targetFolderId: string | number | null
  ): FolderType[] {
    // Encontrar e remover a pasta de origem
    const { folder: sourceFolder, remainingFolders } = this.extractFolder(folders, sourceFolderId);
    
    if (!sourceFolder) {
      return folders; // Pasta de origem não encontrada
    }

    // Se targetFolderId é null, mover para o nível raiz
    if (targetFolderId === null) {
      return [...remainingFolders, sourceFolder];
    }

    // Adicionar a pasta ao destino
    return this.insertFolderIntoTarget(remainingFolders, sourceFolder, targetFolderId);
  }

  private extractFolder(
    folders: FolderType[], 
    folderId: string | number
  ): { folder: FolderType | null, remainingFolders: FolderType[] } {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        const folder = folders[i];
        const remainingFolders = [...folders.slice(0, i), ...folders.slice(i + 1)];
        return { folder, remainingFolders };
      }

      const subFolders = folders[i].subFolders;
      if (subFolders && subFolders.length > 0) {
        const result = this.extractFolder(subFolders, folderId);
        if (result.folder) {
          const updatedFolder = {
            ...folders[i],
            subFolders: result.remainingFolders
          };
          const remainingFolders = [
            ...folders.slice(0, i),
            updatedFolder,
            ...folders.slice(i + 1)
          ];
          return { folder: result.folder, remainingFolders };
        }
      }
    }

    return { folder: null, remainingFolders: folders };
  }

  private insertFolderIntoTarget(
    folders: FolderType[], 
    sourceFolder: FolderType, 
    targetFolderId: string | number
  ): FolderType[] {
    return folders.map(folder => {
      if (folder.id === targetFolderId) {
        return {
          ...folder,
          subFolders: [...(folder.subFolders || []), sourceFolder]
        };
      }

      if (folder.subFolders && folder.subFolders.length > 0) {
        return {
          ...folder,
          subFolders: this.insertFolderIntoTarget(folder.subFolders, sourceFolder, targetFolderId)
        };
      }

      return folder;
    });
  }

  // Validar se movimento é permitido (evitar loops)
  validateFolderMove(
    folders: FolderType[], 
    sourceFolderId: string | number, 
    targetFolderId: string | number | null
  ): { isValid: boolean, reason?: string } {
    if (sourceFolderId === targetFolderId) {
      return { isValid: false, reason: 'Não é possível mover uma pasta para si mesma' };
    }

    // Se mover para raiz, sempre válido
    if (targetFolderId === null) {
      return { isValid: true };
    }

    // Verificar se target é descendente de source (evitar loops)
    const isDescendant = this.isFolderDescendant(folders, targetFolderId, sourceFolderId);
    if (isDescendant) {
      return { isValid: false, reason: 'Não é possível mover uma pasta para dentro de suas subpastas' };
    }

    return { isValid: true };
  }

  private isFolderDescendant(
    folders: FolderType[], 
    potentialDescendantId: string | number, 
    ancestorId: string | number
  ): boolean {
    const ancestorFolder = this.findFolderById(folders, ancestorId);
    if (!ancestorFolder || !ancestorFolder.subFolders || ancestorFolder.subFolders.length === 0) {
      return false;
    }

    return this.searchInSubFolders(ancestorFolder.subFolders, potentialDescendantId);
  }

  private searchInSubFolders(subFolders: FolderType[], targetId: string | number): boolean {
    for (const folder of subFolders) {
      if (folder.id === targetId) {
        return true;
      }
      if (folder.subFolders && folder.subFolders.length > 0 && this.searchInSubFolders(folder.subFolders, targetId)) {
        return true;
      }
    }
    return false;
  }

  private findFolderById(folders: FolderType[], folderId: string | number): FolderType | null {
    for (const folder of folders) {
      if (folder.id === folderId) {
        return folder;
      }
      if (folder.subFolders && folder.subFolders.length > 0) {
        const found = this.findFolderById(folder.subFolders, folderId);
        if (found) return found;
      }
    }
    return null;
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