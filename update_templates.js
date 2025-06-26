// Script para atualizar templates - Execute no Console do Navegador
// Copie e cole este código no console do navegador durante desenvolvimento

const atualizarTemplatesCorporativos = async () => {
  try {
    console.log('🔄 Iniciando atualização dos templates corporativos...');
    
    // Templates atualizados
    const templatesAtualizados = [
      {
        name: "CORPORATIVO BÁSICO",
        description: "Estrutura corporativa para gestão das informações de medição dos polos",
        category: "business",
        folders: [
          {
            id: "folder-1750870451220-2pwchnr3s",
            name: "NOME_INSTALAÇÃO",
            color: "bg-blue-900",
            textColor: "text-white",
            path: "C:\\Nova Pasta Raiz",
            responsible: "Todos",
            tags: [],
            createdAt: "25/06/2025",
            updatedAt: "25/06/2025",
            subFolders: [
              {
                id: "corp-doc-geral",
                name: "1. Documentação Geral da Instalação",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [
                  {
                    id: "corp-memorial-calc",
                    name: "1.1 Memorial do Cálculo de Fechamento de Produção",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["memorial"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-memorial-desc",
                    name: "1.2 Memorial Descritivo da Instalação",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["memorial"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-fluxograma",
                    name: "1.3 Fluxograma (P&ID; PFD; Isométricos)",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["fluxograma"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-diagrama",
                    name: "1.4 Diagrama Esquemático",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["diagrama"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-arquitetura",
                    name: "1.5 Arquitetura do Sistema",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["arquitetura"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-folha-dados",
                    name: "1.6 Folha de Dados",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["dados"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-procedimentos",
                    name: "1.7 Procedimentos Gerais da Instalação",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["procedimentos"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-plano-lacres",
                    name: "1.8 Plano de Gerenciamento de Lacres e Proteção",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["lacres"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  }
                ],
                tags: ["documentação", "instalação"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "25/06/2025",
                isOpen: true,
                description: "",
                link: ""
              },
              {
                id: "corp-doc-medicao",
                name: "2. Documentação do Ponto de Medição",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [
                  {
                    id: "corp-dados-diarios",
                    name: "2.1 Dados das medições diárias",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["medições"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-elemento-primario",
                    name: "2.2 Elemento Primário",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["elemento"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-elementos-secundarios",
                    name: "2.3 Elementos Secundários",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["elementos"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-incerteza",
                    name: "2.4 Avaliação da Incerteza do Sistema de Medição",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["incerteza"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-amostrador",
                    name: "2.5 Amostrador Automático",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["amostrador"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-analises",
                    name: "2.6 Relatórios de Análises Físico Químicas",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["análises"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-computador-vazao",
                    name: "2.7 Computador de Vazão",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["computador"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-teste-estanqueidade",
                    name: "2.8 Teste de estanqueidade de válvulas",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["teste"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-proc-operacionais",
                    name: "2.9 Procedimentos Operacionais",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["procedimentos"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-controle-lacres",
                    name: "2.10 Controle de lacres",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["controle"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-teste-poco",
                    name: "2.11 Teste de poço",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["teste"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-rotinas-medicao",
                    name: "2.12 Rotinas de Medição",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["rotinas"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  },
                  {
                    id: "corp-nfsm",
                    name: "2.13 NFSM",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["nfsm"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "24/06/2025"
                  }
                ],
                tags: ["documentação", "medição"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025",
                isOpen: true
              },
              {
                id: "corp-anp",
                name: "3. ANP",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [
                  {
                    id: "corp-plano-desenvolvimento",
                    name: "3.1 Plano de Desenvolvimento",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["plano"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "25/06/2025",
                    description: "",
                    link: ""
                  },
                  {
                    id: "corp-inspecao-anp",
                    name: "3.2 Inspeções ANP ",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["inspeção"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "25/06/2025",
                    description: "",
                    link: ""
                  },
                  {
                    id: "corp-pap",
                    name: "3.3 PAP",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["pap"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "25/06/2025",
                    description: "",
                    link: ""
                  },
                  {
                    id: "corp-aprovacao-pontos",
                    name: "3.4 Aprovações",
                    color: "bg-blue-400",
                    textColor: "text-white",
                    icon: "folder",
                    iconType: "modern",
                    subFolders: [],
                    tags: ["pontos"],
                    responsible: "Todos",
                    createdAt: "20/03/2025",
                    updatedAt: "25/06/2025",
                    description: "",
                    link: ""
                  }
                ],
                tags: ["anp", "regulamentação"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025",
                isOpen: true
              },
              {
                id: "corp-contratos",
                name: "4. Contratos",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [],
                tags: ["contratos"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025"
              },
              {
                id: "corp-gestao-processos",
                name: "5. Gestão Processos de Medição",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [],
                tags: ["gestão"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025"
              },
              {
                id: "corp-fechamento-mensal",
                name: "6. Fechamento Mensal da Produção",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [],
                tags: ["fechamento"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025"
              },
              {
                id: "corp-requisicoes",
                name: "7. Requisições",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [],
                tags: ["requisições"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025"
              },
              {
                id: "corp-assuntos-gerais",
                name: "8. Assuntos Gerais",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [],
                tags: ["assuntos"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025"
              },
              {
                id: "corp-projetos",
                name: "9. Projetos",
                color: "bg-blue-600",
                textColor: "text-white",
                icon: "folder",
                iconType: "modern",
                subFolders: [],
                tags: ["projetos"],
                responsible: "Todos",
                createdAt: "20/03/2025",
                updatedAt: "24/06/2025"
              }
            ],
            isOpen: true
          }
        ],
        settings: {
          leftWidth: 35,
          isDarkMode: false,
          isDetailsPanelOpen: true
        }
      },
      {
        name: "BOOK ANP",
        description: "Modelo de pastas para BOOK ANP",
        category: "regulatory",
        folders: [
          {
            id: "prod",
            name: "BOOK ANP",
            isOpen: true,
            color: "bg-blue-900",
            textColor: "text-white",
            path: "https://3rpetroleumbr.sharepoint.com/sites/DiretoriadeOperaes/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FDiretoriadeOperaes%2FShared%20Documents%2F3%2E%20Setores%2F05%20Opera%C3%A7%C3%B5es%2F5%2E5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o%2F1%2E%20Medi%C3%A7%C3%A3o%2F007%20%2D%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O%2FBook%20ANP%5Ftemplate%20de%20pastas&viewid=32f67d48%2Dbba4%2D4c87%2Dbb42%2Dd3c2016548d3&e=5%3A87ba45bb5c1f4b35b8e415c0134f3ee4&sharingv2=true&fromShare=true&at=9&CID=c1c180ee%2D22c5%2D4121%2Db33c%2D2e19b9ac6721&FolderCTID=0x012000194E88DB5F35174A8C305C33EBD5C334",
            responsible: "Todos",
            createdAt: "20/03/2025 14:30",
            updatedAt: "24/06/2025",
            tags: ["anp", "regulatório", "documentos"],
            subFolders: [
              {
                id: "anp-1",
                name: "1 - MEMORIAL DESCRITIVO",
                color: "bg-blue-600",
                textColor: "text-white",
                responsible: "Todos",
                createdAt: "20/03/2025",
                tags: [],
                isOpen: false,
                description: "",
                link: "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/1.%20Memorial%20descritivo?csf=1&web=1&e=hcAiZB",
                icon: "folder",
                iconType: "preset",
                path: "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/1.%20Memorial%20descritivo?csf=1&web=1&e=hcAiZB",
                updatedAt: "24/06/2025",
                subFolders: []
              },
              {
                id: "anp-2",
                name: "2 - FLUXOGRAMA SIMPLIFICADO",
                color: "bg-blue-600",
                textColor: "text-white",
                responsible: "Todos",
                createdAt: "20/03/2025",
                tags: [],
                isOpen: false,
                description: "",
                link: "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/2.%20Fluxograma%20Simplificado?csf=1&web=1&e=8GyqEr",
                icon: "folder",
                iconType: "preset",
                path: "https://3rpetroleumbr.sharepoint.com/:f:/r/sites/DiretoriadeOperaes/Shared%20Documents/3.%20Setores/05%20Opera%C3%A7%C3%B5es/5.5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o/1.%20Medi%C3%A7%C3%A3o/007%20-%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O/Book%20ANP_template%20de%20pastas/Rela%C3%A7%C3%A3o%20de%20Documentos%20-%20EMED/2.%20Fluxograma%20Simplificado?csf=1&web=1&e=8GyqEr",
                updatedAt: "24/06/2025",
                subFolders: []
              }
            ],
            description: "Modelo de pasta para armazenar documentos ANP",
            link: "https://3rpetroleumbr.sharepoint.com/sites/DiretoriadeOperaes/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FDiretoriadeOperaes%2FShared%20Documents%2F3%2E%20Setores%2F05%20Opera%C3%A7%C3%B5es%2F5%2E5%20Medi%C3%A7%C3%A3o%20e%20Controle%20da%20Produ%C3%A7%C3%A3o%2F1%2E%20Medi%C3%A7%C3%A3o%2F007%20%2D%20GEST%C3%83O%20DA%20INFORMA%C3%87%C3%83O%2FBook%20ANP%5Ftemplate%20de%20pastas&viewid=32f67d48%2Dbba4%2D4c87%2Dbb42%2Dd3c2016548d3&e=5%3A87ba45bb5c1f4b35b8e415c0134f3ee4&sharingv2=true&fromShare=true&at=9&CID=c1c180ee%2D22c5%2D4121%2Db33c%2D2e19b9ac6721&FolderCTID=0x012000194E88DB5F35174A8C305C33EBD5C334",
            icon: "file-text",
            iconType: "preset"
          }
        ],
        settings: {
          leftWidth: 46.356631717910375,
          isDarkMode: false,
          isDetailsPanelOpen: true
        }
      }
    ];
    
    // Verificar se existe a função getBrowserDatabase
    if (typeof window.getBrowserDatabase === 'undefined') {
      console.error('❌ Função getBrowserDatabase não encontrada. Certifique-se de que a aplicação está rodando.');
      return;
    }
    
    const db = await window.getBrowserDatabase();
    
    for (const template of templatesAtualizados) {
      console.log(`⚡ Atualizando template: ${template.name}`);
      
      // Deletar template existente se houver
      await db.deleteTemplate(template.name);
      console.log(`🗑️ Template "${template.name}" removido`);
      
      // Salvar novo template
      const success = await db.saveTemplate(template);
      
      if (success) {
        console.log(`✅ Template "${template.name}" atualizado com sucesso!`);
      } else {
        console.error(`❌ Erro ao atualizar template "${template.name}"`);
      }
    }
    
    console.log('🎉 Atualização completa! Recarregue a página para ver as mudanças.');
    
  } catch (error) {
    console.error('❌ Erro durante atualização:', error);
  }
};

// Disponibilizar para executar no console
window.atualizarTemplatesCorporativos = atualizarTemplatesCorporativos;

console.log(`
🔧 SCRIPT DE ATUALIZAÇÃO DE TEMPLATES CARREGADO

Para executar:
1. Abra o Console do Navegador (F12)
2. Execute: atualizarTemplatesCorporativos()
3. Aguarde a conclusão
4. Recarregue a página

Ou copie e cole o código da função no console diretamente.
`);

// Auto-executar se estiver na aplicação
if (typeof window !== 'undefined' && window.location && window.location.host.includes('localhost')) {
  console.log('🚀 Auto-executando atualização (modo desenvolvimento)...');
  setTimeout(() => {
    if (confirm('Deseja atualizar os templates corporativos automaticamente?')) {
      atualizarTemplatesCorporativos();
    }
  }, 2000);
} 