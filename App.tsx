import React, { useState, useEffect, useCallback } from 'react';
import {
  Folder as FolderIcon,
  ChevronDown, ChevronRight, Palette, FolderPlus, ExternalLink, Trash2,
  Search, Grid, Settings, User, Hash, AlertCircle,
  Bell, Calendar, Clock, ChevronUp, List, SplitSquareHorizontal,
  Upload, Layout, History, Undo2, Redo2, Star, Edit3, Check, X
} from 'lucide-react';

import { Folder, NewFolderData, CompleteSavedLayout } from './types';
import {
  INITIAL_FOLDERS_DATA,
  RESPONSIBLES_DATA,
  AVAILABLE_COLORS,
  DEFAULT_NEW_FOLDER_DATA,
  getAllResponsibles
} from './constants';

import Modal from './components/Modal';
import Toast from './components/Toast';

import ColorPickerModalContent from './components/modals/ColorPickerModalContent';
import CreateFolderModalContent from './components/modals/CreateFolderModalContent';
import ExportModalContent from './components/modals/ExportModalContent';
import { ImportModalContent } from './components/modals/ImportModalContent';
import { ResizablePanels, ResizablePanelsRef } from './components/ResizablePanels';
import { PanelSizePresets } from './components/PanelSizePresets';
import { ResponsiveWrapper } from './components/ResponsiveWrapper';
import { LayoutManager } from './components/LayoutManager';
import { FavoritesPanel, useFavorites } from './components/FavoritesPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useHistoryManager } from './hooks/useHistoryManager';
import { EditableHeader } from './components/EditableHeader';
import { FolderMetricsDashboard } from './components/modals/FolderMetricsDashboard';
import { EditFolderModalContent } from './components/modals/EditFolderModalContent';
import { AddLinkModalContent } from './components/modals/AddLinkModalContent';
import MonitoringPanel from './components/MonitoringPanel';
import { SettingsModalContent } from './components/modals/SettingsModalContent';
import { IconRenderer } from './utils/iconUtils';

// Helper function to recursively update folder properties
const updateFolderRecursively = (
  foldersToUpdate: Folder[],
  folderId: string | number,
  updateFn: (folder: Folder) => Folder
): Folder[] => {
  return foldersToUpdate.map(folder => {
    if (folder.id === folderId) {
      return updateFn(folder);
    }
    if (folder.subFolders) {
      return { ...folder, subFolders: updateFolderRecursively(folder.subFolders, folderId, updateFn) };
    }
    return folder;
  });
};

const addSubFolderRecursively = (
  foldersToUpdate: Folder[],
  parentId: string | number,
  newFolder: Folder
): Folder[] => {
   return foldersToUpdate.map(folder => {
    if (folder.id === parentId) {
      return {
        ...folder,
        isOpen: true,
        subFolders: [...(folder.subFolders || []), newFolder]
      };
    }
    if (folder.subFolders) {
      return { ...folder, subFolders: addSubFolderRecursively(folder.subFolders, parentId, newFolder) };
    }
    return folder;
  });
};

const removeFolderRecursively = (
  foldersToUpdate: Folder[],
  folderId: string | number
): Folder[] => {
  return foldersToUpdate.filter(folder => {
    if (folder.id === folderId) {
      return false;
    }
    if (folder.subFolders) {
      folder.subFolders = removeFolderRecursively(folder.subFolders, folderId);
    }
    return true;
  });
};

const toggleAllFoldersRecursively = (foldersToUpdate: Folder[], expand: boolean): Folder[] => {
  return foldersToUpdate.map(folder => ({
    ...folder,
    isOpen: folder.subFolders && folder.subFolders.length > 0 ? expand : undefined,
    subFolders: folder.subFolders ? toggleAllFoldersRecursively(folder.subFolders, expand) : undefined,
  }));
};


