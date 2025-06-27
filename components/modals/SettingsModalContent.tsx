import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Trash2, Download, Upload, Users, Hash, Plus, X } from 'lucide-react';
import { RESPONSIBLES_DATA, AVAILABLE_TAGS_DATA } from '../../constants';
import { LocalFolderSettings } from './LocalFolderSettings';

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

  // Configurações de cores para padronização
  const [colorSettings, setColorSettings] = useState({
    mainFolderColor: 'bg-blue-600',
    subFolderColor: 'bg-blue-400', 
    textColor: 'text-white'
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

    // Carregar configurações de cores
    const savedColorSettings = localStorage.getItem('color-settings');
    if (savedColorSettings) {
      try {
        setColorSettings({ ...colorSettings, ...JSON.parse(savedColorSettings) });
      } catch (error) {
        console.error('Erro ao carregar configurações de cores:', error);
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
        const parsed = JSON.parse(savedEditedDefaultResponsibles);
        setEditedDefaultResponsibles(parsed);
      } catch (error) {
        console.error('❌ Erro ao carregar responsáveis editados:', error);
        localStorage.removeItem('edited-default-responsibles');
      }
    }

    if (savedEditedDefaultTags) {
      try {
        const parsed = JSON.parse(savedEditedDefaultTags);
        setEditedDefaultTags(parsed);
      } catch (error) {
        console.error('❌ Erro ao carregar tags editadas:', error);
        localStorage.removeItem('edited-default-tags');
      }
    }
  }, []);

  // Funções para gerenciar responsáveis
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
    const updated = responsibles.filter((_, i) => i !== index);
    setResponsibles(updated);
    localStorage.setItem('custom-responsibles', JSON.stringify(updated));
    onDataChange();
  };

  const updateResponsible = (index: number, newValue: string) => {
    if (newValue.trim()) {
      if (editingResponsible?.isDefault) {
        // Editando um responsável padrão
        const originalValue = editingResponsible.value;
        const updated = { ...editedDefaultResponsibles, [originalValue]: newValue.trim() };
        setEditedDefaultResponsibles(updated);
        localStorage.setItem('edited-default-responsibles', JSON.stringify(updated));
        onDataChange();
      } else {
        // Editando um responsável personalizado
        if (!responsibles.includes(newValue.trim())) {
          const updated = [...responsibles];
          updated[index] = newValue.trim();
          setResponsibles(updated);
          localStorage.setItem('custom-responsibles', JSON.stringify(updated));
          onDataChange();
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
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
    localStorage.setItem('custom-tags', JSON.stringify(updated));
    onDataChange();
  };

  const updateTag = (index: number, newValue: string) => {
    if (newValue.trim()) {
      if (editingTag?.isDefault) {
        // Editando uma tag padrão
        const originalValue = editingTag.value;
        const updated = { ...editedDefaultTags, [originalValue]: newValue.trim() };
        setEditedDefaultTags(updated);
        localStorage.setItem('edited-default-tags', JSON.stringify(updated));
        onDataChange();
      } else {
        // Editando uma tag personalizada
        if (!tags.includes(newValue.trim())) {
          const updated = [...tags];
          updated[index] = newValue.trim();
          setTags(updated);
          localStorage.setItem('custom-tags', JSON.stringify(updated));
          onDataChange();
        }
      }
    }
    setEditingTag(null);
  };

  // Função para atualizar configurações de cores
  const updateColorSettings = (key: keyof typeof colorSettings, value: string) => {
    const newColorSettings = { ...colorSettings, [key]: value };
    setColorSettings(newColorSettings);
    localStorage.setItem('color-settings', JSON.stringify(newColorSettings));
  };

  // Salvar configurações
  const handleSaveSettings = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    localStorage.setItem('color-settings', JSON.stringify(colorSettings));
    
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
      {/* Sistema de Pasta Local Automática */}
      <LocalFolderSettings />

      {/* Aparência */}
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-800 dark:text-gray-100">🎨 Aparência</h3>
        <div className="space-y-3">
          <label className="flex justify-between items-center">
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

          <label className="flex justify-between items-center">
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
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
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

          <label className="flex justify-between items-center">
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

      {/* Configuração de Cores para Padronização */}
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-800 dark:text-gray-100">🎨 Cores de Padronização</h3>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Configure as cores que serão usadas quando você clicar no botão "Padronizar Cores" 🎨 nos templates.
          </p>
          
          <div className="space-y-4">
            {/* Cor das Pastas Principais */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Cor das Pastas Principais
              </label>
              <select
                value={colorSettings.mainFolderColor}
                onChange={(e) => updateColorSettings('mainFolderColor', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
              >
                <option value="bg-blue-600">Azul Escuro (Padrão)</option>
                <option value="bg-blue-700">Azul Muito Escuro</option>
                <option value="bg-blue-800">Azul Ultra Escuro</option>
                <option value="bg-indigo-600">Índigo</option>
                <option value="bg-purple-600">Roxo</option>
                <option value="bg-green-600">Verde</option>
                <option value="bg-teal-600">Verde Água</option>
                <option value="bg-cyan-600">Ciano</option>
                <option value="bg-gray-600">Cinza</option>
                <option value="bg-slate-600">Ardósia</option>
                <option value="bg-zinc-600">Zinco</option>
                <option value="bg-neutral-600">Neutro</option>
                <option value="bg-stone-600">Pedra</option>
              </select>
              <div className={`mt-2 w-full h-8 rounded-md ${colorSettings.mainFolderColor} border border-gray-300`}></div>
            </div>

            {/* Cor das Subpastas */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Cor das Subpastas
              </label>
              <select
                value={colorSettings.subFolderColor}
                onChange={(e) => updateColorSettings('subFolderColor', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
              >
                <option value="bg-blue-400">Azul Claro (Padrão)</option>
                <option value="bg-blue-300">Azul Muito Claro</option>
                <option value="bg-blue-500">Azul Médio</option>
                <option value="bg-indigo-400">Índigo Claro</option>
                <option value="bg-purple-400">Roxo Claro</option>
                <option value="bg-green-400">Verde Claro</option>
                <option value="bg-teal-400">Verde Água Claro</option>
                <option value="bg-cyan-400">Ciano Claro</option>
                <option value="bg-gray-400">Cinza Claro</option>
                <option value="bg-slate-400">Ardósia Clara</option>
                <option value="bg-zinc-400">Zinco Claro</option>
                <option value="bg-neutral-400">Neutro Claro</option>
                <option value="bg-stone-400">Pedra Clara</option>
              </select>
              <div className={`mt-2 w-full h-8 rounded-md ${colorSettings.subFolderColor} border border-gray-300`}></div>
            </div>

            {/* Cor do Texto */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Cor do Texto
              </label>
              <select
                value={colorSettings.textColor}
                onChange={(e) => updateColorSettings('textColor', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
              >
                <option value="text-white">Branco (Padrão)</option>
                <option value="text-black">Preto</option>
                <option value="text-gray-100">Cinza Muito Claro</option>
                <option value="text-gray-200">Cinza Claro</option>
                <option value="text-gray-800">Cinza Escuro</option>
                <option value="text-gray-900">Cinza Muito Escuro</option>
              </select>
              <div className={`mt-2 w-full h-8 rounded-md ${colorSettings.mainFolderColor} border border-gray-300 flex items-center justify-center`}>
                <span className={`font-medium ${colorSettings.textColor}`}>Exemplo de Texto</span>
              </div>
            </div>

            {/* Preview das Cores */}
            <div className="p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600">
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preview das Cores:</h4>
              <div className="space-y-2">
                <div className={`px-3 py-2 rounded-md ${colorSettings.mainFolderColor} ${colorSettings.textColor} text-sm font-medium`}>
                  📁 Pasta Principal
                </div>
                <div className="ml-4 space-y-1">
                  <div className={`px-3 py-2 rounded-md ${colorSettings.subFolderColor} ${colorSettings.textColor} text-sm`}>
                    📁 Subpasta 1
                  </div>
                  <div className={`px-3 py-2 rounded-md ${colorSettings.subFolderColor} ${colorSettings.textColor} text-sm`}>
                    📁 Subpasta 2
                  </div>
                </div>
              </div>
            </div>

            {/* Botão para Resetar Cores */}
            <button
              onClick={() => {
                const defaultColors = {
                  mainFolderColor: 'bg-blue-600',
                  subFolderColor: 'bg-blue-400',
                  textColor: 'text-white'
                };
                setColorSettings(defaultColors);
                localStorage.setItem('color-settings', JSON.stringify(defaultColors));
              }}
              className="px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              🔄 Resetar para Cores Padrão
            </button>
          </div>
        </div>
      </div>

      {/* Comportamento */}
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-800 dark:text-gray-100">⚙️ Comportamento</h3>
        <div className="space-y-3">
          <label className="flex justify-between items-center">
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

          <label className="flex justify-between items-center">
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

          <label className="flex justify-between items-center">
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

          <label className="flex justify-between items-center">
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
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
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
        <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-100">👥 Usuários e Tags</h3>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Gerenciamento de Usuários */}
          <div>
          <h4 className="flex items-center mb-2 font-medium text-gray-700 text-md dark:text-gray-200">
            <Users size={18} className="mr-2" />
            Responsáveis
          </h4>
          
          {/* Adicionar novo usuário */}
          <div className="flex mb-3 space-x-2">
            <input
              type="text"
              value={newResponsible}
              onChange={(e) => setNewResponsible(e.target.value)}
              placeholder="Novo responsável..."
              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 border-solid focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              onKeyDown={(e) => e.key === 'Enter' && addResponsible()}
            />
            <button
              onClick={addResponsible}
              disabled={!newResponsible.trim() || responsibles.includes(newResponsible.trim())}
              className="px-3 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700 disabled:bg-gray-400"
              title="Adicionar responsável"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Lista de usuários */}
          <div className="overflow-y-auto space-y-1 max-h-48 scrollbar-custom">
            {/* Responsáveis padrão */}
            {RESPONSIBLES_DATA.map((responsible, index) => {
              const editedValue = editedDefaultResponsibles[responsible];
              const displayValue = editedValue || responsible;
              const editKey = `default-${index}`;
              
              return (
                <div key={editKey} className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700">
                  {editingResponsible?.index === index && editingResponsible?.isDefault ? (
                    <input
                      type="text"
                      value={editingResponsible.value}
                      onChange={(e) => setEditingResponsible({ index, value: e.target.value, isDefault: true })}
                      className="flex-1 px-2 py-1 text-sm rounded border border-gray-300 border-solid focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-100"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updateResponsible(index, editingResponsible.value);
                        if (e.key === 'Escape') setEditingResponsible(null);
                      }}
                      onBlur={() => updateResponsible(index, editingResponsible.value)}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="flex flex-1 items-center text-sm cursor-pointer hover:text-blue-600"
                      onClick={() => setEditingResponsible({ index, value: displayValue, isDefault: true })}
                    >
                      {displayValue}
                      {editedValue && <span className="px-1 ml-2 text-xs text-blue-600 bg-blue-100 rounded dark:bg-blue-800">editado</span>}
                    </span>
                  )}
                  <span className="px-2 text-xs text-blue-600 dark:text-blue-400">padrão</span>
                </div>
              );
            })}
            
            {/* Responsáveis personalizados */}
            {responsibles.map((responsible, index) => (
              <div key={`custom-${index}`} className="flex justify-between items-center p-2 bg-gray-50 rounded dark:bg-gray-700">
                {editingResponsible?.index === index && !editingResponsible?.isDefault ? (
                  <input
                    type="text"
                    value={editingResponsible.value}
                    onChange={(e) => setEditingResponsible({ index, value: e.target.value, isDefault: false })}
                    className="flex-1 px-2 py-1 text-sm rounded border border-gray-300 border-solid focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-100"
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
                  onClick={() => removeResponsible(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  title="Remover responsável"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Gerenciamento de Tags */}
        <div>
          <h4 className="flex items-center mb-2 font-medium text-gray-700 text-md dark:text-gray-200">
            <Hash size={18} className="mr-2" />
            Tags
          </h4>
          
          {/* Adicionar nova tag */}
          <div className="flex mb-3 space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nova tag..."
              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 border-solid focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
            />
            <button
              onClick={addTag}
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
              className="px-3 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700 disabled:bg-gray-400"
              title="Adicionar tag"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-48 scrollbar-custom">
            {/* Tags padrão */}
            <div className="mb-3">
              <h5 className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">Tags Padrão</h5>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS_DATA.map((tag: string, index: number) => {
                  const editedValue = editedDefaultTags[tag];
                  const displayValue = editedValue || tag;
                  const editKey = `default-tag-${index}`;
                  
                  return (
                    <div key={editKey} className="flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full border border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700">
                      {editingTag?.index === index && editingTag?.isDefault ? (
                        <input
                          type="text"
                          value={editingTag.value}
                          onChange={(e) => setEditingTag({ index, value: e.target.value, isDefault: true })}
                          className="w-20 text-sm bg-transparent border-none outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateTag(index, editingTag.value);
                            if (e.key === 'Escape') setEditingTag(null);
                          }}
                          onBlur={() => updateTag(index, editingTag.value)}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="flex items-center cursor-pointer hover:underline"
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
            <div>
              <h5 className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">Tags Personalizadas</h5>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div key={`custom-tag-${index}`} className="flex items-center px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    {editingTag?.index === index && !editingTag?.isDefault ? (
                      <input
                        type="text"
                        value={editingTag.value}
                        onChange={(e) => setEditingTag({ index, value: e.target.value, isDefault: false })}
                        className="w-20 text-sm bg-transparent border-none outline-none"
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
                        onClick={() => setEditingTag({ index, value: tag, isDefault: false })}
                      >
                        {tag}
                      </span>
                    )}
                    <button
                      onClick={() => removeTag(index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                      title="Remover tag"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Backup e Importação */}
    <div>
      <h3 className="mb-3 text-lg font-medium text-gray-800 dark:text-gray-100">💾 Backup e Importação</h3>
      <div className="space-y-3">
        <div className="flex space-x-2">
          <button
            onClick={handleExportData}
            className="flex flex-1 justify-center items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
          >
            <Download size={18} className="mr-2" />
            Exportar Dados
          </button>
          <button
            onClick={handleImportData}
            disabled={!appData.trim()}
            className="flex flex-1 justify-center items-center px-3 py-2 text-sm text-white bg-green-600 rounded-md transition-colors hover:bg-green-700 disabled:bg-gray-400"
          >
            <Upload size={18} className="mr-2" />
            Importar Dados
          </button>
        </div>

        <textarea
          value={appData}
          onChange={(e) => setAppData(e.target.value)}
          placeholder="Cole aqui o JSON de backup para importar..."
          className="px-3 py-2 w-full h-24 text-xs rounded-md border border-gray-300 border-solid resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 scrollbar-custom"
        />

        <div className="flex space-x-2">
          <button
            onClick={handleResetSettings}
            className="flex flex-1 justify-center items-center px-3 py-2 text-sm text-white bg-yellow-600 rounded-md transition-colors hover:bg-yellow-700"
          >
            <RefreshCw size={18} className="mr-2" />
            Resetar Configurações
          </button>
          <button
            onClick={handleClearAllData}
            className="flex flex-1 justify-center items-center px-3 py-2 text-sm text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
          >
            <Trash2 size={18} className="mr-2" />
            Limpar Todos os Dados
          </button>
        </div>
      </div>
    </div>

    {/* Botões de ação */}
    <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200 border-solid dark:border-gray-700">
      <button
        type="button"
        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md transition-colors dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        onClick={onClose}
      >
        Cancelar
      </button>
      <button
        type="button"
        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
        onClick={handleSaveSettings}
      >
        <Save size={18} className="mr-2" />
        Salvar Configurações
      </button>
    </div>
  </div>
); 
};