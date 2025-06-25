import React from 'react';

// Função para gerar ID único para gradientes
const generateGradientId = (iconId: string, gradientName: string) => 
  `${iconId}-${gradientName}-${Math.random().toString(36).substr(2, 9)}`;

// Ícones modernos estilo iOS com gradientes e design mais sofisticado
export const ModernIcons = {
  // Pastas
  folder: (size = 24) => {
    const gradId = generateGradientId('folder', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <path 
          d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" 
          fill={`url(#${gradId})`} 
          stroke="none"
        />
        <path 
          d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" 
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="1"
        />
      </svg>
    );
  },

  folderOpen: (size = 24) => {
    const gradId = generateGradientId('folderOpen', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <path 
          d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H9L7 5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v2z" 
          fill={`url(#${gradId})`}
        />
        <path 
          d="M21 9v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" 
          fill="none" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="1"
        />
      </svg>
    );
  },

  folderShield: (size = 24) => {
    const gradId = generateGradientId('folderShield', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
        </defs>
        <path 
          d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" 
          fill={`url(#${gradId})`}
        />
        <path 
          d="M12 10s-2 0-2 2 2 4 2 4 2-2 2-4-2-2-2-2z" 
          fill="rgba(255,255,255,0.9)" 
          stroke="none"
        />
      </svg>
    );
  },

  // Negócios
  briefcase: (size = 24) => {
    const gradId = generateGradientId('briefcase', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        <rect x="2" y="7" width="20" height="14" rx="3" fill={`url(#${gradId})`} />
        <path 
          d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" 
          fill="none" 
          stroke="rgba(255,255,255,0.8)" 
          strokeWidth="1.5"
        />
        <rect x="2" y="7" width="20" height="3" fill="rgba(255,255,255,0.1)" />
      </svg>
    );
  },

  building: (size = 24) => {
    const gradId = generateGradientId('building', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
        <rect x="4" y="2" width="16" height="20" rx="2" fill={`url(#${gradId})`} />
        <rect x="7" y="5" width="2" height="2" fill="rgba(255,255,255,0.3)" rx="0.5" />
        <rect x="11" y="5" width="2" height="2" fill="rgba(255,255,255,0.3)" rx="0.5" />
        <rect x="15" y="5" width="2" height="2" fill="rgba(255,255,255,0.3)" rx="0.5" />
        <rect x="7" y="9" width="2" height="2" fill="rgba(255,255,255,0.3)" rx="0.5" />
        <rect x="11" y="9" width="2" height="2" fill="rgba(255,255,255,0.3)" rx="0.5" />
        <rect x="15" y="9" width="2" height="2" fill="rgba(255,255,255,0.3)" rx="0.5" />
        <rect x="9" y="17" width="6" height="5" fill="rgba(255,255,255,0.2)" rx="1" />
      </svg>
    );
  },

  // Tecnologia
  monitor: (size = 24) => {
    const gradId = generateGradientId('monitor', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
        <rect x="2" y="3" width="20" height="14" rx="3" fill={`url(#${gradId})`} />
        <rect x="4" y="5" width="16" height="10" rx="1" fill="rgba(0,0,0,0.3)" />
        <path d="M8 21h8M12 17v4" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="10" r="2" fill="rgba(255,255,255,0.2)" />
      </svg>
    );
  },

  smartphone: (size = 24) => {
    const gradId = generateGradientId('smartphone', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect x="5" y="2" width="14" height="20" rx="4" fill={`url(#${gradId})`} />
        <rect x="7" y="4" width="10" height="14" rx="1" fill="rgba(0,0,0,0.4)" />
        <circle cx="12" cy="20" r="1" fill="rgba(255,255,255,0.8)" />
      </svg>
    );
  },

  // Documentos
  fileDocument: (size = 24) => {
    const gradId = generateGradientId('fileDocument', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <path 
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
          fill={`url(#${gradId})`}
        />
        <path d="M14 2v6h6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <path d="M8 13h8M8 17h6" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      </svg>
    );
  },

  spreadsheet: (size = 24) => {
    const gradId = generateGradientId('spreadsheet', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="3" fill={`url(#${gradId})`} />
        <path d="M8 3v18M16 3v18M3 8h18M3 16h18" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="9" y="9" width="6" height="6" fill="rgba(255,255,255,0.1)" />
      </svg>
    );
  },

  // Comunicação
  mail: (size = 24) => {
    const gradId = generateGradientId('mail', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <rect x="2" y="4" width="20" height="16" rx="3" fill={`url(#${gradId})`} />
        <path 
          d="M2 8l10 6 10-6" 
          stroke="rgba(255,255,255,0.8)" 
          strokeWidth="1.5" 
          fill="none"
        />
        <circle cx="18" cy="6" r="2" fill="#FF6B6B" />
      </svg>
    );
  },

  messageChat: (size = 24) => {
    const gradId = generateGradientId('messageChat', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
        <path 
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" 
          fill={`url(#${gradId})`}
        />
        <circle cx="9" cy="12" r="1" fill="rgba(255,255,255,0.8)" />
        <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.8)" />
        <circle cx="15" cy="12" r="1" fill="rgba(255,255,255,0.8)" />
      </svg>
    );
  },

  // Ferramentas
  settings: (size = 24) => {
    const gradId = generateGradientId('settings', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <path 
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" 
          fill="rgba(255,255,255,0.9)"
        />
        <path 
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" 
          fill={`url(#${gradId})`}
        />
      </svg>
    );
  },

  database: (size = 24) => {
    const gradId = generateGradientId('database', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <ellipse cx="12" cy="5" rx="9" ry="3" fill={`url(#${gradId})`} />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
        <ellipse cx="12" cy="12" rx="7" ry="2" fill="rgba(255,255,255,0.1)" />
      </svg>
    );
  },

  // Segurança
  shield: (size = 24) => {
    const gradId = generateGradientId('shield', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <path 
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
          fill={`url(#${gradId})`}
        />
        <path d="M9 12l2 2 4-4" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" />
      </svg>
    );
  },

  key: (size = 24) => {
    const gradId = generateGradientId('key', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="8" cy="8" r="6" fill={`url(#${gradId})`} />
        <path d="M14.31 14.31L21 21M16 16l-2-2" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
        <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.3)" />
      </svg>
    );
  },

  // Financeiro
  dollarSign: (size = 24) => {
    const gradId = generateGradientId('dollarSign', 'grad');
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill={`url(#${gradId})`} />
        <path 
          d="M12 6v12M9.5 9.5c.83-.83 2.17-.83 3 0 .83.83.83 2.17 0 3-.83.83-2.17.83-3 0M9.5 14.5c.83-.83 2.17-.83 3 0 .83.83.83 2.17 0 3-.83.83-2.17.83-3 0" 
          stroke="rgba(255,255,255,0.9)" 
          strokeWidth="1.5" 
          fill="none"
        />
      </svg>
    );
  }
};

