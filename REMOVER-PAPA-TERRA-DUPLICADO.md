# 🧹 Remover Layout PAPA-TERRA Duplicado

## Situação
Você tem dois layouts PAPA-TERRA:
- **Primeiro**: Vazio (0 pastas) 
- **Segundo**: Completo (17-18 pastas) ✅

## Como Remover o Layout Vazio

### Passo 1: Acessar o Console
1. Abra a aplicação: `http://localhost:5173/`
2. Pressione **F12** para abrir o DevTools
3. Clique na aba **Console**

### Passo 2: Executar o Script
Cole e execute este comando no console:

```javascript
// SCRIPT PARA REMOVER PAPA-TERRA DUPLICADO
async function removerPapaTerraVazio() {
  console.log('🧹 INICIANDO REMOÇÃO DO PAPA-TERRA DUPLICADO VAZIO');
  
  try {
    // Verificar IndexedDB primeiro
    const { getBrowserDatabase } = window;
    if (typeof getBrowserDatabase === 'function') {
      const db = await getBrowserDatabase();
      const templates = await db.listTemplates();
      
      const papaTerraTemplates = templates.filter(t => 
        t.name.includes('PAPA-TERRA') || t.name.includes('PAPA-TERRA MEDIÇÃO')
      );
      
      console.log(`🔍 Templates PAPA-TERRA encontrados: ${papaTerraTemplates.length}`);
      
      // Mostrar detalhes
      papaTerraTemplates.forEach((template, index) => {
        const folderCount = template.folders ? template.folders.length : 0;
        console.log(`${index + 1}. "${template.name}" - ${folderCount} pastas`);
      });
      
      if (papaTerraTemplates.length === 2) {
        // Identificar qual remover (o com menos pastas)
        const [template1, template2] = papaTerraTemplates;
        const folderCount1 = template1.folders ? template1.folders.length : 0;
        const folderCount2 = template2.folders ? template2.folders.length : 0;
        
        let templateParaRemover;
        if (folderCount1 < folderCount2) {
          templateParaRemover = template1;
        } else {
          templateParaRemover = template2;
        }
        
        console.log(`🗑️  REMOVENDO: "${templateParaRemover.name}" (${templateParaRemover.folders ? templateParaRemover.folders.length : 0} pastas)`);
        
        const sucesso = await db.deleteTemplate(templateParaRemover.name);
        
        if (sucesso) {
          console.log(`✅ Template "${templateParaRemover.name}" removido com sucesso!`);
          console.log('🔄 Recarregue a página para ver as mudanças');
        } else {
          console.error(`❌ Erro ao remover template`);
        }
        
        return true;
      } else if (papaTerraTemplates.length === 1) {
        console.log('✅ Apenas um template PAPA-TERRA encontrado. Nada para remover.');
        return true;
      }
    }
    
    // Fallback para localStorage
    console.log('🔍 Verificando localStorage...');
    const savedLayouts = localStorage.getItem('complete-layouts');
    if (savedLayouts) {
      const layouts = JSON.parse(savedLayouts);
      const papaTerraLayouts = layouts.filter(layout => 
        layout.name.includes('PAPA-TERRA')
      );
      
      if (papaTerraLayouts.length > 1) {
        // Manter apenas o que tem mais pastas
        let melhorLayout = papaTerraLayouts[0];
        let maiorContagem = melhorLayout.folders ? melhorLayout.folders.length : 0;
        
        for (const layout of papaTerraLayouts) {
          const contagem = layout.folders ? layout.folders.length : 0;
          if (contagem > maiorContagem) {
            melhorLayout = layout;
            maiorContagem = contagem;
          }
        }
        
        const layoutsFiltrados = layouts.filter(layout => {
          if (layout.name.includes('PAPA-TERRA')) {
            return layout.id === melhorLayout.id;
          }
          return true;
        });
        
        localStorage.setItem('complete-layouts', JSON.stringify(layoutsFiltrados));
        console.log(`✅ Mantido: "${melhorLayout.name}" com ${maiorContagem} pastas`);
        console.log('🔄 Recarregue a página para ver as mudanças');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Executar automaticamente
removerPapaTerraVazio();
```

### Passo 3: Verificar o Resultado
1. **Recarregue a página** (`Ctrl + F5`)
2. Clique no botão **📁 Templates** no header
3. Verifique que agora existe apenas **1 template PAPA-TERRA**
4. Confirme que o template mantido tem **17-18 pastas**

## Método Alternativo: Interface Gráfica

Se preferir usar a interface:

1. Abra o **Gerenciador de Templates** (📁 no header)
2. Localize os dois templates PAPA-TERRA
3. Clique no ícone **🗑️** do template que tem **0 pastas**
4. O template vazio será removido

## Verificação Final

Após a remoção, você deve ter:
- ✅ **1 template PAPA-TERRA MEDIÇÃO** com 17-18 pastas
- ✅ **Template CORPORATIVO BÁSICO** (intacto)
- ✅ **Template BOOK ANP** (intacto)

## Solução de Problemas

### Se o script não funcionar:
1. Certifique-se de estar na página da aplicação (`localhost:5173`)
2. Verifique se não há erros no console antes de executar
3. Tente recarregar a página e executar novamente

### Se ainda houver duplicatas:
Execute este comando de limpeza completa:

```javascript
// LIMPEZA FORÇADA
localStorage.removeItem('complete-layouts');
localStorage.removeItem('saved-layouts');
location.reload();
```

Isso fará os templates retornarem aos padrões do banco de dados. 