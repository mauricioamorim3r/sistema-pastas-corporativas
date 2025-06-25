import React from 'react';
import { Undo2, Redo2, History, Clock, Trash2 } from 'lucide-react';

interface HistoryAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE' | 'IMPORT' | 'BATCH';
  timestamp: number;
  description: string;
  data: {
    before: any;
    after: any;
    targetId?: string | number;
    parentId?: string | number;
  };
}

interface HistoryPanelProps {
  isVisible: boolean;
  onClose: () => void;
  history: HistoryAction[];
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isVisible,
  onClose,
  history,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearHistory
}) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora mesmo';
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'CREATE':
        return '➕';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      case 'MOVE':
        return '↔️';
      case 'IMPORT':
        return '📥';
      case 'BATCH':
        return '📦';
      default:
        return '❓';
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'CREATE':
        return 'text-green-600 dark:text-green-400';
      case 'UPDATE':
        return 'text-blue-600 dark:text-blue-400';
      case 'DELETE':
        return 'text-red-600 dark:text-red-400';
      case 'MOVE':
        return 'text-purple-600 dark:text-purple-400';
      case 'IMPORT':
        return 'text-indigo-600 dark:text-indigo-400';
      case 'BATCH':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">Histórico</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Controles Undo/Redo */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              canUndo
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 size={16} />
            <span className="text-sm">Desfazer</span>
          </button>
          
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              canRedo
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            title="Refazer (Ctrl+Y)"
          >
            <Redo2 size={16} />
            <span className="text-sm">Refazer</span>
          </button>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Limpar Histórico"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Lista de Ações */}
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
            <Clock size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhuma ação registrada</p>
            <p className="text-sm text-center">
              As ações que você realizar aparecerão aqui para que você possa desfazê-las
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {history.slice().reverse().map((action, index) => {
              const isRecent = history.length - index <= 3;
              
              return (
                <div
                  key={action.id}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    isRecent
                      ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg" title={action.type}>
                        {getActionIcon(action.type)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${getActionColor(action.type)}`}>
                        {action.description}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(action.timestamp)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          #{history.length - index}
                        </span>
                      </div>

                      {/* Detalhes da ação */}
                      {action.type === 'IMPORT' && action.data.after && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          {action.data.after.length} pasta(s) importada(s)
                        </div>
                      )}
                      
                      {action.type === 'MOVE' && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          Nova localização
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {isRecent && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                          Recente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer com estatísticas */}
      {history.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {history.length} ação(ões) registrada(s)
            <br />
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Ctrl+Z
            </span> para desfazer • <span className="text-blue-600 dark:text-blue-400 font-medium">
              Ctrl+Y
            </span> para refazer
          </div>
        </div>
      )}
    </div>
  );
}; 