# 🔧 GUIA DE ATUALIZAÇÃO DOS TEMPLATES CORPORATIVOS

## 📋 **INSTRUÇÕES PASSO A PASSO**

### **1. Abrir a Aplicação**
- Acesse: `http://localhost:5173/`
- Certifique-se de que a aplicação está rodando

### **2. Abrir Console do Navegador**
- Pressione `F12` para abrir DevTools
- Clique na aba **Console**

### **3. Carregar Script de Atualização**
Copie e cole o seguinte comando no console:

```javascript
// Carregamento do script
fetch('/update_templates.js')
  .then(response => response.text())
  .then(script => {
    eval(script);
    console.log('✅ Script carregado com sucesso!');
  })
  .catch(error => {
    console.error('❌ Erro ao carregar script:', error);
  });
```

### **4. Executar Atualização**
Após carregar o script, execute:

```javascript
atualizarTemplatesCorporativos();
```

### **5. Aguardar Conclusão**
- O script mostrará o progresso no console
- Aguarde as mensagens de confirmação
- Quando aparecer "🎉 Atualização completa!", pode fechar o console

### **6. Recarregar Aplicação**
- Pressione `F5` ou `Ctrl+R` para recarregar a página
- Os novos templates estarão disponíveis

---

## 📁 **TEMPLATES ATUALIZADOS**

### **CORPORATIVO BÁSICO**
- ✅ Estrutura completa para gestão de medição dos polos
- ✅ 9 seções principais organizadas hierarquicamente
- ✅ Subpastas detalhadas para documentação específica
- ✅ Tags e responsáveis pré-configurados

**Estrutura:**
```
NOME_INSTALAÇÃO/
├── 1. Documentação Geral da Instalação/
│   ├── 1.1 Memorial do Cálculo de Fechamento de Produção
│   ├── 1.2 Memorial Descritivo da Instalação
│   ├── 1.3 Fluxograma (P&ID; PFD; Isométricos)
│   ├── 1.4 Diagrama Esquemático
│   ├── 1.5 Arquitetura do Sistema
│   ├── 1.6 Folha de Dados
│   ├── 1.7 Procedimentos Gerais da Instalação
│   └── 1.8 Plano de Gerenciamento de Lacres e Proteção
├── 2. Documentação do Ponto de Medição/
│   ├── 2.1 Dados das medições diárias
│   ├── 2.2 Elemento Primário
│   ├── 2.3 Elementos Secundários
│   ├── 2.4 Avaliação da Incerteza do Sistema de Medição
│   ├── 2.5 Amostrador Automático
│   ├── 2.6 Relatórios de Análises Físico Químicas
│   ├── 2.7 Computador de Vazão
│   ├── 2.8 Teste de estanqueidade de válvulas
│   ├── 2.9 Procedimentos Operacionais
│   ├── 2.10 Controle de lacres
│   ├── 2.11 Teste de poço
│   ├── 2.12 Rotinas de Medição
│   └── 2.13 NFSM
├── 3. ANP/
│   ├── 3.1 Plano de Desenvolvimento
│   ├── 3.2 Inspeções ANP
│   ├── 3.3 PAP
│   └── 3.4 Aprovações
├── 4. Contratos
├── 5. Gestão Processos de Medição
├── 6. Fechamento Mensal da Produção
├── 7. Requisições
├── 8. Assuntos Gerais
└── 9. Projetos
```

### **BOOK ANP**
- ✅ Modelo específico para documentos ANP
- ✅ Links diretos para SharePoint
- ✅ Estrutura simplificada e focada

**Estrutura:**
```
BOOK ANP/
├── 1 - MEMORIAL DESCRITIVO
└── 2 - FLUXOGRAMA SIMPLIFICADO
```

---

## 🔍 **VERIFICAÇÃO**

Após a atualização, você deve ver:

1. **Novos Templates disponíveis** no menu "Aplicar Template"
2. **CORPORATIVO BÁSICO** com estrutura hierárquica completa
3. **BOOK ANP** com links para SharePoint
4. **Todas as pastas** com cores azuis padronizadas
5. **Tags e responsáveis** pré-configurados

---

## ⚠️ **TROUBLESHOOTING**

### **Se o script não carregar:**
- Certifique-se de que está em `localhost:5173`
- Verifique se o arquivo `update_templates.js` existe na raiz
- Recarregue a página e tente novamente

### **Se a atualização falhar:**
- Verifique mensagens de erro no console
- Tente executar `atualizarTemplatesCorporativos()` novamente
- Se persistir, recarregue a página e repita o processo

### **Se os templates não aparecerem:**
- Recarregue a página completamente (`Ctrl+F5`)
- Verifique se não há erros no console
- Teste criando um novo layout

---

## 🎯 **RESULTADO ESPERADO**

Após a atualização bem-sucedida:
- ✅ Templates corporativos disponíveis para uso
- ✅ Estrutura hierárquica profissional 
- ✅ Organização padronizada de documentos
- ✅ Pronto para deploy em produção! 