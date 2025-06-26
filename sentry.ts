import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || 'https://d0cac82f42420082174958c96f05e409@o4509531701706752.ingest.us.sentry.io/4509532509241344', // DSN do Sistema Pastas Corporativas
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Em desenvolvimento, mostra erros no console também
      if (import.meta.env.MODE === 'development') {
        console.error('Sentry Error:', event);
      }
      return event;
    },
  });
};

// Helper para capturar erros manualmente
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};

// Helper para capturar mensagens
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
}; 