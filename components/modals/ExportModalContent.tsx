import React, { useState } from 'react';
import { Save, Copy, Download, Folder, FolderOpen, Play, AlertCircle, Check } from 'lucide-react';
import { 
  createPhysicalFolders, 
  downloadFolderScript, 
  isFileSystemAccessSupported,
  countFolders,
  generateFolderPreview 
} from '../../utils/folderExporter';
import { Folder as FolderType } from '../../types';

interface ExportModalContentProps {
  jsonString: string;
  folders: FolderType[]; // Adicionar estrutura de pastas
  onGenerateJson: () => void;
  onCopyToClipboard: () => void;
  onDownloadFile: () => void;
  onClose: () => void;
}

const ExportModalContent: React.FC<ExportModalContentProps> = ({
  jsonString,
  folders,
  onGenerateJson,
  onCopyToClipboard,
  onDownloadFile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'folders'>('json');
  const [isCreating, setIsCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const folderCount = countFolders(folders);
  const folderPreview = generateFolderPreview(folders);
  const isAPISupported = isFileSystemAccessSupported();

  const handleCreatePhysicalFolders = async () => {
    if (!folders.length) {
      setErrorMessage('Nenhuma pasta disponível para exportar');
      setCreateStatus('error');
      return;
    }

    setIsCreating(true);
    setCreateStatus('idle');
    setErrorMessage('');

    try {
      await createPhysicalFolders(folders);
      setCreateStatus('success');
      setTimeout(() => setCreateStatus('idle'), 3000);
    } catch (error: any) {
      setCreateStatus('error');
      if (error.name === 'AbortError') {
        setErrorMessage('Operação cancelada pelo usuário');
      } else if (error.message.includes('não suportada')) {
        setErrorMessage('Seu navegador não suporta esta funcionalidade. Use o download do script.');
      } else {
        setErrorMessage(`Erro ao criar pastas: ${error.message}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadScript = () => {
    if (!folders.length) {
      setErrorMessage('Nenhuma pasta disponível para exportar');
      setCreateStatus('error');
      return;
    }

    try {
      downloadFolderScript(folders);
      setCreateStatus('success');
      setTimeout(() => setCreateStatus('idle'), 2000);
    } catch (error: any) {
      setCreateStatus('error');
      setErrorMessage(`Erro ao gerar script: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('json')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'json'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📄 Exportar JSON
        </button>
        <button
          onClick={() => setActiveTab('folders')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'folders'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📁 Criar Pastas Físicas
        </button>
      </div>

      {/* Conteúdo da aba JSON */}
      {activeTab === 'json' && (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            A estrutura de pastas é apresentada abaixo em formato JSON.
            Você pode copiar o texto ou baixar o arquivo .json.
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1" htmlFor="jsonOutput">
              Estrutura em JSON
            </label>
            <textarea
              id="jsonOutput"
              readOnly
              value={jsonString || "Nenhuma estrutura para exibir."}
              className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none text-xs font-mono dark:text-gray-200"
              placeholder="A estrutura JSON aparecerá aqui..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <button
              type="button"
              onClick={onCopyToClipboard}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-800 dark:hover:text-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!jsonString}
            >
              <Copy size={16} className="mr-2" />
              Copiar JSON
            </button>
            <button
              type="button"
              onClick={onDownloadFile}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!jsonString}
            >
              <Download size={16} className="mr-2" />
              Baixar .json
            </button>
          </div>
        </>
      )}

      {/* Conteúdo da aba Criar Pastas Físicas */}
      {activeTab === 'folders' && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Estrutura de Pastas
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {folderCount} {folderCount === 1 ? 'pasta' : 'pastas'}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Crie a estrutura de pastas físicas no seu computador. As pastas serão criadas vazias, 
              apenas com a estrutura organizacional.
            </p>
          </div>

          {/* Preview da estrutura */}
          {folders.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">
                Preview da Estrutura
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 border border-gray-200 dark:border-gray-600 max-h-48 overflow-y-auto">
                <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {folderPreview}
                </pre>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {createStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md flex items-center">
              <Check size={16} className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
              <span className="text-green-800 dark:text-green-200 text-sm">
                {activeTab === 'folders' ? 'Estrutura de pastas criada com sucesso!' : 'Script baixado com sucesso!'}
              </span>
            </div>
          )}

          {createStatus === 'error' && errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md flex items-start">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-red-800 dark:text-red-200 text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex flex-col gap-3 mb-6">
            {/* Botão para criar pastas diretamente */}
            {isAPISupported && (
              <button
                type="button"
                onClick={handleCreatePhysicalFolders}
                disabled={isCreating || !folders.length}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Criando pastas...
                  </>
                ) : (
                  <>
                    <FolderOpen size={18} className="mr-2" />
                    Criar Pastas Agora
                  </>
                )}
              </button>
            )}

            {/* Botão para baixar script */}
            <button
              type="button"
              onClick={handleDownloadScript}
              disabled={!folders.length}
              className="flex items-center justify-center px-4 py-3 border border-green-500 text-green-600 rounded-md hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} className="mr-2" />
              Baixar Script {navigator.platform.toLowerCase().includes('win') ? '(.bat)' : '(.sh)'}
            </button>

            {!isAPISupported && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
                <div className="flex items-start">
                  <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <p className="font-medium">Criação direta não suportada</p>
                    <p>Use o botão "Baixar Script" e execute o arquivo baixado para criar as pastas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Como usar:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              {isAPISupported ? (
                <>
                  <li>• <strong>Criar Pastas Agora:</strong> Escolha uma pasta e crie a estrutura imediatamente</li>
                  <li>• <strong>Baixar Script:</strong> Baixe um arquivo que pode ser executado posteriormente</li>
                </>
              ) : (
                <>
                  <li>• Clique em "Baixar Script" para baixar o arquivo</li>
                  <li>• Navegue até onde quer criar as pastas</li>
                  <li>• Execute o arquivo baixado (duplo clique)</li>
                </>
              )}
              <li>• As pastas serão criadas vazias, apenas com a estrutura organizacional</li>
            </ul>
          </div>
        </>
      )}

      {/* Botões do footer */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          onClick={onClose}
        >
          Fechar
        </button>
        {activeTab === 'json' && (
          <button
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center"
            onClick={onGenerateJson}
          >
            <Save size={18} className="mr-2" />
            Atualizar JSON
          </button>
        )}
      </div>
    </div>
  );
};

export default ExportModalContent;
