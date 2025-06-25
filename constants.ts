import { Folder, ColorOption, NewFolderData, IconOption } from './types';

export const AVAILABLE_COLORS: ColorOption[] = [
  // Azuis - Variações
  { name: 'Azul Claro', value: 'bg-blue-400', textClass: 'text-white' },
  { name: 'Azul', value: 'bg-blue-600', textClass: 'text-white' },
  { name: 'Azul Escuro', value: 'bg-blue-800', textClass: 'text-white' },
  { name: 'Azul Acinzentado', value: 'bg-slate-600', textClass: 'text-white' },
  { name: 'Azul Céu', value: 'bg-sky-500', textClass: 'text-white' },
  
  // Vermelhos - Variações
  { name: 'Vermelho Claro', value: 'bg-red-400', textClass: 'text-white' },
  { name: 'Vermelho', value: 'bg-red-500', textClass: 'text-white' },
  { name: 'Vermelho Escuro', value: 'bg-red-700', textClass: 'text-white' },
  { name: 'Vermelho Rosado', value: 'bg-rose-500', textClass: 'text-white' },
  
  // Verdes - Variações
  { name: 'Verde Claro', value: 'bg-green-400', textClass: 'text-white' },
  { name: 'Verde', value: 'bg-green-600', textClass: 'text-white' },
  { name: 'Verde Escuro', value: 'bg-green-800', textClass: 'text-white' },
  { name: 'Verde Lima', value: 'bg-lime-500', textClass: 'text-black' },
  { name: 'Esmeralda', value: 'bg-emerald-600', textClass: 'text-white' },
  { name: 'Turquesa', value: 'bg-teal-500', textClass: 'text-white' },
  
  // Amarelos e Laranjas
  { name: 'Amarelo Claro', value: 'bg-yellow-300', textClass: 'text-black' },
  { name: 'Amarelo', value: 'bg-yellow-500', textClass: 'text-black' },
  { name: 'Amarelo Ouro', value: 'bg-amber-500', textClass: 'text-black' },
  { name: 'Laranja Claro', value: 'bg-orange-400', textClass: 'text-white' },
  { name: 'Laranja', value: 'bg-orange-500', textClass: 'text-white' },
  { name: 'Laranja Escuro', value: 'bg-orange-700', textClass: 'text-white' },
  
  // Roxos e Rosas
  { name: 'Roxo Claro', value: 'bg-purple-400', textClass: 'text-white' },
  { name: 'Roxo', value: 'bg-purple-600', textClass: 'text-white' },
  { name: 'Roxo Escuro', value: 'bg-purple-800', textClass: 'text-white' },
  { name: 'Violeta', value: 'bg-violet-600', textClass: 'text-white' },
  { name: 'Índigo', value: 'bg-indigo-600', textClass: 'text-white' },
  { name: 'Rosa Claro', value: 'bg-pink-400', textClass: 'text-white' },
  { name: 'Rosa', value: 'bg-pink-500', textClass: 'text-white' },
  { name: 'Rosa Escuro', value: 'bg-pink-700', textClass: 'text-white' },
  { name: 'Magenta', value: 'bg-fuchsia-600', textClass: 'text-white' },
  
  // Ciano e Azuis Especiais
  { name: 'Ciano Claro', value: 'bg-cyan-400', textClass: 'text-white' },
  { name: 'Ciano', value: 'bg-cyan-600', textClass: 'text-white' },
  { name: 'Ciano Escuro', value: 'bg-cyan-800', textClass: 'text-white' },
  
  // Cinzas e Neutros
  { name: 'Cinza Claro', value: 'bg-gray-400', textClass: 'text-white' },
  { name: 'Cinza', value: 'bg-gray-600', textClass: 'text-white' },
  { name: 'Cinza Escuro', value: 'bg-gray-700', textClass: 'text-white' },
  { name: 'Cinza Carvão', value: 'bg-gray-800', textClass: 'text-white' },
  { name: 'Cinza Ardósia', value: 'bg-slate-500', textClass: 'text-white' },
  { name: 'Cinza Zinco', value: 'bg-zinc-600', textClass: 'text-white' },
  { name: 'Cinza Neutro', value: 'bg-neutral-600', textClass: 'text-white' },
  { name: 'Cinza Pedra', value: 'bg-stone-600', textClass: 'text-white' },
  
  // Cores Especiais e Modernas
  { name: 'Bronze', value: 'bg-amber-700', textClass: 'text-white' },
  { name: 'Cobre', value: 'bg-orange-800', textClass: 'text-white' },
  { name: 'Prateado', value: 'bg-gray-500', textClass: 'text-white' },
  { name: 'Dourado', value: 'bg-yellow-600', textClass: 'text-black' },
  { name: 'Marinho', value: 'bg-blue-900', textClass: 'text-white' },
  { name: 'Vinho', value: 'bg-red-900', textClass: 'text-white' },
  { name: 'Petróleo', value: 'bg-teal-800', textClass: 'text-white' },
  { name: 'Mostarda', value: 'bg-yellow-700', textClass: 'text-white' },
  { name: 'Bordô', value: 'bg-rose-800', textClass: 'text-white' },
  { name: 'Lavanda', value: 'bg-purple-300', textClass: 'text-black' },
  { name: 'Menta', value: 'bg-green-300', textClass: 'text-black' },
  { name: 'Pêssego', value: 'bg-orange-300', textClass: 'text-black' },
  { name: 'Coral', value: 'bg-red-400', textClass: 'text-white' },
  { name: 'Aqua', value: 'bg-cyan-300', textClass: 'text-black' },
];

