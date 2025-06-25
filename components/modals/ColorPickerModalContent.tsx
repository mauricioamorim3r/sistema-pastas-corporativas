import React from 'react';
import { Palette } from 'lucide-react';
import { ColorOption } from '../../types';
import { AVAILABLE_COLORS } from '../../constants';

interface ColorPickerModalContentProps {
  onSelectColor: (colorValue: string, textColorValue?: string) => void;
  onClose: () => void;
}

const ColorPickerModalContent: React.FC<ColorPickerModalContentProps> = ({ onSelectColor, onClose }) => {
  // Organizar cores por grupos para melhor visualização
  const colorGroups = [
    { title: 'Azuis', colors: AVAILABLE_COLORS.filter(c => c.name.includes('Azul') || c.name.includes('Céu') || c.name.includes('Marinho')) },
    { title: 'Vermelhos', colors: AVAILABLE_COLORS.filter(c => c.name.includes('Vermelho') || c.name.includes('Vinho') || c.name.includes('Bordô') || c.name.includes('Coral')) },
    { title: 'Verdes', colors: AVAILABLE_COLORS.filter(c => c.name.includes('Verde') || c.name.includes('Esmeralda') || c.name.includes('Turquesa') || c.name.includes('Menta') || c.name.includes('Petróleo')) },
    { title: 'Amarelos/Laranjas', colors: AVAILABLE_COLORS.filter(c => c.name.includes('Amarelo') || c.name.includes('Laranja') || c.name.includes('Ouro') || c.name.includes('Bronze') || c.name.includes('Cobre') || c.name.includes('Dourado') || c.name.includes('Mostarda') || c.name.includes('Pêssego')) },
    { title: 'Roxos/Rosas', colors: AVAILABLE_COLORS.filter(c => c.name.includes('Roxo') || c.name.includes('Rosa') || c.name.includes('Violeta') || c.name.includes('Índigo') || c.name.includes('Magenta') || c.name.includes('Lavanda')) },
    { title: 'Cianos', colors: AVAILABLE_COLORS.filter(c => c.name.includes('Ciano') || c.name.includes('Aqua')) },
    { title: 'Cinzas/Neutros', colors: AVAILABLE_COLORS.filter(c => c.name.includes('Cinza') || c.name.includes('Prateado') || c.name.includes('Acinzentado') || c.name.includes('Ardósia') || c.name.includes('Zinco') || c.name.includes('Neutro') || c.name.includes('Pedra')) },
  ];

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      {colorGroups.map((group) => (
        group.colors.length > 0 && (
          <div key={group.title} className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {group.title}
            </h3>
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
              {group.colors.map((color: ColorOption) => (
                <button
                  key={color.value}
                  className={`${color.value} h-10 w-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-all duration-200 ring-2 ring-transparent hover:ring-offset-2 hover:ring-gray-400 dark:hover:ring-gray-500 hover:scale-105 shadow-sm hover:shadow-md`}
                  onClick={() => onSelectColor(color.value, color.textClass)}
                  title={color.name}
                  aria-label={`Selecionar cor ${color.name}`}
                >
                  <Palette size={20} className={color.textClass || 'text-white'} />
                </button>
              ))}
            </div>
          </div>
        )
      ))}
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {AVAILABLE_COLORS.length} cores disponíveis
        </span>
        <button
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ColorPickerModalContent;
