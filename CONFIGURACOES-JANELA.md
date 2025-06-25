<<<<<<< HEAD
# Configurações de Janela - Sistema de Pastas Corporativas

## Regras Obrigatórias

### 1. Detalhes Ocultos por Padrão
- **Comportamento:** Ao abrir a aplicação, o painel de detalhes sempre inicia fechado
- **Implementação:** `isDetailsPanelOpen` configurado como `false` no estado inicial
- **Benefício:** Interface mais limpa e foco nas pastas principais

### 2. Nova Janela Exclusiva
- **Comportamento:** Aplicação SEMPRE abre em janela exclusiva (não em aba)
- **Características da janela:**
  - Sem barra de status (`status=no`)
  - Sem barra de ferramentas (`toolbar=no`) 
  - Sem barra de menu (`menubar=no`)
  - Sem barra de endereços (`location=no`)
  - Sem diretórios (`directories=no`)
  - Permite redimensionamento (`resizable=yes`)
  - Permite scrollbars (`scrollbars=yes`)
- **Exceção:** Desenvolvimento local mantém janela atual

### 3. Resolução Padrão
- **Tamanho obrigatório:** 1280 x 1024 pixels
- **Zoom automático:** 85% (otimizado para esta resolução)
- **Centralização:** Automática na tela do usuário
- **Reajuste:** Automático se janela for redimensionada

## Implementação Técnica

### Arquivo: `index.tsx`

```javascript
// Regra 1: Detalhes ocultos (App.tsx)
const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState<boolean>(false);

// Regra 2: Nova janela exclusiva
const newWindow = window.open(
  window.location.href,
  'PastasCorporativas',
  'width=1280,height=1024,scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,location=no,directories=no'
);

// Regra 3: Zoom 85% para resolução 1280x1024
document.body.style.zoom = '85%';
```

### Lógica de Detecção

```javascript
const shouldOpenInNewWindow = () => {
  const isInPopup = window.opener !== null;
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // SEMPRE abrir em nova janela exclusiva, exceto em desenvolvimento
  return !isInPopup && !isDevelopment;
};
```

## Comportamento por Ambiente

### Produção
- ✅ Nova janela exclusiva automática
- ✅ Resolução 1280x1024
- ✅ Zoom 85%
- ✅ Detalhes ocultos
- ✅ Centralização automática

### Desenvolvimento Local
- ✅ Mesma janela (para facilitar debug)
- ✅ Zoom 85% aplicado
- ✅ Detalhes ocultos
- ❌ Não abre nova janela

## Benefícios das Configurações

1. **Interface Limpa:** Detalhes ocultos reduzem distração inicial
2. **Janela Dedicada:** Sem interferência de outras abas/sites
3. **Resolução Otimizada:** 1280x1024 com zoom 85% oferece melhor visualização
4. **Experiência Consistente:** Sempre abre com as mesmas configurações
5. **Foco Total:** Janela exclusiva garante atenção completa à aplicação

## Configurações Avançadas

### Fallbacks para Navegadores
- **Chrome/Edge:** `zoom: 85%`
- **Firefox:** `transform: scale(0.85)` + ajustes de dimensão
- **Safari:** `webkit-transform: scale(0.85)` + ajustes de dimensão

### Redimensionamento Automático
- Detecta se janela não está no tamanho correto
- Reajusta automaticamente para 1280x1024
- Centraliza na tela disponível
- Mantém proporções corretas

## Última Atualização
**Data:** Dezembro 2024  
**Versão:** 2.0  
**Mudanças:** 
- Resolução alterada de 1450x970 para 1280x1024
- Zoom ajustado de 80% para 85%
- Detalhes sempre ocultos por padrão
- Janela exclusiva sempre (exceto desenvolvimento)

## 📋 Especificações Implementadas

### 🎯 **Tamanho Obrigatório e Padrão:**
- **Largura**: 1450px
- **Altura**: 970px  
- **Zoom**: 80% (automático)
- **Redimensionável**: Sim (usuário pode alterar manualmente)