export const INITIAL_FOLDERS_DATA: Folder[] = [];

export const RESPONSIBLES_DATA: string[] = [
  'Todos'
];

export const AVAILABLE_TAGS_DATA: string[] = [];

// Funções para obter dados combinados (padrão + personalizados)
export const getAllResponsibles = (): string[] => {
  const customResponsibles = JSON.parse(localStorage.getItem('custom-responsibles') || '[]');
  const editedDefaults = JSON.parse(localStorage.getItem('edited-default-responsibles') || '{}');
  
  // Aplicar edições aos dados padrão
  const modifiedDefaults = RESPONSIBLES_DATA.map(item => editedDefaults[item] || item);
  
  return [...modifiedDefaults, ...customResponsibles];
};

export const getAllTags = (): string[] => {
  const customTags = JSON.parse(localStorage.getItem('custom-tags') || '[]');
  const editedDefaults = JSON.parse(localStorage.getItem('edited-default-tags') || '{}');
  
  // Aplicar edições aos dados padrão
  const modifiedDefaults = AVAILABLE_TAGS_DATA.map(item => editedDefaults[item] || item);
  
  return [...modifiedDefaults, ...customTags];
};

export const DEFAULT_NEW_FOLDER_DATA: NewFolderData = {
  name: '',
  responsible: 'Todos',
  path: '',
  color: 'bg-blue-600',
  textColor: 'text-white',
  icon: 'folder',
  iconType: 'modern',
  tags: [],
  description: '',
  link: '',
};

