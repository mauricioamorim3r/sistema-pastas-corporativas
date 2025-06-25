import React, { useState, useEffect } from 'react';
import { useFolderMonitoring } from '../hooks/useFolderMonitoring';
import { Folder } from '../types';

interface MonitoringPanelProps {
  favoriteFolders: Folder[];
  isOpen: boolean;
  onClose: () => void;
}

const MonitoringPanel: React.FC<MonitoringPanelProps> = ({ favoriteFolders, isOpen, onClose }) => {
  const {
    monitorings,
    settings,
    setSettings,
    startMonitoring,
    stopMonitoring,
    startTimer,
    stopTimer,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    getMonitoringStats,
  } = useFolderMonitoring();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'notifications' | 'settings'>('monitoring');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [timerSetup, setTimerSetup] = useState({
    folderId: '',
    duration: 1,
    unit: 'hours' as 'hours' | 'days' | 'weeks' | 'months',
    description: '',
  });

  // Formatter para tempo restante
  const formatTimeRemaining = (timer: any) => {
    if (!timer || !timer.isActive) return null;
    
    const startTime = new Date(timer.startTime);
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const remaining = timer.duration - elapsed;
    
    if (remaining <= 0) return 'Expirado';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  // Atualizar timer a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render para atualizar timers
      setSelectedFolder(prev => prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartMonitoring = (folderId: string, folderPath: string, fileTypeFilter?: string) => {
    startMonitoring(folderId, folderPath, fileTypeFilter);
  };

  const handleStartTimer = () => {
    if (timerSetup.folderId && timerSetup.duration > 0 && timerSetup.description) {
      startTimer(timerSetup.folderId, timerSetup.duration, timerSetup.unit, timerSetup.description);
      setTimerSetup({ folderId: '', duration: 1, unit: 'hours', description: '' });
    }
  };

  const getFileTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'pdf': '📄',
      'docx': '📝',
      'doc': '📝',
      'xlsx': '📊',
      'xls': '📊',
      'pptx': '📋',
      'ppt': '📋',
      'txt': '📄',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'mp4': '🎥',
      'avi': '🎥',
      'mp3': '🎵',
      'wav': '🎵',
      'zip': '📦',
      'rar': '📦',
    };
    return icons[type.toLowerCase()] || '📄';
  };

  const getNotificationIcon = (type: 'created' | 'modified' | 'deleted') => {
    const icons = {
      created: '➕',
      modified: '✏️',
      deleted: '🗑️',
    };
    return icons[type];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-96 h-full shadow-xl overflow-hidden flex flex-col">
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">🔍 Monitoramento de Pastas</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-700 rounded-full p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex-1 p-3 text-sm font-medium ${
              activeTab === 'monitoring'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Monitoramento
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 p-3 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔔 Notificações
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 p-3 text-sm font-medium ${
              activeTab === 'settings'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚙️ Configurações
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Tab Monitoramento */}
          {activeTab === 'monitoring' && (
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">Pastas Favoritas</h3>
              
              {favoriteFolders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">⭐</div>
                  <p>Nenhuma pasta favorita</p>
                  <p className="text-sm">Marque pastas como favorito para monitorá-las</p>
                </div>
              ) : (
                favoriteFolders.map(folder => {
                  const folderId = String(folder.id);
                  const monitoring = monitorings.get(folderId);
                  const stats = getMonitoringStats(folderId);
                  const timeRemaining = monitoring?.timer ? formatTimeRemaining(monitoring.timer) : null;
                  
                  return (
                    <div key={folder.id} className="border rounded-lg p-3 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{folder.name}</h4>
                          <p className="text-xs text-gray-500">{folder.path}</p>
                          {folder.responsible && (
                            <p className="text-xs text-gray-600">👤 {folder.responsible}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {monitoring?.isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Monitoramento ativo"></div>
                          )}
                          {stats?.unread && stats.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                              {stats.unread}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Timer Display */}
                      {monitoring?.timer?.isActive && (
                        <div className={`text-center p-2 rounded ${
                          monitoring.timer.isExpired ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          <div className="text-sm font-medium">
                            {monitoring.timer.isExpired ? '⏰ Timer Expirado!' : '⏱️ Timer Ativo'}
                          </div>
                          <div className="text-xs">{monitoring.timer.description}</div>
                          <div className="font-mono text-sm">
                            {timeRemaining || 'Expirado'}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      {stats && (
                        <div className="grid grid-cols-4 gap-2 text-xs text-center">
                          <div className="bg-gray-100 rounded p-1">
                            <div className="font-medium">{stats.total}</div>
                            <div className="text-gray-600">Total</div>
                          </div>
                          <div className="bg-green-100 rounded p-1">
                            <div className="font-medium text-green-800">{stats.created}</div>
                            <div className="text-green-600">Criados</div>
                          </div>
                          <div className="bg-blue-100 rounded p-1">
                            <div className="font-medium text-blue-800">{stats.modified}</div>
                            <div className="text-blue-600">Modificados</div>
                          </div>
                          <div className="bg-red-100 rounded p-1">
                            <div className="font-medium text-red-800">{stats.deleted}</div>
                            <div className="text-red-600">Excluídos</div>
                          </div>
                        </div>
                      )}

                      {/* Controles de Monitoramento */}
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          {!monitoring?.isActive ? (
                            <button
                              onClick={() => handleStartMonitoring(folderId, folder.path || '')}
                              className="flex-1 bg-green-600 text-white text-xs py-1.5 px-2 rounded hover:bg-green-700 transition-colors"
                            >
                              ▶️ Iniciar Monitoramento
                            </button>
                          ) : (
                            <button
                              onClick={() => stopMonitoring(folderId)}
                              className="flex-1 bg-red-600 text-white text-xs py-1.5 px-2 rounded hover:bg-red-700 transition-colors"
                            >
                              ⏹️ Parar Monitoramento
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedFolder(selectedFolder === folderId ? null : folderId)}
                            className="bg-blue-600 text-white text-xs py-1.5 px-2 rounded hover:bg-blue-700 transition-colors"
                          >
                            ⚙️
                          </button>
                        </div>

                        {/* Configurações Expandidas */}
                        {selectedFolder === folder.id && (
                          <div className="border-t pt-2 space-y-2">
                            {/* Filtro de Tipo de Arquivo */}
                            <div>
                              <label className="text-xs font-medium text-gray-700">Filtrar tipo:</label>
                              <select
                                value={monitoring?.fileTypeFilter || ''}
                                onChange={(e) => {
                                  if (monitoring?.isActive) {
                                    stopMonitoring(folderId);
                                    setTimeout(() => {
                                      handleStartMonitoring(folderId, folder.path || '', e.target.value || undefined);
                                    }, 100);
                                  }
                                }}
                                className="w-full text-xs border rounded px-2 py-1 mt-1"
                              >
                                <option value="">Todos os tipos</option>
                                <option value="pdf">PDF</option>
                                <option value="docx">Word</option>
                                <option value="xlsx">Excel</option>
                                <option value="pptx">PowerPoint</option>
                                <option value="txt">Texto</option>
                                <option value="jpg">Imagens</option>
                              </select>
                            </div>

                            {/* Configuração de Timer */}
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-700">Timer:</label>
                              <div className="grid grid-cols-3 gap-1">
                                <input
                                  type="number"
                                  min="1"
                                  value={timerSetup.folderId === folderId ? timerSetup.duration : 1}
                                  onChange={(e) => setTimerSetup(prev => ({ 
                                    ...prev, 
                                    folderId: folderId,
                                    duration: parseInt(e.target.value) || 1 
                                  }))}
                                  className="text-xs border rounded px-1 py-1"
                                  placeholder="1"
                                />
                                <select
                                  value={timerSetup.folderId === folderId ? timerSetup.unit : 'hours'}
                                  onChange={(e) => setTimerSetup(prev => ({
                                    ...prev,
                                    folderId: folderId,
                                    unit: e.target.value as any
                                  }))}
                                  className="text-xs border rounded px-1 py-1"
                                >
                                  <option value="hours">Horas</option>
                                  <option value="days">Dias</option>
                                  <option value="weeks">Semanas</option>
                                  <option value="months">Meses</option>
                                </select>
                                {monitoring?.timer?.isActive ? (
                                  <button
                                    onClick={() => stopTimer(folderId)}
                                    className="bg-red-600 text-white text-xs py-1 px-1 rounded hover:bg-red-700 transition-colors"
                                  >
                                    ⏹️
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (timerSetup.folderId === folderId) {
                                        handleStartTimer();
                                      } else {
                                        setTimerSetup(prev => ({ ...prev, folderId: folderId }));
                                      }
                                    }}
                                    className="bg-blue-600 text-white text-xs py-1 px-1 rounded hover:bg-blue-700 transition-colors"
                                  >
                                    ⏰
                                  </button>
                                )}
                              </div>
                              {timerSetup.folderId === folder.id && (
                                <input
                                  type="text"
                                  value={timerSetup.description}
                                  onChange={(e) => setTimerSetup(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Descrição do timer"
                                  className="w-full text-xs border rounded px-2 py-1"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab Notificações */}
          {activeTab === 'notifications' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Notificações</h3>
                <button
                  onClick={() => {
                    favoriteFolders.forEach(folder => clearNotifications(String(folder.id)));
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpar Todas
                </button>
              </div>

              <div className="space-y-2">
                {favoriteFolders.map(folder => {
                  const folderId = String(folder.id);
                  const monitoring = monitorings.get(folderId);
                  const notifications = monitoring?.notifications || [];
                  
                  if (notifications.length === 0) return null;

                  return (
                    <div key={folder.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 flex justify-between items-center">
                        <span className="font-medium text-sm">{folder.name}</span>
                        <button
                          onClick={() => markAllAsRead(folderId)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Marcar todas como lidas
                        </button>
                      </div>
                      
                      <div className="max-h-32 overflow-y-auto">
                        {notifications.slice(0, 10).map(notification => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationAsRead(folderId, notification.id)}
                            className={`p-2 border-b last:border-b-0 cursor-pointer transition-colors ${
                              notification.isRead ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <span className="text-sm">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs">{getFileTypeIcon(notification.fileType)}</span>
                                  <p className="text-xs font-medium truncate">{notification.fileName}</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                                {notification.fileSize && (
                                  <p className="text-xs text-gray-400">
                                    {(notification.fileSize / 1024).toFixed(1)} KB
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {favoriteFolders.every(folder => !monitorings.get(String(folder.id))?.notifications?.length) && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">🔔</div>
                  <p>Nenhuma notificação</p>
                  <p className="text-sm">Inicie o monitoramento para receber notificações</p>
                </div>
              )}
            </div>
          )}

          {/* Tab Configurações */}
          {activeTab === 'settings' && (
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 mb-3">Configurações de Monitoramento</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.enableRealTimeNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableRealTimeNotifications: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Notificações em tempo real</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Sons de notificação</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoMarkAsRead}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoMarkAsRead: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Marcar automaticamente como lida</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de notificações por pasta
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={settings.maxNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxNotifications: parseInt(e.target.value) || 50 }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringPanel; 