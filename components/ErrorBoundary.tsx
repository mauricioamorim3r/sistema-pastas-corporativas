import { Component, ErrorInfo, ReactNode } from 'react';
import { captureError } from '../sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimer: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Salvar informações do erro
    this.setState({ errorInfo });

    // Enviar erro para o Sentry
    captureError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      retryCount: this.state.retryCount
    });

    console.error('ErrorBoundary capturou um erro:', error, errorInfo);

    // Auto-retry para erros de hooks (máximo 2 tentativas)
    if (this.state.retryCount < 2 && this.isHookError(error)) {
      console.log(`Tentativa de auto-recovery ${this.state.retryCount + 1}/2`);
      this.retryTimer = setTimeout(() => {
        this.setState(prevState => ({ 
          hasError: false, 
          error: undefined,
          errorInfo: undefined,
          retryCount: prevState.retryCount + 1 
        }));
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  private isHookError(error: Error): boolean {
    const hookErrorMessages = [
      'invalid hook call',
      'hooks can only be called inside',
      'rendered more hooks than during the previous render',
      'rendered fewer hooks than expected'
    ];
    
    return hookErrorMessages.some(message => 
      error.message?.toLowerCase().includes(message)
    );
  }

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined,
      errorInfo: undefined,
      retryCount: 0 
    });
  };

  private handleReload = () => {
    // Limpar localStorage potencialmente corrompido
    try {
      const keysToKeep = ['theme', 'appTitle', 'appLogo', 'folderNavigatorTitle'];
      const backup: Record<string, string> = {};
      
      keysToKeep.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) backup[key] = value;
      });
      
      localStorage.clear();
      
      Object.entries(backup).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    } catch (error) {
      console.warn('Erro ao limpar localStorage:', error);
    }
    
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isHookError = this.state.error && this.isHookError(this.state.error);
      const canRetry = this.state.retryCount < 3;

      // Fallback UI customizado ou padrão
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {isHookError ? 'Erro de Componente React' : 'Oops! Algo deu errado'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isHookError 
                ? 'Detectamos um problema com os componentes React. Tentando recuperar automaticamente...'
                : 'Ocorreu um erro inesperado. Nossa equipe foi notificada automaticamente.'
              }
            </p>
            {this.state.retryCount > 0 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
                Tentativas de recuperação: {this.state.retryCount}/2
              </p>
            )}
            <div className="space-y-2">
              <button
                onClick={this.handleReload}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recarregar Página
              </button>
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Tentar Novamente
                </button>
              )}
            </div>
            {import.meta.env.MODE === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                  Detalhes do Erro (Desenvolvimento)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                  <strong>Erro:</strong> {this.state.error.message}
                  {'\n\n'}
                  <strong>Stack:</strong>
                  {'\n'}
                  {this.state.error.stack}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {'\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 