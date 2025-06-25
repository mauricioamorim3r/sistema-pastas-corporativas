export interface Folder {
  id: string | number;
  name: string;
  isOpen?: boolean;
  color: string; // Tailwind background color class, e.g., 'bg-blue-600'
  textColor?: string; // Tailwind text color class, e.g., 'text-white'
  icon?: string; // Nome do ícone ou URL do ícone personalizado
  iconType?: 'preset' | 'custom' | 'modern'; // Tipo do ícone
  path?: string;
  responsible?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  description?: string;
  subFolders?: Folder[];
  subCount?: number;
  fileCount?: number;
  monitorDeadline?: string; // e.g. '30/04/2025'
  link?: string; // URL/caminho para abrir a pasta
  metrics?: FolderMetrics; // Métricas da pasta
}

// Novo: Layout Expandido com dados completos
export interface CompleteSavedLayout {
  id: string;
  name: string;
  description?: string;
  
  // Configurações de UI (legado mantido)
  leftWidth: number;
  isDarkMode: boolean;
  isDetailsPanelOpen: boolean;
  
  // Novos: Estado completo das pastas
  folders: Folder[]; // Estrutura completa de pastas
  expandedFolders: (string | number)[]; // IDs das pastas expandidas
  selectedFolder?: Folder; // Pasta selecionada
  
  // Estado dos filtros
  searchQuery?: string;
  selectedResponsible?: string;
  
  // Estado dos painéis auxiliares
  showFavoritesPanel?: boolean;
  showHistoryPanel?: boolean;
  showMonitoringPanel?: boolean;
  
  // Metadados do layout
  createdAt: string;
  updatedAt: string;
  version: string; // Para versionamento de layouts
  category?: string; // Ex: 'Projetos', 'Administrativo', 'Pessoal'
  tags?: string[]; // Tags para categorização
  isTemplate?: boolean; // Se é um template compartilhável
  
  // Estatísticas do layout
  stats?: LayoutStats;
}

export interface LayoutStats {
  totalFolders: number;
  totalSubfolders: number;
  responsiblesCount: number;
  tagsUsed: string[];
  lastUsed?: string;
  useCount: number;
}

// Interface para compatibilidade com layouts antigos
export interface LegacySavedLayout {
  id: string;
  name: string;
  leftWidth: number;
  isDarkMode: boolean;
  isDetailsPanelOpen: boolean;
  createdAt: string;
  description?: string;
}

// Estrutura para futuro banco de dados
export interface DatabaseSchema {
  layouts: CompleteSavedLayout[];
  folders: Folder[];
  favorites: FavoriteFolderData[];
  monitoring: FolderMonitoring[];
  history: HistoryEntry[];
  settings: ApplicationSettings;
  metadata: DatabaseMetadata;
}

export interface FavoriteFolderData {
  id: string;
  originalFolderId: string | number;
  name: string;
  path?: string;
  responsible?: string;
  color: string;
  textColor?: string;
  addedAt: string;
}

export interface HistoryEntry {
  id: string;
  type: 'create' | 'update' | 'delete' | 'import';
  entityType: 'folder' | 'layout' | 'favorite';
  entityId: string;
  description: string;
  timestamp: string;
  data?: any; // Dados específicos da ação
}

export interface ApplicationSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en' | 'es';
  notifications: boolean;
  autoSave: boolean;
  backupInterval: number; // em horas
  maxHistoryEntries: number;
  defaultLayout?: string; // ID do layout padrão
}

export interface DatabaseMetadata {
  version: string;
  createdAt: string;
  lastBackup?: string;
  totalEntries: number;
  dataSize: number; // em bytes
}

// Enums para categorização
export enum LayoutCategory {
  PROJECT = 'Projetos',
  ADMINISTRATIVE = 'Administrativo',
  PERSONAL = 'Pessoal',
  DEPARTMENT = 'Departamental',
  TEMPORARY = 'Temporário',
  TEMPLATE = 'Template'
}

export enum DatabaseProvider {
  LOCAL_STORAGE = 'localStorage',
  INDEXED_DB = 'indexedDB',
  FIREBASE = 'firebase',
  SUPABASE = 'supabase',
  MONGODB = 'mongodb'
}

export interface FolderMetrics {
  documentCount: number; // Quantidade de documentos
  totalSize: number; // Tamanho total em bytes
  fileTypes: FileTypeMetric[]; // Tipos de arquivo e suas quantidades
  lastAccessed?: string; // Último acesso
  averageFileSize: number; // Tamanho médio dos arquivos
  largestFile?: FileInfo; // Maior arquivo
  oldestFile?: FileInfo; // Arquivo mais antigo
  newestFile?: FileInfo; // Arquivo mais recente
}

export interface FileTypeMetric {
  extension: string; // ex: 'pdf', 'docx', 'xlsx'
  count: number; // quantidade deste tipo
  totalSize: number; // tamanho total deste tipo em bytes
  percentage: number; // porcentagem do total
}

export interface FileInfo {
  name: string;
  size: number; // em bytes
  lastModified: string;
  type: string;
}

// Sistema de Monitoramento de Pastas Favoritas
export interface FolderMonitoring {
  isActive: boolean;
  path: string;
  notifications: FolderNotification[];
  fileTypeFilter?: string; // ex: 'pdf', 'docx', 'xlsx'
  timer?: MonitoringTimer;
  lastScan: string;
  scanInterval: number; // em ms
}

export interface FolderNotification {
  id: string;
  type: 'created' | 'modified' | 'deleted';
  fileName: string;
  filePath: string;
  fileType: string;
  timestamp: string;
  fileSize?: number;
  isRead: boolean;
}

export interface MonitoringTimer {
  isActive: boolean;
  startTime: string;
  duration: number; // em ms
  unit: 'hours' | 'days' | 'weeks' | 'months';
  displayDuration: number; // valor original para display
  description: string;
  isExpired: boolean;
  notificationSent: boolean;
}

export interface MonitoringSettings {
  enableRealTimeNotifications: boolean;
  enableFileTypeFilter: boolean;
  enableTimer: boolean;
  autoMarkAsRead: boolean;
  maxNotifications: number;
  soundEnabled: boolean;
}

export interface ColorOption {
  name: string;
  value: string; // Tailwind background color class
  textClass?: string; // Tailwind text color class
}

export interface IconOption {
  id: string;
  name: string;
  category: 'folder' | 'business' | 'development' | 'files' | 'tools' | 'communication' | 'technology' | 'finance';
  type: 'preset' | 'modern';
  color?: string;
}

// ViewMode enum removed as it's no longer used
// export enum ViewMode {
//   List = 'list',
//   Modern = 'modern',
// }

export interface NewFolderData {
  name: string;
  color: string;
  textColor: string;
  path: string;
  responsible: string;
  tags: string[];
  description: string;
  link: string;
  icon: string;
  iconType: 'preset' | 'custom' | 'modern';
}

// Alias para compatibilidade com o sistema de banco de dados
export type FolderType = Folder;

export interface LayoutTemplate {
  id?: number;
  name: string;
  description?: string;
  category: 'business' | 'personal' | 'regulatory' | 'development' | 'other';
  folders: FolderType[];
  settings?: any;
  previewImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonitoringData {
  id?: number;
  folderId: string;
  metricType: string;
  value: number;
  timestamp: string;
}
