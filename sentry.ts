import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN || 'https://d0cac82f42420082174958c96f05e409@o4509531701706752.ingest.us.sentry.io/4509532509241344', // DSN do Sistema Pastas Corporativas
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Em desenvolvimento, mostra erros no console também
      if (process.env.NODE_ENV === 'development') {
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