## 🔧 Funcionalidades Implementadas

### **1. ✅ Nova Janela com Tamanho Fixo**
```javascript
// Configurações da nova janela
window.open(
  url,
  'PastasCorporativas',
  'width=1450,height=970,scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes'
);
```

### **2. ✅ Zoom Automático 80%**
```javascript
// Aplicação do zoom
document.body.style.zoom = '80%';

// Fallback para navegadores sem suporte a zoom
document.body.style.transform = 'scale(0.8)';
document.body.style.transformOrigin = '0 0';
```

### **3. ✅ Centralização Automática**
```javascript
// Calcular posição central da tela
const screenWidth = window.screen.availWidth;
const screenHeight = window.screen.availHeight;
const left = (screenWidth - 1450) / 2;
const top = (screenHeight - 970) / 2;

window.moveTo(left, top);
```

### **4. ✅ Reajuste Automático**
- Verifica tamanho atual da janela
- Redimensiona se diferente do padrão
- Reposiciona no centro da tela
- Aplica zoom se necessário

## 🎨 Comportamentos por Ambiente

### **Em Produção (Build):**
1. ✅ Abre **automaticamente** em nova janela
2. ✅ Tamanho: **1450x970px**
3. ✅ Zoom: **80% automático**
4. ✅ Posição: **Centralizada**
5. ✅ Fecha janela original

### **Em Desenvolvimento (localhost):**
1. ✅ Mantém na **mesma janela**
2. ✅ Aplica zoom **80% automático**
3. ✅ Não redimensiona (para não atrapalhar desenvolvimento)

### **Janela Popup Existente:**
1. ✅ Verifica tamanho atual
2. ✅ Ajusta para **1450x970px** se necessário
3. ✅ Centraliza na tela
4. ✅ Aplica zoom **80%**

## 🛠️ Detalhes Técnicos

### **Suporte a Navegadores:**
- ✅ **Chrome/Edge**: `zoom: 80%` (nativo)
- ✅ **Firefox/Safari**: `transform: scale(0.8)` (fallback)
- ✅ **Compatibilidade**: Funciona em todos os navegadores modernos

### **Tratamento de Erros:**
```javascript
try {
  // Aplicar configurações
} catch (error) {
  console.warn('Não foi possível aplicar configurações da janela:', error);
}
```

### **Ordem de Execução:**
1. **Verificação**: Deve abrir nova janela?
2. **Criação**: Nova janela com dimensões
3. **Load Event**: Aguarda carregamento
4. **Zoom**: Aplica 80% automático
5. **Posicionamento**: Centraliza na tela
6. **Cleanup**: Fecha janela original

## 📊 Vantagens do Tamanho 1450x970

### **Dimensões Otimizadas:**
- ✅ **Largura 1450px**: Ideal para hierarquia de pastas + painel de detalhes
- ✅ **Altura 970px**: Comporta header + filtros + conteúdo sem scroll excessivo
- ✅ **Zoom 80%**: Permite mais conteúdo visível mantendo legibilidade

### **Compatibilidade com Telas:**
- ✅ **Full HD (1920x1080)**: Sobra espaço para outras janelas
- ✅ **4K**: Ocupa porção adequada da tela
- ✅ **Notebooks**: Cabe na maioria das resoluções modernas

## 🚀 Como Testar

### **Teste em Produção:**
1. Faça build da aplicação: `npm run build`
2. Abra o `index.html` do dist
3. Deve abrir nova janela **1450x970** centralizada
4. Zoom deve estar em **80%** automaticamente
5. Interface deve estar **bem dimensionada**

### **Teste em Desenvolvimento:**
1. Acesse `http://localhost:5173`
2. Zoom deve aplicar **80%** automaticamente
3. Tamanho da janela **não muda** (para desenvolvimento)
4. Interface deve estar **proporcionalmente menor**

