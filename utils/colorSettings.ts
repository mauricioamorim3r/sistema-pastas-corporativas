// Configurações de cores para padronização de pastas
export interface ColorSettings {
  mainFolderColor: string;
  subFolderColor: string;
  textColor: string;
}

// Configurações padrão
export const DEFAULT_COLOR_SETTINGS: ColorSettings = {
  mainFolderColor: 'bg-blue-600',
  subFolderColor: 'bg-blue-400',
  textColor: 'text-white'
};

// Função para obter as configurações de cores do localStorage
export const getColorSettings = (): ColorSettings => {
  try {
    const saved = localStorage.getItem('color-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validar se todas as propriedades existem
      if (parsed.mainFolderColor && parsed.subFolderColor && parsed.textColor) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar configurações de cores, usando padrão:', error);
  }
  
  return DEFAULT_COLOR_SETTINGS;
};

// Função para salvar as configurações de cores
export const saveColorSettings = (settings: ColorSettings): void => {
  try {
    localStorage.setItem('color-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Erro ao salvar configurações de cores:', error);
  }
};

// Função para resetar para cores padrão
export const resetColorSettings = (): ColorSettings => {
  saveColorSettings(DEFAULT_COLOR_SETTINGS);
  return DEFAULT_COLOR_SETTINGS;
};

// Função para validar se uma configuração de cor é válida
export const isValidColorClass = (colorClass: string): boolean => {
  // Lista das classes de cores válidas do Tailwind
  const validColors = [
    'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800',
    'bg-indigo-400', 'bg-indigo-600',
    'bg-purple-400', 'bg-purple-600',
    'bg-green-400', 'bg-green-600',
    'bg-teal-400', 'bg-teal-600',
    'bg-cyan-400', 'bg-cyan-600',
    'bg-gray-400', 'bg-gray-600',
    'bg-slate-400', 'bg-slate-600',
    'bg-zinc-400', 'bg-zinc-600',
    'bg-neutral-400', 'bg-neutral-600',
    'bg-stone-400', 'bg-stone-600',
    'text-white', 'text-black', 'text-gray-100', 'text-gray-200', 'text-gray-800', 'text-gray-900'
  ];
  
  return validColors.includes(colorClass);
}; 