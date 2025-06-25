import React from 'react';
import { FolderPlus, X as XIcon } from 'lucide-react';
import { NewFolderData, ColorOption } from '../../types';
import { AVAILABLE_COLORS, getAllResponsibles, getAllTags } from '../../constants';
import IconSelector from '../IconSelector';
import { IconRenderer } from '../../utils/iconUtils';

interface CreateFolderModalContentProps {
  newFolderData: NewFolderData;
  setNewFolderData: React.Dispatch<React.SetStateAction<NewFolderData>>;
  onAddFolder: () => void;
  onClose: () => void;
  parentFolderName?: string;
}

const CreateFolderModalContent: React.FC<CreateFolderModalContentProps> = ({
  newFolderData,
  setNewFolderData,
  onAddFolder,
  onClose,
  parentFolderName,
}) => {
  // Estados para dados dinâmicos
  const allResponsibles = getAllResponsibles();
  const allTags = getAllTags();

  const handleInputChange = <K extends keyof NewFolderData>(field: K, value: NewFolderData[K]) => {
    setNewFolderData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setNewFolderData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };
  
  return (
    <div className="space-y-4">
      {parentFolderName && <p className="text-sm text-gray-600">Criando subpasta em: <span className="font-medium">{parentFolderName}</span></p>}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="folderName">
          Nome da pasta
        </label>
        <input
          id="folderName"
          type="text"
          value={newFolderData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Documentos Fiscais"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="folderPath">
          Caminho (opcional)
        </label>
        <input
          id="folderPath"
          type="text"
          value={newFolderData.path}
          onChange={(e) => handleInputChange('path', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: C:\\Projetos\\ClienteX"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="folderResponsible">
          Responsável
        </label>
        <select
          id="folderResponsible"
          value={newFolderData.responsible}
          onChange={(e) => handleInputChange('responsible', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {allResponsibles.filter((r: string) => r !== 'Todos').map((resp: string) => (
            <option key={resp} value={resp}>{resp}</option>
          ))}
        </select>
      </div>

      {/* Seleção de Ícone */}
      <IconSelector
        selectedIcon={newFolderData.icon}
        selectedIconType={newFolderData.iconType}
        onIconSelect={(iconId, iconType) => {
          handleInputChange('icon', iconId);
          handleInputChange('iconType', iconType);
        }}
      />

      {/* Seleção de Cor da Pasta e Fonte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cor da Pasta */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Cor da Pasta</label>
          <div className="grid grid-cols-4 gap-2">
            {AVAILABLE_COLORS.slice(0, 12).map((color: ColorOption) => (
              <button
                key={color.value}
                type="button"
                className={`${color.value} h-8 w-8 rounded-md hover:opacity-80 transition-opacity ${newFolderData.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-1 ring-gray-300'}`}
                onClick={() => handleInputChange('color', color.value)}
                title={color.name}
                aria-label={`Selecionar cor ${color.name}`}
              />
            ))}
          </div>
        </div>

        {/* Cor da Fonte */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Cor da Fonte</label>
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
            ].slice(0, 12).map((textColor) => (
              <button
                key={textColor.value}
                type="button"
                className={`${textColor.preview} h-8 w-8 rounded-md hover:opacity-80 transition-opacity ${(newFolderData as any).textColor === textColor.value ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-1 ring-gray-300'}`}
                onClick={() => handleInputChange('textColor' as any, textColor.value)}
                title={textColor.name}
                aria-label={`Selecionar cor da fonte ${textColor.name}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Preview da Combinação */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Preview</label>
        <div className={`${newFolderData.color} ${(newFolderData as any).textColor || 'text-white'} p-3 rounded-lg shadow-md flex items-center`}>
          <IconRenderer 
            iconId={newFolderData.icon || 'folder'}
            iconType={newFolderData.iconType || 'preset'}
            size={24} 
            className="mr-2" 
          />
          <div>
            <div className="font-medium">{newFolderData.name || 'Nome da Pasta'}</div>
            <div className="text-sm opacity-80">{newFolderData.responsible || 'Responsável'}</div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {newFolderData.tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
            >
              #{tag}
              <button
                type="button"
                className="ml-1 text-blue-600 hover:text-blue-800"
                onClick={() => handleTagToggle(tag)}
                aria-label={`Remover tag ${tag}`}
              >
                <XIcon size={12} />
              </button>
            </span>
          ))}
        </div>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          onChange={(e) => {
            if (e.target.value && !newFolderData.tags.includes(e.target.value)) {
              handleTagToggle(e.target.value);
            }
            e.target.value = ''; // Reset select
          }}
          value=""
        >
          <option value="" disabled>Adicionar tag...</option>
          {allTags.filter((tag: string) => !newFolderData.tags.includes(tag)).map((tag: string) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          onClick={onAddFolder}
          disabled={!newFolderData.name.trim()}
        >
          <FolderPlus size={18} className="mr-2" />
          Criar Pasta
        </button>
      </div>
    </div>
  );
};

export default CreateFolderModalContent;
