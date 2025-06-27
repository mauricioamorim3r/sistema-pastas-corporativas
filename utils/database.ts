import { neon } from '@neondatabase/serverless';
import { Folder } from '../types';
import logger from './secureLogger';

// Configuração da conexão com Neon com timeout
const sql = neon('postgresql://neondb_owner:npg_eIBfo69wquxO@ep-still-haze-a5ct2l39-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require');

// Configurações de timeout
const TIMEOUT_CONFIG = {
  short: 5000,   // 5s para operações simples
  medium: 15000, // 15s para operações médias
  long: 30000    // 30s para operações complexas
};

/**
 * Wrapper para operações com timeout
 */
async function withTimeout<T>(
  operation: Promise<T>, 
  timeoutMs: number,
  operationName: string
): Promise<T> {
  const startTime = Date.now();
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      const duration = Date.now() - startTime;
      logger.warn(`Timeout em operação: ${operationName}`, { 
        timeout: timeoutMs, 
        duration 
      });
      reject(new Error(`Timeout: ${operationName} excedeu ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([operation, timeoutPromise]);
    const duration = Date.now() - startTime;
    
    // Log performance para operações lentas
    if (duration > 1000) {
      logger.performance(operationName, duration);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Erro em operação de banco: ${operationName}`, error as Error, { 
      duration,
      timeout: timeoutMs 
    });
    throw error;
  }
}

// Tipos específicos do banco
export interface DbFolder {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  parent_id: number | null;
  icon: string | null;
  color: string | null;
  responsible: string | null;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  metadata: Record<string, any>;
}

export interface DbFile {
  id: number;
  uuid: string;
  folder_id: number;
  name: string;
  original_name: string;
  size_bytes: number;
  mime_type: string | null;
  file_extension: string | null;
  storage_type: 'database' | 'local' | 'cloud' | 'url';
  storage_path: string | null;
  file_data: string | null;
  upload_date: string;
  last_accessed: string;
  access_count: number;
  uploaded_by: string | null;
  metadata: Record<string, any>;
}

// Utilitário para converter DbFolder para Folder
export function dbFolderToFolder(dbFolder: DbFolder): Folder {
  return {
    id: dbFolder.uuid,
    name: dbFolder.name,
    isOpen: false,
    color: dbFolder.color || '#3B82F6',
    textColor: 'text-white',
    icon: dbFolder.icon || 'Folder',
    responsible: dbFolder.responsible || 'Não definido',
    createdAt: dbFolder.created_at,
    updatedAt: dbFolder.updated_at,
    tags: dbFolder.tags || [],
    description: dbFolder.description || '',
    subFolders: []
  };
}

// === FUNÇÕES PRINCIPAIS ===

/**
 * Testa a conexão com o banco
 */
export async function testConnection(): Promise<boolean> {
  try {
    const operation = sql`SELECT 1 as connected`;
    const result = await withTimeout(operation, TIMEOUT_CONFIG.short, 'testConnection');
    return result[0]?.connected === 1;
  } catch (error) {
    logger.error('Erro ao testar conexão com banco', error as Error);
    return false;
  }
}

/**
 * Busca todas as pastas do banco
 */
export async function getAllFolders(): Promise<DbFolder[]> {
  try {
    const operation = sql`
      SELECT * FROM folders
      ORDER BY parent_id NULLS FIRST, name ASC
    `;
    const result = await withTimeout(operation, TIMEOUT_CONFIG.medium, 'getAllFolders');
    return result as DbFolder[];
  } catch (error) {
    logger.error('Erro ao buscar pastas do banco', error as Error);
    throw error;
  }
}

/**
 * Busca uma pasta específica por UUID
 */
export async function getFolderByUuid(uuid: string): Promise<DbFolder | null> {
  try {
    const operation = sql`
      SELECT * FROM folders
      WHERE uuid = ${uuid}
      LIMIT 1
    `;
    const result = await withTimeout(operation, TIMEOUT_CONFIG.short, 'getFolderByUuid');
    return result[0] as DbFolder || null;
  } catch (error) {
    logger.error('Erro ao buscar pasta por UUID', error as Error, { uuid });
    throw error;
  }
}

/**
 * Cria uma nova pasta
 */
export async function createFolder(folderData: Partial<Folder>, parentUuid?: string): Promise<DbFolder> {
  try {
    let parentId: number | null = null;
    
    // Se tem pasta pai, busca o ID do banco
    if (parentUuid) {
      const parentFolder = await getFolderByUuid(parentUuid);
      if (parentFolder) {
        parentId = parentFolder.id;
      }
    }
    
    const result = await sql`
      INSERT INTO folders (
        name, description, parent_id, icon, color, responsible, tags, is_favorite, metadata, created_by
      )
      VALUES (
        ${folderData.name}, ${folderData.description || null}, ${parentId}, ${folderData.icon || 'Folder'}, 
        ${folderData.color || '#3B82F6'}, ${folderData.responsible || 'Sistema'}, ${folderData.tags || []}, 
        ${false}, ${JSON.stringify({})}, ${'system'}
      )
      RETURNING *
    `;
    
    return result[0] as DbFolder;
  } catch (error) {
    console.error('Erro ao criar pasta:', error);
    throw error;
  }
}

