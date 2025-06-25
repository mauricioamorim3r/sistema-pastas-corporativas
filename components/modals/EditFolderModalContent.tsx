import React, { useState } from 'react';
import { Folder } from '../../types';
import { FolderPlus, Link, User, MapPin, Calendar, Hash, FileText, Palette } from 'lucide-react';
import { AVAILABLE_COLORS, getAllResponsibles, getAllTags } from '../../constants';
import IconSelector from '../IconSelector';
import { IconRenderer } from '../../utils/iconUtils';

interface EditFolderModalContentProps {
  folder: Folder;
  onSave: (updatedFolder: Folder) => void;
  onClose: () => void;
}

export const EditFolderModalContent: React.FC<EditFolderModalContentProps> = ({
  folder,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Folder>({
    ...folder,
    tags: folder.tags || [],
    description: folder.description || '',
    link: folder.link || '',
    icon: folder.icon || 'folder',
    iconType: folder.iconType || 'preset',
  });

  // Estados para dados dinâmicos
  const [allResponsibles] = useState<string[]>(getAllResponsibles());
  const [allTags] = useState<string[]>(getAllTags());

  const handleInputChange = (field: keyof Folder, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  const handleSave = () => {
    const updatedFolder: Folder = {
      ...formData,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
    };
    onSave(updatedFolder);
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidPath = (string: string) => {
    // Verifica se é um caminho válido do Windows, Mac ou Linux
    return /^[a-zA-Z]:\\/.test(string) || // Windows: C:\
           /^\//.test(string) || // Unix: /
           /^~\//.test(string) || // Home: ~/
           /^\.\.?\//.test(string); // Relativo: ./ ou ../
  };

  const isValidLink = (link: string) => {
    if (!link.trim()) return true; // Link vazio é válido
    return isValidUrl(link) || isValidPath(link);
  };

  return (
    <div className="space-y-6">
      {/* Header com nome da pasta */}
      <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className={`w-12 h-12 rounded-lg ${formData.color} ${formData.textColor || 'text-white'} flex items-center justify-center mr-4 shadow-md`}>
          <IconRenderer 
            iconId={formData.icon || 'folder'}
            iconType={formData.iconType || 'preset'}
            size={24}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Editar Pasta
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Altere os parâmetros da pasta "{folder.name}"
          </p>
        </div>
      </div>

      {/* Linha 1: Nome e Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nome da pasta */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="folderName">
            <FolderPlus size={18} className="inline mr-2" />
            Nome da pasta *
          </label>
          <input
            id="folderName"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder="Ex: Documentos Fiscais"
            required
          />
        </div>

        {/* Link da pasta */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="folderLink">
            <Link size={18} className="inline mr-2" />
            Link/Caminho
          </label>
          <input
            id="folderLink"
            type="text"
            value={formData.link || ''}
            onChange={(e) => handleInputChange('link', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-200 ${
              isValidLink(formData.link || '') 
                ? 'border-gray-300 dark:border-gray-600 focus:ring-blue-500' 
                : 'border-red-500 focus:ring-red-500'
            }`}
            placeholder="Ex: https://exemplo.com ou C:\Pasta\Documentos"
          />
          {formData.link && !isValidLink(formData.link) && (
            <p className="text-red-500 text-xs mt-1">
              Link inválido. Use URL completa (https://) ou caminho do sistema.
            </p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            URL, caminho do sistema ou deixe vazio para usar o caminho padrão
          </p>
        </div>
      </div>

      {/* Linha 2: Responsável, Caminho e Prazo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Responsável */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="folderResponsible">
            <User size={18} className="inline mr-2" />
            Responsável
          </label>
          <select
            id="folderResponsible"
            value={formData.responsible || ''}
            onChange={(e) => handleInputChange('responsible', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="">Selecione um responsável</option>
            {allResponsibles.map((resp: string) => (
              <option key={resp} value={resp}>{resp}</option>
            ))}
          </select>
        </div>

        {/* Caminho do Sistema */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="folderPath">
            <MapPin size={18} className="inline mr-2" />
            Caminho no Sistema
          </label>
          <input
            id="folderPath"
            type="text"
            value={formData.path || ''}
            onChange={(e) => handleInputChange('path', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder="Ex: C:\Projetos\ClienteX"
          />
        </div>

        {/* Prazo de Monitoramento */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="monitorDeadline">
            <Calendar size={18} className="inline mr-2" />
            Prazo de Monitoramento
          </label>
          <input
            id="monitorDeadline"
            type="date"
            value={formData.monitorDeadline ? 
              new Date(formData.monitorDeadline.split('/').reverse().join('-')).toISOString().split('T')[0] : 
              ''}
            onChange={(e) => {
              const date = e.target.value;
              const formattedDate = date ? new Date(date).toLocaleDateString('pt-BR') : '';
              handleInputChange('monitorDeadline', formattedDate);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="folderDescription">
          <FileText size={18} className="inline mr-2" />
          Descrição
        </label>
        <textarea
          id="folderDescription"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          placeholder="Descrição detalhada da pasta e seu conteúdo..."
        />
      </div>

      {/* Linha 3: Ícone, Cores e Preview em Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Coluna 1: Seleção de Ícone */}
        <div className="xl:col-span-1">
          <IconSelector
            selectedIcon={formData.icon}
            selectedIconType={formData.iconType}
            onIconSelect={(iconId, iconType) => {
              handleInputChange('icon', iconId);
              handleInputChange('iconType', iconType);
            }}
          />
        </div>

        {/* Coluna 2: Cores */}
        <div className="xl:col-span-1 space-y-4">
          {/* Cor da Pasta */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              <Palette size={18} className="inline mr-2" />
              Cor da Pasta
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleInputChange('color', color.value)}
                  className={`w-8 h-8 rounded-lg ${color.value} border-2 ${
                    formData.color === color.value 
                      ? 'border-gray-800 dark:border-gray-200' 
                      : 'border-gray-300 dark:border-gray-600'
                  } hover:scale-110 transition-transform`}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Fundo: {AVAILABLE_COLORS.find((c) => c.value === formData.color)?.name || 'Personalizada'}
            </p>
          </div>

          {/* Cor da Fonte */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              <Hash size={18} className="inline mr-2" />
              Cor da Fonte
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Branco', value: 'text-white', preview: 'bg-white' },
                { name: 'Preto', value: 'text-black', preview: 'bg-black' },
                { name: 'Cinza Escuro', value: 'text-gray-800', preview: 'bg-gray-800' },
                { name: 'Cinza Claro', value: 'text-gray-300', preview: 'bg-gray-300' },
                { name: 'Azul', value: 'text-blue-600', preview: 'bg-blue-600' },
                { name: 'Verde', value: 'text-green-600', preview: 'bg-green-600' },
                { name: 'Vermelho', value: 'text-red-600', preview: 'bg-red-600' },
                { name: 'Amarelo', value: 'text-yellow-600', preview: 'bg-yellow-600' },
                { name: 'Roxo', value: 'text-purple-600', preview: 'bg-purple-600' },
                { name: 'Rosa', value: 'text-pink-600', preview: 'bg-pink-600' },
                { name: 'Laranja', value: 'text-orange-600', preview: 'bg-orange-600' },
                { name: 'Turquesa', value: 'text-teal-600', preview: 'bg-teal-600' }
              ].map((textColor) => (
                <button
                  key={textColor.value}
                  onClick={() => handleInputChange('textColor', textColor.value)}
                  className={`w-8 h-8 rounded-lg ${textColor.preview} border-2 ${
                    formData.textColor === textColor.value 
                      ? 'border-gray-800 dark:border-gray-200 ring-2 ring-blue-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } hover:scale-110 transition-transform`}
                  title={textColor.name}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Fonte: {formData.textColor?.replace('text-', '').replace('-600', '').replace('-800', '').replace('-300', '') || 'Padrão'}
            </p>
          </div>
        </div>

        {/* Coluna 3: Preview */}
        <div className="xl:col-span-1">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
            Preview da Combinação
          </label>
          <div className={`${formData.color} ${formData.textColor || 'text-white'} p-4 rounded-lg shadow-md flex items-center h-24`}>
            <IconRenderer 
              iconId={formData.icon || 'folder'}
              iconType={formData.iconType || 'preset'}
              size={24} 
              className="mr-3" 
            />
            <div>
              <div className="font-medium text-lg">{formData.name || 'Nome da Pasta'}</div>
              <div className="text-sm opacity-80">{formData.responsible || 'Responsável'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
          <Hash size={18} className="inline mr-2" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag: string) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                formData.tags?.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {formData.tags.length} tag{formData.tags.length !== 1 ? 's' : ''} selecionada{formData.tags.length !== 1 ? 's' : ''}
          </p>
        )}
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={!formData.name.trim() || !isValidLink(formData.link || '')}
        >
          <FolderPlus size={18} className="mr-2" />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}; 