### **Teste de Redimensionamento:**
1. Em nova janela, altere tamanho manualmente
2. Recarregue a página
3. Deve voltar para **1450x970** automaticamente
4. Deve centralizar novamente

## 🎯 Benefícios Implementados

### **Para Usuários:**
- ✅ **Tamanho Consistente**: Sempre abre no tamanho ideal
- ✅ **Zoom Ideal**: 80% permite ver mais conteúdo
- ✅ **Posição Central**: Sempre no centro da tela
- ✅ **Flexibilidade**: Pode redimensionar se desejar

### **Para Interface:**
- ✅ **Espaço Otimizado**: Dimensões ideais para hierarquia
- ✅ **Legibilidade**: Zoom reduz sem prejudicar leitura
- ✅ **Responsividade**: Funciona bem com painel lateral
- ✅ **Profissional**: Janela dedicada para aplicação

### **Para Desenvolvimento:**
- ✅ **Não Intrusivo**: Localhost mantém comportamento normal
- ✅ **Configurável**: Pode ajustar dimensões facilmente
- ✅ **Compatível**: Funciona em todos os navegadores
- ✅ **Tolerante a Falhas**: Não quebra se algo falhar

## 📝 Configurações Técnicas

### **Parâmetros da Nova Janela:**
```
width=1450          // Largura fixa
height=970          // Altura fixa  
scrollbars=yes      // Permite scroll se necessário
resizable=yes       // Usuário pode redimensionar
status=yes          // Barra de status
toolbar=yes         // Barra de ferramentas
menubar=yes         // Menu do navegador
```

### **CSS de Zoom Aplicado:**
```css
/* Método principal */
body { zoom: 80%; }

/* Fallback */
body {
  transform: scale(0.8);
  transform-origin: 0 0;
  width: 125%;
  height: 125%;
}
```

---

**Status:** ✅ Implementado e Funcional  
**Compatibilidade:** ✅ Todos os navegadores modernos  
**Flexibilidade:** ✅ Usuário pode alterar se desejar  
=======
# Configurações de Janela - Sistema de Pastas Corporativas

## Regras Obrigatórias

### 1. Detalhes Ocultos por Padrão
- **Comportamento:** Ao abrir a aplicação, o painel de detalhes sempre inicia fechado
- **Implementação:** `isDetailsPanelOpen` configurado como `false` no estado inicial
- **Benefício:** Interface mais limpa e foco nas pastas principais

### 2. Nova Janela Exclusiva
- **Comportamento:** Aplicação SEMPRE abre em janela exclusiva (não em aba)
- **Características da janela:**
  - Sem barra de status (`status=no`)
  - Sem barra de ferramentas (`toolbar=no`) 
  - Sem barra de menu (`menubar=no`)
  - Sem barra de endereços (`location=no`)
  - Sem diretórios (`directories=no`)
  - Permite redimensionamento (`resizable=yes`)
  - Permite scrollbars (`scrollbars=yes`)
- **Exceção:** Desenvolvimento local mantém janela atual

### 3. Resolução Padrão
- **Tamanho obrigatório:** 1280 x 1024 pixels
- **Zoom automático:** 85% (otimizado para esta resolução)
- **Centralização:** Automática na tela do usuário
- **Reajuste:** Automático se janela for redimensionada

## Implementação Técnica

### Arquivo: `index.tsx`

```javascript
// Regra 1: Detalhes ocultos (App.tsx)
const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState<boolean>(false);

// Regra 2: Nova janela exclusiva
const newWindow = window.open(
  window.location.href,
  'PastasCorporativas',
  'width=1280,height=1024,scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,location=no,directories=no'
);

// Regra 3: Zoom 85% para resolução 1280x1024
document.body.style.zoom = '85%';
```

### Lógica de Detecção

```javascript
const shouldOpenInNewWindow = () => {
  const isInPopup = window.opener !== null;
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // SEMPRE abrir em nova janela exclusiva, exceto em desenvolvimento
  return !isInPopup && !isDevelopment;
};
```

