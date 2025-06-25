import { captureMessage } from '../sentry';

interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  checks: {
    localStorage: boolean;
    performance: boolean;
    memory: boolean;
    connectivity: boolean;
  };
  details: {
    localStorage?: string;
    performance?: string;
    memory?: string;
    connectivity?: string;
  };
}

export const performHealthCheck = (): HealthCheckResult => {
  const result: HealthCheckResult = {
    status: 'healthy',
    checks: {
      localStorage: false,
      performance: false,
      memory: false,
      connectivity: false
    },
    details: {}
  };

  // Verificar localStorage
  try {
    localStorage.setItem('health-check', 'test');
    localStorage.removeItem('health-check');
    result.checks.localStorage = true;
  } catch (error) {
    result.checks.localStorage = false;
    result.details.localStorage = 'LocalStorage não disponível';
    result.status = 'error';
  }

  // Verificar performance
  try {
    const loadTime = performance.now();
    result.checks.performance = loadTime < 3000; // Menos de 3 segundos
    if (!result.checks.performance) {
      result.details.performance = `Tempo de carregamento alto: ${loadTime.toFixed(2)}ms`;
      result.status = 'warning';
    }
  } catch (error) {
    result.checks.performance = false;
    result.details.performance = 'API Performance não disponível';
  }

  // Verificar memória (se disponível)
  try {
    // @ts-ignore - performance.memory pode não estar disponível
    const memory = performance.memory;
    if (memory) {
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      result.checks.memory = memoryUsage < 0.8; // Menos de 80%
      if (!result.checks.memory) {
        result.details.memory = `Uso de memória alto: ${(memoryUsage * 100).toFixed(1)}%`;
        result.status = 'warning';
      }
    } else {
      result.checks.memory = true; // Assume OK se não disponível
    }
  } catch (error) {
    result.checks.memory = true; // Assume OK se não disponível
  }

  // Verificar conectividade (simplificado)
  try {
    result.checks.connectivity = navigator.onLine;
    if (!result.checks.connectivity) {
      result.details.connectivity = 'Aplicação offline';
      result.status = 'warning';
    }
  } catch (error) {
    result.checks.connectivity = false;
    result.details.connectivity = 'Não foi possível verificar conectividade';
  }

  // Reportar resultado para o Sentry se houver problemas
  if (result.status !== 'healthy') {
    captureMessage(`Health Check Status: ${result.status}`, 'warning');
  }

  return result;
};

// Executar health check periodicamente
export const startHealthMonitoring = () => {
  // Health check inicial
  setTimeout(() => {
    const initialHealth = performHealthCheck();
    console.log('Health Check Inicial:', initialHealth);
  }, 2000);

  // Health check a cada 5 minutos
  setInterval(() => {
    const health = performHealthCheck();
    if (health.status !== 'healthy') {
      console.warn('Health Check - Problemas detectados:', health);
    }
  }, 5 * 60 * 1000);
};

// Detectar problemas comuns
export const detectCommonIssues = () => {
  const issues: string[] = [];

  // Verificar se há muitos listeners de evento
  const eventTargets = document.querySelectorAll('*');
  if (eventTargets.length > 1000) {
    issues.push('Muitos elementos DOM (possível vazamento de memória)');
  }

  // Verificar localStorage cheio
  try {
    const used = JSON.stringify(localStorage).length;
    const quota = 5 * 1024 * 1024; // ~5MB
    if (used > quota * 0.8) {
      issues.push(`LocalStorage quase cheio: ${(used / 1024).toFixed(1)}KB usado`);
    }
  } catch (error) {
    issues.push('Erro ao verificar localStorage');
  }

  // Verificar se há erros no console
  const originalError = console.error;
  let errorCount = 0;
  console.error = (...args) => {
    errorCount++;
    originalError.apply(console, args);
  };

  // Restaurar após 1 minuto
  setTimeout(() => {
    console.error = originalError;
    if (errorCount > 5) {
      issues.push(`Muitos erros no console: ${errorCount} erro(s)`);
    }
  }, 60000);

  return issues;
}; 