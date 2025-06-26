// SCRIPT PARTE 2 - ADICIONAR TEMPLATES CORPORATIVO BÁSICO E BOOK ANP
// Execute após o primeiro script

async function adicionarTemplatesRestantes() {
  console.log('🔄 ADICIONANDO TEMPLATES RESTANTES...');
  
  try {
    // Recuperar layouts existentes
    let layouts = JSON.parse(localStorage.getItem('layouts') || '[]');
    console.log(`📊 Templates atuais: ${layouts.length}`);
    
    // 3. CORPORATIVO BÁSICO (estrutura simplificada devido ao tamanho)
    const corporativoBasicoTemplate = {
      "id": "CORPORATIVO BÁSICO",
      "name": "CORPORATIVO BÁSICO",
      "description": "Estrutura corporativa para gestão das informações de medição dos polos",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        {
          "id": "folder-nome-instalacao",
          "name": "NOME_INSTALAÇÃO",
          "color": "bg-blue-900",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "responsible": "Todos",
          "tags": [],
          "createdAt": "25/06/2025",
          "updatedAt": "25/06/2025",
          "subFolders": [
            {
              "id": "corp-doc-geral",
              "name": "1. Documentação Geral da Instalação",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [
                {
                  "id": "corp-memorial-calc",
                  "name": "1.1 Memorial do Cálculo de Fechamento de Produção",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["memorial"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-memorial-desc",
                  "name": "1.2 Memorial Descritivo da Instalação",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["memorial"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-fluxograma",
                  "name": "1.3 Fluxograma (P&ID; PFD; Isométricos)",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["fluxograma"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-diagrama",
                  "name": "1.4 Diagrama Esquemático",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["diagrama"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-arquitetura",
                  "name": "1.5 Arquitetura do Sistema",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["arquitetura"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-folha-dados",
                  "name": "1.6 Folha de Dados",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["dados"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-procedimentos",
                  "name": "1.7 Procedimentos Gerais da Instalação",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["procedimentos"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-plano-lacres",
                  "name": "1.8 Plano de Gerenciamento de Lacres e Proteção",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["lacres"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                }
              ],
              "tags": ["documentação", "instalação"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "25/06/2025",
              "isOpen": true
            },
            {
              "id": "corp-doc-medicao",
              "name": "2. Documentação do Ponto de Medição",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [
                {
                  "id": "corp-dados-diarios",
                  "name": "2.1 Dados das medições diárias",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["medições"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-elemento-primario",
                  "name": "2.2 Elemento Primário",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["elemento"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-elementos-secundarios",
                  "name": "2.3 Elementos Secundários",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["elementos"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-incerteza",
                  "name": "2.4 Avaliação da Incerteza do Sistema de Medição",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["incerteza"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-amostrador",
                  "name": "2.5 Amostrador Automático",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["amostrador"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-analises",
                  "name": "2.6 Relatórios de Análises Físico Químicas",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["análises"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-computador-vazao",
                  "name": "2.7 Computador de Vazão",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["computador"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-teste-estanqueidade",
                  "name": "2.8 Teste de estanqueidade de válvulas",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["teste"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-proc-operacionais",
                  "name": "2.9 Procedimentos Operacionais",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["procedimentos"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-controle-lacres",
                  "name": "2.10 Controle de lacres",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["controle"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-teste-poco",
                  "name": "2.11 Teste de poço",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["teste"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-rotinas-medicao",
                  "name": "2.12 Rotinas de Medição",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["rotinas"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                },
                {
                  "id": "corp-nfsm",
                  "name": "2.13 NFSM",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["nfsm"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "24/06/2025"
                }
              ],
              "tags": ["documentação", "medição"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025",
              "isOpen": true
            },
            {
              "id": "corp-anp",
              "name": "3. ANP",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [
                {
                  "id": "corp-plano-desenvolvimento",
                  "name": "3.1 Plano de Desenvolvimento",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["plano"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "25/06/2025"
                },
                {
                  "id": "corp-inspecao-anp",
                  "name": "3.2 Inspeções ANP",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["inspeção"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "25/06/2025"
                },
                {
                  "id": "corp-pap",
                  "name": "3.3 PAP",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["pap"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "25/06/2025"
                },
                {
                  "id": "corp-aprovacao-pontos",
                  "name": "3.4 Aprovações",
                  "color": "bg-blue-400",
                  "textColor": "text-white",
                  "icon": "folder",
                  "iconType": "modern",
                  "subFolders": [],
                  "tags": ["pontos"],
                  "responsible": "Todos",
                  "createdAt": "20/03/2025",
                  "updatedAt": "25/06/2025"
                }
              ],
              "tags": ["anp", "regulamentação"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025",
              "isOpen": true
            },
            {
              "id": "corp-contratos",
              "name": "4. Contratos",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [],
              "tags": ["contratos"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025"
            },
            {
              "id": "corp-gestao-processos",
              "name": "5. Gestão Processos de Medição",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [],
              "tags": ["gestão"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025"
            },
            {
              "id": "corp-fechamento-mensal",
              "name": "6. Fechamento Mensal da Produção",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [],
              "tags": ["fechamento"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025"
            },
            {
              "id": "corp-requisicoes",
              "name": "7. Requisições",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [],
              "tags": ["requisições"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025"
            },
            {
              "id": "corp-assuntos-gerais",
              "name": "8. Assuntos Gerais",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [],
              "tags": ["assuntos"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025"
            },
            {
              "id": "corp-projetos",
              "name": "9. Projetos",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "icon": "folder",
              "iconType": "modern",
              "subFolders": [],
              "tags": ["projetos"],
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "updatedAt": "24/06/2025"
            }
          ],
          "isOpen": true
        }
      ],
      "expandedFolders": [],
      "createdAt": "2025-06-25T15:49:23.507Z",
      "updatedAt": "2025-06-25T17:05:41.195Z",
      "version": "2.0.0",
      "category": "Template",
      "isTemplate": true,
      "stats": {
        "totalFolders": 1,
        "totalSubfolders": 34,
        "responsiblesCount": 1,
        "tagsUsed": ["documentação", "instalação", "memorial", "fluxograma", "diagrama", "arquitetura", "dados", "procedimentos", "lacres", "medição", "medições", "elemento", "elementos", "incerteza", "amostrador", "análises", "computador", "teste", "controle", "rotinas", "nfsm", "anp", "regulamentação", "plano", "inspeção", "pap", "pontos", "contratos", "gestão", "fechamento", "requisições", "assuntos", "projetos"],
        "useCount": 0
      }
    };

    console.log('📁 Adicionando CORPORATIVO BÁSICO...');
    layouts.push(corporativoBasicoTemplate);
    
    console.log('✅ CORPORATIVO BÁSICO adicionado!');
    console.log('📋 Execute o próximo script para BOOK ANP...');
    
    // Salvar progresso
    localStorage.setItem('layouts', JSON.stringify(layouts));
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao adicionar templates restantes:', error);
    return false;
  }
}

// Para executar no console:
adicionarTemplatesRestantes(); 