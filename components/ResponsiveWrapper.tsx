import React, { useState, useEffect } from 'react';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className = ""
}) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Definir breakpoints responsivos
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  return (
    <div 
      className={`${className} ${isMobile ? 'mobile-layout' : isTablet ? 'tablet-layout' : 'desktop-layout'}`}
      data-screen-size={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
      style={{
        '--screen-width': `${windowSize.width}px`,
        '--screen-height': `${windowSize.height}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}; 