// Sistema de Logging Seguro
import { captureMessage, captureError } from '../sentry';

class SecureLogger {
  private isProduction = import.meta.env.MODE === 'production';
  private sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'dsn', 'api_key',
    'authorization', 'bearer', 'cookie', 'session'
  ];

  /**
   * Sanitiza dados removendo informações sensíveis
   */
  private sanitizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const keyLower = key.toLowerCase();
      
      // Verificar se é uma chave sensível
      if (this.sensitiveKeys.some(sensitive => keyLower.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Log debug - apenas em desenvolvimento
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.isProduction) return;

    const sanitizedContext = context ? this.sanitizeData(context) : undefined;
    console.debug(`🐛 [DEBUG] ${message}`, sanitizedContext);
  }

  /**
   * Log info - limitado em produção
   */
  info(message: string, context?: Record<string, any>): void {
    const sanitizedContext = context ? this.sanitizeData(context) : undefined;
    
    if (this.isProduction) {
      // Em produção, enviar apenas para Sentry sem console
      captureMessage(message, 'info');
    } else {
      console.info(`ℹ️ [INFO] ${message}`, sanitizedContext);
    }
  }

  /**
   * Log warning - sempre registrado
   */
  warn(message: string, context?: Record<string, any>): void {
    const sanitizedContext = context ? this.sanitizeData(context) : undefined;
    
    captureMessage(message, 'warning');
    
    if (!this.isProduction) {
      console.warn(`⚠️ [WARN] ${message}`, sanitizedContext);
    }
  }

  /**
   * Log error - sempre registrado
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    const sanitizedContext = context ? this.sanitizeData(context) : undefined;
    
    if (error) {
      captureError(error, sanitizedContext);
    } else {
      captureMessage(message, 'error');
    }
    
    if (!this.isProduction) {
      console.error(`❌ [ERROR] ${message}`, error, sanitizedContext);
    }
  }

  /**
   * Log de operação crítica - sempre auditado
   */
  audit(operation: string, context?: Record<string, any>): void {
    const auditLog = {
      operation,
      timestamp: new Date().toISOString(),
      context: this.sanitizeData(context || {}),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };

    // Sempre enviar para Sentry para auditoria
    captureMessage(`AUDIT: ${operation}`, 'info');
    
    if (!this.isProduction) {
      console.log(`📋 [AUDIT] ${operation}`, auditLog);
    }
  }

  /**
   * Log de performance - apenas métricas essenciais em produção
   */
  performance(metric: string, value: number, unit: string = 'ms'): void {
    const perfLog = {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString()
    };

    if (this.isProduction) {
      // Em produção, apenas se for métrica crítica
      if (value > 1000 || metric.includes('error') || metric.includes('slow')) {
        captureMessage(`PERFORMANCE: ${metric} = ${value}${unit}`, 'warning');
      }
    } else {
      console.log(`⚡ [PERF] ${metric}: ${value}${unit}`, perfLog);
    }
  }

  /**
   * Log de segurança - sempre crítico
   */
  security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>): void {
    const securityLog = {
      event,
      severity,
      timestamp: new Date().toISOString(),
      context: this.sanitizeData(context || {})
    };

    // Sempre registrar eventos de segurança
    captureMessage(`SECURITY: ${severity.toUpperCase()} - ${event}`, 'error');
    
    if (!this.isProduction) {
      console.error(`🛡️ [SECURITY] ${severity.toUpperCase()}: ${event}`, securityLog);
    }
  }

  /**
   * Criar logger com contexto específico
   */
  createContextLogger(defaultContext: Record<string, any>) {
    return {
      debug: (message: string, context?: Record<string, any>) => 
        this.debug(message, { ...defaultContext, ...context }),
      info: (message: string, context?: Record<string, any>) => 
        this.info(message, { ...defaultContext, ...context }),
      warn: (message: string, context?: Record<string, any>) => 
        this.warn(message, { ...defaultContext, ...context }),
      error: (message: string, error?: Error, context?: Record<string, any>) => 
        this.error(message, error, { ...defaultContext, ...context }),
      audit: (operation: string, context?: Record<string, any>) => 
        this.audit(operation, { ...defaultContext, ...context })
    };
  }
}

// Singleton instance
const logger = new SecureLogger();

// Hook para componentes React
export const useSecureLogger = (componentName: string) => {
  return logger.createContextLogger({ component: componentName });
};

export { logger };
export default logger; 