import React, { useState, useRef, useEffect } from 'react';
import { FolderIcon, Edit3, Upload, X, Check } from 'lucide-react';

interface EditableHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  logoUrl?: string | null;
  onLogoChange: (logoUrl: string | null) => void;
  className?: string;
}

export const EditableHeader: React.FC<EditableHeaderProps> = ({
  title,
  onTitleChange,
  logoUrl,
  onLogoChange,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logoMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Fechar o menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoMenuRef.current && !logoMenuRef.current.contains(event.target as Node)) {
        setShowLogoUpload(false);
      }
    };

    if (showLogoUpload) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoUpload]);

  const handleSaveTitle = () => {
    onTitleChange(tempTitle.trim() || 'Pastas Corporativas');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Verificar tamanho (máximo 5MB para melhor suporte)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            onLogoChange(dataUrl);
            setShowLogoUpload(false);
          }
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          alert('Erro ao processar a imagem. Tente novamente.');
        }
      };
      reader.onerror = () => {
        alert('Erro ao ler o arquivo. Tente novamente.');
      };
      reader.readAsDataURL(file);
    }
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    event.target.value = '';
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    setShowLogoUpload(false);
  };

  const toggleLogoMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoUpload(!showLogoUpload);
  };

  const handleLogoMouseEnter = () => {
    setIsHoveringLogo(true);
  };

  const handleLogoMouseLeave = () => {
    setIsHoveringLogo(false);
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo ou Ícone */}
      <div 
        className="relative mr-6 group" 
        ref={logoMenuRef}
        onMouseEnter={handleLogoMouseEnter}
        onMouseLeave={handleLogoMouseLeave}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-30 h-30 object-contain transition-all duration-200"
            onError={() => onLogoChange(null)}
          />
        ) : (
          <div className="w-30 h-30 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105">
            <FolderIcon size={72} className="text-white" />
          </div>
        )}
        
        {/* Botão de upload/edição de logo - Aparece sempre sem logo, ou apenas no hover com logo */}
        <button
          onClick={toggleLogoMenu}
          className={`absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-xs shadow-lg hover:scale-110 transition-all duration-200 ${
            logoUrl 
              ? `${isHoveringLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`
              : 'opacity-100 scale-100'
          }`}
          title={logoUrl ? "Alterar logo" : "Adicionar logo"}
        >
          <Upload size={16} />
        </button>

        {/* Overlay sutil no hover quando há logo */}
        {logoUrl && (
          <div 
            className={`absolute inset-0 bg-black rounded-lg transition-opacity duration-200 pointer-events-none ${
              isHoveringLogo ? 'opacity-10' : 'opacity-0'
            }`}
          />
        )}

        {/* Menu de upload de logo */}
        {showLogoUpload && (
          <div className="absolute top-32 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl p-4 z-[100] min-w-[220px] animate-in fade-in zoom-in duration-200">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {logoUrl ? 'Gerenciar Logo' : 'Adicionar Logo'}
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
              >
                <Upload size={18} />
                <span>{logoUrl ? 'Trocar Imagem' : 'Escolher Imagem'}</span>
              </button>
              
              {logoUrl && (
                <button
                  onClick={handleRemoveLogo}
                  className="w-full px-4 py-3 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
                >
                  <X size={18} />
                  <span>Remover Logo</span>
                </button>
              )}
              
              <button
                onClick={() => setShowLogoUpload(false)}
                className="w-full px-4 py-3 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Cancelar</span>
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Formatos: PNG, JPG, GIF, SVG<br />
                Tamanho máximo: 5MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
      </div>

      {/* Título Editável */}
      <div className="flex items-center group">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-4xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none text-gray-800 dark:text-gray-100 min-w-[400px]"
              placeholder="Digite o título..."
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
              title="Salvar"
            >
              <Check size={18} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
              title="Cancelar"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h1>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Editar título"
            >
              <Edit3 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 