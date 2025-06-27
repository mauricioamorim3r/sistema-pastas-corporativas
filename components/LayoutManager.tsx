import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, FolderTree, Tag, Star, Download, Upload, Palette } from 'lucide-react';
import { CompleteSavedLayout, LegacySavedLayout, Folder, LayoutCategory, LayoutStats, LayoutTemplate } from '../types';
import { getBrowserDatabase } from '../utils/browserDatabase';
import { getColorSettings } from '../utils/colorSettings';

interface LayoutManagerProps {
  // Props existentes (UI)
  currentLeftWidth: number;
  currentIsDarkMode: boolean;
  currentIsDetailsPanelOpen: boolean;
  
  // Novas props (estado completo)
  currentFolders: Folder[];
  currentExpandedFolders: Set<string | number>;
  currentSelectedFolder?: Folder;
  currentSearchQuery?: string;
  currentSelectedResponsible?: string;
  currentShowFavoritesPanel?: boolean;
  currentShowHistoryPanel?: boolean;
  currentShowMonitoringPanel?: boolean;
  
  // Callbacks
  onApplyLayout: (layout: CompleteSavedLayout) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({
  // UI props
  currentLeftWidth,
  currentIsDarkMode,
  currentIsDetailsPanelOpen,
  
  // Estado completo props
  currentFolders,
  currentExpandedFolders,
  currentSelectedFolder,
  currentSearchQuery,
  currentSelectedResponsible,
  currentShowFavoritesPanel,
  currentShowHistoryPanel,
  currentShowMonitoringPanel,
  
  onApplyLayout,
  isVisible,
  onClose
}) => {
  const [savedLayouts, setSavedLayouts] = useState<CompleteSavedLayout[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingLayout, setEditingLayout] = useState<CompleteSavedLayout | null>(null);
  
  // Estados do formulário
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDescription, setNewLayoutDescription] = useState('');
  const [newLayoutCategory, setNewLayoutCategory] = useState<string>(LayoutCategory.PROJECT);
  const [newLayoutTags, setNewLayoutTags] = useState<string[]>([]);
  const [newLayoutIsTemplate, setNewLayoutIsTemplate] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  
  // Estados de filtro e exibição
  const [filterCategory, setFilterCategory] = useState<string>('Todos');
  const [filterTag, setFilterTag] = useState<string>('');

  // Carregar layouts salvos e migrar layouts antigos
  useEffect(() => {
    loadSavedLayouts();
  }, []);

