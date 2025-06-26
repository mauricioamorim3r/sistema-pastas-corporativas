// Script de Teste para Drag & Drop - Execute no Console do Navegador
// Este script simula operações de drag and drop para identificar problemas

console.log('🧪 Iniciando testes de Drag & Drop...');

// Função para contar total de pastas recursivamente
function contarPastasRecursivamente(folders) {
  let total = folders.length;
  folders.forEach(folder => {
    if (folder.subFolders) {
      total += contarPastasRecursivamente(folder.subFolders);
    }
  });
  return total;
}

// Função para listar todos os IDs de pastas
function listarTodosIds(folders, nivel = 0) {
  const ids = [];
  folders.forEach(folder => {
    ids.push({ id: folder.id, name: folder.name, nivel });
    if (folder.subFolders) {
      ids.push(...listarTodosIds(folder.subFolders, nivel + 1));
    }
  });
  return ids;
}

// Teste 1: Verificar estado inicial
function teste1_verificarEstadoInicial() {
  console.log('\n📋 TESTE 1: Verificando estado inicial');
  
  const folders = window.testState?.folders || [];
  const totalPastas = contarPastasRecursivamente(folders);
  const todoIds = listarTodosIds(folders);
  
  console.log(`📊 Total de pastas: ${totalPastas}`);
  console.log('📝 IDs encontrados:', todoIds.map(item => `${item.id} (${item.name})`));
  
  return { totalPastas, todoIds };
}

// Teste 2: Simular reordenação no mesmo nível
function teste2_simularReordenacao(sourceId, targetId) {
  console.log('\n🔄 TESTE 2: Simulando reordenação no mesmo nível');
  console.log(`Source: ${sourceId}, Target: ${targetId}`);
  
  const estadoAntes = teste1_verificarEstadoInicial();
  
  // Simular o processo de reordenação
  console.log('🔄 Simulando remoção...');
  // Aqui seria onde a pasta é removida
  
  console.log('🔄 Simulando inserção...');
  // Aqui seria onde a pasta é inserida novamente
  
  const estadoDepois = teste1_verificarEstadoInicial();
  
  if (estadoAntes.totalPastas !== estadoDepois.totalPastas) {
    console.error('❌ PROBLEMA DETECTADO: Número de pastas mudou!');
    console.error(`Antes: ${estadoAntes.totalPastas}, Depois: ${estadoDepois.totalPastas}`);
    
    // Identificar qual pasta desapareceu
    const idsAntes = estadoAntes.todoIds.map(item => item.id);
    const idsDepois = estadoDepois.todoIds.map(item => item.id);
    
    const pastasDesaparecidas = idsAntes.filter(id => !idsDepois.includes(id));
    const pastasNovas = idsDepois.filter(id => !idsAntes.includes(id));
    
    console.error('🗑️ Pastas desaparecidas:', pastasDesaparecidas);
    console.error('➕ Pastas novas:', pastasNovas);
  } else {
    console.log('✅ TESTE PASSOU: Número de pastas mantido');
  }
}

// Teste 3: Verificar estrutura de dados
function teste3_verificarEstrutura() {
  console.log('\n🏗️ TESTE 3: Verificando estrutura de dados');
  
  const folders = window.testState?.folders || [];
  
  function verificarPastaRecursivamente(folder, caminho = '') {
    const novoCaminho = caminho ? `${caminho} > ${folder.name}` : folder.name;
    
    // Verificar propriedades essenciais
    if (!folder.id) {
      console.error(`❌ Pasta sem ID: ${novoCaminho}`);
    }
    if (!folder.name) {
      console.error(`❌ Pasta sem nome: ${folder.id}`);
    }
    
    // Verificar subpastas
    if (folder.subFolders) {
      if (!Array.isArray(folder.subFolders)) {
        console.error(`❌ subFolders não é array: ${novoCaminho}`);
      } else {
        folder.subFolders.forEach(sub => {
          verificarPastaRecursivamente(sub, novoCaminho);
        });
      }
    }
  }
  
  folders.forEach(folder => {
    verificarPastaRecursivamente(folder);
  });
  
  console.log('✅ Verificação de estrutura concluída');
}

// Teste 4: Simular operação completa de drag & drop
function teste4_simularDragDrop(sourceId, targetId, operacao = 'move') {
  console.log(`\n🎯 TESTE 4: Simulando ${operacao} completo`);
  console.log(`Source: ${sourceId}, Target: ${targetId}`);
  
  const estadoAntes = teste1_verificarEstadoInicial();
  
  try {
    // Aqui seria onde a operação real aconteceria
    console.log('🔄 Executando operação...');
    
    // Simular delay como no sistema real
    setTimeout(() => {
      const estadoDepois = teste1_verificarEstadoInicial();
      
      console.log(`📊 Pastas antes: ${estadoAntes.totalPastas}`);
      console.log(`📊 Pastas depois: ${estadoDepois.totalPastas}`);
      
      if (estadoAntes.totalPastas === estadoDepois.totalPastas) {
        console.log('✅ TESTE PASSOU: Operação manteve integridade');
      } else {
        console.error('❌ TESTE FALHOU: Pastas perdidas durante operação');
      }
    }, 100);
    
  } catch (error) {
    console.error('❌ ERRO durante simulação:', error);
  }
}

// Função principal para executar todos os testes
function executarTodosTestes() {
  console.log('🧪 === BATERIA DE TESTES DRAG & DROP ===');
  
  // Capturar estado atual para testes
  window.testState = {
    folders: [] // Será preenchido dinamicamente
  };
  
  teste1_verificarEstadoInicial();
  teste3_verificarEstrutura();
  
  console.log('\n🎯 Para testar operações específicas, use:');
  console.log('teste2_simularReordenacao("sourceId", "targetId")');
  console.log('teste4_simularDragDrop("sourceId", "targetId", "move")');
  
  console.log('\n📝 Para monitorar operações reais:');
  console.log('1. Abra o console');
  console.log('2. Execute operações de drag & drop');
  console.log('3. Observe os logs com emojis: 🔄, 📁, 🗑️, 🏠');
}

// Função para monitorar mudanças em tempo real
function monitorarMudancas() {
  console.log('👁️ Iniciando monitoramento de mudanças...');
  
  let estadoAnterior = null;
  
  setInterval(() => {
    const estadoAtual = teste1_verificarEstadoInicial();
    
    if (estadoAnterior && estadoAnterior.totalPastas !== estadoAtual.totalPastas) {
      console.warn('⚠️ MUDANÇA DETECTADA!');
      console.warn(`Pastas: ${estadoAnterior.totalPastas} → ${estadoAtual.totalPastas}`);
      
      if (estadoAtual.totalPastas < estadoAnterior.totalPastas) {
        console.error('❌ PASTAS PERDIDAS!');
      }
    }
    
    estadoAnterior = estadoAtual;
  }, 1000);
}

// Exportar funções globalmente para uso no console
window.testDragDrop = {
  executarTodosTestes,
  teste1_verificarEstadoInicial,
  teste2_simularReordenacao,
  teste3_verificarEstrutura,
  teste4_simularDragDrop,
  monitorarMudancas,
  contarPastasRecursivamente,
  listarTodosIds
};

// Executar automaticamente
executarTodosTestes();

console.log('\n✅ Script de teste carregado! Use window.testDragDrop para acessar as funções.'); 