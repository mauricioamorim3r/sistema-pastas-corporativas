import React, { useState, useRef } from 'react';
import { 
  BarChart3, File, Upload, Download, Eye, Trash2, Plus, 
  Image, FileVideo, Music, FileText, Archive, HardDrive,
  ExternalLink, AlertCircle, CheckCircle
} from 'lucide-react';
import { Folder as FolderType } from '../../types';
import { localFolderManager, SavedFileInfo } from '../../utils/localFolderManager';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string;
  data?: string; // Base64 para arquivos pequenos
}

interface FolderMetrics {
  documentCount: number; // Quantidade de documentos
  totalSize: number; // Tamanho total em bytes
  fileTypes: Array<{
    extension: string; // ex: 'pdf', 'docx', 'xlsx'
    count: number; // quantidade deste tipo
    totalSize: number; // tamanho total deste tipo em bytes
    percentage: number; // porcentagem do total
  }>;
  lastAccessed?: string; // Último acesso
  averageFileSize: number; // Tamanho médio dos arquivos
  largestFile?: {
    name: string;
    size: number; // em bytes
    lastModified: string;
    type: string;
  }; // Maior arquivo
  oldestFile?: {
    name: string;
    size: number; // em bytes
    lastModified: string;
    type: string;
  }; // Arquivo mais antigo
  newestFile?: {
    name: string;
    size: number; // em bytes
    lastModified: string;
    type: string;
  }; // Arquivo mais recente
}

interface FolderMetricsDashboardProps {
  metrics?: FolderMetrics;
  folderName: string;
  folder: FolderType & { uploadedFiles?: UploadedFile[] };
  onUpdateFolder: (folderId: string, updates: Partial<FolderType>) => void;
}