/**
 * Atualiza uma pasta existente
 */
export async function updateFolder(uuid: string, updates: Partial<Folder>): Promise<DbFolder | null> {
  try {
    const result = await sql`
      UPDATE folders 
      SET 
        name = COALESCE(${updates.name}, name),
        description = COALESCE(${updates.description}, description),
        icon = COALESCE(${updates.icon}, icon),
        color = COALESCE(${updates.color}, color),
        responsible = COALESCE(${updates.responsible}, responsible),
        tags = COALESCE(${updates.tags}, tags),
        metadata = COALESCE(${JSON.stringify({})}, metadata)
      WHERE uuid = ${uuid}
      RETURNING *
    `;
    
    return result[0] as DbFolder || null;
  } catch (error) {
    console.error('Erro ao atualizar pasta:', error);
    throw error;
  }
}

/**
 * Remove uma pasta
 */
export async function deleteFolder(uuid: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM folders
      WHERE uuid = ${uuid}
    `;
    
    return (result as any).count > 0;
  } catch (error) {
    console.error('Erro ao deletar pasta:', error);
    throw error;
  }
}

/**
 * Busca arquivos de uma pasta
 */
export async function getFilesByFolder(folderUuid: string): Promise<DbFile[]> {
  try {
    const result = await sql`
      SELECT f.* FROM files f
      JOIN folders fold ON f.folder_id = fold.id
      WHERE fold.uuid = ${folderUuid}
      ORDER BY f.upload_date DESC
    `;
    return result as DbFile[];
  } catch (error) {
    console.error('Erro ao buscar arquivos:', error);
    throw error;
  }
}

/**
 * Cria um novo arquivo
 */
export async function createFile(
  folderUuid: string, 
  fileData: {
    name: string;
    originalName: string;
    sizeBytes: number;
    mimeType?: string;
    fileExtension?: string;
    storageType: 'database' | 'local' | 'cloud' | 'url';
    storagePath?: string;
    fileData?: string;
    uploadedBy?: string;
  }
): Promise<DbFile> {
  try {
    const folder = await getFolderByUuid(folderUuid);
    if (!folder) {
      throw new Error('Pasta não encontrada');
    }
    
    const result = await sql`
      INSERT INTO files (
        folder_id, name, original_name, size_bytes, mime_type, file_extension,
        storage_type, storage_path, file_data, uploaded_by
      )
      VALUES (
        ${folder.id}, ${fileData.name}, ${fileData.originalName}, ${fileData.sizeBytes},
        ${fileData.mimeType}, ${fileData.fileExtension}, ${fileData.storageType},
        ${fileData.storagePath}, ${fileData.fileData}, ${fileData.uploadedBy}
      )
      RETURNING *
    `;
    
    return result[0] as DbFile;
  } catch (error) {
    console.error('Erro ao criar arquivo:', error);
    throw error;
  }
}

/**
 * Constrói a árvore de pastas a partir dos dados do banco
 */
export function buildFolderTree(folders: DbFolder[]): Folder[] {
  const folderMap = new Map<number, Folder>();
  const rootFolders: Folder[] = [];
  
  // Primeiro, converte todas as pastas
  folders.forEach(dbFolder => {
    const folder = dbFolderToFolder(dbFolder);
    folderMap.set(dbFolder.id, folder);
  });
  
  // Depois, constrói a hierarquia
  folders.forEach(dbFolder => {
    const folder = folderMap.get(dbFolder.id)!;
    
    if (dbFolder.parent_id) {
      // Tem pai - adiciona como filho
      const parent = folderMap.get(dbFolder.parent_id);
      if (parent && parent.subFolders) {
        parent.subFolders.push(folder);
      }
    } else {
      // Não tem pai - é raiz
      rootFolders.push(folder);
    }
  });
  
  return rootFolders;
}

/**
 * Migra dados do localStorage para o banco
 */
export async function migrateFromLocalStorage(localStorageData: any[]): Promise<Map<string, string>> {
  try {
    console.log('Iniciando migração do localStorage...');
    
    // Mapeia IDs locais para UUIDs do banco
    const idMapping = new Map<string, string>();
    
    // Primeiro, cria todas as pastas sem hierarquia
    for (const folder of localStorageData) {
      if (folder.type === 'folder') {
        const dbFolder = await createFolder({
          name: folder.name,
          description: folder.description || '',
          icon: folder.icon || 'Folder',
          color: folder.color || '#3B82F6',
          responsible: folder.responsible || 'Migração',
          tags: folder.tags || []
        });
        
        idMapping.set(folder.id, dbFolder.uuid);
      }
    }
    
    console.log('Migração concluída com sucesso!');
    return idMapping;
  } catch (error) {
    console.error('Erro na migração:', error);
    throw error;
  }
}
