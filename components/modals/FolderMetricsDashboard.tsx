import React from 'react';
import { BarChart3, FileText, HardDrive, Clock, TrendingUp, Calendar } from 'lucide-react';
import { FolderMetrics } from '../../types';

interface FolderMetricsDashboardProps {
  metrics?: FolderMetrics;
  folderName: string;
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
  folderName 
}) => {
  if (!metrics) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 mb-6">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Dashboard de Métricas
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
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

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 mb-6 border border-blue-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <BarChart3 size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Dashboard de Métricas - {folderName}
        </h3>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
          <FileText size={20} className="mx-auto text-green-600 dark:text-green-400 mb-1" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {metrics.documentCount.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Documentos</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
          <HardDrive size={20} className="mx-auto text-blue-600 dark:text-blue-400 mb-1" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {formatFileSize(metrics.totalSize)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tamanho Total</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
          <TrendingUp size={20} className="mx-auto text-purple-600 dark:text-purple-400 mb-1" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {formatFileSize(metrics.averageFileSize)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tamanho Médio</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
          <Clock size={20} className="mx-auto text-orange-600 dark:text-orange-400 mb-1" />
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {metrics.fileTypes.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tipos</div>
        </div>
      </div>

      {/* Tipos de Arquivo Mais Comuns */}
      {topFileTypes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tipos de Arquivo Principais
          </h4>
          <div className="space-y-2">
            {topFileTypes.map((fileType, index) => (
              <div key={fileType.extension} className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-2">
                <span className="text-lg mr-2">{getFileTypeIcon(fileType.extension)}</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-blue-200 dark:border-gray-600">
          {metrics.largestFile && (
            <div className="text-xs">
              <div className="text-gray-500 dark:text-gray-400 mb-1">Maior Arquivo:</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">
                {metrics.largestFile.name}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {formatFileSize(metrics.largestFile.size)}
              </div>
            </div>
          )}
          
          {metrics.lastAccessed && (
            <div className="text-xs">
              <div className="text-gray-500 dark:text-gray-400 mb-1">Último Acesso:</div>
              <div className="text-gray-700 dark:text-gray-300 flex items-center">
                <Calendar size={12} className="mr-1" />
                {metrics.lastAccessed}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 