## Comportamento por Ambiente

### Produção
- ✅ Nova janela exclusiva automática
- ✅ Resolução 1280x1024
- ✅ Zoom 85%
- ✅ Detalhes ocultos
- ✅ Centralização automática

### Desenvolvimento Local
- ✅ Mesma janela (para facilitar debug)
- ✅ Zoom 85% aplicado
- ✅ Detalhes ocultos
- ❌ Não abre nova janela

## Benefícios das Configurações

1. **Interface Limpa:** Detalhes ocultos reduzem distração inicial
2. **Janela Dedicada:** Sem interferência de outras abas/sites
3. **Resolução Otimizada:** 1280x1024 com zoom 85% oferece melhor visualização
4. **Experiência Consistente:** Sempre abre com as mesmas configurações
5. **Foco Total:** Janela exclusiva garante atenção completa à aplicação

## Configurações Avançadas

### Fallbacks para Navegadores
- **Chrome/Edge:** `zoom: 85%`
- **Firefox:** `transform: scale(0.85)` + ajustes de dimensão
- **Safari:** `webkit-transform: scale(0.85)` + ajustes de dimensão

### Redimensionamento Automático
- Detecta se janela não está no tamanho correto
- Reajusta automaticamente para 1280x1024
- Centraliza na tela disponível
- Mantém proporções corretas

## Última Atualização
**Data:** Dezembro 2024  
**Versão:** 2.0  
**Mudanças:** 
- Resolução alterada de 1450x970 para 1280x1024
- Zoom ajustado de 80% para 85%
- Detalhes sempre ocultos por padrão
- Janela exclusiva sempre (exceto desenvolvimento)

## 📋 Especificações Implementadas

### 🎯 **Tamanho Obrigatório e Padrão:**
- **Largura**: 1450px
- **Altura**: 970px  
- **Zoom**: 80% (automático)
- **Redimensionável**: Sim (usuário pode alterar manualmente)

## 🔧 Funcionalidades Implementadas

### **1. ✅ Nova Janela com Tamanho Fixo**
```javascript
// Configurações da nova janela
window.open(
  url,
  'PastasCorporativas',
  'width=1450,height=970,scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes'
);
```

### **2. ✅ Zoom Automático 80%**
```javascript
// Aplicação do zoom
document.body.style.zoom = '80%';

// Fallback para navegadores sem suporte a zoom
document.body.style.transform = 'scale(0.8)';
document.body.style.transformOrigin = '0 0';
```

### **3. ✅ Centralização Automática**
```javascript
// Calcular posição central da tela
const screenWidth = window.screen.availWidth;
const screenHeight = window.screen.availHeight;
const left = (screenWidth - 1450) / 2;
const top = (screenHeight - 970) / 2;

window.moveTo(left, top);
```

### **4. ✅ Reajuste Automático**
- Verifica tamanho atual da janela
- Redimensiona se diferente do padrão
- Reposiciona no centro da tela
- Aplica zoom se necessário

## 🎨 Comportamentos por Ambiente

### **Em Produção (Build):**
1. ✅ Abre **automaticamente** em nova janela
2. ✅ Tamanho: **1450x970px**
3. ✅ Zoom: **80% automático**
4. ✅ Posição: **Centralizada**
5. ✅ Fecha janela original

### **Em Desenvolvimento (localhost):**
1. ✅ Mantém na **mesma janela**
2. ✅ Aplica zoom **80% automático**
3. ✅ Não redimensiona (para não atrapalhar desenvolvimento)

### **Janela Popup Existente:**
1. ✅ Verifica tamanho atual
2. ✅ Ajusta para **1450x970px** se necessário
3. ✅ Centraliza na tela
4. ✅ Aplica zoom **80%**

## 🛠️ Detalhes Técnicos

### **Suporte a Navegadores:**
- ✅ **Chrome/Edge**: `zoom: 80%` (nativo)
- ✅ **Firefox/Safari**: `transform: scale(0.8)` (fallback)
- ✅ **Compatibilidade**: Funciona em todos os navegadores modernos