  const loadSavedLayouts = async () => {
    try {
      const db = await getBrowserDatabase();
      
      // Carregar templates do banco de dados
      const templates = await db.listTemplates();
      
      // Converter templates para layouts completos
      const layouts: CompleteSavedLayout[] = templates.map((template: LayoutTemplate) => ({
        id: template.name, // Usar nome como ID para compatibilidade
        name: template.name,
        description: template.description,
        leftWidth: currentLeftWidth,
        isDarkMode: currentIsDarkMode,
        isDetailsPanelOpen: currentIsDetailsPanelOpen,
        folders: template.folders,
        expandedFolders: [],
        createdAt: template.createdAt || new Date().toLocaleDateString('pt-BR'),
        updatedAt: template.updatedAt || new Date().toLocaleDateString('pt-BR'),
        version: '2.0.0',
        category: template.category,
        isTemplate: true,
        stats: generateLayoutStats(template.folders)
      }));

      // Fallback para localStorage se não houver templates no banco
      if (layouts.length === 0) {
        const saved = localStorage.getItem('complete-layouts');
        const legacySaved = localStorage.getItem('saved-layouts');
        
        let legacyLayouts: CompleteSavedLayout[] = [];
        
        // Carregar layouts completos do localStorage
        if (saved) {
          try {
            legacyLayouts = JSON.parse(saved);
          } catch (error) {
            console.error('Erro ao carregar layouts completos:', error);
          }
        }
        
        // Migrar layouts antigos se existirem
        if (legacySaved && legacyLayouts.length === 0) {
          try {
            const oldLayouts: LegacySavedLayout[] = JSON.parse(legacySaved);
            legacyLayouts = migrateLegacyLayouts(oldLayouts);
            saveLayoutsToStorage(legacyLayouts);
            console.log(`Migrados ${oldLayouts.length} layouts antigos`);
          } catch (error) {
            console.error('Erro ao migrar layouts antigos:', error);
          }
        }
        
        // Migrar layouts do localStorage para o banco de dados
        if (legacyLayouts.length > 0) {
          for (const layout of legacyLayouts) {
            const template: Omit<LayoutTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
              name: layout.name,
              description: layout.description,
              category: 'other',
              folders: layout.folders,
              settings: {
                leftWidth: layout.leftWidth,
                isDarkMode: layout.isDarkMode,
                isDetailsPanelOpen: layout.isDetailsPanelOpen
              }
            };
            await db.saveTemplate(template);
          }
          console.log(`✅ Migrados ${legacyLayouts.length} layouts para o banco de dados`);
        }
        
        setSavedLayouts(layouts.concat(legacyLayouts));
      } else {
        setSavedLayouts(layouts);
      }
    } catch (error) {
      console.error('Erro ao carregar layouts:', error);
      setSavedLayouts([]);
    }
  };

  const migrateLegacyLayouts = (legacyLayouts: LegacySavedLayout[]): CompleteSavedLayout[] => {
    return legacyLayouts.map(legacy => ({
      id: legacy.id,
      name: legacy.name,
      description: legacy.description,
      leftWidth: legacy.leftWidth,
      isDarkMode: legacy.isDarkMode,
      isDetailsPanelOpen: legacy.isDetailsPanelOpen,
      folders: currentFolders, // Usar pastas atuais como fallback
      expandedFolders: Array.from(currentExpandedFolders),
      createdAt: legacy.createdAt,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      version: '1.0.0',
      category: LayoutCategory.PROJECT,
      isTemplate: false,
      stats: generateLayoutStats(currentFolders)
    }));
  };

  const generateLayoutStats = (folders: Folder[]): LayoutStats => {
    const countSubfolders = (folderList: Folder[]): number => {
      return folderList.reduce((count, folder) => {
        return count + (folder.subFolders ? folder.subFolders.length + countSubfolders(folder.subFolders) : 0);
      }, 0);
    };

    const getAllResponsibles = (folderList: Folder[]): string[] => {
      const responsibles = new Set<string>();
      const addResponsibles = (folders: Folder[]) => {
        folders.forEach(folder => {
          if (folder.responsible) responsibles.add(folder.responsible);
          if (folder.subFolders) addResponsibles(folder.subFolders);
        });
      };
      addResponsibles(folderList);
      return Array.from(responsibles);
    };

    const getAllTags = (folderList: Folder[]): string[] => {
      const tags = new Set<string>();
      const addTags = (folders: Folder[]) => {
        folders.forEach(folder => {
          if (folder.tags) folder.tags.forEach(tag => tags.add(tag));
          if (folder.subFolders) addTags(folder.subFolders);
        });
      };
      addTags(folderList);
      return Array.from(tags);
    };

    return {
      totalFolders: folders.length,
      totalSubfolders: countSubfolders(folders),
      responsiblesCount: getAllResponsibles(folders).length,
      tagsUsed: getAllTags(folders),
      useCount: 0
    };
  };

  const saveLayoutsToStorage = (layouts: CompleteSavedLayout[]) => {
    localStorage.setItem('complete-layouts', JSON.stringify(layouts));
    setSavedLayouts(layouts);
  };

  const handleSaveCurrentLayout = async () => {
    if (!newLayoutName.trim()) return;

    try {
      const db = await getBrowserDatabase();
      
      // Criar template para o banco de dados
      const template: Omit<LayoutTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
        name: newLayoutName.trim(),
        description: newLayoutDescription.trim() || undefined,
        category: newLayoutCategory as any,
        folders: JSON.parse(JSON.stringify(currentFolders)), // Deep clone
        settings: {
          leftWidth: currentLeftWidth,
          isDarkMode: currentIsDarkMode,
          isDetailsPanelOpen: currentIsDetailsPanelOpen,
          expandedFolders: Array.from(currentExpandedFolders),
          selectedFolder: currentSelectedFolder ? JSON.parse(JSON.stringify(currentSelectedFolder)) : undefined,
          searchQuery: currentSearchQuery || '',
          selectedResponsible: currentSelectedResponsible || '',
          showFavoritesPanel: currentShowFavoritesPanel || false,
          showHistoryPanel: currentShowHistoryPanel || false,
          showMonitoringPanel: currentShowMonitoringPanel || false,
          tags: newLayoutTags,
          isTemplate: newLayoutIsTemplate
        }
      };

      if (editingLayout) {
        // Atualizando template existente
        await db.updateTemplate(editingLayout.name, template);
        console.log(`✅ Template "${newLayoutName}" atualizado no banco de dados`);
      } else {
        // Novo template
        await db.saveTemplate(template);
        console.log(`✅ Template "${newLayoutName}" salvo no banco de dados`);
      }

      // Recarregar layouts para refletir as mudanças
      await loadSavedLayouts();
      resetForm();
      
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      alert('Erro ao salvar template. Verifique o console para mais detalhes.');
    }
  };

  const resetForm = () => {
    setNewLayoutName('');
    setNewLayoutDescription('');
    setNewLayoutCategory(LayoutCategory.PROJECT);
    setNewLayoutTags([]);
    setNewLayoutIsTemplate(false);
    setCurrentTag('');
    setShowSaveDialog(false);
    setEditingLayout(null);
  };

  const handleDeleteLayout = async (layoutId: string) => {
    try {
      // Encontrar o layout que será removido
      const layoutToDelete = savedLayouts.find(layout => layout.id === layoutId);
      if (!layoutToDelete) {
        console.error('Layout não encontrado:', layoutId);
        return;
      }

      // Tentar remover do banco de dados primeiro
      const db = await getBrowserDatabase();
      const successDB = await db.deleteTemplate(layoutToDelete.name);
      
      if (successDB) {
        console.log(`✅ Template "${layoutToDelete.name}" removido do banco de dados`);
      } else {
        console.warn(`⚠️ Não foi possível remover "${layoutToDelete.name}" do banco de dados`);
      }

      // Remover da lista local e localStorage como fallback
      const updatedLayouts = savedLayouts.filter(layout => layout.id !== layoutId);
      saveLayoutsToStorage(updatedLayouts);
      
      console.log(`🗑️ Template "${layoutToDelete.name}" removido da interface`);
      
    } catch (error) {
      console.error('Erro ao remover layout:', error);
      
      // Fallback: remover apenas da lista local
    const updatedLayouts = savedLayouts.filter(layout => layout.id !== layoutId);
    saveLayoutsToStorage(updatedLayouts);
    }
  };

  const handleEditLayout = (layout: CompleteSavedLayout) => {
    setEditingLayout(layout);
    setNewLayoutName(layout.name);
    setNewLayoutDescription(layout.description || '');
    setNewLayoutCategory(layout.category || LayoutCategory.PROJECT);
    setNewLayoutTags(layout.tags || []);
    setNewLayoutIsTemplate(layout.isTemplate || false);
    setShowSaveDialog(true);
  };

  // Função para padronizar cores das pastas usando configurações personalizáveis
  const standardizeFolderColors = (folders: Folder[]): Folder[] => {
    const colorSettings = getColorSettings();
    
    const processFolder = (folder: Folder, isSubfolder: boolean = false): Folder => {
      const standardizedFolder = {
        ...folder,
        color: isSubfolder ? colorSettings.subFolderColor : colorSettings.mainFolderColor,
        textColor: colorSettings.textColor
      };

      // Processar subpastas recursivamente
      if (folder.subFolders && folder.subFolders.length > 0) {
        standardizedFolder.subFolders = folder.subFolders.map(subfolder => 
          processFolder(subfolder, true)
        );
      }

      return standardizedFolder;
    };

    return folders.map(folder => processFolder(folder, false));
  };

  const handleApplyLayout = (layout: CompleteSavedLayout) => {
    // Padronizar cores das pastas antes de aplicar
    const layoutWithStandardizedColors = {
      ...layout,
      folders: standardizeFolderColors(layout.folders || [])
    };

    // Atualizar estatísticas de uso
    const updatedLayout = {
      ...layoutWithStandardizedColors,
      stats: {
        ...layout.stats!,
        lastUsed: new Date().toLocaleDateString('pt-BR'),
        useCount: (layout.stats?.useCount || 0) + 1
      }
    };
    
    const updatedLayouts = savedLayouts.map(l => 
      l.id === layout.id ? updatedLayout : l
    );
    saveLayoutsToStorage(updatedLayouts);
    
    onApplyLayout(updatedLayout);
    onClose();
  };

  const handleStandardizeColors = (layout: CompleteSavedLayout) => {
    const layoutWithStandardizedColors = {
      ...layout,
      folders: standardizeFolderColors(layout.folders || []),
      updatedAt: new Date().toLocaleDateString('pt-BR')
    };
    
    const updatedLayouts = savedLayouts.map(l => 
      l.id === layout.id ? layoutWithStandardizedColors : l
    );
    saveLayoutsToStorage(updatedLayouts);
  };

  const handleStandardizeAllColors = () => {
    const updatedLayouts = savedLayouts.map(layout => ({
      ...layout,
      folders: standardizeFolderColors(layout.folders || []),
      updatedAt: new Date().toLocaleDateString('pt-BR')
    }));
    saveLayoutsToStorage(updatedLayouts);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !newLayoutTags.includes(currentTag.trim())) {
      setNewLayoutTags([...newLayoutTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewLayoutTags(newLayoutTags.filter(tag => tag !== tagToRemove));
  };

  const exportLayout = (layout: CompleteSavedLayout) => {
    const dataStr = JSON.stringify(layout, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `layout-${layout.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLayout: CompleteSavedLayout = JSON.parse(e.target?.result as string);
        const newId = `layout-${Date.now()}`;
        const newLayout = {
          ...importedLayout,
          id: newId,
          name: `${importedLayout.name} (Importado)`,
          createdAt: new Date().toLocaleDateString('pt-BR'),
          updatedAt: new Date().toLocaleDateString('pt-BR')
        };
        saveLayoutsToStorage([...savedLayouts, newLayout]);
      } catch (error) {
        console.error('Erro ao importar layout:', error);
        alert('Erro ao importar layout. Verifique se o arquivo é válido.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // Filtrar layouts
  const filteredLayouts = savedLayouts.filter(layout => {
    const matchesCategory = filterCategory === 'Todos' || layout.category === filterCategory;
    const matchesTag = !filterTag || layout.tags?.some(tag => 
      tag.toLowerCase().includes(filterTag.toLowerCase())
    );
    return matchesCategory && matchesTag;
  });

  if (!isVisible) return null;

  return (
    <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50 w-96 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <FolderTree size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Templates de Organização</h3>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".json"
            onChange={importLayout}
            className="hidden"
            id="import-layout"
          />
          <button
            onClick={handleStandardizeAllColors}
            className="p-2 text-purple-600 rounded-lg transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900"
            title="Padronizar Cores de Todos os Templates (configurável em Configurações)"
            disabled={savedLayouts.length === 0}
          >
            <Palette size={16} />
          </button>
          <label
            htmlFor="import-layout"
            className="p-2 text-green-600 rounded-lg transition-colors cursor-pointer hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900"
            title="Importar Template"
          >
            <Upload size={16} />
          </label>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="p-2 text-blue-600 rounded-lg transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900"
            title="Salvar Template Atual"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Fechar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 space-y-2">
        <div className="flex space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="Todos">Todas Categorias</option>
            {Object.values(LayoutCategory).map((category, index) => (
              <option key={`category-filter-${index}-${category}`} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filtrar por tag..."
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Dialog para Salvar/Editar Layout */}
      {showSaveDialog && (
        <div className="overflow-y-auto p-3 mb-4 max-h-96 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <h4 className="mb-3 text-sm font-medium text-gray-800 dark:text-gray-100">
            {editingLayout ? 'Editar Template' : 'Salvar Template Atual'}
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Nome do Template *
              </label>
              <input
                type="text"
                value={newLayoutName}
                onChange={(e) => setNewLayoutName(e.target.value)}
                className="px-3 py-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Gestão de Projetos 2024"
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <textarea
                value={newLayoutDescription}
                onChange={(e) => setNewLayoutDescription(e.target.value)}
                className="px-3 py-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva como este template organiza os documentos..."
                maxLength={200}
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Categoria
              </label>
              <select
                value={newLayoutCategory}
                onChange={(e) => setNewLayoutCategory(e.target.value)}
                className="px-3 py-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(LayoutCategory).map((category, index) => (
                  <option key={`category-dialog-${index}-${category}`} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="flex mb-2 space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adicionar tag..."
                  maxLength={20}
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {newLayoutTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full dark:bg-blue-700 dark:text-blue-100"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isTemplate"
                checked={newLayoutIsTemplate}
                onChange={(e) => setNewLayoutIsTemplate(e.target.checked)}
                className="text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isTemplate" className="text-xs text-gray-700 dark:text-gray-300">
                Marcar como template compartilhável
              </label>
            </div>

            {/* Preview das configurações */}
            <div className="p-2 text-xs text-gray-600 bg-gray-100 rounded dark:text-gray-400 dark:bg-gray-600">
              <strong>Dados que serão salvos:</strong><br/>
              • {currentFolders.length} pasta(s) raiz<br/>
              • {generateLayoutStats(currentFolders).totalSubfolders} subpasta(s)<br/>
              • Largura do painel: {Math.round(currentLeftWidth)}%<br/>
              • Tema: {currentIsDarkMode ? 'Escuro' : 'Claro'}<br/>
              • Pasta selecionada: {currentSelectedFolder?.name || 'Nenhuma'}<br/>
              • {Array.from(currentExpandedFolders).length} pasta(s) expandida(s)
            </div>
          </div>

          <div className="flex justify-end mt-3 space-x-2">
            <button
              onClick={resetForm}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCurrentLayout}
              disabled={!newLayoutName.trim()}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {editingLayout ? 'Atualizar' : 'Salvar Template'}
            </button>
          </div>
        </div>
      )}

      {/* Lista de Layouts Salvos */}
      <div className="overflow-y-auto flex-1 space-y-2">
        {filteredLayouts.length === 0 ? (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            <FolderTree size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum template encontrado</p>
            <p className="text-xs">Clique em + para salvar o estado atual</p>
          </div>
        ) : (
          filteredLayouts.map((layout) => (
            <div
              key={layout.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 transition-colors group dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleApplyLayout(layout)}
                >
                  <div className="flex items-center mb-1 space-x-2">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {layout.name}
                    </div>
                    {layout.isTemplate && (
                      <Star size={12} className="text-yellow-500" />
                    )}
                  </div>
                  
                  {layout.description && (
                    <div className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                      {layout.description}
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-500">
                    <div>
                      📁 {layout.stats?.totalFolders} pastas • 
                      📂 {layout.stats?.totalSubfolders} subpastas • 
                      👥 {layout.stats?.responsiblesCount} responsáveis
                    </div>
                    <div>
                      {layout.category} • {layout.createdAt}
                      {layout.stats?.useCount && layout.stats.useCount > 0 && (
                        <span> • {layout.stats.useCount} uso(s)</span>
                      )}
                    </div>
                  </div>

                  {layout.tags && layout.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {layout.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 rounded"
                        >
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleStandardizeColors(layout)}
                    className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
                    title="Padronizar Cores (configurável em Configurações)"
                  >
                    <Palette size={14} />
                  </button>
                  <button
                    onClick={() => exportLayout(layout)}
                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Exportar Template"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => handleEditLayout(layout)}
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
                    title="Editar Template"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteLayout(layout.id)}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Excluir Template"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 mt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <div><strong>💡 Templates:</strong> Salvam estrutura completa de pastas, filtros, seleções e estado visual.</div>
                      <div><strong>🎨 Cores:</strong> Use o ícone <Palette size={12} className="inline" /> para padronizar cores (configurável em ⚙️ Configurações).</div>
        </div>
      </div>
    </div>
  );
}; 