import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Folder } from '../../types';
import { captureError } from '../../sentry';

interface ImportModalContentProps {
  onImport: (folders: Folder[]) => void;
  onClose: () => void;
}

export const ImportModalContent: React.FC<ImportModalContentProps> = ({
  onImport,
  onClose
}) => {
  const [importText, setImportText] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    folderCount?: number;
  } | null>(null);

  const validateImportData = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      
      // Verificar se é um array
      if (!Array.isArray(parsed)) {
        return { isValid: false, message: 'O arquivo deve conter um array de pastas.' };
      }

      // Validar estrutura básica das pastas
      const validateFolder = (folder: any): boolean => {
        return (
          typeof folder === 'object' &&
          folder !== null &&
          typeof folder.name === 'string' &&
          folder.name.trim() !== '' &&
          (folder.subFolders === undefined || Array.isArray(folder.subFolders))
        );
      };

      const countFolders = (folders: any[]): number => {
        let count = folders.length;
        folders.forEach(folder => {
          if (folder.subFolders && Array.isArray(folder.subFolders)) {
            count += countFolders(folder.subFolders);
          }
        });
        return count;
      };

      // Validar cada pasta
      for (const folder of parsed) {
        if (!validateFolder(folder)) {
          return { isValid: false, message: 'Estrutura de pasta inválida encontrada.' };
        }
        
        // Validar subpastas recursivamente
        if (folder.subFolders) {
          const validateSubFolders = (subFolders: any[]): boolean => {
            return subFolders.every(sub => {
              if (!validateFolder(sub)) return false;
              if (sub.subFolders) return validateSubFolders(sub.subFolders);
              return true;
            });
          };
          
          if (!validateSubFolders(folder.subFolders)) {
            return { isValid: false, message: 'Estrutura de subpasta inválida encontrada.' };
          }
        }
      }

      const totalFolders = countFolders(parsed);
      return { 
        isValid: true, 
        message: `Estrutura válida! ${parsed.length} pasta(s) raiz, ${totalFolders} pasta(s) no total.`,
        folderCount: totalFolders
      };
    } catch (error) {
      captureError(error as Error, { context: 'validateImportData', data: data.substring(0, 100) });
      return { isValid: false, message: 'JSON inválido. Verifique a sintaxe.' };
    }
  }, []);

  const handleTextChange = useCallback((value: string) => {
    setImportText(value);
    setValidationResult(null);
    
    if (value.trim()) {
      setIsValidating(true);
      // Debounce validation
      const timeoutId = setTimeout(() => {
        const result = validateImportData(value.trim());
        setValidationResult(result);
        setIsValidating(false);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [validateImportData]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (file.name.endsWith('.csv')) {
        // Converter CSV para JSON (implementação básica)
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setValidationResult({ isValid: false, message: 'Arquivo CSV deve ter pelo menos um cabeçalho e uma linha de dados.' });
          return;
        }
        
        const folders: Folder[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const folder: Folder = {
            id: `imported-${Date.now()}-${i}`,
            name: values[0] || `Pasta ${i}`,
            color: values[1] || 'bg-blue-600',
            textColor: 'text-white',
            path: values[2] || '',
            responsible: values[3] || '',
            tags: values[4] ? values[4].split(';') : [],
            createdAt: new Date().toLocaleDateString('pt-BR'),
            subFolders: [],
            isOpen: false
          };
          folders.push(folder);
        }
        
        setImportText(JSON.stringify(folders, null, 2));
      } else {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleImport = () => {
    if (!validationResult?.isValid) return;
    
    try {
      const folders = JSON.parse(importText);
      // Adicionar IDs únicos se não existirem
      const addUniqueIds = (folderList: any[]): Folder[] => {
        return folderList.map((folder, index) => ({
          ...folder,
          id: folder.id || `imported-${Date.now()}-${index}`,
          createdAt: folder.createdAt || new Date().toLocaleDateString('pt-BR'),
          updatedAt: new Date().toLocaleDateString('pt-BR'),
          color: folder.color || 'bg-blue-600',
          textColor: folder.textColor || 'text-white',
          subFolders: folder.subFolders ? addUniqueIds(folder.subFolders) : [],
          isOpen: false
        }));
      };
      
      const processedFolders = addUniqueIds(folders);
      onImport(processedFolders);
      onClose();
    } catch (error) {
      setValidationResult({ isValid: false, message: 'Erro ao processar dados.' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Importar Estrutura de Pastas
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Faça upload de um arquivo JSON ou CSV, ou cole o conteúdo diretamente
        </p>
      </div>

      {/* Upload de Arquivo */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept=".json,.csv"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <FileText className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Clique para fazer upload
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            JSON ou CSV (máx. 10MB)
          </span>
        </label>
      </div>

      <div className="text-center text-gray-500 dark:text-gray-400">ou</div>

      {/* Área de Texto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cole o JSON aqui:
        </label>
        <textarea
          value={importText}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Exemplo de estrutura JSON:
[
  {
    "name": "Projeto A",
    "color": "bg-blue-600",
    "responsible": "João Silva",
    "tags": ["desenvolvimento", "urgente"],
    "subFolders": [
      {
        "name": "Documentação",
        "color": "bg-green-600"
      }
    ]
  }
]`}
        />
      </div>

      {/* Status de Validação */}
      {isValidating && (
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm">Validando estrutura...</span>
        </div>
      )}

      {validationResult && (
        <div className={`flex items-start space-x-2 p-3 rounded-lg ${
          validationResult.isValid 
            ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-100' 
            : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-100'
        }`}>
          {validationResult.isValid ? (
            <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          )}
          <span className="text-sm">{validationResult.message}</span>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleImport}
          disabled={!validationResult?.isValid}
          className={`px-4 py-2 rounded-lg transition-colors ${
            validationResult?.isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          Importar {validationResult?.folderCount ? `(${validationResult.folderCount} pastas)` : ''}
        </button>
      </div>
    </div>
  );
}; 