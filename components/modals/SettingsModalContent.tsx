import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Trash2, Download, Upload, Users, Hash, Plus, X } from 'lucide-react';
import { RESPONSIBLES_DATA, AVAILABLE_TAGS_DATA } from '../../constants';

interface SettingsModalContentProps {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentPanelWidth: number;
  onPanelWidthChange: (width: number) => void;
  isDetailsPanelOpen: boolean;
  onToggleDetailsPanel: () => void;
  onDataChange: () => void;
}

export const SettingsModalContent: React.FC<SettingsModalContentProps> = ({
  onClose,
  isDarkMode,
  onToggleDarkMode,
  currentPanelWidth,
  onPanelWidthChange,
  isDetailsPanelOpen,
  onToggleDetailsPanel,
  onDataChange,
}) => {
  const [settings, setSettings] = useState({
    autoSave: true,
    showNotifications: true,
    soundEnabled: true,
    maxHistoryItems: 50,
    autoBackup: false,
    backupInterval: 30, // minutos
    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    showTooltips: true,
    compactMode: false,
  });

  const [appData, setAppData] = useState<string>('');

  // Estados para gerenciamento de usuários e tags
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newResponsible, setNewResponsible] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [editingResponsible, setEditingResponsible] = useState<{ index: number; value: string; isDefault?: boolean } | null>(null);
  const [editingTag, setEditingTag] = useState<{ index: number; value: string; isDefault?: boolean } | null>(null);
  
  // Estados para os dados padrão editados
  const [editedDefaultResponsibles, setEditedDefaultResponsibles] = useState<{[key: string]: string}>({});
  const [editedDefaultTags, setEditedDefaultTags] = useState<{[key: string]: string}>({});

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }

    // Carregar usuários e tags do localStorage
    const savedResponsibles = localStorage.getItem('custom-responsibles');
    const savedTags = localStorage.getItem('custom-tags');
    const savedEditedDefaultResponsibles = localStorage.getItem('edited-default-responsibles');
    const savedEditedDefaultTags = localStorage.getItem('edited-default-tags');
    
    console.log('🔍 Dados salvos encontrados:');
    console.log('- Responsáveis:', savedResponsibles);
    console.log('- Tags:', savedTags);
    
    if (savedResponsibles) {
      try {
        const parsed = JSON.parse(savedResponsibles);
        console.log('✅ Responsáveis carregados:', parsed);
        setResponsibles(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('❌ Erro ao carregar responsáveis:', error);
        console.log('🔧 Limpando dados corrompidos...');
        localStorage.removeItem('custom-responsibles');
        setResponsibles([]);
      }
    }
    
    if (savedTags) {
      try {
        const parsed = JSON.parse(savedTags);
        console.log('✅ Tags carregadas:', parsed);
        setTags(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('❌ Erro ao carregar tags:', error);
        console.log('🔧 Limpando dados corrompidos...');
        localStorage.removeItem('custom-tags');
        setTags([]);
      }
    }
    
    if (savedEditedDefaultResponsibles) {
      try {
        setEditedDefaultResponsibles(JSON.parse(savedEditedDefaultResponsibles));
      } catch (error) {
        console.error('Erro ao carregar responsáveis padrão editados:', error);
        localStorage.removeItem('edited-default-responsibles');
      }
    }
    
    if (savedEditedDefaultTags) {
      try {
        setEditedDefaultTags(JSON.parse(savedEditedDefaultTags));
      } catch (error) {
        console.error('Erro ao carregar tags padrão editadas:', error);
        localStorage.removeItem('edited-default-tags');
      }
    }
  }, []);

  // Diagnóstico para debug
  const debugUserData = () => {
    console.log('🔍 DIAGNÓSTICO DE USUÁRIOS E TAGS:');
    console.log('📊 Estado atual responsibles:', responsibles);
    console.log('📊 Estado atual tags:', tags);
    console.log('💾 localStorage responsibles:', localStorage.getItem('custom-responsibles'));
    console.log('💾 localStorage tags:', localStorage.getItem('custom-tags'));
    console.log('🔧 Responsáveis editados padrão:', editedDefaultResponsibles);
    console.log('🔧 Tags editadas padrão:', editedDefaultTags);
  };

  // Disponibilizar função globalmente para debug
  useEffect(() => {
    (window as any).debugUserData = debugUserData;
    return () => {
      delete (window as any).debugUserData;
    };
  }, [responsibles, tags, editedDefaultResponsibles, editedDefaultTags]);

  // Funções para gerenciar usuários
  const addResponsible = () => {
    if (newResponsible.trim() && !responsibles.includes(newResponsible.trim())) {
      const updated = [...responsibles, newResponsible.trim()];
      setResponsibles(updated);
      localStorage.setItem('custom-responsibles', JSON.stringify(updated));
      setNewResponsible('');
      onDataChange();
    }
  };

  const removeResponsible = (index: number) => {
    console.log('🗑️ Removendo responsável:', index, responsibles[index]);
    console.log('📊 Lista atual antes da remoção:', responsibles);
    
    const updated = responsibles.filter((_, i) => i !== index);
    console.log('📊 Lista após remoção:', updated);
    
    setResponsibles(updated);
    localStorage.setItem('custom-responsibles', JSON.stringify(updated));
    
    // Forçar atualização do componente
    setTimeout(() => {
      console.log('🔄 Estado atualizado:', updated);
      onDataChange();
    }, 100);
  };

  const updateResponsible = (index: number, newValue: string) => {
    console.log('✏️ Atualizando responsável:', index, newValue, editingResponsible);
    if (newValue.trim()) {
      if (editingResponsible?.isDefault) {
        // Editando um responsável padrão
        const originalValue = editingResponsible.value;
        const updated = { ...editedDefaultResponsibles, [originalValue]: newValue.trim() };
        setEditedDefaultResponsibles(updated);
        localStorage.setItem('edited-default-responsibles', JSON.stringify(updated));
        console.log('✅ Responsável padrão editado:', updated);
        onDataChange();
      } else {
        // Editando um responsável personalizado
        if (!responsibles.includes(newValue.trim())) {
          const updated = [...responsibles];
          updated[index] = newValue.trim();
          setResponsibles(updated);
          localStorage.setItem('custom-responsibles', JSON.stringify(updated));
          console.log('✅ Responsável personalizado editado:', updated);
          onDataChange();
        } else {
          console.log('⚠️ Responsável já existe:', newValue.trim());
        }
      }
    }
    setEditingResponsible(null);
  };

  // Funções para gerenciar tags
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updated = [...tags, newTag.trim()];
      setTags(updated);
      localStorage.setItem('custom-tags', JSON.stringify(updated));
      setNewTag('');
      onDataChange();
    }
  };

  const removeTag = (index: number) => {
    console.log('🗑️ Removendo tag:', index, tags[index]);
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    localStorage.setItem('custom-tags', JSON.stringify(updated));
    onDataChange();
  };

  const updateTag = (index: number, newValue: string) => {
    console.log('✏️ Atualizando tag:', index, newValue, editingTag);
    if (newValue.trim()) {
      if (editingTag?.isDefault) {
        // Editando uma tag padrão
        const originalValue = editingTag.value;
        const updated = { ...editedDefaultTags, [originalValue]: newValue.trim() };
        setEditedDefaultTags(updated);
        localStorage.setItem('edited-default-tags', JSON.stringify(updated));
        console.log('✅ Tag padrão editada:', updated);
        onDataChange();
      } else {
        // Editando uma tag personalizada
        if (!tags.includes(newValue.trim())) {
          const updated = [...tags];
          updated[index] = newValue.trim();
          setTags(updated);
          localStorage.setItem('custom-tags', JSON.stringify(updated));
          console.log('✅ Tag personalizada editada:', updated);
          onDataChange();
        } else {
          console.log('⚠️ Tag já existe:', newValue.trim());
        }
      }
    }
    setEditingTag(null);
  };

  // Salvar configurações
  const handleSaveSettings = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Aplicar configurações imediatamente
    if (settings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }

    onClose();
  };

  // Resetar configurações
  const handleResetSettings = () => {
    const defaultSettings = {
      autoSave: true,
      showNotifications: true,
      soundEnabled: true,
      maxHistoryItems: 50,
      autoBackup: false,
      backupInterval: 30,
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      showTooltips: true,
      compactMode: false,
    };
    setSettings(defaultSettings);
    localStorage.removeItem('app-settings');
  };

  // Limpar todos os dados
  const handleClearAllData = () => {
    if (confirm('Tem certeza que deseja limpar TODOS os dados da aplicação? Esta ação irá:\n\n• Remover todas as pastas e subpastas criadas\n• Limpar todos os favoritos\n• Apagar usuários personalizados\n• Apagar tags personalizadas\n• Resetar todas as configurações\n• Limpar histórico e monitoramento\n\nEsta ação NÃO PODE ser desfeita!')) {
      // Limpar todos os dados do localStorage
      localStorage.clear();
      
      // Resetar também os estados locais
      setResponsibles([]);
      setTags([]);
      setNewResponsible('');
      setNewTag('');
      setEditingResponsible(null);
      setEditingTag(null);
      setEditedDefaultResponsibles({});
      setEditedDefaultTags({});
      
      // Chamar onDataChange para atualizar a interface principal
      onDataChange();
      
      // Recarregar a página para garantir que tudo seja resetado
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Exportar dados
  const handleExportData = () => {
    const allData = {
      folders: JSON.parse(localStorage.getItem('folders') || '[]'),
      favorites: JSON.parse(localStorage.getItem('favorite-folders') || '[]'),
      layouts: JSON.parse(localStorage.getItem('saved-layouts') || '[]'),
      settings: JSON.parse(localStorage.getItem('app-settings') || '{}'),
      monitoring: JSON.parse(localStorage.getItem('folder-monitorings') || '{}'),
      monitoringSettings: JSON.parse(localStorage.getItem('folder-monitoring-settings') || '{}'),
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-pastas-corporativas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Importar dados
  const handleImportData = () => {
    try {
      const data = JSON.parse(appData);
      
      if (data.folders) localStorage.setItem('folders', JSON.stringify(data.folders));
      if (data.favorites) localStorage.setItem('favorite-folders', JSON.stringify(data.favorites));
      if (data.layouts) localStorage.setItem('saved-layouts', JSON.stringify(data.layouts));
      if (data.settings) localStorage.setItem('app-settings', JSON.stringify(data.settings));
      if (data.monitoring) localStorage.setItem('folder-monitorings', JSON.stringify(data.monitoring));
      if (data.monitoringSettings) localStorage.setItem('folder-monitoring-settings', JSON.stringify(data.monitoringSettings));

      alert('Dados importados com sucesso! A página será recarregada.');
      window.location.reload();
    } catch (error) {
      alert('Erro ao importar dados. Verifique se o formato está correto.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Aparência */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">🎨 Aparência</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Modo escuro</span>
            <button
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Painel de detalhes</span>
            <button
              onClick={onToggleDetailsPanel}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDetailsPanelOpen ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDetailsPanelOpen ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Largura do painel principal: {currentPanelWidth}%
            </label>
            <input
              type="range"
              min="25"
              max="75"
              value={currentPanelWidth}
              onChange={(e) => onPanelWidthChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Modo compacto</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.compactMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.compactMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>
        </div>
      </div>

      {/* Comportamento */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">⚙️ Comportamento</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Salvamento automático</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, autoSave: !prev.autoSave }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoSave ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar notificações</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, showNotifications: !prev.showNotifications }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Sons habilitados</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar tooltips</span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, showTooltips: !prev.showTooltips }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showTooltips ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showTooltips ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </label>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Máximo de itens no histórico: {settings.maxHistoryItems}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.maxHistoryItems}
              onChange={(e) => setSettings(prev => ({ ...prev, maxHistoryItems: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Gerenciamento de Dados */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">👥 Usuários e Tags</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gerenciamento de Usuários */}
          <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
            <Users size={18} className="mr-2" />
            Responsáveis
          </h4>
          
          {/* Adicionar novo usuário */}
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newResponsible}
              onChange={(e) => setNewResponsible(e.target.value)}
              placeholder="Novo responsável..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addResponsible()}
            />
            <button
              onClick={addResponsible}
              disabled={!newResponsible.trim() || responsibles.includes(newResponsible.trim())}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              title="Adicionar responsável"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Lista de usuários */}
          <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-custom">
            {/* Responsáveis padrão */}
            {RESPONSIBLES_DATA.map((responsible, index) => {
              const editedValue = editedDefaultResponsibles[responsible];
              const displayValue = editedValue || responsible;
              const editKey = `default-${index}`;
              
              return (
                <div key={editKey} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
                  {editingResponsible?.index === index && editingResponsible?.isDefault ? (
                    <input
                      type="text"
                      value={editingResponsible.value}
                      onChange={(e) => setEditingResponsible({ index, value: e.target.value, isDefault: true })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-100 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updateResponsible(index, editingResponsible.value);
                        if (e.key === 'Escape') setEditingResponsible(null);
                      }}
                      onBlur={() => updateResponsible(index, editingResponsible.value)}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="flex-1 text-sm cursor-pointer hover:text-blue-600 flex items-center"
                      onClick={() => setEditingResponsible({ index, value: displayValue, isDefault: true })}
                    >
                      {displayValue}
                      {editedValue && <span className="ml-2 text-xs text-blue-600 bg-blue-100 dark:bg-blue-800 px-1 rounded">editado</span>}
                    </span>
                  )}
                  <span className="text-xs text-blue-600 dark:text-blue-400 px-2">padrão</span>
                </div>
              );
            })}
            
            {/* Responsáveis personalizados */}
            {responsibles.map((responsible, index) => (
              <div key={`custom-${index}`} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                {editingResponsible?.index === index && !editingResponsible?.isDefault ? (
                  <input
                    type="text"
                    value={editingResponsible.value}
                    onChange={(e) => setEditingResponsible({ index, value: e.target.value, isDefault: false })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-100 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateResponsible(index, editingResponsible.value);
                      if (e.key === 'Escape') setEditingResponsible(null);
                    }}
                    onBlur={() => updateResponsible(index, editingResponsible.value)}
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 text-sm cursor-pointer hover:text-blue-600"
                    onClick={() => {
                      console.log('🖱️ Clique para editar responsável:', index, responsible);
                      setEditingResponsible({ index, value: responsible, isDefault: false });
                    }}
                  >
                    {responsible}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🖱️ Clique no botão remover responsável:', index);
                    removeResponsible(index);
                  }}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  title="Remover responsável"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

          {/* Gerenciamento de Tags */}
          <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
            <Hash size={18} className="mr-2" />
            Tags
          </h4>
          
          {/* Adicionar nova tag */}
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nova tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
            />
            <button
              onClick={addTag}
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              title="Adicionar tag"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Lista de tags */}
          <div className="max-h-48 overflow-y-auto scrollbar-custom">
            {/* Tags padrão */}
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Tags Padrão</h5>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS_DATA.map((tag: string, index: number) => {
                  const editedValue = editedDefaultTags[tag];
                  const displayValue = editedValue || tag;
                  const editKey = `default-tag-${index}`;
                  
                  return (
                    <div key={editKey} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm border border-blue-300 dark:border-blue-700">
                      {editingTag?.index === index && editingTag?.isDefault ? (
                        <input
                          type="text"
                          value={editingTag.value}
                          onChange={(e) => setEditingTag({ index, value: e.target.value, isDefault: true })}
                          className="bg-transparent border-none outline-none text-sm w-20"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateTag(index, editingTag.value);
                            if (e.key === 'Escape') setEditingTag(null);
                          }}
                          onBlur={() => updateTag(index, editingTag.value)}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="cursor-pointer hover:underline flex items-center"
                          onClick={() => setEditingTag({ index, value: displayValue, isDefault: true })}
                        >
                          {displayValue}
                          {editedValue && <span className="ml-1 text-xs">*</span>}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Tags personalizadas */}
            {tags.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Tags Personalizadas</h5>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div key={`custom-tag-${index}`} className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full px-3 py-1 text-sm">
                      {editingTag?.index === index && !editingTag?.isDefault ? (
                        <input
                          type="text"
                          value={editingTag.value}
                          onChange={(e) => setEditingTag({ index, value: e.target.value, isDefault: false })}
                          className="bg-transparent border-none outline-none text-sm w-20"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateTag(index, editingTag.value);
                            if (e.key === 'Escape') setEditingTag(null);
                          }}
                          onBlur={() => updateTag(index, editingTag.value)}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => {
                            console.log('🖱️ Clique para editar tag:', index, tag);
                            setEditingTag({ index, value: tag, isDefault: false });
                          }}
                        >
                          {tag}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🖱️ Clique no botão remover tag:', index);
                          removeTag(index);
                        }}
                        className="ml-2 text-green-600 dark:text-green-400 hover:text-red-500 transition-colors"
                        title="Remover tag"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Backup e Dados */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">💾 Backup e Dados</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={handleExportData}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Download size={18} className="mr-2" />
              Exportar Dados
            </button>
            <button
              onClick={handleImportData}
              disabled={!appData.trim()}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
            >
              <Upload size={18} className="mr-2" />
              Importar Dados
            </button>
          </div>

          <textarea
            value={appData}
            onChange={(e) => setAppData(e.target.value)}
            placeholder="Cole aqui o JSON de backup para importar..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-xs scrollbar-custom resize-none"
          />

          <div className="flex space-x-2">
            <button
              onClick={handleResetSettings}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
            >
              <RefreshCw size={18} className="mr-2" />
              Resetar Configurações
            </button>
            <button
              onClick={handleClearAllData}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 size={18} className="mr-2" />
              Limpar Todos os Dados
            </button>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          onClick={handleSaveSettings}
        >
          <Save size={18} className="mr-2" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}; 