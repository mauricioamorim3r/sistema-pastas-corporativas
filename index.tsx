import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initSentry } from './sentry';
import { ErrorBoundary } from './components/ErrorBoundary';
import { startHealthMonitoring, detectCommonIssues } from './utils/healthCheck';

// Inicializar Sentry para monitoramento de erros
initSentry();

// Iniciar monitoramento de saúde da aplicação
startHealthMonitoring();

// Detectar problemas comuns
setTimeout(() => {
  const issues = detectCommonIssues();
  if (issues.length > 0) {
    console.warn('Problemas detectados:', issues);
  }
}, 3000);

// Função para aplicar configurações de tamanho e zoom da janela
const applyWindowSettings = () => {
  try {
    // Aplicar zoom 85% para melhor visualização em 1280x1024
    document.body.style.zoom = '85%';
    
    // Alternativa para navegadores que não suportam zoom
    if (!document.body.style.zoom) {
      document.body.style.transform = 'scale(0.85)';
      document.body.style.transformOrigin = '0 0';
      document.body.style.width = '117.6%';
      document.body.style.height = '117.6%';
    }

    // Se estivermos em uma janela popup, ajustar tamanho
    if (window.opener !== null) {
      // Redimensionar para tamanho padrão se necessário
      const targetWidth = 1280;
      const targetHeight = 1024;
      
      if (window.outerWidth !== targetWidth || window.outerHeight !== targetHeight) {
        window.resizeTo(targetWidth, targetHeight);
      }
      
      // Centralizar a janela na tela
      const screenWidth = window.screen.availWidth;
      const screenHeight = window.screen.availHeight;
      const left = (screenWidth - targetWidth) / 2;
      const top = (screenHeight - targetHeight) / 2;
      
      window.moveTo(left, top);
    }
    
  } catch (error) {
    console.warn('Não foi possível aplicar configurações da janela:', error);
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Register Service Worker for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js') // Path relative to where index.html is served
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Verificar se a aplicação deve abrir em nova janela
const shouldOpenInNewWindow = () => {
  const isInPopup = window.opener !== null;
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Não abrir nova janela se:
  // 1. Já estamos em um popup (window.opener existe)
  // 2. Estamos em desenvolvimento local
  // 3. A URL já contém launcher.html (evitar loop)
  const isLauncherPage = window.location.pathname.includes('launcher.html');
  
  return !isInPopup && !isDevelopment && !isLauncherPage;
};

// Abrir em nova janela se necessário
if (shouldOpenInNewWindow()) {
  const newWindow = window.open(
    window.location.href,
    'PastasCorporativas',
    'width=1280,height=1024,scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,location=no,directories=no'
  );
  
  if (newWindow) {
    // Aguardar a janela carregar e aplicar zoom 85%
    newWindow.addEventListener('load', () => {
      try {
        newWindow.document.body.style.zoom = '85%';
        // Alternativa para navegadores que não suportam zoom
        if (!newWindow.document.body.style.zoom) {
          newWindow.document.body.style.transform = 'scale(0.85)';
          newWindow.document.body.style.transformOrigin = '0 0';
          newWindow.document.body.style.width = '117.6%';
          newWindow.document.body.style.height = '117.6%';
        }
      } catch (error) {
        console.warn('Não foi possível aplicar zoom automático:', error);
      }
    });
    
    newWindow.focus();
    // Fechar a janela atual após um breve delay
    setTimeout(() => {
      window.close();
    }, 500);
  }
} else {
  // Renderizar normalmente se já estamos em nova janela ou em desenvolvimento
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  // Aplicar configurações de janela padrão
  applyWindowSettings();
}
