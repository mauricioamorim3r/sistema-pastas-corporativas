// SCRIPT PARTE 3 - ADICIONAR TEMPLATE BOOK ANP
// Execute após os dois primeiros scripts

async function adicionarBookANP() {
  console.log('🔄 ADICIONANDO TEMPLATE BOOK ANP...');
  
  try {
    // Recuperar layouts existentes
    let layouts = JSON.parse(localStorage.getItem('layouts') || '[]');
    console.log(`📊 Templates atuais: ${layouts.length}`);
    
    // 4. BOOK ANP
    const bookANPTemplate = {
      "id": "BOOK ANP",
      "name": "BOOK ANP",
      "description": "Modelo de pastas para BOOK ANP",
      "leftWidth": 46.356631717910375,
      "isDarkMode": false,
      "isDetailsPanelOpen": true,
      "folders": [
        {
          "id": "prod",
          "name": "BOOK ANP",
          "isOpen": true,
          "color": "bg-blue-900",
          "textColor": "text-white",
          "path": "https://3rpetroleumbr.sharepoint.com/sites/DiretoriadeOperaes/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FDiretoriadeOperaes%2FShared%20Documents%2F3%2E%20Setores%2F05%20Opera%C3%A7%C3%B5es%2F5%2E5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o%2F1%2E%20Medi%C3%A7%C3%A3o%2F007%20%2D%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O%2FBook%20ANP%5Ftemplate%20de%20pastas&viewid=32f67d48%2Dbba4%2D4c87%2Dbb42%2Dd3c2016548d3&e=5%3A87ba45bb5c1f4b35b8e415c0134f3ee4&sharingv2=true&fromShare=true&at=9&CID=c1c180ee%2D22c5%2D4121%2Db33c%2D2e19b9ac6721&FolderCTID=0x012000194E88DB5F35174A8C305C33EBD5C334",
          "responsible": "Todos",
          "createdAt": "20/03/2025 14:30",
          "updatedAt": "24/06/2025",
          "tags": ["anp", "regulatório", "documentos"],
          "subFolders": [
            {
              "id": "anp",
              "name": "1 - MEMORIAL DESCRITIVO",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "tags": [],
              "subCount": 4,
              "isOpen": false,
              "description": "",
              "link": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/1.%20Memorial%20descritivo?csf=1&web=1&e=hcAiZB",
              "icon": "folder",
              "iconType": "preset",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/1.%20Memorial%20descritivo?csf=1&web=1&e=hcAiZB",
              "updatedAt": "24/06/2025"
            },
            {
              "id": "pcp",
              "name": "2 - FLUXOGRAMA SIMPLIFICADO",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "tags": [],
              "subCount": 2,
              "isOpen": false,
              "description": "",
              "link": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/2.%20Fluxograma%20Simplificado?csf=1&web=1&e=8GyqEr",
              "icon": "folder",
              "iconType": "preset",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/2.%20Fluxograma%20Simplificado?csf=1&web=1&e=8GyqEr",
              "updatedAt": "24/06/2025"
            },
            {
              "id": "integridade",
              "name": "3 - FLUXOGRAMA DE ENGENHARIA",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "responsible": "Todos",
              "createdAt": "20/03/2025",
              "tags": [],
              "subCount": 6,
              "isOpen": false,
              "description": "",
              "link": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/3.%20Fluxograma%20de%20Engenharia?csf=1&web=1&e=igjhmy",
              "icon": "folder",
              "iconType": "preset",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/3.%20Fluxograma%20de%20Engenharia?csf=1&web=1&e=igjhmy",
              "updatedAt": "25/06/2025"
            },
            {
              "id": "folder-1750857320658-7sg46e0ba",
              "name": "4 - ISOMÉTRICO",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/4.%20Isom%C3%A9tricos?csf=1&web=1&e=le2mgy",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false,
              "description": "",
              "link": "",
              "icon": "folder",
              "iconType": "preset"
            },
            {
              "id": "folder-1750857428410-cwwm0lhk2",
              "name": "5 - ARQUIVO DE CONFIGURAÇÃO DO CV",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/5.%20Arquivo%20de%20Configura%C3%A7%C3%A3o%20do%20CV?csf=1&web=1&e=onVoO3",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857490546-hasm8soby",
              "name": "6 - FOLHA DE DADOS",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/6.%20Folha%20de%20Dados?csf=1&web=1&e=Y1BYiH",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857528892-r31c6ibpx",
              "name": "7 - CERTIFICADOS DE CALIBRAÇÃO",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/7.%20Certificados%20de%20Calibra%C3%A7%C3%A3o?csf=1&web=1&e=alq1T2",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857631108-cc5qeso9g",
              "name": "8 - TESTES DE ESTANQUEIDADE",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/8.%20Certificado%20de%20Teste%20de%20Estanqueidade%20de%20V%C3%A1lvulas?csf=1&web=1&e=slsqvU",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857699116-0tfugxcw3",
              "name": "9 - PLANILHA DE CONROLE DE LACRES",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/9.%20Planilha%20de%20Controle%20de%20Lacres?csf=1&web=1&e=8gAMmf",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857733624-h9jcg26jy",
              "name": "10 - RELATÓRIO DE CONFIGURAÇÃO DOS MEDIDORES",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/10.%20Relat%C3%B3rios%20de%20Configura%C3%A7%C3%A3o%20dos%20Medidores?csf=1&web=1&e=vyJBEg",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857762623-74phmjfrq",
              "name": "11 - PORTARIAS DE APROVAÇÃO DE MODELO",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/11.%20Portaria%20de%20Aprova%C3%A7%C3%A3o%20de%20Modelos?csf=1&web=1&e=B7YrgZ",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857786872-4ojtbbmhx",
              "name": "12 - CÁLCULOS DE INCERTEZA",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/12.%20C%C3%A1lculos%20de%20Incerteza?csf=1&web=1&e=4xyrrH",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857823512-7wndpnrpv",
              "name": "13 - ESTIMATIVA DA COMPOSIÇÃO DE FLUIDOS",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/13.%20Estimativa%20da%20Composi%C3%A7%C3%A3o%20de%20Fluidos?csf=1&web=1&e=3gaqF2",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857875288-k4kx7oskf",
              "name": "14 - MODELO DE RELATÓRIO DE PRODUÇÃO",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/14.%20Modelo%20de%20Relat%C3%B3rio%20de%20Produ%C3%A7%C3%A3o?csf=1&web=1&e=mrUPpp",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            },
            {
              "id": "folder-1750857905929-09465zg1u",
              "name": "15 - PROCEDIMENTOS DE CALIBRAÇÃO",
              "color": "bg-blue-600",
              "textColor": "text-white",
              "path": "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/15.%20Procedimento%20de%20Calibra%C3%A7%C3%A3o%20dos%20Medidores%20de%20Vaz%C3%A3o?csf=1&web=1&e=GASA0K",
              "responsible": "Todos",
              "tags": [],
              "createdAt": "25/06/2025",
              "updatedAt": "25/06/2025",
              "subFolders": [],
              "isOpen": false
            }
          ],
          "description": "Modelo de pasta para armazenar documentos ANP",
          "link": "https://3rpetroleumbr.sharepoint.com/sites/DiretoriadeOperaes/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FDiretoriadeOperaes%2FShared%20Documents%2F3%2E%20Setores%2F05%20Opera%C3%A7%C3%B5es%2F5%2E5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o%2F1%2E%20Medi%C3%A7%C3%A3o%2F007%20%2D%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O%2FBook%20ANP%5Ftemplate%20de%20pastas&viewid=32f67d48%2Dbba4%2D4c87%2Dbb42%2Dd3c2016548d3&e=5%3A87ba45bb5c1f4b35b8e415c0134f3ee4&sharingv2=true&fromShare=true&at=9&CID=c1c180ee%2D22c5%2D4121%2Db33c%2D2e19b9ac6721&FolderCTID=0x012000194E88DB5F35174A8C305C33EBD5C334",
          "icon": "file-text",
          "iconType": "preset"
        }
      ],
      "expandedFolders": [],
      "createdAt": "2025-06-24T13:39:37.870Z",
      "updatedAt": "2025-06-25T13:25:35.911Z",
      "version": "2.0.0",
      "category": "Template",
      "isTemplate": true,
      "stats": {
        "totalFolders": 1,
        "totalSubfolders": 15,
        "responsiblesCount": 1,
        "tagsUsed": ["anp", "regulatório", "documentos"],
        "useCount": 0
      }
    };

    console.log('📁 Adicionando BOOK ANP...');
    layouts.push(bookANPTemplate);
    
    console.log('✅ BOOK ANP adicionado!');
    
    // Salvar todos os templates
    localStorage.setItem('layouts', JSON.stringify(layouts));
    
    console.log('🎉 SUBSTITUIÇÃO COMPLETA FINALIZADA!');
    console.log(`📊 Total de templates: ${layouts.length}`);
    console.log('📋 Templates disponíveis:');
    layouts.forEach((layout, index) => {
      console.log(`${index + 1}. ${layout.name} - ${layout.description}`);
    });
    
    console.log('🔄 Recarregue a página para ver os novos templates!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao adicionar BOOK ANP:', error);
    return false;
  }
}

// Para executar no console:
adicionarBookANP(); 