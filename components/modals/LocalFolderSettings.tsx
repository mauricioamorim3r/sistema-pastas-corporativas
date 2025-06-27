import React, { useState, useEffect } from 'react';
import { FolderOpen, CheckCircle, AlertCircle, Info, HardDrive } from 'lucide-react';
import { localFolderManager, LocalStorageConfig } from '../../utils/localFolderManager';

interface LocalFolderSettingsProps {
  onConfigChange?: (config: LocalStorageConfig) => void;
}

export const LocalFolderSettings: React.FC<LocalFolderSettingsProps> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<LocalStorageConfig>(localFolderManager.getConfig());
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Atualizar config quando mudar
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitStatus('idle');
    setStatusMessage('');

    try {
      const success = await localFolderManager.initialize();
      
      if (success) {
        setInitStatus('success');
        setStatusMessage('Sistema de pasta local ativado com sucesso! Os arquivos serão salvos em uma pasta dedicada.');
        const newConfig = localFolderManager.getConfig();
        setConfig(newConfig);
      } else {
        setInitStatus('error');
        setStatusMessage('Não foi possível ativar o sistema. Verifique se seu navegador suporta File System Access API.');
      }
    } catch (error: any) {
      setInitStatus('error');
      if (error.name === 'AbortError') {
        setStatusMessage('Operação cancelada pelo usuário.');
      } else {
        setStatusMessage(`Erro ao configurar pasta local: ${error.message}`);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const handleDisable = () => {
    if (confirm('Tem certeza que deseja desativar o sistema de pasta local? Os arquivos já salvos permanecerão no disco, mas novos uploads não serão salvos automaticamente.')) {
      localFolderManager.disable();
      const newConfig = localFolderManager.getConfig();
      setConfig(newConfig);
      setInitStatus('idle');
      setStatusMessage('');
    }
  };

  const updateConfigValue = (key: keyof LocalStorageConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    localFolderManager.updateConfig(newConfig);
  };

  const isSupported = localFolderManager.isSupported();
  const isInitialized = localFolderManager.isInitialized();

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <HardDrive size={24} className="mr-2 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Sistema de Pasta Local Automática
        </h3>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Ative este sistema para que arquivos carregados na aplicação sejam automaticamente salvos 
          em uma pasta dedicada no seu computador (Documentos/PastasApp).
        </p>

        {/* Verificação de Suporte */}
        <div className="flex items-start p-3 mb-4 rounded-md border">
          {isSupported ? (
            <>
              <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800 dark:text-green-200">Navegador Compatível</p>
                <p className="text-green-700 dark:text-green-300">Seu navegador suporta salvamento direto de arquivos.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800 dark:text-red-200">Navegador Incompatível</p>
                <p className="text-red-700 dark:text-red-300">
                  Use Chrome, Edge ou Opera (versão 86+) para esta funcionalidade.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Área de Configuração */}
      {isSupported && (
        <div className="space-y-4">
          {/* Status Atual */}
          <div className="flex items-center justify-between p-3 bg-white rounded-md border dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${isInitialized ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="font-medium text-gray-900 dark:text-white">
                {isInitialized ? 'Sistema Ativo' : 'Sistema Inativo'}
              </span>
            </div>
            
            {isInitialized ? (
              <button
                onClick={handleDisable}
                className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
              >
                Desativar
              </button>
            ) : (
              <button
                onClick={handleInitialize}
                disabled={isInitializing}
                className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isInitializing ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                    Configurando...
                  </>
                ) : (
                  <>
                    <FolderOpen size={16} className="mr-2" />
                    Ativar Sistema
                  </>
                )}
              </button>
            )}
          </div>

          {/* Mensagem de Status */}
          {initStatus !== 'idle' && statusMessage && (
            <div className={`flex items-start p-3 rounded-md border ${
              initStatus === 'success' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              {initStatus === 'success' ? (
                <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${
                initStatus === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {statusMessage}
              </span>
            </div>
          )}

          {/* Configurações Avançadas */}
          {isInitialized && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Configurações</h4>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.autoCreateSubfolders}
                    onChange={(e) => updateConfigValue('autoCreateSubfolders', e.target.checked)}
                    className="mr-3 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Criar subpastas automaticamente
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.preserveStructure}
                    onChange={(e) => updateConfigValue('preserveStructure', e.target.checked)}
                    className="mr-3 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Preservar estrutura de pastas da aplicação
                  </span>
                </label>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-start">
                  <Info size={16} className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Como funciona:</p>
                    <ul className="space-y-1">
                      <li>• Pasta base criada em: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">Documentos/PastasApp</code></li>
                      <li>• Cada pasta da aplicação gera uma subpasta física</li>
                      <li>• Arquivos são salvos diretamente no sistema</li>
                      <li>• Links são gerados automaticamente para acesso rápido</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 