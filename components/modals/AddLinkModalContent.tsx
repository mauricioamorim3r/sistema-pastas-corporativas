import React, { useState } from 'react';
import { Link, ExternalLink, Folder as FolderIcon } from 'lucide-react';

interface AddLinkModalContentProps {
  folder: { name: string; link?: string };
  onSave: (link: string) => void;
  onClose: () => void;
}

export const AddLinkModalContent: React.FC<AddLinkModalContentProps> = ({
  folder,
  onSave,
  onClose,
}) => {
  const [link, setLink] = useState(folder.link || '');
  const [linkType, setLinkType] = useState<'url' | 'path'>('url');

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidPath = (string: string) => {
    return /^[a-zA-Z]:\\/.test(string) || // Windows: C:\
           /^\//.test(string) || // Unix: /
           /^~\//.test(string) || // Home: ~/
           /^\.\.?\//.test(string); // Relativo: ./ ou ../
  };

  const isValidLink = (link: string) => {
    if (!link.trim()) return false;
    return linkType === 'url' ? isValidUrl(link) : isValidPath(link);
  };

  const handleSave = () => {
    if (isValidLink(link)) {
      onSave(link.trim());
    }
  };

  const getPlaceholder = () => {
    return linkType === 'url' 
      ? 'https://exemplo.com'
      : 'C:\\Pasta\\Documentos';
  };

  const getValidationMessage = () => {
    if (!link.trim()) return '';
    if (linkType === 'url' && !isValidUrl(link)) {
      return 'URL inválida. Deve começar com http:// ou https://';
    }
    if (linkType === 'path' && !isValidPath(link)) {
      return 'Caminho inválido. Use formato Windows (C:\\) ou Unix (/)';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <Link size={24} className="text-blue-600 dark:text-blue-400 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {folder.link ? 'Editar Link' : 'Adicionar Link'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Para a pasta "{folder.name}"
          </p>
        </div>
      </div>

      {/* Tipo de Link */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
          Tipo de Link
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="url"
              checked={linkType === 'url'}
              onChange={(e) => setLinkType(e.target.value as 'url' | 'path')}
              className="mr-2"
            />
            <ExternalLink size={16} className="mr-1" />
            URL/Site
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="path"
              checked={linkType === 'path'}
              onChange={(e) => setLinkType(e.target.value as 'url' | 'path')}
              className="mr-2"
            />
            <FolderIcon size={16} className="mr-1" />
            Caminho Local
          </label>
        </div>
      </div>

      {/* Campo de Link */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="linkInput">
          {linkType === 'url' ? 'URL' : 'Caminho'} *
        </label>
        <input
          id="linkInput"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-200 ${
            link && !isValidLink(link) 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
          }`}
          placeholder={getPlaceholder()}
          autoFocus
        />
        {getValidationMessage() && (
          <p className="text-red-500 text-xs mt-1">
            {getValidationMessage()}
          </p>
        )}
      </div>

      {/* Exemplos */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Exemplos:
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          {linkType === 'url' ? (
            <>
              <div>• https://drive.google.com/drive/folders/...</div>
              <div>• https://onedrive.live.com/...</div>
              <div>• https://dropbox.com/...</div>
            </>
          ) : (
            <>
              <div>• C:\Documentos\Projeto</div>
              <div>• \\servidor\pasta\documentos</div>
              <div>• /home/usuario/documentos</div>
            </>
          )}
        </div>
      </div>

      {/* Botões */}
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
          disabled={!isValidLink(link)}
        >
          <Link size={16} className="mr-2" />
          {folder.link ? 'Atualizar' : 'Adicionar'} Link
        </button>
      </div>
    </div>
  );
}; 