import React from 'react';
import { 
  Folder, FolderOpen, FolderPlus, FolderCheck, FolderX, FolderLock,
  Briefcase, Building, Users, Handshake, BarChart3, TrendingUp, DollarSign, PiggyBank,
  Code, GitBranch, Database, Server, Globe, Smartphone, Monitor, Cpu,
  FileText, FileSpreadsheet, Presentation, FileImage, FileVideo, FileAudio, Archive, Download,
  Settings, Hammer, Wrench, Cog, Shield, Key, Search, Filter,
  Mail, MessageCircle, Phone, Video, Share, Bell, Calendar, Clock
} from 'lucide-react';
import { ModernIconRenderer, ModernIcons } from './modernIcons';

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

interface RenderIconProps {
  iconId?: string;
  iconType?: 'preset' | 'custom' | 'modern';
  size?: number;
  className?: string;
}

/**
 * Renderiza um ícone baseado no ID e tipo
 * @param iconId - ID do ícone ou URL para ícones personalizados
 * @param iconType - Tipo do ícone ('preset' para ícones pré-definidos, 'custom' para URLs, 'modern' para ícones iOS)
 * @param size - Tamanho do ícone em pixels (padrão: 20)
 * @param className - Classes CSS adicionais
 */
export const renderIcon = ({ 
  iconId = 'folder', 
  iconType = 'preset', 
  size = 20, 
  className = '' 
}: RenderIconProps) => {
  if (iconType === 'modern') {
    return <ModernIconRenderer iconId={iconId} size={size} className={className} />;
  }

  if (iconType === 'custom' && iconId) {
    return (
      <img 
        src={iconId} 
        alt="Ícone personalizado" 
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          // Se a imagem falhar ao carregar, substitui por ícone padrão
          const fallbackIcon = React.createElement(Folder, { size, className });
          const parent = e.currentTarget.parentNode;
          if (parent) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.innerHTML = fallbackIcon.toString();
            parent.replaceChild(fallbackDiv, e.currentTarget);
          }
        }}
      />
    );
  }

  const IconComponent = iconComponents[iconId];
  if (IconComponent) {
    return React.createElement(IconComponent, { size, className });
  }
  
  // Fallback para ícone padrão
  return React.createElement(Folder, { size, className });
};

/**
 * Componente React para renderizar ícones
 */
export const IconRenderer: React.FC<RenderIconProps> = (props) => {
  return <>{renderIcon(props)}</>;
};

/**
 * Hook para obter o componente de ícone
 */
export const useIcon = (iconId: string = 'folder', iconType: 'preset' | 'custom' | 'modern' = 'preset') => {
  if (iconType === 'modern') {
    return ModernIcons[iconId as keyof typeof ModernIcons] || ModernIcons.folder;
  }
  return iconComponents[iconId] || Folder;
};

/**
 * Função utilitária para verificar se um ícone existe
 */
export const iconExists = (iconId: string, iconType: 'preset' | 'custom' | 'modern' = 'preset') => {
  if (iconType === 'modern') {
    return ModernIcons.hasOwnProperty(iconId);
  }
  if (iconType === 'custom') {
    // Para ícones personalizados, sempre retorna true (será validado na renderização)
    return true;
  }
  return iconComponents.hasOwnProperty(iconId);
};

/**
 * Função para obter lista de ícones disponíveis por tipo
 */
export const getAvailableIcons = (iconType: 'preset' | 'modern' = 'preset') => {
  if (iconType === 'modern') {
    return Object.keys(ModernIcons);
  }
  return Object.keys(iconComponents);
};

export default { renderIcon, IconRenderer, useIcon, iconExists, getAvailableIcons }; 