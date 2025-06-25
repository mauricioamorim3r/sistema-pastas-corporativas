import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN || 'https://example@sentry.io/project-id', // Substitua pela sua DSN real
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