### **Tratamento de Erros:**
```javascript
try {
  // Aplicar configurações
} catch (error) {
  console.warn('Não foi possível aplicar configurações da janela:', error);
}
```

### **Ordem de Execução:**
1. **Verificação**: Deve abrir nova janela?
2. **Criação**: Nova janela com dimensões
3. **Load Event**: Aguarda carregamento
4. **Zoom**: Aplica 80% automático
5. **Posicionamento**: Centraliza na tela
6. **Cleanup**: Fecha janela original

## 📊 Vantagens do Tamanho 1450x970

### **Dimensões Otimizadas:**
- ✅ **Largura 1450px**: Ideal para hierarquia de pastas + painel de detalhes
- ✅ **Altura 970px**: Comporta header + filtros + conteúdo sem scroll excessivo
- ✅ **Zoom 80%**: Permite mais conteúdo visível mantendo legibilidade

### **Compatibilidade com Telas:**
- ✅ **Full HD (1920x1080)**: Sobra espaço para outras janelas
- ✅ **4K**: Ocupa porção adequada da tela
- ✅ **Notebooks**: Cabe na maioria das resoluções modernas

## 🚀 Como Testar

### **Teste em Produção:**
1. Faça build da aplicação: `npm run build`
2. Abra o `index.html` do dist
3. Deve abrir nova janela **1450x970** centralizada
4. Zoom deve estar em **80%** automaticamente
5. Interface deve estar **bem dimensionada**

### **Teste em Desenvolvimento:**
1. Acesse `http://localhost:5173`
2. Zoom deve aplicar **80%** automaticamente
3. Tamanho da janela **não muda** (para desenvolvimento)
4. Interface deve estar **proporcionalmente menor**

### **Teste de Redimensionamento:**
1. Em nova janela, altere tamanho manualmente
2. Recarregue a página
3. Deve voltar para **1450x970** automaticamente
4. Deve centralizar novamente

## 🎯 Benefícios Implementados

### **Para Usuários:**
- ✅ **Tamanho Consistente**: Sempre abre no tamanho ideal
- ✅ **Zoom Ideal**: 80% permite ver mais conteúdo
- ✅ **Posição Central**: Sempre no centro da tela
- ✅ **Flexibilidade**: Pode redimensionar se desejar

### **Para Interface:**
- ✅ **Espaço Otimizado**: Dimensões ideais para hierarquia
- ✅ **Legibilidade**: Zoom reduz sem prejudicar leitura
- ✅ **Responsividade**: Funciona bem com painel lateral
- ✅ **Profissional**: Janela dedicada para aplicação

### **Para Desenvolvimento:**
- ✅ **Não Intrusivo**: Localhost mantém comportamento normal
- ✅ **Configurável**: Pode ajustar dimensões facilmente
- ✅ **Compatível**: Funciona em todos os navegadores
- ✅ **Tolerante a Falhas**: Não quebra se algo falhar

## 📝 Configurações Técnicas

### **Parâmetros da Nova Janela:**
```
width=1450          // Largura fixa
height=970          // Altura fixa  
scrollbars=yes      // Permite scroll se necessário
resizable=yes       // Usuário pode redimensionar
status=yes          // Barra de status
toolbar=yes         // Barra de ferramentas
menubar=yes         // Menu do navegador
```

### **CSS de Zoom Aplicado:**
```css
/* Método principal */
body { zoom: 80%; }

/* Fallback */
body {
  transform: scale(0.8);
  transform-origin: 0 0;
  width: 125%;
  height: 125%;
}
```

---

**Status:** ✅ Implementado e Funcional  
**Compatibilidade:** ✅ Todos os navegadores modernos  
**Flexibilidade:** ✅ Usuário pode alterar se desejar  
>>>>>>> origin/main
**Automático:** ✅ Aplicado sem intervenção do usuário 