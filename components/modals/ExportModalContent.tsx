import React, { useState } from 'react';
import { Save, Copy, Download, FolderOpen, AlertCircle, Check } from 'lucide-react';
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
      <div className="flex p-1 mb-4 bg-gray-100 rounded-lg dark:bg-gray-700">
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
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            A estrutura de pastas é apresentada abaixo em formato JSON.
            Você pode copiar o texto ou baixar o arquivo .json.
          </p>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="jsonOutput">
              Estrutura em JSON
            </label>
            <textarea
              id="jsonOutput"
              readOnly
              value={jsonString || "Nenhuma estrutura para exibir."}
              className="px-3 py-2 w-full h-48 font-mono text-xs bg-gray-50 rounded-md border border-gray-300 border-solid dark:border-gray-600 dark:bg-gray-700 focus:outline-none dark:text-gray-200"
              placeholder="A estrutura JSON aparecerá aqui..."
            />
          </div>
          
          <div className="flex flex-col gap-2 mb-6 sm:flex-row">
            <button
              type="button"
              onClick={onCopyToClipboard}
              className="flex flex-1 justify-center items-center px-4 py-2 text-blue-600 rounded-md border border-blue-500 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-800 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!jsonString}
            >
              <Copy size={16} className="mr-2" />
              Copiar JSON
            </button>
            <button
              type="button"
              onClick={onDownloadFile}
              className="flex flex-1 justify-center items-center px-4 py-2 text-green-600 rounded-md border border-green-500 border-solid transition-colors hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Estrutura de Pastas
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {folderCount} {folderCount === 1 ? 'pasta' : 'pastas'}
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Crie a estrutura de pastas físicas no seu computador. As pastas serão criadas vazias, 
              apenas com a estrutura organizacional.
            </p>
          </div>

          {/* Preview da estrutura */}
          {folders.length > 0 && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Preview da Estrutura
              </label>
              <div className="overflow-y-auto p-4 max-h-48 bg-gray-50 rounded-md border border-gray-200 border-solid dark:bg-gray-700 dark:border-gray-600">
                <pre className="font-mono text-xs text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                  {folderPreview}
                </pre>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {createStatus === 'success' && (
            <div className="flex items-center p-3 mb-4 bg-green-50 rounded-md border border-green-200 border-solid dark:bg-green-900 dark:border-green-700">
              <Check size={16} className="flex-shrink-0 mr-2 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-800 dark:text-green-200">
                {activeTab === 'folders' ? 'Estrutura de pastas criada com sucesso!' : 'Script baixado com sucesso!'}
              </span>
            </div>
          )}

          {createStatus === 'error' && errorMessage && (
            <div className="flex items-start p-3 mb-4 bg-red-50 rounded-md border border-red-200 dark:bg-red-900 dark:border-red-700">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 dark:text-red-200">{errorMessage}</span>
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
                className="flex justify-center items-center px-4 py-3 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isCreating ? (
                  <>
                    <div className="mr-2 w-4 h-4 rounded-full border-2 border-white border-solid animate-spin border-t-transparent"></div>
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
              className="flex justify-center items-center px-4 py-3 text-green-600 rounded-md border border-green-500 border-solid transition-colors hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-800 dark:hover:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} className="mr-2" />
              Baixar Script {navigator.platform.toLowerCase().includes('win') ? '(.bat)' : '(.sh)'}
            </button>

            {!isAPISupported && (
              <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 border-solid dark:bg-yellow-900 dark:border-yellow-700">
                <div className="flex items-start">
                  <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium">Criação direta não suportada</p>
                    <p>Use o botão "Baixar Script" e execute o arquivo baixado para criar as pastas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instruções */}
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200 dark:bg-blue-900 dark:border-blue-700">
            <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-200">Como usar:</h4>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
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
      <div className="flex flex-col justify-end mt-6 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          onClick={onClose}
        >
          Fechar
        </button>
        {activeTab === 'json' && (
          <button
            type="button"
            className="flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-md transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
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
