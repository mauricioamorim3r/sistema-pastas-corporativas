import React, { useState, useRef } from 'react';
import { BarChart3, FileText, HardDrive, Clock, TrendingUp, Calendar, Download, Upload, File, Trash2, Eye, Plus, Image, FileVideo, Music, Archive } from 'lucide-react';
import { FolderMetrics, Folder } from '../../types';

interface FolderMetricsDashboardProps {
  metrics?: FolderMetrics;
  folderName: string;
  folder: Folder;
  onUpdateFolder: (folderId: string, updates: Partial<Folder>) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string;
  data?: string; // Base64 para arquivos pequenos
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeIcon = (extension: string) => {
  const iconMap: { [key: string]: string } = {
    'pdf': '📄',
    'doc': '📝', 'docx': '📝',
    'xls': '📊', 'xlsx': '📊',
    'ppt': '📋', 'pptx': '📋',
    'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
    'mp4': '🎥', 'avi': '🎥', 'mov': '🎥',
    'mp3': '🎵', 'wav': '🎵',
    'zip': '📦', 'rar': '📦',
    'txt': '📄',
  };
  return iconMap[extension.toLowerCase()] || '📁';
};

export const FolderMetricsDashboard: React.FC<FolderMetricsDashboardProps> = ({ 
  metrics, 
  folderName, 
  folder, 
  onUpdateFolder 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    folder.uploadedFiles || []
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!metrics) {
    return (
      <div className="p-6 mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Dashboard de Métricas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhuma métrica disponível para esta pasta
          </p>
          <button className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Analisar Pasta Agora
          </button>
        </div>
      </div>
    );
  }

  const topFileTypes = metrics.fileTypes
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

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
  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Limite de 10MB por arquivo
      if (file.size > 10 * 1024 * 1024) {
        alert(`Arquivo "${file.name}" é muito grande. Máximo: 10MB`);
        return;
      }

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
        onUpdateFolder(folder.id, { 
          uploadedFiles: updatedFiles 
        });
      };
      reader.readAsDataURL(file);
    });
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

  // Baixar arquivo
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

  // Visualizar arquivo (para imagens)
  const previewFile = (file: UploadedFile) => {
    if (file.type.startsWith('image/') && file.data) {
      window.open(file.data, '_blank');
    } else {
      downloadFile(file);
    }
  };

  // Excluir arquivo
  const deleteFile = (fileId: string) => {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
      setUploadedFiles(updatedFiles);
      onUpdateFolder(folder.id, { 
        uploadedFiles: updatedFiles 
      });
    }
  };

  return (
    <div className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <BarChart3 size={24} className="mr-2 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Dashboard de Métricas - {folderName}
        </h3>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <FileText size={20} className="mx-auto mb-1 text-green-600 dark:text-green-400" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {metrics.documentCount.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Documentos</div>
        </div>

        <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <HardDrive size={20} className="mx-auto mb-1 text-blue-600 dark:text-blue-400" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {formatFileSize(metrics.totalSize)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tamanho Total</div>
        </div>

        <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <TrendingUp size={20} className="mx-auto mb-1 text-purple-600 dark:text-purple-400" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {formatFileSize(metrics.averageFileSize)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tamanho Médio</div>
        </div>

        <div className="p-3 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <Clock size={20} className="mx-auto mb-1 text-orange-600 dark:text-orange-400" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {metrics.fileTypes.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tipos</div>
        </div>
      </div>

      {/* Tipos de Arquivo Mais Comuns */}
      {topFileTypes.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipos de Arquivo Principais
          </h4>
          <div className="space-y-2">
            {topFileTypes.map((fileType, index) => (
              <div key={fileType.extension} className="flex items-center p-2 bg-white rounded-lg dark:bg-gray-800">
                <span className="mr-2 text-lg">{getFileTypeIcon(fileType.extension)}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      .{fileType.extension.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {fileType.count} arquivo{fileType.count !== 1 ? 's' : ''} • {formatFileSize(fileType.totalSize)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${fileType.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      {(metrics.largestFile || metrics.lastAccessed) && (
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-blue-200 sm:grid-cols-2 dark:border-gray-600">
          {metrics.largestFile && (
            <div className="text-xs">
              <div className="mb-1 text-gray-500 dark:text-gray-400">Maior Arquivo:</div>
              <div className="font-medium text-gray-700 dark:text-gray-300">
                {metrics.largestFile.name}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {formatFileSize(metrics.largestFile.size)}
              </div>
            </div>
          )}
          
          {metrics.lastAccessed && (
            <div className="text-xs">
              <div className="mb-1 text-gray-500 dark:text-gray-400">Último Acesso:</div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar size={12} className="mr-1" />
                {metrics.lastAccessed}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sistema de Upload de Arquivos */}
      <div className="pt-6 border-t border-gray-200 border-solid dark:border-gray-700">
        <h4 className="flex gap-2 items-center mb-4 font-semibold text-gray-900 text-md dark:text-white">
          <File className="w-5 h-5" />
          Arquivos da Pasta
        </h4>

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
            className="flex gap-2 items-center px-4 py-2 mx-auto text-sm text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Selecionar Arquivos
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Máximo: 10MB por arquivo
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

        {/* Lista de Arquivos */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Arquivos Carregados ({uploadedFiles.length})
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
                  
                  <div className="flex gap-1 items-center">
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

        {/* Estatísticas dos arquivos */}
        {uploadedFiles.length > 0 && (
          <div className="p-3 mt-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total de arquivos:
              </span>
              <span className="font-medium">{uploadedFiles.length}</span>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Tamanho total:
              </span>
              <span className="font-medium">
                {formatFileSize(uploadedFiles.reduce((total, file) => total + file.size, 0))}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 