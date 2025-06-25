
import React from 'react';
import { Save, Copy, Download } from 'lucide-react';

interface ExportModalContentProps {
  jsonString: string;
  onGenerateJson: () => void; // Called when "Atualizar JSON" is clicked
  onCopyToClipboard: () => void;
  onDownloadFile: () => void;
  onClose: () => void;
}

const ExportModalContent: React.FC<ExportModalContentProps> = ({
  jsonString,
  onGenerateJson,
  onCopyToClipboard,
  onDownloadFile,
  onClose,
}) => {
  return (
    <div>
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

      <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          onClick={onClose}
        >
          Fechar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center"
          onClick={onGenerateJson}
        >
          <Save size={18} className="mr-2" />
          Atualizar JSON
        </button>
      </div>
    </div>
  );
};

export default ExportModalContent;
