import { useState, useEffect, useCallback, useRef } from 'react';
import { FolderMonitoring, FolderNotification, MonitoringTimer, MonitoringSettings } from '../types';

// Simulação de File System Watcher (em produção seria uma API real)
interface FileSystemEvent {
  type: 'created' | 'modified' | 'deleted';
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize?: number;
}

export const useFolderMonitoring = () => {
  const [monitorings, setMonitorings] = useState<Map<string, FolderMonitoring>>(new Map());
  const [settings, setSettings] = useState<MonitoringSettings>({
    enableRealTimeNotifications: true,
    enableFileTypeFilter: false,
    enableTimer: false,
    autoMarkAsRead: false,
    maxNotifications: 50,
    soundEnabled: true,
  });

  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('folder-monitoring-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erro ao carregar configurações de monitoramento:', error);
      }
    }

    const savedMonitorings = localStorage.getItem('folder-monitorings');
    if (savedMonitorings) {
      try {
        const parsed = JSON.parse(savedMonitorings);
        const monitoringMap = new Map<string, FolderMonitoring>();
        
        // Converter objeto para Map com tipagem correta
        Object.entries(parsed).forEach(([key, value]) => {
          monitoringMap.set(key, value as FolderMonitoring);
        });
        
        setMonitorings(monitoringMap);
        
        // Reativar monitoramentos que estavam ativos
        monitoringMap.forEach((monitoring, folderId) => {
          if (monitoring.isActive) {
            startMonitoring(folderId, monitoring.path, monitoring.fileTypeFilter);
          }
          if (monitoring.timer?.isActive) {
            restoreTimer(folderId, monitoring.timer);
          }
        });
      } catch (error) {
        console.error('Erro ao carregar monitoramentos:', error);
      }
    }
  }, []);

  // Salvar no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('folder-monitoring-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const monitoringsObj = Object.fromEntries(monitorings);
    localStorage.setItem('folder-monitorings', JSON.stringify(monitoringsObj));
  }, [monitorings]);

  // Simulação de monitoramento de arquivos (em produção seria File System Watcher)
  const simulateFileSystemEvents = useCallback((folderId: string, path: string, fileTypeFilter?: string) => {
    const monitoring = monitorings.get(folderId);
    if (!monitoring || !monitoring.isActive) return;

    // Simular eventos aleatórios de arquivo
    const eventTypes: ('created' | 'modified' | 'deleted')[] = ['created', 'modified', 'deleted'];
    const fileTypes = ['pdf', 'docx', 'xlsx', 'txt', 'jpg', 'png'];
    
    // Gerar evento aleatório ocasionalmente
    if (Math.random() < 0.1) { // 10% de chance a cada verificação
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      
      // Filtrar por tipo se especificado
      if (fileTypeFilter && fileType !== fileTypeFilter) {
        return;
      }

      const fileName = `documento_${Date.now()}.${fileType}`;
      const event: FileSystemEvent = {
        type: eventType,
        fileName,
        filePath: `${path}\\${fileName}`,
        fileType,
        fileSize: Math.floor(Math.random() * 5000000) + 1000, // 1KB - 5MB
      };

      addNotification(folderId, event);
    }
  }, [monitorings]);

  // Iniciar monitoramento de uma pasta
  const startMonitoring = useCallback((folderId: string, folderPath: string, fileTypeFilter?: string) => {
    // Parar monitoramento anterior se existir
    stopMonitoring(folderId);

    const newMonitoring: FolderMonitoring = {
      isActive: true,
      path: folderPath,
      notifications: [],
      fileTypeFilter,
      lastScan: new Date().toISOString(),
      scanInterval: 5000, // 5 segundos
    };

    setMonitorings(prev => new Map(prev.set(folderId, newMonitoring)));

    // Iniciar intervalo de monitoramento
    const interval = setInterval(() => {
      simulateFileSystemEvents(folderId, folderPath, fileTypeFilter);
    }, newMonitoring.scanInterval);

    intervalRefs.current.set(folderId, interval);
  }, [simulateFileSystemEvents]);

  // Parar monitoramento
  const stopMonitoring = useCallback((folderId: string) => {
    const interval = intervalRefs.current.get(folderId);
    if (interval) {
      clearInterval(interval);
      intervalRefs.current.delete(folderId);
    }

    setMonitorings(prev => {
      const newMap = new Map(prev);
      const monitoring = newMap.get(folderId);
      if (monitoring) {
        newMap.set(folderId, { ...monitoring, isActive: false });
      }
      return newMap;
    });
  }, []);

  // Adicionar notificação
  const addNotification = useCallback((folderId: string, event: FileSystemEvent) => {
    const notification: FolderNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: event.type,
      fileName: event.fileName,
      filePath: event.filePath,
      fileType: event.fileType,
      timestamp: new Date().toISOString(),
      fileSize: event.fileSize,
      isRead: false,
    };

    setMonitorings(prev => {
      const newMap = new Map(prev);
      const monitoring = newMap.get(folderId);
      if (monitoring) {
        const notifications = [notification, ...monitoring.notifications];
        // Limitar número de notificações
        if (notifications.length > settings.maxNotifications) {
          notifications.splice(settings.maxNotifications);
        }
        
        newMap.set(folderId, {
          ...monitoring,
          notifications,
          lastScan: new Date().toISOString(),
        });
      }
      return newMap;
    });

    // Reproduzir som se habilitado
    if (settings.soundEnabled) {
      try {
        // Som simples de notificação (poderia ser um arquivo de áudio)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        console.warn('Não foi possível reproduzir som de notificação:', error);
      }
    }
  }, [settings.soundEnabled, settings.maxNotifications]);

  // Iniciar timer
  const startTimer = useCallback((folderId: string, duration: number, unit: 'hours' | 'days' | 'weeks' | 'months', description: string) => {
    // Converter para millisegundos
    const multipliers = {
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,
      months: 30 * 24 * 60 * 60 * 1000,
    };

    const durationMs = duration * multipliers[unit];
    const startTime = new Date().toISOString();

    const timer: MonitoringTimer = {
      isActive: true,
      startTime,
      duration: durationMs,
      unit,
      displayDuration: duration,
      description,
      isExpired: false,
      notificationSent: false,
    };

    setMonitorings(prev => {
      const newMap = new Map(prev);
      const monitoring = newMap.get(folderId);
      if (monitoring) {
        newMap.set(folderId, { ...monitoring, timer });
      }
      return newMap;
    });

    // Definir timeout para quando o timer expirar
    const timeout = setTimeout(() => {
      setMonitorings(prev => {
        const newMap = new Map(prev);
        const monitoring = newMap.get(folderId);
        if (monitoring?.timer) {
          newMap.set(folderId, {
            ...monitoring,
            timer: { ...monitoring.timer, isExpired: true, notificationSent: true }
          });
        }
        return newMap;
      });
      
      // Notificação de timer expirado
      if (settings.soundEnabled) {
        // Som mais longo para timer expirado
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
          console.warn('Não foi possível reproduzir som do timer:', error);
        }
      }
    }, durationMs);

    timerRefs.current.set(folderId, timeout);
  }, [settings.soundEnabled]);

  // Restaurar timer após recarregar página
  const restoreTimer = useCallback((folderId: string, timer: MonitoringTimer) => {
    if (!timer.isActive || timer.isExpired) return;

    const startTime = new Date(timer.startTime);
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const remaining = timer.duration - elapsed;

    if (remaining <= 0) {
      // Timer já expirou
      setMonitorings(prev => {
        const newMap = new Map(prev);
        const monitoring = newMap.get(folderId);
        if (monitoring?.timer) {
          newMap.set(folderId, {
            ...monitoring,
            timer: { ...monitoring.timer, isExpired: true }
          });
        }
        return newMap;
      });
      return;
    }

    // Continuar timer
    const timeout = setTimeout(() => {
      setMonitorings(prev => {
        const newMap = new Map(prev);
        const monitoring = newMap.get(folderId);
        if (monitoring?.timer) {
          newMap.set(folderId, {
            ...monitoring,
            timer: { ...monitoring.timer, isExpired: true, notificationSent: true }
          });
        }
        return newMap;
      });
    }, remaining);

    timerRefs.current.set(folderId, timeout);
  }, []);

  // Parar timer
  const stopTimer = useCallback((folderId: string) => {
    const timeout = timerRefs.current.get(folderId);
    if (timeout) {
      clearTimeout(timeout);
      timerRefs.current.delete(folderId);
    }

    setMonitorings(prev => {
      const newMap = new Map(prev);
      const monitoring = newMap.get(folderId);
      if (monitoring?.timer) {
        newMap.set(folderId, {
          ...monitoring,
          timer: { ...monitoring.timer, isActive: false }
        });
      }
      return newMap;
    });
  }, []);

  // Marcar notificação como lida
  const markNotificationAsRead = useCallback((folderId: string, notificationId: string) => {
    setMonitorings(prev => {
      const newMap = new Map(prev);
      const monitoring = newMap.get(folderId);
      if (monitoring) {
        const notifications = monitoring.notifications.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        );
        newMap.set(folderId, { ...monitoring, notifications });
      }
      return newMap;
    });
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback((folderId: string) => {
    setMonitorings(prev => {
      const newMap = new Map(prev);
      const monitoring = newMap.get(folderId);
      if (monitoring) {
        const notifications = monitoring.notifications.map(notif => ({ ...notif, isRead: true }));
        newMap.set(folderId, { ...monitoring, notifications });
      }
      return newMap;
    });
  }, []);

  // Limpar notificações
  const clearNotifications = useCallback((folderId: string) => {
    setMonitorings(prev => {
      const newMap = new Map(prev);
      const monitoring = newMap.get(folderId);
      if (monitoring) {
        newMap.set(folderId, { ...monitoring, notifications: [] });
      }
      return newMap;
    });
  }, []);

  // Obter estatísticas
  const getMonitoringStats = useCallback((folderId: string) => {
    const monitoring = monitorings.get(folderId);
    if (!monitoring) return null;

    const notifications = monitoring.notifications;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const createdCount = notifications.filter(n => n.type === 'created').length;
    const modifiedCount = notifications.filter(n => n.type === 'modified').length;
    const deletedCount = notifications.filter(n => n.type === 'deleted').length;

    return {
      total: notifications.length,
      unread: unreadCount,
      created: createdCount,
      modified: modifiedCount,
      deleted: deletedCount,
      isActive: monitoring.isActive,
      hasTimer: !!monitoring.timer?.isActive,
      timerExpired: monitoring.timer?.isExpired || false,
    };
  }, [monitorings]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(interval => clearInterval(interval));
      timerRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
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
  };
}; 