export const FolderMetricsDashboard: React.FC<FolderMetricsDashboardProps> = ({ 
  metrics, 
  folderName, 
  folder, 
  onUpdateFolder 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    folder.uploadedFiles || []
  );
  const [localFiles, setLocalFiles] = useState<SavedFileInfo[]>(
    localFolderManager.getFilesByFolder(String(folder.id))
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [saveMode, setSaveMode] = useState<'browser' | 'local'>('browser');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verifica suporte do sistema local uma única vez
  const isLocalSystemSupported = localFolderManager.isSupported();
  const isLocalSystemInitialized = localFolderManager.isInitialized();

  const topFileTypes = metrics?.fileTypes?.sort((a, b) => b.count - a.count).slice(0, 4) || [];

  // Função para obter ícone do arquivo baseado no tipo
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />;
    if (type.startsWith('video/')) return <FileVideo className="w-4 h-4 text-purple-500" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4 text-green-500" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-4 h-4 text-orange-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  // Função para processar arquivos
  const processFiles = async (files: FileList) => {
    setUploadStatus('uploading');
    setStatusMessage('');

    for (const file of Array.from(files)) {
      // Limite de 10MB por arquivo para modo browser
      if (saveMode === 'browser' && file.size > 10 * 1024 * 1024) {
        setUploadStatus('error');
        setStatusMessage(`Arquivo "${file.name}" é muito grande para salvamento no navegador. Máximo: 10MB`);
        continue;
      }

      try {
        if (saveMode === 'local' && localFolderManager.isInitialized()) {
          // Salvar no sistema local
          const savedFileInfo = await localFolderManager.saveFile(file, folder);
          if (savedFileInfo) {
            setLocalFiles(prev => [...prev, savedFileInfo]);
            setUploadStatus('success');
            setStatusMessage(`Arquivo "${file.name}" salvo no sistema local com sucesso!`);
          }
        } else {
          // Salvar no navegador (modo existente)
          const reader = new FileReader();
          reader.onload = (e) => {
            const newFile: UploadedFile = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: file.name,
              size: file.size,
              type: file.type,
              uploadDate: new Date().toISOString(),
              data: e.target?.result as string
            };

            const updatedFiles = [...uploadedFiles, newFile];
            setUploadedFiles(updatedFiles);
            
            // Salvar no folder
            onUpdateFolder(String(folder.id), { 
              uploadedFiles: updatedFiles 
            });

            setUploadStatus('success');
            setStatusMessage(`Arquivo "${file.name}" salvo no navegador com sucesso!`);
          };
          reader.readAsDataURL(file);
        }
      } catch (error: any) {
        setUploadStatus('error');
        setStatusMessage(`Erro ao salvar "${file.name}": ${error.message}`);
      }
    }

    // Limpar status após 3 segundos
    setTimeout(() => {
      setUploadStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // Handle file input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // Baixar arquivo do navegador
  const downloadFile = (file: UploadedFile) => {
    if (file.data) {
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Abrir arquivo local
  const openLocalFile = (fileInfo: SavedFileInfo) => {
    const link = localFolderManager.generateFileLink(fileInfo);
    // Tentar abrir com protocolo file://
    window.open(`file:///${link}`, '_blank');
  };

  // Visualizar arquivo (para imagens)
  const previewFile = (file: UploadedFile) => {
    if (file.type.startsWith('image/') && file.data) {
      window.open(file.data, '_blank');
    } else {
      downloadFile(file);
    }
  };

  // Excluir arquivo do navegador
  const deleteFile = (fileId: string) => {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
      setUploadedFiles(updatedFiles);
      onUpdateFolder(String(folder.id), { 
        uploadedFiles: updatedFiles 
      });
    }
  };

  // Excluir arquivo local
  const deleteLocalFile = async (fileId: string) => {
    if (confirm('Tem certeza que deseja excluir este arquivo do sistema local?')) {
      const success = await localFolderManager.deleteFile(fileId);
      if (success) {
        setLocalFiles(prev => prev.filter(f => f.id !== fileId));
      }
    }
  };

  // Função para formatar tamanho de arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <BarChart3 size={24} className="mr-2 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Dashboard de Métricas - {folderName}
        </h3>
      </div>

      {/* Seção de Métricas */}
      {metrics ? (
        <>
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
            <div className="p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total de Arquivos</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{metrics.documentCount}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">Tamanho Total</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{formatFileSize(metrics.totalSize)}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">Tamanho Médio</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{formatFileSize(metrics.averageFileSize)}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">Tipos de Arquivo</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{metrics.fileTypes.length}</p>
            </div>
          </div>

          {/* Tipos de Arquivo Mais Comuns */}
          {topFileTypes.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-gray-900 text-md dark:text-white">Tipos Mais Comuns</h4>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {topFileTypes.map((fileType, index) => (
                  <div key={index} className="flex gap-2 items-center p-2 bg-white rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    {getFileIcon(fileType.extension)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate dark:text-white">
                        {fileType.extension?.toUpperCase() || fileType.extension}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{fileType.count} arquivos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mb-6 text-center">
          <BarChart3 size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhuma métrica disponível para esta pasta. Faça upload de arquivos para gerar estatísticas.
          </p>
        </div>
      )}

      {/* Seção de Upload de Arquivos */}
      <div className="pt-6 border-t border-gray-200 border-solid dark:border-gray-700">
        <h4 className="flex gap-2 items-center mb-4 font-semibold text-gray-900 text-md dark:text-white">
          <File className="w-5 h-5" />
          Arquivos da Pasta
        </h4>

        {/* Seletor de Modo de Salvamento */}
        <div className="flex gap-2 p-2 mb-4 bg-gray-100 rounded-lg dark:bg-gray-700">
          <button
            onClick={() => setSaveMode('browser')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
              saveMode === 'browser'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            💾 No Navegador
          </button>
          <button
            onClick={() => setSaveMode('local')}
            disabled={!isLocalSystemSupported}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded transition-colors ${
              saveMode === 'local'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <HardDrive className="inline w-4 h-4 mr-1" />
            No Sistema Local
          </button>
        </div>

        {/* Status do Sistema Local */}
        {saveMode === 'local' && (
          <div className="mb-4">
            {!isLocalSystemSupported ? (
              <div className="flex items-center p-3 bg-red-50 rounded border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 mr-2" />
                <span className="text-sm text-red-800 dark:text-red-200">
                  Navegador não suporta salvamento local. Use Chrome, Edge ou Opera.
                </span>
              </div>
            ) : !isLocalSystemInitialized ? (
              <div className="flex items-center p-3 bg-yellow-50 rounded border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  Sistema local não configurado. Ative nas Configurações → Sistema de Pasta Local.
                </span>
              </div>
            ) : (
              <div className="flex items-center p-3 bg-green-50 rounded border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm text-green-800 dark:text-green-200">
                  Sistema local ativo. Arquivos serão salvos em Documentos/PastasApp/{folder.name.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, '_')}/
                </span>
              </div>
            )}
          </div>
        )}

        {/* Status do Upload */}
        {uploadStatus !== 'idle' && statusMessage && (
          <div className={`flex items-center p-3 mb-4 rounded border ${
            uploadStatus === 'success' 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
              : uploadStatus === 'error'
              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
          }`}>
            {uploadStatus === 'success' ? (
              <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle size={16} className="text-red-600 dark:text-red-400 mr-2" />
            ) : (
              <div className="w-4 h-4 mr-2 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            )}
            <span className={`text-sm ${
              uploadStatus === 'success' 
                ? 'text-green-800 dark:text-green-200' 
                : uploadStatus === 'error'
                ? 'text-red-800 dark:text-red-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}>
              {statusMessage}
            </span>
          </div>
        )}

        {/* Área de Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
              : 'border-gray-300 border-solid border-[1px] dark:border-gray-600 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto mb-2 w-8 h-8 text-gray-400" />
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Arraste arquivos aqui ou
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={saveMode === 'local' && !isLocalSystemInitialized}
            className="flex gap-2 items-center px-4 py-2 mx-auto text-sm text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Selecionar Arquivos
          </button>
          <p className="mt-2 text-xs text-gray-500">
            {saveMode === 'browser' ? 'Máximo: 10MB por arquivo' : 'Sem limite de tamanho'}
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />
        </div>

        {/* Listas de Arquivos */}
        <div className="mt-6 space-y-6">
          {/* Arquivos do Navegador */}
          {uploadedFiles.length > 0 && (
            <div>
              <h5 className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                💾 Arquivos no Navegador ({uploadedFiles.length})
              </h5>
              <div className="overflow-y-auto space-y-2 max-h-60">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
                  >
                    <div className="flex flex-1 gap-3 items-center min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => previewFile(file)}
                        className="p-1 text-gray-400 transition-colors hover:text-blue-600"
                        title={file.type.startsWith('image/') ? 'Visualizar' : 'Baixar'}
                      >
                        {file.type.startsWith('image/') ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-1 text-gray-400 transition-colors hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Arquivos Locais */}
          {localFiles.length > 0 && (
            <div>
              <h5 className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <HardDrive className="w-4 h-4" />
                Arquivos no Sistema Local ({localFiles.length})
              </h5>
              <div className="overflow-y-auto space-y-2 max-h-60">
                {localFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
                  >
                    <div className="flex flex-1 gap-3 items-center min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {new Date(file.savedAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                          {file.savedPath}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => openLocalFile(file)}
                        className="p-1 text-gray-400 transition-colors hover:text-blue-600"
                        title="Abrir arquivo local"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLocalFile(file.id)}
                        className="p-1 text-gray-400 transition-colors hover:text-red-600"
                        title="Excluir do sistema"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Estatísticas dos arquivos */}
        {(uploadedFiles.length > 0 || localFiles.length > 0) && (
          <div className="p-3 mt-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Arquivos no navegador:</span>
                  <span className="font-medium">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tamanho (navegador):</span>
                  <span className="font-medium">
                    {formatFileSize(uploadedFiles.reduce((total, file) => total + file.size, 0))}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Arquivos locais:</span>
                  <span className="font-medium">{localFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tamanho (local):</span>
                  <span className="font-medium">
                    {formatFileSize(localFiles.reduce((total, file) => total + file.size, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 