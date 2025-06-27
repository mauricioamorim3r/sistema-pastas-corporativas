import { Folder } from '../types';

export interface LocalStorageConfig {
  basePath: string;
  enabled: boolean;
  autoCreateSubfolders: boolean;
  preserveStructure: boolean;
}

export interface SavedFileInfo {
  id: string;
  originalName: string;
  savedPath: string;
  savedAt: string;
  size: number;
  type: string;
  folderId: string;
}

/**
 * Gerenciador de Pasta Local Automática
 * Cria e gerencia pasta dedicada para arquivos da aplicação
 */
export class LocalFolderManager {
  private config: LocalStorageConfig;
  private rootHandle: FileSystemDirectoryHandle | null = null;
  private initialized = false;

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Carrega configuração do localStorage
   */
  private loadConfig(): LocalStorageConfig {
    try {
      const saved = localStorage.getItem('local-folder-config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração de pasta local:', error);
    }

    // Configuração padrão
    return {
      basePath: 'Documentos/PastasApp',
      enabled: false,
      autoCreateSubfolders: true,
      preserveStructure: true
    };
  }

  /**
   * Salva configuração no localStorage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem('local-folder-config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Erro ao salvar configuração de pasta local:', error);
    }
  }

  /**
   * Verifica se o File System Access API está disponível
   */
  isSupported(): boolean {
    return 'showDirectoryPicker' in window && typeof (window as any).showDirectoryPicker === 'function';
  }

  /**
   * Inicializa o sistema de pasta local
   */
  async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('File System Access API não suportada');
      return false;
    }

    try {
      // Solicita permissão para pasta raiz onde será criada a estrutura
      const showDirectoryPicker = (window as any).showDirectoryPicker;
      this.rootHandle = await showDirectoryPicker({
        mode: 'readwrite'
      });

      if (!this.rootHandle) {
        console.error('Não foi possível obter handle da pasta');
        return false;
      }

      // Cria pasta base "PastasApp" se não existir
      const appFolder = await this.rootHandle.getDirectoryHandle('PastasApp', { 
        create: true 
      });

      this.rootHandle = appFolder;
      this.initialized = true;
      this.config.enabled = true;
      this.saveConfig();

      console.log('✅ Sistema de pasta local inicializado');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar pasta local:', error);
      return false;
    }
  }

  /**
   * Cria estrutura de subpasta baseada na pasta da aplicação
   */
  private async createFolderStructure(folder: Folder): Promise<FileSystemDirectoryHandle> {
    if (!this.rootHandle) {
      throw new Error('Sistema não inicializado');
    }

    // Sanitizar nome da pasta para sistema de arquivos
    const safeName = this.sanitizeFolderName(folder.name);
    
    return await this.rootHandle.getDirectoryHandle(safeName, { create: true });
  }

  /**
   * Sanitiza nome de pasta para compatibilidade com sistema de arquivos
   */
  private sanitizeFolderName(name: string): string {
    return name
      .replace(/[<>:"/\\|?*]/g, '-') // Caracteres inválidos
      .replace(/\s+/g, '_') // Espaços para underscore
      .substring(0, 100); // Limitar tamanho
  }

  /**
   * Salva arquivo na pasta local
   */
  async saveFile(file: File, folder: Folder): Promise<SavedFileInfo | null> {
    if (!this.initialized || !this.rootHandle) {
      throw new Error('Sistema de pasta local não inicializado');
    }

    try {
      // Criar estrutura da pasta se necessário
      const folderHandle = await this.createFolderStructure(folder);

      // Gerar nome único para evitar conflitos
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = file.name.split('.').pop() || '';
      const safeName = this.sanitizeFolderName(
        file.name.replace(`.${fileExtension}`, '')
      );
      const fileName = `${safeName}_${timestamp}.${fileExtension}`;

      // Criar arquivo
      const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      
      await writable.write(file);
      await writable.close();

      // Gerar caminho completo para link
      const fullPath = `${this.config.basePath}/${this.sanitizeFolderName(folder.name)}/${fileName}`;

      const savedFileInfo: SavedFileInfo = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        originalName: file.name,
        savedPath: fullPath,
        savedAt: new Date().toISOString(),
        size: file.size,
        type: file.type,
        folderId: String(folder.id)
      };

      // Salvar registro no localStorage
      this.saveFileRecord(savedFileInfo);

      console.log('✅ Arquivo salvo:', fileName);
      return savedFileInfo;
    } catch (error) {
      console.error('❌ Erro ao salvar arquivo:', error);
      throw error;
    }
  }

  /**
   * Salva registro do arquivo no localStorage
   */
  private saveFileRecord(fileInfo: SavedFileInfo): void {
    try {
      const records = this.getFileRecords();
      records.push(fileInfo);
      localStorage.setItem('local-saved-files', JSON.stringify(records));
    } catch (error) {
      console.warn('Erro ao salvar registro de arquivo:', error);
    }
  }

  /**
   * Obtém registros de arquivos salvos
   */
  getFileRecords(): SavedFileInfo[] {
    try {
      const saved = localStorage.getItem('local-saved-files');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Erro ao carregar registros de arquivos:', error);
      return [];
    }
  }

  /**
   * Obtém arquivos de uma pasta específica
   */
  getFilesByFolder(folderId: string): SavedFileInfo[] {
    return this.getFileRecords().filter(file => file.folderId === folderId);
  }

  /**
   * Remove arquivo do sistema e registro
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const records = this.getFileRecords();
      const fileIndex = records.findIndex(f => f.id === fileId);
      
      if (fileIndex === -1) {
        console.warn('Arquivo não encontrado nos registros');
        return false;
      }

      const fileInfo = records[fileIndex];
      
      // Tentar remover arquivo físico (se possível)
      if (this.initialized && this.rootHandle) {
        try {
          const pathParts = fileInfo.savedPath.split('/');
          const folderName = pathParts[pathParts.length - 2];
          const fileName = pathParts[pathParts.length - 1];
          
          const folderHandle = await this.rootHandle.getDirectoryHandle(folderName);
          await folderHandle.removeEntry(fileName);
        } catch (error) {
          console.warn('Não foi possível remover arquivo físico:', error);
        }
      }

      // Remover do registro
      records.splice(fileIndex, 1);
      localStorage.setItem('local-saved-files', JSON.stringify(records));

      console.log('✅ Arquivo removido:', fileInfo.originalName);
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover arquivo:', error);
      return false;
    }
  }

  /**
   * Atualiza configuração
   */
  updateConfig(newConfig: Partial<LocalStorageConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  /**
   * Obtém configuração atual
   */
  getConfig(): LocalStorageConfig {
    return { ...this.config };
  }

  /**
   * Desabilita sistema
   */
  disable(): void {
    this.config.enabled = false;
    this.initialized = false;
    this.rootHandle = null;
    this.saveConfig();
  }

  /**
   * Gera link para abertura do arquivo
   */
  generateFileLink(fileInfo: SavedFileInfo): string {
    // Para Windows - caminho UNC ou drive
    if (navigator.platform.toLowerCase().includes('win')) {
      const userProfile = 'C:\\Users\\%USERNAME%';
      return `${userProfile}\\Documents\\PastasApp\\${fileInfo.savedPath.split('/').slice(-2).join('\\')}`;
    }
    
    // Para outros sistemas
    return `~/Documents/PastasApp/${fileInfo.savedPath.split('/').slice(-2).join('/')}`;
  }

  /**
   * Verifica se sistema está inicializado
   */
  isInitialized(): boolean {
    return this.initialized && this.config.enabled;
  }
}

// Instância singleton
export const localFolderManager = new LocalFolderManager(); 