// Ícones disponíveis organizados por categoria
export const AVAILABLE_ICONS: IconOption[] = [
  // Pasta básica
  { id: 'folder', name: 'Pasta Padrão', category: 'folder', type: 'preset' },
  { id: 'folder-open', name: 'Pasta Aberta', category: 'folder', type: 'preset' },
  { id: 'folder-plus', name: 'Nova Pasta', category: 'folder', type: 'preset' },
  { id: 'folder-check', name: 'Pasta Concluída', category: 'folder', type: 'preset' },
  { id: 'folder-x', name: 'Pasta Bloqueada', category: 'folder', type: 'preset' },
  { id: 'folder-lock', name: 'Pasta Protegida', category: 'folder', type: 'preset' },

  // Negócios e administração
  { id: 'briefcase', name: 'Negócios', category: 'business', type: 'preset' },
  { id: 'building', name: 'Empresa', category: 'business', type: 'preset' },
  { id: 'users', name: 'Equipe', category: 'business', type: 'preset' },
  { id: 'user-tie', name: 'Executivo', category: 'business', type: 'preset' },
  { id: 'handshake', name: 'Contratos', category: 'business', type: 'preset' },
  { id: 'chart-bar', name: 'Relatórios', category: 'business', type: 'preset' },
  { id: 'trending-up', name: 'Crescimento', category: 'business', type: 'preset' },
  { id: 'dollar-sign', name: 'Financeiro', category: 'business', type: 'preset' },
  { id: 'piggy-bank', name: 'Orçamento', category: 'business', type: 'preset' },

  // Desenvolvimento e tecnologia
  { id: 'code', name: 'Código', category: 'development', type: 'preset' },
  { id: 'git-branch', name: 'Git', category: 'development', type: 'preset' },
  { id: 'database', name: 'Banco de Dados', category: 'development', type: 'preset' },
  { id: 'server', name: 'Servidor', category: 'development', type: 'preset' },
  { id: 'globe', name: 'Web', category: 'development', type: 'preset' },
  { id: 'smartphone', name: 'Mobile', category: 'development', type: 'preset' },
  { id: 'monitor', name: 'Desktop', category: 'development', type: 'preset' },
  { id: 'cpu', name: 'Sistema', category: 'development', type: 'preset' },

  // Arquivos e documentos
  { id: 'file-text', name: 'Documentos', category: 'files', type: 'preset' },
  { id: 'file-spreadsheet', name: 'Planilhas', category: 'files', type: 'preset' },
  { id: 'presentation', name: 'Apresentações', category: 'files', type: 'preset' },
  { id: 'file-image', name: 'Imagens', category: 'files', type: 'preset' },
  { id: 'file-video', name: 'Vídeos', category: 'files', type: 'preset' },
  { id: 'file-audio', name: 'Áudios', category: 'files', type: 'preset' },
  { id: 'archive', name: 'Arquivo', category: 'files', type: 'preset' },
  { id: 'download', name: 'Downloads', category: 'files', type: 'preset' },

  // Ferramentas e utilitários
  { id: 'settings', name: 'Configurações', category: 'tools', type: 'preset' },
  { id: 'tool', name: 'Ferramentas', category: 'tools', type: 'preset' },
  { id: 'wrench', name: 'Manutenção', category: 'tools', type: 'preset' },
  { id: 'cog', name: 'Engrenagem', category: 'tools', type: 'preset' },
  { id: 'shield', name: 'Segurança', category: 'tools', type: 'preset' },
  { id: 'key', name: 'Chaves', category: 'tools', type: 'preset' },
  { id: 'search', name: 'Pesquisa', category: 'tools', type: 'preset' },
  { id: 'filter', name: 'Filtros', category: 'tools', type: 'preset' },

  // Comunicação e colaboração
  { id: 'mail', name: 'E-mail', category: 'communication', type: 'preset' },
  { id: 'message-circle', name: 'Chat', category: 'communication', type: 'preset' },
  { id: 'phone', name: 'Telefone', category: 'communication', type: 'preset' },
  { id: 'video', name: 'Videoconferência', category: 'communication', type: 'preset' },
  { id: 'share', name: 'Compartilhar', category: 'communication', type: 'preset' },
  { id: 'bell', name: 'Notificações', category: 'communication', type: 'preset' },
  { id: 'calendar', name: 'Agenda', category: 'communication', type: 'preset' },
  { id: 'clock', name: 'Horários', category: 'communication', type: 'preset' },
];

// Categorias de ícones para organização na interface
export const ICON_CATEGORIES = [
  { id: 'folder', name: 'Pastas', description: 'Ícones básicos de pastas' },
  { id: 'business', name: 'Negócios', description: 'Ícones corporativos e administrativos' },
  { id: 'development', name: 'Desenvolvimento', description: 'Ícones de tecnologia e programação' },
  { id: 'technology', name: 'Tecnologia', description: 'Ícones de dispositivos e sistemas' },
  { id: 'files', name: 'Arquivos', description: 'Ícones de tipos de documentos' },
  { id: 'tools', name: 'Ferramentas', description: 'Ícones de utilitários e configurações' },
  { id: 'communication', name: 'Comunicação', description: 'Ícones de colaboração e contato' },
  { id: 'finance', name: 'Financeiro', description: 'Ícones relacionados a finanças' },
] as const;
