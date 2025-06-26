// ========================================
// SCRIPT CORRIGIDO - ESTRUTURA COM PASTA RAIZ
// SUBSTITUIÇÃO COMPLETA DOS TEMPLATES
// Execute este código no console do navegador (F12)
// ========================================

function substituirTemplatesComEstruturasCorretas() {
  console.log('🚀 INICIANDO SUBSTITUIÇÃO COM ESTRUTURAS CORRETAS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // 1. LIMPAR TODOS OS TEMPLATES EXISTENTES
    console.log('🗑️  ETAPA 1: Removendo templates existentes...');
    const layouts = JSON.parse(localStorage.getItem('layouts') || '[]');
    console.log(`📊 Templates encontrados: ${layouts.length}`);
    
    // Limpar completamente
    localStorage.setItem('layouts', '[]');
    console.log('✅ Templates antigos removidos');
    
    // 2. CRIAR ARRAY DE NOVOS TEMPLATES
    const novosTemplates = [];
    
    // =========================================
    // TEMPLATE 1: PAPA-TERRA (com pasta raiz)
    // =========================================
    console.log('📁 ETAPA 2: Criando PAPA-TERRA com pasta raiz...');
    
    const papaTerraTemplate = {
      "id": "PAPA-TERRA",
      "name": "PAPA-TERRA",
      "description": "Estrutura PAPA-TERRA - Sistema de Medição Operacional",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        {
          "id": "papa-terra-root",
          "name": "PAPA-TERRA",
          "color": "bg-blue-900",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [
            { "id": "ppt-xml", "name": "00.XML", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["xml", "dados"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-teste-poco", "name": "01.Teste de Poço", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["teste", "poço"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-nfsm", "name": "02.NFSM", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["nfsm"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-bmp", "name": "03.BMP", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["bmp"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-analises-quimicas", "name": "04.Análises Químicas", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["análises", "químicas"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-certificados", "name": "05.Certificados", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["certificados"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-backup-cvs", "name": "06.Backup-CV's", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["backup", "cv"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-gestao-medicao", "name": "07.Gestão Medição", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["gestão", "medição"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-offloading", "name": "08.Offloading", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["offloading"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-comunicacao-anp", "name": "09. Comunicação ANP", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["comunicação", "anp"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-controle-lacres", "name": "10.Controle de Lacres", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["controle", "lacres"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-pcs", "name": "11.PCS", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["pcs"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-cuna-pev", "name": "12.Cuna PEV e Contaminantes", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["cuna", "pev", "contaminantes"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-contratos", "name": "13.Contratos", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["contratos"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-compra-estoque", "name": "14.Compra e Estoque de Materiais", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["compra", "estoque", "materiais"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-projetos-melhorias", "name": "15.Projetos e Melhorias", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["projetos", "melhorias"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-reunioes-petrobras", "name": "16.Reuniões Petrobrás", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["reuniões", "petrobrás"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
            { "id": "ppt-queima-extraordinaria", "name": "17.Queima Extraordinária", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["queima", "extraordinária"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" }
          ],
          "tags": ["papa-terra", "medição"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        }
      ],
      "expandedFolders": [],
      "createdAt": "2025-06-25T15:49:23.508Z",
      "updatedAt": "2025-06-25T15:49:23.508Z",
      "version": "2.0.0",
      "category": "other",
      "isTemplate": true,
      "stats": {
        "totalFolders": 1,
        "totalSubfolders": 18,
        "responsiblesCount": 1,
        "tagsUsed": ["papa-terra", "medição"],
        "useCount": 0
      }
    };
    
    novosTemplates.push(papaTerraTemplate);
    console.log('✅ PAPA-TERRA criado com pasta raiz e 18 subpastas!');
    
    // =========================================
    // TEMPLATE 2: CORPORATIVO BÁSICO (com pasta raiz)
    // =========================================
    console.log('📁 ETAPA 3: Criando CORPORATIVO BÁSICO com pasta raiz...');
    
    const corporativoBasicoTemplate = {
      "id": "CORPORATIVO BÁSICO",
      "name": "CORPORATIVO BÁSICO",
      "description": "Estrutura Corporativa - Gestão de Informações de Medição dos Polos",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        {
          "id": "nome-instalacao-root",
          "name": "NOME_INSTALAÇÃO",
          "color": "bg-blue-900",
          "textColor": "text-white",
          "icon": "building",
          "iconType": "modern",
          "subFolders": [
            {
              "id": "doc-geral",
              "name": "1. Documentação Geral da Instalação",
              "color": "bg-gray-100",
              "textColor": "text-gray-800",
              "icon": "file-text",
              "iconType": "modern",
              "subFolders": [
                { "id": "doc-1-1", "name": "1.1 Área de Concessão", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-2", "name": "1.2 Memorial Descritivo de Implantação", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-3", "name": "1.3 Plantas e Desenhos", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-4", "name": "1.4 Manual do Sistema", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-5", "name": "1.5 Fluxograma da Instalação", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-6", "name": "1.6 Lista de Instrumentos", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-7", "name": "1.7 Folhas de Dados dos Instrumentos", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-8", "name": "1.8 Laudos de Interligação", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] }
              ]
            },
            {
              "id": "doc-ponto-medicao",
              "name": "2. Documentação do Ponto de Medição",
              "color": "bg-gray-100",
              "textColor": "text-gray-800",
              "icon": "file-text",
              "iconType": "modern",
              "subFolders": [
                { "id": "doc-2-1", "name": "2.1 Memorial Descritivo", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-2", "name": "2.2 Croqui de Localização", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-3", "name": "2.3 Desenhos Isométricos", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-4", "name": "2.4 Folhas de Dados dos Medidores", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-5", "name": "2.5 Certificados de Calibração", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-6", "name": "2.6 Curvas de Calibração", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-7", "name": "2.7 Planilhas de Cálculo", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-8", "name": "2.8 Relatórios de Ensaios", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-9", "name": "2.9 Incerteza de Medição", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-10", "name": "2.10 Fator do Medidor", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-11", "name": "2.11 Configuração Eletrônica", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-12", "name": "2.12 Lacração e Vedação", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-13", "name": "2.13 Logotipos de Identificação", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] }
              ]
            },
            {
              "id": "anp",
              "name": "3. ANP",
              "color": "bg-gray-100",
              "textColor": "text-gray-800",
              "icon": "shield",
              "iconType": "modern",
              "subFolders": [
                { "id": "anp-3-1", "name": "3.1 Regulamentações", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "anp-3-2", "name": "3.2 Resoluções", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "anp-3-3", "name": "3.3 Comunicações", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "anp-3-4", "name": "3.4 Relatórios ANP", "color": "bg-gray-50", "textColor": "text-gray-700", "icon": "folder", "iconType": "modern", "subFolders": [] }
              ]
            },
            { "id": "contratos", "name": "4. Contratos", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "clipboard", "iconType": "modern", "subFolders": [] },
            { "id": "gestao-processos", "name": "5. Gestão Processos de Medição", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "settings", "iconType": "modern", "subFolders": [] },
            { "id": "fechamento-mensal", "name": "6. Fechamento Mensal da Produção", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "calendar", "iconType": "modern", "subFolders": [] },
            { "id": "requisicoes", "name": "7. Requisições", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "message-square", "iconType": "modern", "subFolders": [] },
            { "id": "assuntos-gerais", "name": "8. Assuntos Gerais", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "inbox", "iconType": "modern", "subFolders": [] },
            { "id": "projetos", "name": "9. Projetos", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "layers", "iconType": "modern", "subFolders": [] }
          ],
          "tags": ["corporativo", "instalação"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        }
      ],
      "expandedFolders": [],
      "createdAt": "2025-06-25T15:49:23.508Z",
      "updatedAt": "2025-06-25T15:49:23.508Z",
      "version": "2.0.0",
      "category": "other",
      "isTemplate": true,
      "stats": {
        "totalFolders": 1,
        "totalSubfolders": 26,
        "responsiblesCount": 1,
        "tagsUsed": ["corporativo", "instalação"],
        "useCount": 0
      }
    };
    
    novosTemplates.push(corporativoBasicoTemplate);
    console.log('✅ CORPORATIVO BÁSICO criado com pasta raiz NOME_INSTALAÇÃO!');
    
    // =========================================
    // TEMPLATE 3: BOOK ANP (com pasta raiz)
    // =========================================
    console.log('📁 ETAPA 4: Criando BOOK ANP com pasta raiz...');
    
    const bookAnpTemplate = {
      "id": "BOOK ANP",
      "name": "BOOK ANP",
      "description": "Modelo de Documentos ANP com Links SharePoint",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        {
          "id": "book-anp-root",
          "name": "BOOK ANP",
          "color": "bg-blue-900",
          "textColor": "text-white",
          "icon": "book",
          "iconType": "modern",
          "subFolders": [
            { "id": "book-memorial-descritivo", "name": "Memorial Descritivo", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "file-text", "iconType": "modern", "subFolders": [], "tags": ["memorial", "descritivo"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/memorial-descritivo"] },
            { "id": "book-fluxograma", "name": "Fluxograma Simplificado", "color": "bg-gray-100", "textColor": "text-gray-800", "icon": "git-branch", "iconType": "modern", "subFolders": [], "tags": ["fluxograma", "simplificado"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/fluxograma-simplificado"] }
          ],
          "tags": ["book", "anp"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        }
      ],
      "expandedFolders": [],
      "createdAt": "2025-06-25T15:49:23.508Z",
      "updatedAt": "2025-06-25T15:49:23.508Z",
      "version": "2.0.0",
      "category": "other",
      "isTemplate": true,
      "stats": {
        "totalFolders": 1,
        "totalSubfolders": 2,
        "responsiblesCount": 1,
        "tagsUsed": ["book", "anp"],
        "useCount": 0
      }
    };
    
    novosTemplates.push(bookAnpTemplate);
    console.log('✅ BOOK ANP criado com pasta raiz e estrutura SharePoint!');
    
    // 3. SALVAR TODOS OS TEMPLATES
    localStorage.setItem('layouts', JSON.stringify(novosTemplates));
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SUBSTITUIÇÃO CORRIGIDA FINALIZADA COM SUCESSO!');
    console.log(`📊 TOTAL DE TEMPLATES CRIADOS: ${novosTemplates.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 4. VERIFICAÇÃO FINAL
    const verificacao = JSON.parse(localStorage.getItem('layouts') || '[]');
    console.log(`🔍 VERIFICAÇÃO: ${verificacao.length} templates salvos no localStorage`);
    
    if (verificacao.length === 3) {
      console.log('🎯 RESUMO DOS TEMPLATES CORRIGIDOS:');
      verificacao.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.name}`);
        console.log(`      📁 Pasta raiz: ${template.folders[0].name}`);
        console.log(`      📂 ${template.folders[0].subFolders.length} subpastas dentro da raiz`);
        console.log('');
      });
      
      console.log('✅ ESTRUTURAS CORRETAS:');
      console.log('   • PAPA-TERRA com pasta raiz e 18 subpastas');
      console.log('   • NOME_INSTALAÇÃO com pasta raiz e estrutura hierárquica');
      console.log('   • BOOK ANP com pasta raiz e links SharePoint');
      console.log('');
      console.log('🔄 RECARREGUE A PÁGINA PARA VER OS TEMPLATES CORRIGIDOS!');
    } else {
      console.error('⚠️  Algo deu errado. Templates salvos:', verificacao.length);
    }
    
    return novosTemplates;
    
  } catch (error) {
    console.error('❌ ERRO DURANTE A CORREÇÃO:', error);
    return false;
  }
}

// ========================================
// INSTRUÇÕES DE USO:
// ========================================
// 1. Abra o console do navegador (F12)
// 2. Cole este código completo
// 3. Execute: substituirTemplatesComEstruturasCorretas()
// 4. Aguarde a conclusão
// 5. Recarregue a página
// ======================================== 