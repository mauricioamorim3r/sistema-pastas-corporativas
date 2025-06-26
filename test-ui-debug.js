// Script de Debug para UI/CSS
// Execute no console do navegador para debugar problemas visuais

window.debugUI = {
  // Verificar todos os elementos com position fixed
  checkFixedElements() {
    console.log('🔍 Verificando elementos com position: fixed...');
    
    const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
      return window.getComputedStyle(el).position === 'fixed';
    });
    
    console.log(`📌 Encontrados ${fixedElements.length} elementos fixos:`);
    
    fixedElements.forEach((el, index) => {
      const style = window.getComputedStyle(el);
      console.log(`  ${index + 1}. ${el.tagName}:`, {
        element: el,
        zIndex: style.zIndex,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        width: style.width,
        height: style.height,
        top: style.top,
        right: style.right,
        classes: el.className
      });
    });
  },

  // Verificar especificamente o painel de favoritos
  checkFavoritesPanel() {
    console.log('⭐ Verificando painel de favoritos...');
    
    // Buscar por diferentes seletores possíveis
    const selectors = [
      '.fixed.inset-y-0.right-0',
      '[class*="fixed"][class*="right-0"]',
      'div[class*="w-80"][class*="bg-white"]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      console.log(`🔍 Seletor "${selector}": ${elements.length} elementos`);
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        console.log('  - Elemento:', {
          element: el,
          visible: style.display !== 'none' && style.visibility !== 'hidden',
          zIndex: style.zIndex,
          classes: el.className
        });
      });
    });
  },

  // Verificar React DevTools se disponível
  checkReactState() {
    console.log('⚛️ Verificando estado React...');
    
    try {
      // Tentar acessar React DevTools
      if (window.React) {
        console.log('✅ React detectado');
      }
      
      // Buscar componentes React na página
      const reactElements = Array.from(document.querySelectorAll('[data-reactroot], [data-reactid]'));
      console.log(`📦 Elementos React encontrados: ${reactElements.length}`);
      
    } catch (error) {
      console.log('❌ Erro ao verificar React:', error);
    }
  },

  // Simular clique no botão de favoritos
  clickFavoritesButton() {
    console.log('🖱️ Tentando clicar no botão de favoritos...');
    
    const button = document.querySelector('button[title="Favoritos"]');
    if (button) {
      console.log('✅ Botão encontrado:', button);
      
      // Verificar se o botão é visível
      const rect = button.getBoundingClientRect();
      const style = window.getComputedStyle(button);
      
      console.log('📏 Posição do botão:', {
        visible: rect.width > 0 && rect.height > 0,
        clickable: style.pointerEvents !== 'none',
        rect,
        style: {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity
        }
      });
      
      // Simular clique
      button.click();
      console.log('🖱️ Clique simulado!');
      
      // Verificar após clique
      setTimeout(() => {
        this.checkFavoritesPanel();
      }, 100);
      
    } else {
      console.log('❌ Botão não encontrado');
    }
  },

  // Forçar visibilidade do painel (hack para teste)
  forceShowPanel() {
    console.log('🔧 Forçando visibilidade do painel...');
    
    // Criar painel de teste se não existir
    let panel = document.querySelector('.fixed.inset-y-0.right-0');
    
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'fixed inset-y-0 right-0 w-80 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col';
      panel.innerHTML = `
        <div class="p-4 border-b">
          <h2 class="text-lg font-medium">Painel de Teste</h2>
        </div>
        <div class="p-4">
          <p>Este é um painel de teste para verificar se o CSS está funcionando.</p>
        </div>
      `;
      document.body.appendChild(panel);
      console.log('✅ Painel de teste criado!');
    } else {
      // Garantir que está visível
      panel.style.display = 'flex';
      panel.style.visibility = 'visible';
      panel.style.opacity = '1';
      panel.style.zIndex = '9999';
      console.log('✅ Painel existente forçado a ser visível!');
    }
  },

  // Debug completo
  fullDebug() {
    console.log('🚀 Iniciando debug completo da UI...');
    console.log('='.repeat(60));
    
    this.checkFixedElements();
    console.log('');
    this.checkFavoritesPanel();
    console.log('');
    this.checkReactState();
    
    console.log('');
    console.log('📋 Comandos de teste disponíveis:');
    console.log('- debugUI.clickFavoritesButton() - Clica no botão');
    console.log('- debugUI.forceShowPanel() - Força exibição do painel');
    console.log('='.repeat(60));
  }
};

console.log('🛠️ Debug UI carregado!');
console.log('💡 Execute: debugUI.fullDebug() para começar'); 