// Interface para renderizar ícones modernos
interface ModernIconProps {
  iconId: string;
  size?: number;
  className?: string;
}

export const ModernIconRenderer: React.FC<ModernIconProps> = ({ 
  iconId, 
  size = 24, 
  className = "" 
}) => {
  const IconComponent = ModernIcons[iconId as keyof typeof ModernIcons];
  
  if (IconComponent) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {IconComponent(size)}
      </div>
    );
  }
  
  // Fallback para ícone padrão
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {ModernIcons.folder(size)}
    </div>
  );
};

// Lista de ícones disponíveis com metadados
export const MODERN_ICONS_LIST = [
  { id: 'folder', name: 'Pasta Básica', category: 'folder', color: '#3B82F6' },
  { id: 'folderOpen', name: 'Pasta Aberta', category: 'folder', color: '#10B981' },
  { id: 'folderShield', name: 'Pasta Protegida', category: 'folder', color: '#7C3AED' },
  
  { id: 'briefcase', name: 'Negócios', category: 'business', color: '#DC2626' },
  { id: 'building', name: 'Empresa', category: 'business', color: '#374151' },
  
  { id: 'monitor', name: 'Desktop/Web', category: 'technology', color: '#06B6D4' },
  { id: 'smartphone', name: 'Mobile', category: 'technology', color: '#8B5CF6' },
  { id: 'database', name: 'Banco de Dados', category: 'technology', color: '#F97316' },
  
  { id: 'fileDocument', name: 'Documentos', category: 'files', color: '#F59E0B' },
  { id: 'spreadsheet', name: 'Planilhas', category: 'files', color: '#10B981' },
  
  { id: 'mail', name: 'E-mail', category: 'communication', color: '#EF4444' },
  { id: 'messageChat', name: 'Chat', category: 'communication', color: '#06B6D4' },
  
  { id: 'settings', name: 'Configurações', category: 'tools', color: '#6B7280' },
  { id: 'shield', name: 'Segurança', category: 'tools', color: '#14B8A6' },
  { id: 'key', name: 'Chaves/Acesso', category: 'tools', color: '#FBBF24' },
  
  { id: 'dollarSign', name: 'Financeiro', category: 'finance', color: '#22C55E' },
];

export default ModernIcons; 