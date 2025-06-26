// Script para substituir completamente os templates existentes pelos novos modelos
function substituirTemplatesNovos() {
  console.log('🔄 Iniciando substituição completa dos templates...');
  
  // Novos templates com estrutura completa
  const novosTemplates = [
    {
      "id": "PAPA-TERRA MEDIÇÃO",
      "name": "PAPA-TERRA MEDIÇÃO",
      "description": "Estrutura PAPA-TERRA - Sistema de Medição Operacional",
      "leftWidth": 35,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        {
          "id": "ppt-xml",
          "name": "00.XML",
          "color": "bg-blue-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["xml", "dados"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-teste-poco",
          "name": "01.Teste de Poço",
          "color": "bg-green-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["teste", "poço"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-nfsm",
          "name": "02.NFSM",
          "color": "bg-purple-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["nfsm"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-bmp",
          "name": "03.BMP",
          "color": "bg-orange-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["bmp"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-analises-quimicas",
          "name": "04.Análises Químicas",
          "color": "bg-red-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["análises", "químicas"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-certificados",
          "name": "05.Certificados",
          "color": "bg-indigo-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["certificados"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-backup-cvs",
          "name": "06.Backup-CV's",
          "color": "bg-pink-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["backup", "cv"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-gestao-medicao",
          "name": "07.Gestão Medição",
          "color": "bg-gray-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["gestão", "medição"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-offloading",
          "name": "08.Offloading",
          "color": "bg-teal-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["offloading"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-comunicacao-anp",
          "name": "09. Comunicação ANP",
          "color": "bg-cyan-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["comunicação", "anp"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-controle-lacres",
          "name": "10.Controle de Lacres",
          "color": "bg-lime-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["controle", "lacres"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-pcs",
          "name": "11.PCS",
          "color": "bg-emerald-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["pcs"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-cuna-pev",
          "name": "12.Cuna PEV e Contaminantes",
          "color": "bg-amber-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["cuna", "pev", "contaminantes"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-contratos",
          "name": "13.Contratos",
          "color": "bg-yellow-800",
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
          "id": "ppt-compra-estoque",
          "name": "14.Compra e Estoque de Materiais",
          "color": "bg-stone-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["compra", "estoque", "materiais"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-projetos-melhorias",
          "name": "15.Projetos e Melhorias",
          "color": "bg-slate-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["projetos", "melhorias"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-reunioes-petrobras",
          "name": "16.Reuniões Petrobrás",
          "color": "bg-zinc-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["reuniões", "petrobrás"],
          "responsible": "Todos",
          "createdAt": "20/03/2025",
          "updatedAt": "24/06/2025"
        },
        {
          "id": "ppt-queima-extraordinaria",
          "name": "17.Queima Extraordinária",
          "color": "bg-neutral-800",
          "textColor": "text-white",
          "icon": "folder",
          "iconType": "modern",
          "subFolders": [],
          "tags": ["queima", "extraordinária"],
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
        "totalFolders": 18,
        "totalSubfolders": 0,
        "responsiblesCount": 1,
        "tagsUsed": ["xml", "dados", "teste", "poço", "nfsm", "bmp", "análises", "químicas", "certificados", "backup", "cv", "gestão", "medição", "offloading", "comunicação", "anp", "controle", "lacres", "pcs", "cuna", "pev", "contaminantes", "contratos", "compra", "estoque", "materiais", "projetos", "melhorias", "reuniões", "petrobrás", "queima", "extraordinária"],
        "useCount": 0
      }
    }
  ];

  console.log('📁 Aguarde, carregando próximo template...');
  
  // Continua no próximo script devido ao limite de tamanho...
  console.log('✅ Primeiro template PAPA-TERRA MEDIÇÃO preparado');
  console.log('⚠️  Execute o próximo script para continuar...');
  
  return novosTemplates;
}

// Para executar:
// substituirTemplatesNovos(); 