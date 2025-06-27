import * as Sentry from '@sentry/react';

export const initSentry = () => {
  // Validar se DSN está configurado corretamente
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!sentryDsn) {
    console.warn('⚠️ SENTRY_DSN não configurado. Monitoramento de erros desabilitado.');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0, // Reduzir sampling em produção
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