const App: React.FC = () => {
  // Hook para gerenciar histórico de ações
  const {
    folders,
    canUndo,
    canRedo,
    history,
    undo,
    redo,
    clearHistory,
    createFolder: createFolderWithHistory,
    updateFolder: updateFolderWithHistory,
    deleteFolder: deleteFolderWithHistory,
    importFolders: importFoldersWithHistory
  } = useHistoryManager(INITIAL_FOLDERS_DATA);

  // Hook para favoritos (será usado nas novas funcionalidades)
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState<boolean>(false);
  const [showPanelPresets, setShowPanelPresets] = useState<boolean>(false);
  const [currentPanelWidth, setCurrentPanelWidth] = useState<number>(35);
  
  const resizablePanelsRef = React.useRef<ResizablePanelsRef>(null);
  const navigatorTitleInputRef = React.useRef<HTMLInputElement>(null);

  // Novos estados para as funcionalidades
  const [showLayoutManager, setShowLayoutManager] = useState<boolean>(false);
  const [showFavoritesPanel, setShowFavoritesPanel] = useState<boolean>(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showMonitoringPanel, setShowMonitoringPanel] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Estados para título e logo personalizáveis
  const [appTitle, setAppTitle] = useState<string>(() => {
    return localStorage.getItem('appTitle') || 'Pastas Corporativas';
  });
  
  const [appLogo, setAppLogo] = useState<string | null>(() => {
    return localStorage.getItem('appLogo') || null;
  });

  // Estados para o título do navegador de pastas
  const [folderNavigatorTitle, setFolderNavigatorTitle] = useState<string>(() => {
    return localStorage.getItem('folderNavigatorTitle') || 'Navegador de Pastas';
  });
  const [isEditingNavigatorTitle, setIsEditingNavigatorTitle] = useState<boolean>(false);
  const [tempNavigatorTitle, setTempNavigatorTitle] = useState<string>(folderNavigatorTitle);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState<string>(RESPONSIBLES_DATA[0]);

  // Estados para dados dinâmicos
  const [allResponsibles, setAllResponsibles] = useState<string[]>(getAllResponsibles());

  // const [sortOrder, setSortOrder] = useState<string>('Nome (A-Z)'); // Sort not implemented yet

  // Modal states
  const [showColorPickerModal, setShowColorPickerModal] = useState<boolean>(false);
  const [folderForColorChange, setFolderForColorChange] = useState<Folder | null>(null);
  
  // Novos modals para link e edição
  const [showAddLinkModal, setShowAddLinkModal] = useState<boolean>(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState<boolean>(false);
  const [folderForLinkEdit, setFolderForLinkEdit] = useState<Folder | null>(null);
  const [folderForEdit, setFolderForEdit] = useState<Folder | null>(null);

  const [showCreateFolderModal, setShowCreateFolderModal] = useState<boolean>(false);
  const [newFolderParent, setNewFolderParent] = useState<Folder | null>(null);
  const [newFolderData, setNewFolderData] = useState<NewFolderData>(DEFAULT_NEW_FOLDER_DATA);

  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportJsonString, setExportJsonString] = useState<string>('');

  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToastInfo({ message, type, isVisible: true });
  }, []);

  // Funções para gerenciar título e logo
  const handleTitleChange = useCallback((newTitle: string) => {
    setAppTitle(newTitle);
    localStorage.setItem('appTitle', newTitle);
    showToast('Título atualizado com sucesso!', 'success');
  }, [showToast]);

  const handleLogoChange = useCallback((logoUrl: string | null) => {
    setAppLogo(logoUrl);
    if (logoUrl) {
      localStorage.setItem('appLogo', logoUrl);
      showToast('Logo adicionado com sucesso!', 'success');
    } else {
      localStorage.removeItem('appLogo');
      showToast('Logo removido com sucesso!', 'success');
    }
  }, [showToast]);

  // Funções para gerenciar título do navegador de pastas
  const handleNavigatorTitleSave = useCallback(() => {
    const finalTitle = tempNavigatorTitle.trim() || 'Navegador de Pastas';
    setFolderNavigatorTitle(finalTitle);
    localStorage.setItem('folderNavigatorTitle', finalTitle);
    setIsEditingNavigatorTitle(false);
    showToast('Título do navegador atualizado!', 'success');
  }, [tempNavigatorTitle, showToast]);

  const handleNavigatorTitleCancel = useCallback(() => {
    setTempNavigatorTitle(folderNavigatorTitle);
    setIsEditingNavigatorTitle(false);
  }, [folderNavigatorTitle]);

  const handleNavigatorTitleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigatorTitleSave();
    } else if (e.key === 'Escape') {
      handleNavigatorTitleCancel();
    }
  }, [handleNavigatorTitleSave, handleNavigatorTitleCancel]);

  // Função para atualizar dados dinâmicos
  const refreshDynamicData = useCallback(() => {
    setAllResponsibles(getAllResponsibles());
  }, []); 

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isEditingNavigatorTitle && navigatorTitleInputRef.current) {
      navigatorTitleInputRef.current.focus();
      navigatorTitleInputRef.current.select();
    }
  }, [isEditingNavigatorTitle]);

  useEffect(() => {
    setTempNavigatorTitle(folderNavigatorTitle);
  }, [folderNavigatorTitle]);

  useEffect(() => {
    // Select the first root folder by default if no folder is selected
    if (folders.length > 0 && !selectedFolder) {
        setSelectedFolder(folders[0]);
    }
  }, [folders, selectedFolder]); // Corrected dependencies

  // Fechar dropdown de presets quando clicar fora
  useEffect(() => {
    const handleClickOutside = (_: MouseEvent) => {
      if (showPanelPresets) {
        setShowPanelPresets(false);
      }
    };

    if (showPanelPresets) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPanelPresets]);


  // Função auxiliar para encontrar pasta recursivamente
  const findFolderRecursively = (folderList: Folder[], folderId: string | number): Folder | null => {
    for (const folder of folderList) {
      if (folder.id === folderId) return folder;
      if (folder.subFolders) {
        const found = findFolderRecursively(folder.subFolders, folderId);
        if (found) return found;
      }
    }
    return null;
  };

  // Estado simples para controlar expansão/recolhimento
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string | number>>(new Set(['prod']));

  // Função simples para toggle
  const handleToggleFolder = (folderId: string | number) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleSelectFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    if (!isDetailsPanelOpen && window.innerWidth < 768) { 
        setIsDetailsPanelOpen(true);
    }
  };

  const handleOpenFolderSystem = (folder: Folder) => {
    if (folder.link) {
      // Se tem link, tentar abrir
      try {
        // Verificar se é URL ou caminho
        if (folder.link.startsWith('http://') || folder.link.startsWith('https://')) {
          window.open(folder.link, '_blank');
          showToast(`Abrindo link: ${folder.link}`, 'info');
        } else {
          // É um caminho do sistema - tentar abrir usando protocolo file://
          const encodedPath = encodeURI(folder.link.replace(/\\/g, '/'));
          window.open(`file:///${encodedPath}`, '_blank');
          showToast(`Abrindo caminho: ${folder.link}`, 'info');
        }
      } catch (error) {
        showToast('Erro ao abrir o link/caminho', 'error');
      }
    } else {
      // Se não tem link, abrir modal para cadastrar
      setFolderForLinkEdit(folder);
      setShowAddLinkModal(true);
    }
  };

  const handleShowColorPicker = (folder: Folder) => {
    setFolderForColorChange(folder);
    setShowColorPickerModal(true);
  };

  const inferTextColor = (backgroundColor: string): string => {
    const color = AVAILABLE_COLORS.find(c => c.value === backgroundColor);
    if (color && color.textClass) {
        return color.textClass;
    }
    const darkColorKeywords = ['gray-700', 'gray-800', 'blue-600', 'blue-700', 'blue-800', 'red-500', 'red-600', 'green-600', 'green-700','purple-600', 'purple-700', 'indigo-600', 'indigo-700', 'pink-500', 'pink-600', 'teal-500', 'teal-600', 'emerald-600', 'emerald-700', 'orange-500', 'orange-600', 'cyan-600', 'cyan-700'];
    if (darkColorKeywords.some(keyword => backgroundColor.includes(keyword))) {
        return 'text-white';
    }
    if (backgroundColor.includes('yellow-')) return 'text-black';
    if (backgroundColor.includes('white')) return 'text-gray-800'; 
    return 'text-black'; 
  };

  const handleChangeFolderColor = (colorValue: string, textColorValue?: string) => {
    if (!folderForColorChange) return;
    const determinedTextColor = textColorValue || inferTextColor(colorValue);
    const updatedFolder = { ...folderForColorChange, color: colorValue, textColor: determinedTextColor };
    updateFolderWithHistory(updatedFolder);
    
    if (selectedFolder && selectedFolder.id === folderForColorChange.id) {
        setSelectedFolder(updatedFolder);
    }
    setShowColorPickerModal(false);
    setFolderForColorChange(null);
    showToast('Cor da pasta alterada com sucesso!');
  };

  const handlePrepareAddFolder = (parentFolder: Folder | null = null) => {
    setNewFolderParent(parentFolder);
    setNewFolderData({
      ...DEFAULT_NEW_FOLDER_DATA,
      path: parentFolder ? `${parentFolder.path || `PRODUÇÃO/${parentFolder.name}`}\\Nova Pasta` : 'C:\\Nova Pasta Raiz',
      responsible: parentFolder?.responsible || DEFAULT_NEW_FOLDER_DATA.responsible,
    });
    setShowCreateFolderModal(true);
  };

  const handleAddNewFolder = () => {
    if (!newFolderData.name.trim()) {
      showToast('O nome da pasta não pode estar vazio.', 'error');
      return;
    }
    const newFolderEntry: Folder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newFolderData.name,
      color: newFolderData.color,
      textColor: newFolderData.textColor || 'text-white',
      path: newFolderData.path,
      responsible: newFolderData.responsible,
      tags: newFolderData.tags,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      subFolders: [],
      isOpen: false,
    };

    // Usar a função do histórico para criar pasta
    createFolderWithHistory(newFolderEntry, newFolderParent?.id);

    setShowCreateFolderModal(false);
    setNewFolderData(DEFAULT_NEW_FOLDER_DATA);
    setNewFolderParent(null);
    showToast('Pasta criada com sucesso!');
  };

  const handleRemoveFolder = (folderId: string | number) => {
    deleteFolderWithHistory(folderId);
    if (selectedFolder && selectedFolder.id === folderId) {
      setSelectedFolder(null);
      // If the removed folder was selected, try to select the first root folder
      if (folders.length > 0) {
        setSelectedFolder(folders[0]);
      }
    }
    showToast('Pasta removida com sucesso!');
  };

  const handleExpandAll = () => {
    // Coletar todos os IDs de pastas que têm subFolders
    const getAllFolderIds = (folderList: Folder[]): (string | number)[] => {
      let ids: (string | number)[] = [];
      folderList.forEach(folder => {
        if (folder.subFolders && folder.subFolders.length > 0) {
          ids.push(folder.id);
          ids = ids.concat(getAllFolderIds(folder.subFolders));
        }
      });
      return ids;
    };
    
    const allIds = getAllFolderIds(folders);
    setExpandedFolders(new Set(allIds));
    showToast('Pastas expandidas.');
  };

  const handleCollapseAll = () => {
    // Manter apenas a pasta raiz PRODUÇÃO expandida
    setExpandedFolders(new Set(['prod']));
    showToast('Pastas recolhidas.');
  };

  const handleGenerateExportJson = useCallback(() => {
    const cleanFoldersForExport = (folderList: Folder[]): any[] => {
      return folderList.map(({ isOpen, ...folder }) => ({
        ...folder,
        textColor: undefined, 
        subFolders: folder.subFolders ? cleanFoldersForExport(folder.subFolders) : undefined,
      }));
    };
    const cleanedData = cleanFoldersForExport(folders);
    setExportJsonString(JSON.stringify(cleanedData, null, 2));
    showToast('Estrutura JSON gerada/atualizada.', 'info');
  }, [folders, showToast, setExportJsonString]);

  const handleCopyToClipboard = async () => {
    if (!exportJsonString) {
      showToast('Nenhum dado JSON para copiar. Gere o JSON primeiro.', 'warning');
      return;
    }
    try {
      await navigator.clipboard.writeText(exportJsonString);
      showToast('JSON copiado!', 'success');
    } catch (err) {
      showToast('Falha ao copiar JSON.', 'error');
    }
  };

  const handleDownloadJsonFile = () => {
    if (!exportJsonString) {
      showToast('Nenhum dado JSON para baixar. Gere o JSON primeiro.', 'warning');
      return;
    }
    const blob = new Blob([exportJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estrutura_pastas.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download JSON iniciado.', 'success');
  };

  // Novos handlers para as funcionalidades implementadas
  const handleImportFolders = (importedFolders: Folder[]) => {
    importFoldersWithHistory(importedFolders);
    showToast(`${importedFolders.length} pasta(s) importada(s) com sucesso!`);
  };

  const handleApplyLayout = (layout: CompleteSavedLayout) => {
    // Aplicar configurações de UI
    setCurrentPanelWidth(layout.leftWidth);
    setIsDarkMode(layout.isDarkMode);
    setIsDetailsPanelOpen(layout.isDetailsPanelOpen);
    
    if (resizablePanelsRef.current) {
      resizablePanelsRef.current.setLeftWidth(layout.leftWidth);
    }
    
    // Aplicar estado completo das pastas
    importFoldersWithHistory(layout.folders);
    
    // Aplicar pastas expandidas
    setExpandedFolders(new Set(layout.expandedFolders));
    
    // Aplicar pasta selecionada (se existir no novo conjunto)
    if (layout.selectedFolder) {
      const foundFolder = findFolderRecursively(layout.folders, layout.selectedFolder.id);
      if (foundFolder) {
        setSelectedFolder(foundFolder);
      }
    }
    
    // Aplicar filtros
    if (layout.searchQuery !== undefined) {
      setSearchQuery(layout.searchQuery);
    }
    if (layout.selectedResponsible !== undefined) {
      setSelectedResponsible(layout.selectedResponsible);
    }
    
    // Aplicar estado dos painéis auxiliares
    if (layout.showFavoritesPanel !== undefined) {
      setShowFavoritesPanel(layout.showFavoritesPanel);
    }
    if (layout.showHistoryPanel !== undefined) {
      setShowHistoryPanel(layout.showHistoryPanel);
    }
    if (layout.showMonitoringPanel !== undefined) {
      setShowMonitoringPanel(layout.showMonitoringPanel);
    }
    
    showToast(`Template "${layout.name}" aplicado! ${layout.stats?.totalFolders || 0} pastas carregadas.`);
    setShowLayoutManager(false);
  };

  // Novos handlers para link e edição
  const handleSaveLink = (link: string) => {
    if (folderForLinkEdit) {
      const updatedFolder = { ...folderForLinkEdit, link, updatedAt: new Date().toLocaleDateString('pt-BR') };
      updateFolderWithHistory(updatedFolder);
      
      // Atualizar pasta selecionada se for a mesma
      if (selectedFolder && selectedFolder.id === folderForLinkEdit.id) {
        setSelectedFolder(updatedFolder);
      }
      
      setShowAddLinkModal(false);
      setFolderForLinkEdit(null);
      showToast(folderForLinkEdit.link ? 'Link atualizado com sucesso!' : 'Link adicionado com sucesso!');
    }
  };

  const handleEditFolder = (folder: Folder) => {
    setFolderForEdit(folder);
    setShowEditFolderModal(true);
  };

  const handleSaveEditedFolder = (updatedFolder: Folder) => {
    updateFolderWithHistory(updatedFolder);
    
    // Atualizar pasta selecionada se for a mesma
    if (selectedFolder && selectedFolder.id === updatedFolder.id) {
      setSelectedFolder(updatedFolder);
    }
    
    setShowEditFolderModal(false);
    setFolderForEdit(null);
    showToast('Pasta atualizada com sucesso!');
  };

  // Função para obter pastas favoritas no formato correto para monitoramento
  const getFavoriteFolders = () => {
    const saved = localStorage.getItem('favorite-folders');
    if (saved) {
      try {
        const favoriteData = JSON.parse(saved);
        return favoriteData.map((fav: any) => ({
          id: fav.originalFolderId,
          name: fav.name,
          path: fav.path || 'Caminho não definido',
          responsible: fav.responsible,
          color: fav.color,
          textColor: fav.textColor
        }));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        return [];
      }
    }
    return [];
  };

  // Handlers para atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
          showToast('Ação desfeita');
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) {
          redo();
          showToast('Ação refeita');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canUndo, canRedo, undo, redo, showToast]);

  // Implementação de filtros recursivos por busca, responsável e tags
  const filterFoldersRecursively = useCallback((folderList: Folder[], query: string, responsible: string): Folder[] => {
    const filterFolder = (folder: Folder): Folder | null => {
      // Verificar se a pasta atual corresponde aos filtros
      const matchesSearch = query === '' || 
        folder.name.toLowerCase().includes(query.toLowerCase()) ||
        (folder.path && folder.path.toLowerCase().includes(query.toLowerCase())) ||
        (folder.description && folder.description.toLowerCase().includes(query.toLowerCase()));
      
      const matchesResponsible = responsible === 'Todos' || 
        responsible === '' || 
        folder.responsible === responsible;

      // Filtrar subpastas recursivamente
      const filteredSubFolders = folder.subFolders ? 
        folder.subFolders.map(filterFolder).filter(Boolean) as Folder[] : 
        undefined;

      // Manter pasta se ela corresponde aos filtros OU se tem subpastas que correspondem
      const hasMatchingSubFolders = filteredSubFolders && filteredSubFolders.length > 0;
      const currentMatches = matchesSearch && matchesResponsible;

      if (currentMatches || hasMatchingSubFolders) {
        return {
          ...folder,
          subFolders: filteredSubFolders,
          // Abrir automaticamente pastas que têm correspondências nas subpastas
          isOpen: hasMatchingSubFolders ? true : folder.isOpen
        };
      }

      return null;
    };

    return folderList.map(filterFolder).filter(Boolean) as Folder[];
  }, []);

      const filteredFolders = filterFoldersRecursively(folders, searchQuery, selectedResponsible);

  const countTotalSubfolders = (folderList: Folder[]): number => {
    let count = 0;
    for (const folder of folderList) {
        if (folder.subFolders) {
            count += folder.subFolders.length;
            count += countTotalSubfolders(folder.subFolders);
        }
    }
    return count;
  };
      const totalRootFolders = folders.length;
    const totalSubfolders = countTotalSubfolders(folders);

  const renderFolderItem = (folder: Folder, level = 0): React.ReactNode => {
    const hasSubfolders = folder.subFolders && folder.subFolders.length > 0;
    const basePadding = 12;
    const indentSize = 20;
    const paddingLeft = basePadding + (level * indentSize);

    // Hierarquia visual por largura - 3 níveis
    const getHierarchyWidth = (level: number) => {
      switch (level) {
        case 0: return 'w-full';           // Pasta raiz - largura total
        case 1: return 'w-[95%] ml-[2.5%]'; // Subpasta - 95% da largura
        case 2: return 'w-[90%] ml-[5%]';   // Sub-subpasta - 90% da largura
        default: return 'w-[85%] ml-[7.5%]'; // Níveis mais profundos - 85%
      }
    };

    const isSelected = selectedFolder?.id === folder.id;

    const isExpanded = expandedFolders.has(folder.id);
    
    return (
      <div key={folder.id} className="mb-1.5 last:mb-0">
        <div
          className={`group flex items-center p-2.5 ${folder.color} ${folder.textColor || 'text-white'} rounded-lg
                     shadow-sm hover:shadow-md animate-folder-hover cursor-pointer animate-folder-entry
                     ${getHierarchyWidth(level)}
                     ${isSelected ? 'ring-2 ring-offset-1 ring-offset-gray-100 dark:ring-offset-gray-800 ring-blue-500' : ''}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => handleSelectFolder(folder)}
          role="treeitem"
          aria-expanded={hasSubfolders ? folder.isOpen : undefined}
          aria-selected={isSelected}
          aria-level={level + 1}
          aria-label={folder.name}
        >
          {hasSubfolders ? (
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                handleToggleFolder(folder.id); 
              }}
              className="p-1 mr-2 rounded-full transition-all duration-200 hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50"
              aria-label={isExpanded ? `Recolher ${folder.name}` : `Expandir ${folder.name}`}
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          ) : (
             <span className="mr-2 w-[28px] inline-block"></span>
          )}
          <IconRenderer 
            iconId={folder.icon || 'folder'}
            iconType={folder.iconType || 'preset'}
            size={24} 
            className="mr-2.5 flex-shrink-0" 
          />
          <div className="flex-1 truncate">
            <div className="text-sm font-medium" title={folder.name}>{folder.name}</div>
            {folder.responsible && <div className="text-xs opacity-80 flex items-center mt-0.5"><User size={14} className="mr-1" />{folder.responsible}</div>}
          </div>
          <div className="flex items-center space-x-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <button 
              title={isFavorite(folder.id) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"} 
              onClick={(e) => {e.stopPropagation(); toggleFavorite(folder)}} 
              className={`p-1.5 rounded-full focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50 animate-button-pop ${
                isFavorite(folder.id) 
                  ? 'bg-white bg-opacity-90 hover:bg-opacity-100 text-black' 
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-black hover:text-black'
              }`}
            >
              <Star size={18} fill={isFavorite(folder.id) ? 'currentColor' : 'none'} />
            </button>
            <button 
              title="Mudar Cor" 
              onClick={(e) => {e.stopPropagation(); handleShowColorPicker(folder)}} 
              className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50 animate-button-pop text-gray-600 hover:text-black"
            >
              <Palette size={18} />
            </button>
            <button 
              title="Adicionar Subpasta" 
              onClick={(e) => { e.stopPropagation(); handlePrepareAddFolder(folder); }} 
              className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50 animate-button-pop text-gray-600 hover:text-black"
            >
              <FolderPlus size={18} />
            </button>
            <button 
              title={folder.link ? "Abrir" : "Cadastrar Link"} 
              onClick={(e) => { e.stopPropagation(); handleOpenFolderSystem(folder); }} 
              className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50 animate-button-pop text-gray-600 hover:text-black"
            >
              <ExternalLink size={18} />
            </button>
            <button 
              title="Remover" 
              onClick={(e) => { e.stopPropagation(); handleRemoveFolder(folder.id); }} 
              className="p-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50 animate-button-pop text-gray-600 hover:text-black"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
         {hasSubfolders && isExpanded && (
          <div 
            className="mt-1.5 transition-all duration-300 ease-in-out" 
            role="group"
          >
            {folder.subFolders?.map(sub => renderFolderItem(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderDetailsPanelContent = (currentFolder: Folder | null): React.ReactNode => {
    if (!currentFolder) {
      return (
        <div className="flex flex-col justify-center items-center p-4 h-full text-gray-500 dark:text-gray-400">
          <FolderIcon size={48} className="mb-3 text-blue-400 dark:text-blue-500" />
          <p className="text-lg font-medium">Selecione uma pasta</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Clique em uma pasta para visualizar seus detalhes.</p>
        </div>
      );
    }

    const detailItemClass = "bg-gray-100 dark:bg-gray-700 p-3 rounded-lg";
    const labelClass = "text-gray-500 dark:text-gray-400 text-xs mb-1";
    const valueClass = "font-medium text-gray-800 dark:text-gray-100 flex items-center text-sm";

    return (
      <div className="flex overflow-y-auto flex-col p-4 h-full">
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 rounded-lg ${currentFolder.color} ${currentFolder.textColor || 'text-white'} flex items-center justify-center mr-4 shadow-md`}>
              <IconRenderer 
                iconId={currentFolder.icon || 'folder'}
                iconType={currentFolder.iconType || 'preset'}
                size={32}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 break-all dark:text-gray-100">{currentFolder.name}</h2>
              {currentFolder.path && <p className="text-sm text-gray-500 break-all dark:text-gray-400">{currentFolder.path}</p>}
            </div>
          </div>

        <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2">
          <div className={detailItemClass}>
            <div className={labelClass}>Responsável</div>
            <div className={valueClass}>
              <User size={18} className="mr-2 text-blue-500 dark:text-blue-400" />
              {currentFolder.responsible || 'Não definido'}
            </div>
          </div>
          <div className={detailItemClass}>
            <div className={labelClass}>Criado em</div>
            <div className={valueClass}>
              <Calendar size={18} className="mr-2 text-green-500 dark:text-green-400" />
              {currentFolder.createdAt || '—'}
            </div>
          </div>
          {currentFolder.updatedAt && (
            <div className={detailItemClass}>
              <div className={labelClass}>Atualizado em</div>
              <div className={valueClass}>
                <Clock size={18} className="mr-2 text-orange-500 dark:text-orange-400" />
                {currentFolder.updatedAt}
              </div>
            </div>
          )}
          <div className={detailItemClass}>
            <div className={labelClass}>Subpastas</div>
            <div className={valueClass}>
              <FolderIcon size={18} className="mr-2 text-purple-500 dark:text-purple-400" />
              {currentFolder.subFolders ? currentFolder.subFolders.length : (currentFolder.subCount || 0)}
            </div>
          </div>
        </div>

        {currentFolder.description && (
          <div className="mb-5">
            <h3 className={`${labelClass} font-medium mb-1.5 text-gray-700 dark:text-gray-300`}>Descrição</h3>
            <p className="p-3 text-sm text-gray-700 bg-gray-100 rounded-lg dark:text-gray-200 dark:bg-gray-700">{currentFolder.description}</p>
          </div>
        )}

        {currentFolder.tags && currentFolder.tags.length > 0 && (
          <div className="mb-5">
            <h3 className={`${labelClass} font-medium mb-1.5 text-gray-700 dark:text-gray-300`}>Tags</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentFolder.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 px-2.5 py-1 rounded-full text-xs flex items-center">
                  <Hash size={12} className="mr-1" />{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentFolder.monitorDeadline && (
           <div className="p-3 mb-5 bg-red-50 rounded-r-lg border-l-4 border-red-500 dark:bg-red-900 dark:border-red-400">
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2 text-red-500 dark:text-red-400" />
              <div>
                <div className="text-sm font-medium text-red-600 dark:text-red-300">Prazo de Monitoramento</div>
                <div className="text-sm text-red-700 dark:text-red-200">{currentFolder.monitorDeadline}</div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard de Métricas */}
        <FolderMetricsDashboard metrics={currentFolder.metrics} folderName={currentFolder.name} />

        <div className="flex flex-col gap-2 pt-4 mt-auto sm:flex-row">
           <button onClick={() => handleOpenFolderSystem(currentFolder)} className="flex items-center justify-center px-4 py-2.5 rounded-lg flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
            <ExternalLink size={18} className="mr-2" /> {currentFolder.link ? 'Abrir' : 'Cadastrar Link'}
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-2 sm:flex-row">
          <button onClick={() => handleEditFolder(currentFolder)} className="flex items-center justify-center px-4 py-2.5 rounded-lg flex-1 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors">
            <Settings size={18} className="mr-2" /> Editar
          </button>
           <button onClick={() => handleRemoveFolder(currentFolder.id)} className="flex items-center justify-center px-4 py-2.5 rounded-lg flex-1 border border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300 transition-colors">
            <Trash2 size={18} className="mr-2" /> Remover
          </button>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveWrapper className="flex flex-col h-screen text-gray-900 transition-colors duration-300 dark:text-gray-100">
      <div id="pasta-corporativa-app" className="flex flex-col h-full">
      {/* Header - Aumentado e com título/logo editáveis */}
      <header className="bg-white dark:bg-gray-800 shadow-lg p-4 sticky top-0 z-30 flex items-center justify-between min-h-[80px]">
        <EditableHeader
          title={appTitle}
          onTitleChange={handleTitleChange}
          logoUrl={appLogo}
          onLogoChange={handleLogoChange}
          className="flex-1"
        />
        <div className="flex items-center space-x-2">
          {/* Botões de Undo/Redo */}
          <button 
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo 
                ? 'text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300' 
                : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
            }`}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 size={20} />
          </button>
          
          <button 
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-colors ${
              canRedo 
                ? 'text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300' 
                : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
            }`}
            title="Refazer (Ctrl+Y)"
          >
            <Redo2 size={20} />
          </button>

          {/* Divisor */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          {/* Botão de Favoritos */}
          <button 
            onClick={() => setShowFavoritesPanel(!showFavoritesPanel)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" 
            title="Favoritos"
          >
            <Star size={20} />
          </button>

          {/* Botão de Importar */}
          <button 
            onClick={() => setShowImportModal(true)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" 
            title="Importar Estrutura"
          >
            <Upload size={20} />
          </button>

          {/* Botão de Histórico */}
          <button 
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" 
            title="Histórico de Ações"
          >
            <History size={20} />
          </button>

          {/* Botão de Monitoramento */}
          <button 
            onClick={() => setShowMonitoringPanel(!showMonitoringPanel)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" 
            title="Monitoramento de Pastas Favoritas"
          >
            <Bell size={20} />
          </button>

          <button onClick={() => setIsDetailsPanelOpen(!isDetailsPanelOpen)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" title={isDetailsPanelOpen ? "Ocultar Detalhes" : "Mostrar Detalhes"}>
            {isDetailsPanelOpen ? <Grid size={20} /> : <List size={20} />}
          </button>
          
          {/* Layout Presets - só mostra quando o painel de detalhes está aberto */}
          {isDetailsPanelOpen && (
            <div className="relative">
              <button 
                onClick={() => setShowPanelPresets(!showPanelPresets)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" 
                title="Ajustar Layout dos Painéis"
              >
                <SplitSquareHorizontal size={20} />
              </button>
              
              <PanelSizePresets
                isVisible={showPanelPresets}
                currentLeftWidth={currentPanelWidth}
                onPresetSelect={(width) => {
                  resizablePanelsRef.current?.setLeftWidth(width);
                  setShowPanelPresets(false);
                }}
              />
            </div>
          )}

          {/* Layout Manager */}
          <div className="relative">
            <button 
              onClick={() => setShowLayoutManager(!showLayoutManager)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" 
              title="Gerenciar Layouts"
            >
              <Layout size={20} />
            </button>
            
            <LayoutManager
              currentLeftWidth={currentPanelWidth}
              currentIsDarkMode={isDarkMode}
              currentIsDetailsPanelOpen={isDetailsPanelOpen}
              currentFolders={folders}
              currentExpandedFolders={expandedFolders}
              currentSelectedFolder={selectedFolder || undefined}
              currentSearchQuery={searchQuery}
              currentSelectedResponsible={selectedResponsible}
              currentShowFavoritesPanel={showFavoritesPanel}
              currentShowHistoryPanel={showHistoryPanel}
              currentShowMonitoringPanel={showMonitoringPanel}
              onApplyLayout={handleApplyLayout}
              isVisible={showLayoutManager}
              onClose={() => setShowLayoutManager(false)}
            />
          </div>
          

          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" 
            title="Configurações"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-3 border-b border-gray-200 dark:border-gray-700 sticky top-[80px] z-20">
        <div className="flex flex-col gap-3 items-center sm:flex-row">
            <div className="relative flex-1 w-full sm:w-auto">
                <input
                    type="text"
                    placeholder="Buscar pastas..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow focus:shadow-md text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 text-gray-400 transform -translate-y-1/2 dark:text-gray-500" size={18} />
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 shadow-xs flex-1 sm:flex-none">
                    <User size={16} className="text-gray-500 dark:text-gray-400 mr-1.5" />
                    <select
                        value={selectedResponsible}
                        onChange={(e) => setSelectedResponsible(e.target.value)}
                        className="w-full text-sm font-medium bg-transparent border-none focus:outline-none"
                    >
                        {allResponsibles.map(r => <option key={r} value={r} className="bg-white dark:bg-gray-700">{r}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-2 w-full sm:w-auto sm:ml-auto">
                <button onClick={handleCollapseAll} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center text-xs font-medium shadow-xs"><ChevronUp size={16} className="mr-1" />Recolher</button>
                <button onClick={handleExpandAll} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center text-xs font-medium shadow-xs">Expandir<ChevronDown size={16} className="ml-1" /></button>
                <button 
                  onClick={() => handlePrepareAddFolder(null)} 
                  className="bg-green-600 dark:bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 flex items-center text-xs font-medium shadow-xs"
                  title="Adicionar Nova Pasta Raiz"
                >
                  <FolderPlus size={16} className="mr-1" />Nova Pasta
                </button>
                <button 
                  onClick={() => { 
                    handleGenerateExportJson(); 
                    setShowExportModal(true); 
                  }} 
                  className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 text-xs font-medium shadow-xs"
                >
                  Exportar
                </button>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="overflow-hidden flex-1 p-1 sm:p-2">
        <ResizablePanels
          ref={resizablePanelsRef}
          defaultLeftWidth={35}
          minLeftWidth={25}
          maxLeftWidth={75}
          isRightPanelVisible={isDetailsPanelOpen}
          className="h-full"
          onWidthChange={setCurrentPanelWidth}
          leftPanel={
            <div
              className="flex flex-col h-full bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800"
              role="tree"
              aria-label="Estrutura de Pastas Principal"
            >
              <div className="flex justify-between items-center p-3 pb-3 border-b border-gray-200 sm:p-4 dark:border-gray-700">
                <div className="flex items-center group">
                  {isEditingNavigatorTitle ? (
                    <div className="flex items-center space-x-2">
                      <input
                        ref={navigatorTitleInputRef}
                        type="text"
                        value={tempNavigatorTitle}
                        onChange={(e) => setTempNavigatorTitle(e.target.value)}
                        onKeyDown={handleNavigatorTitleKeyPress}
                        className="text-lg font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none text-gray-800 dark:text-gray-100 min-w-[180px]"
                        placeholder="Digite o título..."
                      />
                      <button
                        onClick={handleNavigatorTitleSave}
                        className="p-1 text-green-600 rounded transition-colors hover:bg-green-100 dark:hover:bg-green-900"
                        title="Salvar"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={handleNavigatorTitleCancel}
                        className="p-1 text-red-600 rounded transition-colors hover:bg-red-100 dark:hover:bg-red-900"
                        title="Cancelar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {folderNavigatorTitle}
                      </h2>
                      <button
                        onClick={() => setIsEditingNavigatorTitle(true)}
                        className="p-1 text-gray-500 rounded opacity-0 transition-all hover:text-gray-700 dark:hover:text-gray-300 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Editar título"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="overflow-auto flex-1 p-3 pt-3 sm:p-4">
                <div className="space-y-1">
                  {filteredFolders.map(folder => renderFolderItem(folder, 0))}
                </div>
                
                {/* Informações de status dentro do navegador */}
                <div className="pt-3 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2 items-center text-xs text-gray-500 dark:text-gray-400">
                    <Bell size={14} />
                    <span>{totalRootFolders} pasta(s) raiz • {totalSubfolders} subpasta(s)</span>
                  </div>
                </div>
              </div>
            </div>
          }
          rightPanel={
            <div className="flex flex-col h-full bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800">
              <div className="overflow-auto flex-1">
                {renderDetailsPanelContent(selectedFolder)}
              </div>
            </div>
          }
        />
      </main>

      {/* Novos Painéis */}
      <FavoritesPanel
        isVisible={showFavoritesPanel}
        onClose={() => setShowFavoritesPanel(false)}
        allFolders={folders}
        onSelectFolder={handleSelectFolder}
        selectedFolder={selectedFolder}
      />

      <HistoryPanel
        isVisible={showHistoryPanel}
        onClose={() => setShowHistoryPanel(false)}
        history={history}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onClearHistory={clearHistory}
      />

      <MonitoringPanel
        isOpen={showMonitoringPanel}
        onClose={() => setShowMonitoringPanel(false)}
        favoriteFolders={getFavoriteFolders()}
      />

      {/* Modals & Global Components */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Importar Estrutura de Pastas"
        size="lg"
      >
        <ImportModalContent
          onImport={handleImportFolders}
          onClose={() => setShowImportModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showColorPickerModal}
        onClose={() => setShowColorPickerModal(false)}
        title={folderForColorChange ? `Cor para: ${folderForColorChange.name}` : "Selecionar Cor"}
        size="sm"
      >
        {folderForColorChange && (
          <ColorPickerModalContent
            onSelectColor={handleChangeFolderColor}
            onClose={() => setShowColorPickerModal(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        title={newFolderParent ? `Nova Subpasta` : 'Nova Pasta Raiz'}
      >
        <CreateFolderModalContent
          newFolderData={newFolderData}
          setNewFolderData={setNewFolderData}
          onAddFolder={handleAddNewFolder}
          onClose={() => setShowCreateFolderModal(false)}
          parentFolderName={newFolderParent?.name}
        />
      </Modal>

      <Modal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
        }}
        title="Exportar Estrutura de Pastas (JSON)"
        size="lg"
      >
        <ExportModalContent
          jsonString={exportJsonString}
          onGenerateJson={handleGenerateExportJson} 
          onCopyToClipboard={handleCopyToClipboard}
          onDownloadFile={handleDownloadJsonFile}
          onClose={() => {
            setShowExportModal(false);
          }}
        />
      </Modal>

      {/* Modal para Adicionar/Editar Link */}
      <Modal
        isOpen={showAddLinkModal}
        onClose={() => {
          setShowAddLinkModal(false);
          setFolderForLinkEdit(null);
        }}
        title={folderForLinkEdit?.link ? "Editar Link" : "Adicionar Link"}
        size="md"
      >
        {folderForLinkEdit && (
          <AddLinkModalContent
            folder={folderForLinkEdit}
            onSave={handleSaveLink}
            onClose={() => {
              setShowAddLinkModal(false);
              setFolderForLinkEdit(null);
            }}
          />
        )}
      </Modal>

      {/* Modal para Editar Pasta */}
      <Modal
        isOpen={showEditFolderModal}
        onClose={() => {
          setShowEditFolderModal(false);
          setFolderForEdit(null);
        }}
        title="Editar Pasta"
        size="2xl"
      >
        {folderForEdit && (
          <EditFolderModalContent
            folder={folderForEdit}
            onSave={handleSaveEditedFolder}
            onClose={() => {
              setShowEditFolderModal(false);
              setFolderForEdit(null);
            }}
          />
        )}
      </Modal>

      {/* Modal de Configurações */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="⚙️ Configurações da Aplicação"
        size="2xl"
      >
        <SettingsModalContent
          onClose={() => setShowSettingsModal(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          currentPanelWidth={currentPanelWidth}
          onPanelWidthChange={(width) => {
            setCurrentPanelWidth(width);
            resizablePanelsRef.current?.setLeftWidth(width);
          }}
          isDetailsPanelOpen={isDetailsPanelOpen}
          onToggleDetailsPanel={() => setIsDetailsPanelOpen(!isDetailsPanelOpen)}
          onDataChange={refreshDynamicData}
        />
      </Modal>

      <Toast
        message={toastInfo.message}
        type={toastInfo.type}
        isVisible={toastInfo.isVisible}
        onClose={() => setToastInfo(prev => ({ ...prev, isVisible: false }))}
      />

      </div>
    </ResponsiveWrapper>
  );
};

export default App;
