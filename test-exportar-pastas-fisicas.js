// 📁 Script de Teste - Sistema de Exportação de Pastas Físicas
// Execute no console do navegador em http://localhost:5173/

console.log('🧪 Testando Sistema de Exportação de Pastas Físicas...');

// Funcionalidades de teste disponíveis
window.testExportarPastas = {
  // Testa se as funções de exportação estão disponíveis
  testarFuncoesDisponiveis: () => {
    console.log('📋 Verificando funções de exportação...');
    
    try {
      // Importa funções do módulo
      import('./utils/folderExporter.js').then(module => {
        console.log('✅ Módulo folderExporter carregado:', Object.keys(module));
        
        const funcoesEsperadas = [
          'createPhysicalFolders',
          'downloadFolderScript', 
          'isFileSystemAccessSupported',
          'countFolders',
          'generateFolderPreview'
        ];
        
        funcoesEsperadas.forEach(funcao => {
          if (typeof module[funcao] === 'function') {
            console.log(`✅ ${funcao}: Disponível`);
          } else {
            console.log(`❌ ${funcao}: Não encontrada`);
          }
        });
      }).catch(err => {
        console.error('❌ Erro ao carregar módulo:', err);
      });
    } catch (error) {
      console.error('❌ Erro na verificação:', error);
    }
  },

  // Testa suporte à File System Access API
  testarSuporteAPI: () => {
    console.log('🔍 Verificando suporte à File System Access API...');
    
    if ('showDirectoryPicker' in window) {
      console.log('✅ File System Access API: Suportada');
      console.log('🚀 Você pode usar "Criar Pastas Agora"');
    } else {
      console.log('⚠️ File System Access API: Não suportada');
      console.log('📋 Use "Baixar Script" como alternativa');
    }
    
    console.log('🌐 Navegador:', navigator.userAgent.split(' ').pop());
    console.log('🖥️ Plataforma:', navigator.platform);
  },

  // Simula estrutura de teste
  criarEstruturaTeste: () => {
    console.log('🏗️ Criando estrutura de teste...');
    
    const estruturaTeste = [
      {
        id: 'test-1',
        name: 'PROJETO TESTE',
        color: 'bg-blue-600',
        subFolders: [
          {
            id: 'test-1-1',
            name: 'Documentação',
            color: 'bg-green-600',
            subFolders: [
              { id: 'test-1-1-1', name: 'Manuais', color: 'bg-gray-600' },
              { id: 'test-1-1-2', name: 'Tutoriais', color: 'bg-gray-600' }
            ]
          },
          {
            id: 'test-1-2',
            name: 'Desenvolvimento',
            color: 'bg-purple-600',
            subFolders: [
              { id: 'test-1-2-1', name: 'Código', color: 'bg-gray-600' },
              { id: 'test-1-2-2', name: 'Testes', color: 'bg-gray-600' }
            ]
          }
        ]
      },
      {
        id: 'test-2',
        name: 'ADMINISTRATIVO',
        color: 'bg-red-600',
        subFolders: [
          { id: 'test-2-1', name: 'RH', color: 'bg-orange-600' },
          { id: 'test-2-2', name: 'Financeiro', color: 'bg-yellow-600' }
        ]
      }
    ];
    
    console.log('📊 Estrutura criada:', estruturaTeste);
    console.log('📁 Total de pastas:', this.contarPastas(estruturaTeste));
    
    return estruturaTeste;
  },

  // Testa preview da estrutura
  testarPreview: () => {
    console.log('👁️ Testando preview da estrutura...');
    
    const estrutura = this.criarEstruturaTeste();
    
    try {
      import('./utils/folderExporter.js').then(({ generateFolderPreview, countFolders }) => {
        const preview = generateFolderPreview(estrutura);
        const total = countFolders(estrutura);
        
        console.log('📋 Preview da estrutura:');
        console.log(preview);
        console.log(`📊 Total de pastas: ${total}`);
      });
    } catch (error) {
      console.error('❌ Erro ao gerar preview:', error);
    }
  },

  // Testa geração de script
  testarScript: () => {
    console.log('📜 Testando geração de script...');
    
    const estrutura = this.criarEstruturaTeste();
    
    try {
      import('./utils/folderExporter.js').then(({ generateFolderScript }) => {
        const isWindows = navigator.platform.toLowerCase().includes('win');
        const script = generateFolderScript(estrutura, isWindows);
        
        console.log(`📋 Script gerado (${isWindows ? 'Windows' : 'Unix'}):`);
        console.log(script);
      });
    } catch (error) {
      console.error('❌ Erro ao gerar script:', error);
    }
  },

  // Simula download de script
  simularDownload: () => {
    console.log('⬇️ Simulando download de script...');
    
    const estrutura = this.criarEstruturaTeste();
    
    try {
      import('./utils/folderExporter.js').then(({ downloadFolderScript }) => {
        downloadFolderScript(estrutura);
        console.log('✅ Script baixado com sucesso!');
      });
    } catch (error) {
      console.error('❌ Erro no download:', error);
    }
  },

  // Abre modal de exportação
  abrirModalExportacao: () => {
    console.log('🔓 Tentando abrir modal de exportação...');
    
    // Procura botão de configurações
    const botaoConfig = document.querySelector('button[title*="Configurações"], button[aria-label*="Configurações"]');
    if (botaoConfig) {
      botaoConfig.click();
      console.log('⚙️ Modal de configurações aberto');
      
      setTimeout(() => {
        // Procura botão de exportar
        const botaoExportar = document.querySelector('button:contains("Exportar"), [data-export]');
        if (botaoExportar) {
          botaoExportar.click();
          console.log('📤 Modal de exportação aberto');
        } else {
          console.log('❌ Botão de exportar não encontrado');
        }
      }, 500);
    } else {
      console.log('❌ Botão de configurações não encontrado');
      console.log('💡 Tente clicar manualmente em ⚙️ Configurações');
    }
  },

  // Função auxiliar para contar pastas
  contarPastas: (folders) => {
    let count = 0;
    const countRecursive = (folder) => {
      count++;
      if (folder.subFolders && folder.subFolders.length > 0) {
        folder.subFolders.forEach(countRecursive);
      }
    };
    folders.forEach(countRecursive);
    return count;
  },

  // Executa todos os testes
  executarTodosTestes: () => {
    console.log('🧪 Executando bateria completa de testes...');
    console.log('='.repeat(50));
    
    this.testarSuporteAPI();
    console.log('-'.repeat(30));
    
    this.testarFuncoesDisponiveis();
    console.log('-'.repeat(30));
    
    this.testarPreview();
    console.log('-'.repeat(30));
    
    this.testarScript();
    console.log('-'.repeat(30));
    
    console.log('✅ Todos os testes executados!');
    console.log('💡 Use testExportarPastas.simularDownload() para testar download');
    console.log('💡 Use testExportarPastas.abrirModalExportacao() para abrir modal');
  }
};

// Executa teste inicial
console.log('🎯 Sistema de teste carregado!');
console.log('📋 Comandos disponíveis:');
console.log('• testExportarPastas.executarTodosTestes()');
console.log('• testExportarPastas.testarSuporteAPI()');
console.log('• testExportarPastas.testarPreview()');
console.log('• testExportarPastas.simularDownload()');
console.log('• testExportarPastas.abrirModalExportacao()');
console.log('');
console.log('🚀 Execute: testExportarPastas.executarTodosTestes()'); 