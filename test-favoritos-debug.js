// Script de Debug para Sistema de Favoritos
// Execute no console do navegador: 
// 1. Cole este código
// 2. Execute: testFavoritos.debug()

window.testFavoritos = {
  // Função para testar o localStorage dos favoritos
  debugLocalStorage() {
    console.log('🔍 DEBUG: Testando localStorage dos favoritos...');
    
    const saved = localStorage.getItem('favorite-folders');
    console.log('📂 LocalStorage content:', saved);
    
    if (saved) {
      try {
        const favorites = JSON.parse(saved);
        console.log('⭐ Favoritos encontrados:', favorites.length);
        favorites.forEach((fav, index) => {
          console.log(`  ${index + 1}. ${fav.name} (ID: ${fav.originalFolderId})`);
        });
      } catch (error) {
        console.error('❌ Erro ao parsear JSON:', error);
      }
    } else {
      console.log('📂 Nenhum favorito encontrado no localStorage');
    }
  },

  // Função para verificar se o painel está visível
  debugPanelVisibility() {
    console.log('🔍 DEBUG: Verificando visibilidade do painel...');
    
    const panel = document.querySelector('[class*="fixed inset-y-0 right-0"]');
    if (panel) {
      console.log('✅ Painel encontrado no DOM');
      console.log('👁️ Visível:', !panel.classList.contains('hidden'));
      console.log('📏 Z-index:', window.getComputedStyle(panel).zIndex);
      console.log('📐 Width:', window.getComputedStyle(panel).width);
    } else {
      console.log('❌ Painel não encontrado no DOM');
    }
  },

  // Função para verificar se o botão está funcionando
  debugButton() {
    console.log('🔍 DEBUG: Verificando botão de favoritos...');
    
    const buttons = document.querySelectorAll('button[title="Favoritos"]');
    console.log('🔘 Botões encontrados:', buttons.length);
    
    buttons.forEach((btn, index) => {
      console.log(`  Botão ${index + 1}:`, btn);
      console.log(`  - Clicável:`, !btn.disabled);
      console.log(`  - Evento click:`, btn.onclick ? 'Sim' : 'Não');
    });
  },

  // Função para simular um clique no botão
  simulateClick() {
    console.log('🔍 DEBUG: Simulando clique no botão...');
    
    const button = document.querySelector('button[title="Favoritos"]');
    if (button) {
      console.log('✅ Botão encontrado, simulando clique...');
      button.click();
      
      setTimeout(() => {
        this.debugPanelVisibility();
      }, 100);
    } else {
      console.log('❌ Botão não encontrado');
    }
  },

  // Função para adicionar um favorito de teste
  addTestFavorite() {
    console.log('🔍 DEBUG: Adicionando favorito de teste...');
    
    const testFavorite = {
      id: `fav-test-${Date.now()}`,
      name: 'Pasta Teste Favorito',
      path: 'C:\\Teste\\Favorito',
      color: 'bg-blue-500',
      textColor: 'text-white',
      responsible: 'Usuário Teste',
      addedAt: new Date().toLocaleDateString('pt-BR'),
      originalFolderId: 'test-folder-id'
    };
    
    const existing = localStorage.getItem('favorite-folders');
    const favorites = existing ? JSON.parse(existing) : [];
    favorites.push(testFavorite);
    
    localStorage.setItem('favorite-folders', JSON.stringify(favorites));
    console.log('✅ Favorito de teste adicionado!');
    
    // Força recarregamento dos favoritos
    window.location.reload();
  },

  // Função para limpar todos os favoritos
  clearFavorites() {
    console.log('🔍 DEBUG: Limpando todos os favoritos...');
    localStorage.removeItem('favorite-folders');
    console.log('✅ Favoritos limpos!');
    window.location.reload();
  },

  // Função principal de debug
  debug() {
    console.log('🚀 Iniciando debug completo do sistema de favoritos...');
    console.log('='.repeat(50));
    
    this.debugLocalStorage();
    console.log('');
    this.debugButton();
    console.log('');
    this.debugPanelVisibility();
    
    console.log('');
    console.log('📋 Comandos disponíveis:');
    console.log('- testFavoritos.addTestFavorite() - Adiciona favorito de teste');
    console.log('- testFavoritos.clearFavorites() - Limpa todos favoritos');
    console.log('- testFavoritos.simulateClick() - Simula clique no botão');
    console.log('='.repeat(50));
  }
};

console.log('✅ Script de debug carregado!');
console.log('💡 Execute: testFavoritos.debug() para começar'); 