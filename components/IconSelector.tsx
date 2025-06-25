import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FolderPlus, FolderCheck, FolderX, FolderLock,
  Briefcase, Building, Users, Handshake, BarChart3, TrendingUp, DollarSign, PiggyBank,
  Code, GitBranch, Database, Server, Globe, Smartphone, Monitor, Cpu,
  FileText, FileSpreadsheet, Presentation, FileImage, FileVideo, FileAudio, Archive, Download,
  Settings, Hammer, Wrench, Cog, Shield, Key, Search, Filter,
  Mail, MessageCircle, Phone, Video, Share, Bell, Calendar, Clock,
  Upload, X, Sparkles
} from 'lucide-react';
import { AVAILABLE_ICONS, ICON_CATEGORIES } from '../constants';
import { ModernIconRenderer, MODERN_ICONS_LIST } from '../utils/modernIcons';
import { IconOption } from '../types';

interface IconSelectorProps {
  selectedIcon?: string;
  selectedIconType?: 'preset' | 'custom' | 'modern';
  onIconSelect: (iconId: string, iconType: 'preset' | 'custom' | 'modern') => void;
  className?: string;
}

// Mapeamento dos IDs dos ícones para os componentes Lucide
const iconComponents: Record<string, React.ComponentType<any>> = {
  'folder': Folder,
  'folder-open': FolderOpen,
  'folder-plus': FolderPlus,
  'folder-check': FolderCheck,
  'folder-x': FolderX,
  'folder-lock': FolderLock,
  'briefcase': Briefcase,
  'building': Building,
  'users': Users,
  'handshake': Handshake,
  'chart-bar': BarChart3,
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  'piggy-bank': PiggyBank,
  'code': Code,
  'git-branch': GitBranch,
  'database': Database,
  'server': Server,
  'globe': Globe,
  'smartphone': Smartphone,
  'monitor': Monitor,
  'cpu': Cpu,
  'file-text': FileText,
  'file-spreadsheet': FileSpreadsheet,
  'presentation': Presentation,
  'file-image': FileImage,
  'file-video': FileVideo,
  'file-audio': FileAudio,
  'archive': Archive,
  'download': Download,
  'settings': Settings,
  'tool': Hammer,
  'wrench': Wrench,
  'cog': Cog,
  'shield': Shield,
  'key': Key,
  'search': Search,
  'filter': Filter,
  'mail': Mail,
  'message-circle': MessageCircle,
  'phone': Phone,
  'video': Video,
  'share': Share,
  'bell': Bell,
  'calendar': Calendar,
  'clock': Clock,
};

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon = 'folder',
  selectedIconType = 'preset',
  onIconSelect,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('folder');
  const [iconStyle, setIconStyle] = useState<'modern' | 'classic'>('modern');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Função para renderizar um ícone baseado no ID (versão clássica)
  const renderClassicIcon = (iconId: string, size = 20) => {
    const IconComponent = iconComponents[iconId];
    if (IconComponent) {
      return <IconComponent size={size} />;
    }
    return <Folder size={size} />; // Fallback para ícone padrão
  };

  // Filtrar ícones por categoria
  const filteredClassicIcons = AVAILABLE_ICONS.filter(icon => icon.category === activeCategory);
  const filteredModernIcons = MODERN_ICONS_LIST.filter(icon => icon.category === activeCategory);

  const handleCustomIconSubmit = () => {
    if (customIconUrl.trim() && isValidUrl(customIconUrl)) {
      onIconSelect(customIconUrl, 'custom');
      setCustomIconUrl('');
      setShowCustomInput(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleCustomIconCancel = () => {
    setCustomIconUrl('');
    setShowCustomInput(false);
  };

  const getSelectedIconName = () => {
    if (selectedIconType === 'custom') return 'Ícone Personalizado';
    if (selectedIconType === 'modern') {
      return MODERN_ICONS_LIST.find(icon => icon.id === selectedIcon)?.name || 'Ícone Moderno';
    }
    return AVAILABLE_ICONS.find(icon => icon.id === selectedIcon)?.name || 'Ícone Clássico';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          Ícone da Pasta
        </label>
        
        {/* Ícone selecionado atualmente */}
        <div className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">Ícone Selecionado:</p>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
              {selectedIconType === 'modern' ? (
                <ModernIconRenderer iconId={selectedIcon} size={32} />
              ) : selectedIconType === 'preset' ? (
                renderClassicIcon(selectedIcon, 24)
              ) : (
                <img 
                  src={selectedIcon} 
                  alt="Ícone personalizado" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              )}
              <Folder size={32} className="hidden text-gray-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                {getSelectedIconName()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {selectedIconType === 'modern' ? 'Estilo Moderno' : 
                 selectedIconType === 'preset' ? 'Estilo Clássico' : 'Personalizado'}
              </span>
            </div>
          </div>
        </div>

        {/* Seletor de Estilo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estilo dos Ícones
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIconStyle('modern')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                iconStyle === 'modern'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Sparkles size={18} className="inline mr-2" />
              Moderno (iOS)
            </button>
            <button
              type="button"
              onClick={() => setIconStyle('classic')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                iconStyle === 'classic'
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Settings size={18} className="inline mr-2" />
              Clássico
            </button>
          </div>
        </div>

        {/* Categorias */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria
          </label>
          <div className="flex flex-wrap gap-2">
            {ICON_CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-105'
                }`}
                title={category.description}
              >
                {category.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                showCustomInput
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 hover:scale-105'
              }`}
              title="Usar ícone personalizado (URL)"
            >
              <Upload size={18} />
              Personalizado
            </button>
          </div>
        </div>

        {/* Grid de ícones da categoria selecionada */}
        {!showCustomInput && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 gap-3 max-h-80 overflow-y-auto">
              {iconStyle === 'modern' ? (
                // Ícones modernos
                filteredModernIcons.map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => onIconSelect(icon.id, 'modern')}
                    className={`p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group relative ${
                      selectedIcon === icon.id && selectedIconType === 'modern'
                        ? 'bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500 shadow-lg scale-105'
                        : 'bg-gray-50 dark:bg-gray-700 hover:scale-105'
                    }`}
                    title={icon.name}
                    aria-label={`Selecionar ícone ${icon.name}`}
                  >
                    <ModernIconRenderer iconId={icon.id} size={32} />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {icon.name}
                    </div>
                  </button>
                ))
              ) : (
                // Ícones clássicos
                filteredClassicIcons.map((icon: IconOption) => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => onIconSelect(icon.id, 'preset')}
                    className={`p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group relative ${
                      selectedIcon === icon.id && selectedIconType === 'preset'
                        ? 'bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500 shadow-lg scale-105'
                        : 'bg-gray-50 dark:bg-gray-700 hover:scale-105'
                    }`}
                    title={icon.name}
                    aria-label={`Selecionar ícone ${icon.name}`}
                  >
                    {renderClassicIcon(icon.id, 24)}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {icon.name}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Input para ícone personalizado */}
        {showCustomInput && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL do Ícone Personalizado
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={customIconUrl}
                  onChange={(e) => setCustomIconUrl(e.target.value)}
                  placeholder="https://exemplo.com/icone.png"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 text-sm"
                />
                <button
                  type="button"
                  onClick={handleCustomIconSubmit}
                  disabled={!customIconUrl.trim() || !isValidUrl(customIconUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  title="Aplicar ícone personalizado"
                >
                  <Upload size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleCustomIconCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  title="Cancelar"
                >
                  <X size={18} />
                </button>
              </div>
              {customIconUrl && !isValidUrl(customIconUrl) && (
                <p className="text-red-500 text-xs mt-1">URL inválida</p>
              )}
            </div>
            
            {/* Preview do ícone personalizado */}
            {customIconUrl && isValidUrl(customIconUrl) && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Preview:</span>
                <div className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                  <img 
                    src={customIconUrl} 
                    alt="Preview do ícone" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Folder size={24} className="hidden text-red-500" />
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
              <strong>Dica:</strong> Formatos suportados: PNG, JPG, SVG, GIF. Tamanho recomendado: 24x24px para melhor qualidade.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconSelector; 