import { Folder } from '../types';

// Tipos para File System Access API
interface FileSystemDirectoryHandle {
  name: string;
  kind: 'directory';
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
}

// Extensão da interface Window para incluir showDirectoryPicker
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

/**
 * Gera um script batch/shell para criar estrutura de pastas
 */
export const generateFolderScript = (folders: Folder[], isWindows: boolean = true): string => {
  const createFolderCommands: string[] = [];
  
  const processFolder = (folder: Folder, basePath: string = '') => {
    const currentPath = basePath ? `${basePath}/${folder.name}` : folder.name;
    
    if (isWindows) {
      createFolderCommands.push(`mkdir "${currentPath.replace(/\//g, '\\')}"`);
    } else {
      createFolderCommands.push(`mkdir -p "${currentPath}"`);
    }
    
    if (folder.subFolders && folder.subFolders.length > 0) {
      folder.subFolders.forEach((child: Folder) => processFolder(child, currentPath));
    }
  };

  folders.forEach(folder => processFolder(folder));
  
  if (isWindows) {
    return `@echo off
echo Criando estrutura de pastas...
echo.

${createFolderCommands.join('\n')}

echo.
echo ✅ Estrutura de pastas criada com sucesso!
pause`;
  } else {
    return `#!/bin/bash
echo "Criando estrutura de pastas..."
echo

${createFolderCommands.join('\n')}

echo
echo "✅ Estrutura de pastas criada com sucesso!"`;
  }
};

/**
 * Cria estrutura de pastas usando File System Access API
 */
export const createPhysicalFolders = async (folders: Folder[]): Promise<boolean> => {
  // Verifica se a API está disponível
  if (!window.showDirectoryPicker) {
    throw new Error('File System Access API não suportada neste navegador');
  }

  try {
    // Solicita ao usuário para escolher um diretório
    const rootHandle = await window.showDirectoryPicker();
    
    const createFolderRecursive = async (folder: Folder, parentHandle: FileSystemDirectoryHandle) => {
      try {
        // Criar pasta atual
        const folderHandle = await parentHandle.getDirectoryHandle(folder.name, { create: true });
        
        // Criar subpastas se existirem
        if (folder.subFolders && folder.subFolders.length > 0) {
          for (const child of folder.subFolders) {
            await createFolderRecursive(child, folderHandle);
          }
        }
      } catch (error) {
        console.error(`Erro ao criar pasta ${folder.name}:`, error);
        throw error;
      }
    };

    // Criar todas as pastas raiz
    for (const folder of folders) {
      await createFolderRecursive(folder, rootHandle);
    }

    return true;
  } catch (error) {
    console.error('Erro ao criar estrutura física:', error);
    throw error;
  }
};

/**
 * Download do script para criar pastas
 */
export const downloadFolderScript = (folders: Folder[]) => {
  const isWindows = navigator.platform.toLowerCase().includes('win');
  const script = generateFolderScript(folders, isWindows);
  const extension = isWindows ? 'bat' : 'sh';
  const filename = `criar_estrutura_pastas.${extension}`;
  
  const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Verifica se File System Access API está disponível
 */
export const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window;
};

/**
 * Conta total de pastas na estrutura
 */
export const countFolders = (folders: Folder[]): number => {
  let count = 0;
  
  const countRecursive = (folder: Folder) => {
    count++;
    if (folder.subFolders && folder.subFolders.length > 0) {
      folder.subFolders.forEach(countRecursive);
    }
  };
  
  folders.forEach(countRecursive);
  return count;
};

/**
 * Gera preview da estrutura em formato texto
 */
export const generateFolderPreview = (folders: Folder[]): string => {
  const lines: string[] = [];
  
  const processFolder = (folder: Folder, level: number = 0) => {
    const indent = '  '.repeat(level);
    const icon = folder.subFolders && folder.subFolders.length > 0 ? '📁' : '📂';
    lines.push(`${indent}${icon} ${folder.name}/`);
    
    if (folder.subFolders && folder.subFolders.length > 0) {
      folder.subFolders.forEach((child: Folder) => processFolder(child, level + 1));
    }
  };
  
  folders.forEach(folder => processFolder(folder));
  return lines.join('\n');
}; 