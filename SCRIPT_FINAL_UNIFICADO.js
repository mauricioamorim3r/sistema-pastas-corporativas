// ========================================
// SCRIPT FINAL UNIFICADO
// SUBSTITUIÇÃO COMPLETA DE TODOS OS TEMPLATES
// Execute este código no console do navegador (F12)
// ========================================

function substituirTodosOsTemplates() {
  console.log('🚀 INICIANDO SUBSTITUIÇÃO COMPLETA DE TODOS OS TEMPLATES');
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
    // TEMPLATE 1: PAPA-TERRA MEDIÇÃO
    // =========================================
    console.log('📁 ETAPA 2: Criando PAPA-TERRA MEDIÇÃO...');
    
    const papaTerraTemplate = {
      "id": "PAPA-TERRA MEDIÇÃO",
      "name": "PAPA-TERRA MEDIÇÃO",
      "description": "Estrutura PAPA-TERRA - Sistema de Medição Operacional",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        { "id": "ppt-xml", "name": "00.XML", "color": "bg-blue-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["xml", "dados"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-teste-poco", "name": "01.Teste de Poço", "color": "bg-green-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["teste", "poço"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-nfsm", "name": "02.NFSM", "color": "bg-purple-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["nfsm"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-bmp", "name": "03.BMP", "color": "bg-orange-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["bmp"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-analises-quimicas", "name": "04.Análises Químicas", "color": "bg-red-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["análises", "químicas"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-certificados", "name": "05.Certificados", "color": "bg-indigo-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["certificados"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-backup-cvs", "name": "06.Backup-CV's", "color": "bg-pink-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["backup", "cv"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-gestao-medicao", "name": "07.Gestão Medição", "color": "bg-gray-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["gestão", "medição"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-offloading", "name": "08.Offloading", "color": "bg-teal-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["offloading"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-comunicacao-anp", "name": "09. Comunicação ANP", "color": "bg-cyan-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["comunicação", "anp"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-controle-lacres", "name": "10.Controle de Lacres", "color": "bg-lime-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["controle", "lacres"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-pcs", "name": "11.PCS", "color": "bg-emerald-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["pcs"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-cuna-pev", "name": "12.Cuna PEV e Contaminantes", "color": "bg-amber-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["cuna", "pev", "contaminantes"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-contratos", "name": "13.Contratos", "color": "bg-yellow-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["contratos"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-compra-estoque", "name": "14.Compra e Estoque de Materiais", "color": "bg-stone-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["compra", "estoque", "materiais"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-projetos-melhorias", "name": "15.Projetos e Melhorias", "color": "bg-slate-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["projetos", "melhorias"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-reunioes-petrobras", "name": "16.Reuniões Petrobrás", "color": "bg-zinc-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["reuniões", "petrobrás"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" },
        { "id": "ppt-queima-extraordinaria", "name": "17.Queima Extraordinária", "color": "bg-neutral-800", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [], "tags": ["queima", "extraordinária"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025" }
      ],
      "expandedFolders": [],
      "createdAt": "2025-06-25T15:49:23.508Z",
      "updatedAt": "2025-06-25T15:49:23.508Z",
      "version": "2.0.0",
      "category": "other",
      "isTemplate": true,
      "stats": {
        "totalFolders": 18,
        "totalSubfolders": 0,
        "responsiblesCount": 1,
        "tagsUsed": ["xml", "dados", "teste", "poço", "nfsm", "bmp", "análises", "químicas", "certificados", "backup", "cv", "gestão", "medição", "offloading", "comunicação", "anp", "controle", "lacres", "pcs", "cuna", "pev", "contaminantes", "contratos", "compra", "estoque", "materiais", "projetos", "melhorias", "reuniões", "petrobrás", "queima", "extraordinária"],
        "useCount": 0
      }
    };
    
    novosTemplates.push(papaTerraTemplate);
    console.log('✅ PAPA-TERRA MEDIÇÃO criado com 18 pastas!');
    
    // =========================================
    // TEMPLATE 2: CORPORATIVO BÁSICO
    // =========================================
    console.log('📁 ETAPA 3: Criando CORPORATIVO BÁSICO...');
    
    const corporativoBasicoTemplate = {
      "id": "CORPORATIVO BÁSICO",
      "name": "CORPORATIVO BÁSICO",
      "description": "Estrutura Corporativa - Gestão de Informações de Medição dos Polos",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        {
          "id": "nome-instalacao",
          "name": "NOME_INSTALAÇÃO",
          "color": "bg-blue-900",
          "textColor": "text-white",
          "icon": "building",
          "iconType": "modern",
          "subFolders": [
            {
              "id": "doc-geral",
              "name": "1. Documentação Geral da Instalação",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "file-text",
              "iconType": "modern",
              "subFolders": [
                { "id": "doc-1-1", "name": "1.1 Área de Concessão", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-2", "name": "1.2 Memorial Descritivo de Implantação", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-3", "name": "1.3 Plantas e Desenhos", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-4", "name": "1.4 Manual do Sistema", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-5", "name": "1.5 Fluxograma da Instalação", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-6", "name": "1.6 Lista de Instrumentos", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-7", "name": "1.7 Folhas de Dados dos Instrumentos", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-1-8", "name": "1.8 Laudos de Interligação", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] }
              ]
            },
            {
              "id": "doc-ponto-medicao",
              "name": "2. Documentação do Ponto de Medição",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "file-text",
              "iconType": "modern",
              "subFolders": [
                { "id": "doc-2-1", "name": "2.1 Memorial Descritivo", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-2", "name": "2.2 Croqui de Localização", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-3", "name": "2.3 Desenhos Isométricos", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-4", "name": "2.4 Folhas de Dados dos Medidores", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-5", "name": "2.5 Certificados de Calibração", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-6", "name": "2.6 Curvas de Calibração", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-7", "name": "2.7 Planilhas de Cálculo", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-8", "name": "2.8 Relatórios de Ensaios", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-9", "name": "2.9 Incerteza de Medição", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-10", "name": "2.10 Fator do Medidor", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-11", "name": "2.11 Configuração Eletrônica", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-12", "name": "2.12 Lacração e Vedação", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "doc-2-13", "name": "2.13 Logotipos de Identificação", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] }
              ]
            },
            {
              "id": "anp",
              "name": "3. ANP",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "shield",
              "iconType": "modern",
              "subFolders": [
                { "id": "anp-3-1", "name": "3.1 Regulamentações", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "anp-3-2", "name": "3.2 Resoluções", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "anp-3-3", "name": "3.3 Comunicações", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] },
                { "id": "anp-3-4", "name": "3.4 Relatórios ANP", "color": "bg-blue-400", "textColor": "text-white", "icon": "folder", "iconType": "modern", "subFolders": [] }
              ]
            },
            { "id": "contratos", "name": "4. Contratos", "color": "bg-blue-600", "textColor": "text-white", "icon": "clipboard", "iconType": "modern", "subFolders": [] },
            { "id": "gestao-processos", "name": "5. Gestão Processos de Medição", "color": "bg-blue-600", "textColor": "text-white", "icon": "settings", "iconType": "modern", "subFolders": [] },
            { "id": "fechamento-mensal", "name": "6. Fechamento Mensal da Produção", "color": "bg-blue-600", "textColor": "text-white", "icon": "calendar", "iconType": "modern", "subFolders": [] },
            { "id": "requisicoes", "name": "7. Requisições", "color": "bg-blue-600", "textColor": "text-white", "icon": "message-square", "iconType": "modern", "subFolders": [] },
            { "id": "assuntos-gerais", "name": "8. Assuntos Gerais", "color": "bg-blue-600", "textColor": "text-white", "icon": "inbox", "iconType": "modern", "subFolders": [] },
            { "id": "projetos", "name": "9. Projetos", "color": "bg-blue-600", "textColor": "text-white", "icon": "layers", "iconType": "modern", "subFolders": [] }
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
    console.log('✅ CORPORATIVO BÁSICO criado com estrutura hierárquica completa!');
    
    // =========================================
    // TEMPLATE 3: BOOK ANP
    // =========================================
    console.log('📁 ETAPA 4: Criando BOOK ANP...');
    
    const bookAnpTemplate = {
      "id": "BOOK ANP",
      "name": "BOOK ANP",
      "description": "Modelo de Documentos ANP com Links SharePoint",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        { "id": "book-memorial-descritivo", "name": "1-MEMORIAL DESCRITIVO", "color": "bg-blue-600", "textColor": "text-white", "icon": "file-text", "iconType": "modern", "subFolders": [], "tags": ["memorial", "descritivo"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/memorial-descritivo"] },
        { "id": "book-fluxograma", "name": "2-FLUXOGRAMA SIMPLIFICADO", "color": "bg-green-600", "textColor": "text-white", "icon": "git-branch", "iconType": "modern", "subFolders": [], "tags": ["fluxograma", "simplificado"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/fluxograma-simplificado"] },
        { "id": "book-plantas", "name": "3-PLANTAS", "color": "bg-purple-600", "textColor": "text-white", "icon": "map", "iconType": "modern", "subFolders": [], "tags": ["plantas"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/plantas"] },
        { "id": "book-isometricos", "name": "4-ISOMÉTRICOS", "color": "bg-orange-600", "textColor": "text-white", "icon": "grid", "iconType": "modern", "subFolders": [], "tags": ["isométricos"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/isometricos"] },
        { "id": "book-folhas-dados", "name": "5-FOLHA DE DADOS DOS MEDIDORES", "color": "bg-red-600", "textColor": "text-white", "icon": "database", "iconType": "modern", "subFolders": [], "tags": ["folha", "dados", "medidores"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/folha-dados-medidores"] },
        { "id": "book-lista-instrumentos", "name": "6-LISTA DE INSTRUMENTOS", "color": "bg-indigo-600", "textColor": "text-white", "icon": "list", "iconType": "modern", "subFolders": [], "tags": ["lista", "instrumentos"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/lista-instrumentos"] },
        { "id": "book-folhas-instrumentos", "name": "7-FOLHA DE DADOS DOS INSTRUMENTOS", "color": "bg-pink-600", "textColor": "text-white", "icon": "tool", "iconType": "modern", "subFolders": [], "tags": ["folha", "dados", "instrumentos"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/folha-dados-instrumentos"] },
        { "id": "book-certificados", "name": "8-CERTIFICADOS DE CALIBRAÇÃO", "color": "bg-gray-600", "textColor": "text-white", "icon": "award", "iconType": "modern", "subFolders": [], "tags": ["certificados", "calibração"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/certificados-calibracao"] },
        { "id": "book-curvas", "name": "9-CURVAS DE CALIBRAÇÃO", "color": "bg-teal-600", "textColor": "text-white", "icon": "trending-up", "iconType": "modern", "subFolders": [], "tags": ["curvas", "calibração"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/curvas-calibracao"] },
        { "id": "book-planilhas", "name": "10-PLANILHAS DE CÁLCULO", "color": "bg-cyan-600", "textColor": "text-white", "icon": "calculator", "iconType": "modern", "subFolders": [], "tags": ["planilhas", "cálculo"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/planilhas-calculo"] },
        { "id": "book-ensaios", "name": "11-RELATÓRIOS DE ENSAIOS", "color": "bg-lime-600", "textColor": "text-white", "icon": "clipboard-check", "iconType": "modern", "subFolders": [], "tags": ["relatórios", "ensaios"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/relatorios-ensaios"] },
        { "id": "book-incerteza", "name": "12-INCERTEZA DE MEDIÇÃO", "color": "bg-emerald-600", "textColor": "text-white", "icon": "alert-triangle", "iconType": "modern", "subFolders": [], "tags": ["incerteza", "medição"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/incerteza-medicao"] },
        { "id": "book-fator-medidor", "name": "13-FATOR DO MEDIDOR", "color": "bg-amber-600", "textColor": "text-white", "icon": "hash", "iconType": "modern", "subFolders": [], "tags": ["fator", "medidor"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/fator-medidor"] },
        { "id": "book-configuracao", "name": "14-CONFIGURAÇÃO ELETRÔNICA", "color": "bg-yellow-600", "textColor": "text-white", "icon": "cpu", "iconType": "modern", "subFolders": [], "tags": ["configuração", "eletrônica"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/configuracao-eletronica"] },
        { "id": "book-procedimentos", "name": "15-PROCEDIMENTOS DE CALIBRAÇÃO", "color": "bg-stone-600", "textColor": "text-white", "icon": "book-open", "iconType": "modern", "subFolders": [], "tags": ["procedimentos", "calibração"], "responsible": "Todos", "createdAt": "20/03/2025", "updatedAt": "24/06/2025", "links": ["https://petrobras.sharepoint.com/sites/procedimentos-calibracao"] }
      ],
      "expandedFolders": [],
      "createdAt": "2025-06-25T15:49:23.508Z",
      "updatedAt": "2025-06-25T15:49:23.508Z",
      "version": "2.0.0",
      "category": "other",
      "isTemplate": true,
      "stats": {
        "totalFolders": 15,
        "totalSubfolders": 0,
        "responsiblesCount": 1,
        "tagsUsed": ["memorial", "descritivo", "fluxograma", "simplificado", "plantas", "isométricos", "folha", "dados", "medidores", "lista", "instrumentos", "certificados", "calibração", "curvas", "planilhas", "cálculo", "relatórios", "ensaios", "incerteza", "medição", "fator", "medidor", "configuração", "eletrônica", "procedimentos"],
        "useCount": 0
      }
    };
    
    novosTemplates.push(bookAnpTemplate);
    console.log('✅ BOOK ANP criado com 15 pastas e links SharePoint!');
    
    // 3. SALVAR TODOS OS TEMPLATES
    localStorage.setItem('layouts', JSON.stringify(novosTemplates));
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SUBSTITUIÇÃO COMPLETA FINALIZADA COM SUCESSO!');
    console.log(`📊 TOTAL DE TEMPLATES CRIADOS: ${novosTemplates.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 4. VERIFICAÇÃO FINAL
    const verificacao = JSON.parse(localStorage.getItem('layouts') || '[]');
    console.log(`🔍 VERIFICAÇÃO: ${verificacao.length} templates salvos no localStorage`);
    
    if (verificacao.length === 3) {
      console.log('🎯 RESUMO DOS TEMPLATES CRIADOS:');
      verificacao.forEach((template, index) => {
        const subfolders = template.stats.totalSubfolders || 0;
        console.log(`   ${index + 1}. ${template.name}`);
        console.log(`      📁 ${template.stats.totalFolders} pastas principais`);
        if (subfolders > 0) console.log(`      📂 ${subfolders} subpastas`);
        console.log(`      🏷️  ${template.stats.tagsUsed.length} tags diferentes`);
        console.log('');
      });
      
      console.log('🔄 RECARREGUE A PÁGINA PARA VER OS NOVOS TEMPLATES!');
      console.log('🎉 Substituição realizada com sucesso!');
    } else {
      console.error('⚠️  Algo deu errado. Templates salvos:', verificacao.length);
    }
    
    return novosTemplates;
    
  } catch (error) {
    console.error('❌ ERRO DURANTE A SUBSTITUIÇÃO:', error);
    return false;
  }
}

// ========================================
// INSTRUÇÕES DE USO:
// ========================================
// 1. Abra o console do navegador (F12)
// 2. Cole este código completo
// 3. Execute: substituirTodosOsTemplates()
// 4. Aguarde a conclusão
// 5. Recarregue a página
// ======================================== 