// Sistema de Rate Limiting para Uploads e Operações Críticas
import { captureMessage } from '../sentry';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitRecord> = new Map();
  
  // Configurações padrão para diferentes tipos de operação
  private configs: Record<string, RateLimitConfig> = {
    upload: {
      maxRequests: 10, // 10 uploads por minuto
      windowMs: 60 * 1000,
      identifier: 'upload'
    },
    folderOperation: {
      maxRequests: 50, // 50 operações de pasta por minuto  
      windowMs: 60 * 1000,
      identifier: 'folder'
    },
    exportOperation: {
      maxRequests: 5, // 5 exports por 5 minutos
      windowMs: 5 * 60 * 1000,
      identifier: 'export'
    },
    importOperation: {
      maxRequests: 3, // 3 imports por 10 minutos
      windowMs: 10 * 60 * 1000,
      identifier: 'import'
    }
  };

  /**
   * Verifica se a operação está dentro do limite
   */
  checkLimit(operation: keyof typeof this.configs, userIp?: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  } {
    const config = this.configs[operation];
    if (!config) {
      return { allowed: true, remaining: 999, resetTime: Date.now() };
    }

    // Usar IP do usuário ou fallback para identificador da operação
    const key = userIp ? `${config.identifier}:${userIp}` : config.identifier;
    const now = Date.now();
    
    // Buscar ou criar registro
    let record = this.limits.get(key);
    
    // Se não existe ou a janela de tempo expirou, reset
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }

    // Verificar se excedeu limite
    if (record.count >= config.maxRequests) {
      const timeToReset = Math.ceil((record.resetTime - now) / 1000);
      
      // Log para monitoramento
      captureMessage(`Rate limit excedido para ${operation}`, 'warning');
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        message: `Limite excedido. Aguarde ${timeToReset}s para tentar novamente.`
      };
    }

    // Incrementar contador e salvar
    record.count++;
    this.limits.set(key, record);

    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  /**
   * Reset manual de um limite específico (para testes ou admin)
   */
  resetLimit(operation: keyof typeof this.configs, userIp?: string): void {
    const config = this.configs[operation];
    if (!config) return;

    const key = userIp ? `${config.identifier}:${userIp}` : config.identifier;
    this.limits.delete(key);
  }

  /**
   * Cleanup de registros expirados (executar periodicamente)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.limits.entries()) {
      if (now > record.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  /**
   * Obter estatísticas de uso
   */
  getStats(): Record<string, { active: number; total: number }> {
    const stats: Record<string, { active: number; total: number }> = {};
    
    for (const [operation, config] of Object.entries(this.configs)) {
      const prefix = `${config.identifier}:`;
      const activeCount = Array.from(this.limits.keys())
        .filter(key => key.startsWith(prefix))
        .length;
        
      stats[operation] = {
        active: activeCount,
        total: config.maxRequests
      };
    }
    
    return stats;
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Cleanup automático a cada 5 minutos
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

export { rateLimiter };

/**
 * Hook para usar rate limiting em componentes React
 */
export const useRateLimit = () => {
  const checkUploadLimit = () => rateLimiter.checkLimit('upload');
  const checkFolderLimit = () => rateLimiter.checkLimit('folderOperation');
  const checkExportLimit = () => rateLimiter.checkLimit('exportOperation');
  const checkImportLimit = () => rateLimiter.checkLimit('importOperation');

  return {
    checkUploadLimit,
    checkFolderLimit,
    checkExportLimit,
    checkImportLimit,
    getStats: () => rateLimiter.getStats()
  };
};

/**
 * Middleware para verificar rate limit antes de operações
 */
export const withRateLimit = <T extends any[]>(
  operation: keyof typeof rateLimiter['configs'],
  fn: (...args: T) => any
) => {
  return (...args: T) => {
    const result = rateLimiter.checkLimit(operation);
    
    if (!result.allowed) {
      throw new Error(result.message || 'Rate limit excedido');
    }
    
    return fn(...args);
  };
}; 