import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { ResizeIndicator } from './ResizeIndicator';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number; // Porcentagem (0-100)
  minLeftWidth?: number; // Porcentagem mínima
  maxLeftWidth?: number; // Porcentagem máxima
  isRightPanelVisible: boolean;
  className?: string;
  onWidthChange?: (leftWidth: number) => void; // Callback para mudanças de largura
}

export interface ResizablePanelsRef {
  setLeftWidth: (width: number) => void;
  getLeftWidth: () => number;
}

export const ResizablePanels = React.forwardRef<ResizablePanelsRef, ResizablePanelsProps>(({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 35,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  isRightPanelVisible,
  className = "",
  onWidthChange,
}, ref) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  // Salvar e restaurar a largura no localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('resizable-panels-left-width');
    if (savedWidth) {
      const width = parseFloat(savedWidth);
      if (width >= minLeftWidth && width <= maxLeftWidth) {
        setLeftWidth(width);
      }
    }
  }, [minLeftWidth, maxLeftWidth]);

  useEffect(() => {
    localStorage.setItem('resizable-panels-left-width', leftWidth.toString());
    onWidthChange?.(leftWidth);
  }, [leftWidth, onWidthChange]);

  // Expor métodos via ref
  React.useImperativeHandle(ref, () => ({
    setLeftWidth: (width: number) => {
      const clampedWidth = Math.min(Math.max(width, minLeftWidth), maxLeftWidth);
      setLeftWidth(clampedWidth);
    },
    getLeftWidth: () => leftWidth,
  }), [leftWidth, minLeftWidth, maxLeftWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Aplicar limites
    const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
    setLeftWidth(clampedWidth);
  }, [minLeftWidth, maxLeftWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    isResizingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset para largura padrão
  const resetWidth = () => {
    setLeftWidth(defaultLeftWidth);
  };

  if (!isRightPanelVisible) {
    return (
      <div className={`flex h-full ${className}`} ref={containerRef}>
        <div className="w-full">
          {leftPanel}
        </div>
      </div>
    );
  }



  return (
    <>
      <div className={`flex h-full ${className}`} ref={containerRef}>
        {/* Painel Esquerdo */}
        <div 
          className="overflow-hidden"
          style={{ width: `${leftWidth}%` }}
        >
          {leftPanel}
        </div>

        {/* Divisor Redimensionável */}
        <div className="relative flex items-center group">
          <div
            className={`
              w-1 h-full bg-gray-300 dark:bg-gray-600 cursor-col-resize
              hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors duration-200
              ${isDragging ? 'bg-blue-500 dark:bg-blue-400' : ''}
            `}
            onMouseDown={handleMouseDown}
          />
          
          {/* Handle visual com ícone */}
          <div 
            className={`
              absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
              bg-gray-400 dark:bg-gray-500 rounded-full p-1
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-col-resize
              ${isDragging ? 'opacity-100' : ''}
            `}
            onMouseDown={handleMouseDown}
            onDoubleClick={resetWidth}
            title="Arraste para redimensionar. Duplo clique para resetar."
          >
            <GripVertical size={12} className="text-white" />
          </div>
        </div>

        {/* Painel Direito */}
        <div 
          className="overflow-hidden"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {rightPanel}
        </div>
      </div>
      
      {/* Indicador de Redimensionamento */}
      <ResizeIndicator 
        isVisible={isDragging}
        leftWidth={leftWidth}
        rightWidth={100 - leftWidth}
      />
    </>
  );
}); 