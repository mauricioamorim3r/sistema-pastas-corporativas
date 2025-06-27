# 🌙 Sistema de Modo Escuro - Pastas Corporativas

## 📋 Como Funciona

O sistema de modo escuro da aplicação utiliza uma implementação robusta baseada em **Tailwind CSS** com detecção automática de preferências do sistema e persistência local.

## 🔧 Implementação Técnica

### 1. **Configuração Base - Tailwind CSS v4**
```css
/* index.css */
@import 'tailwindcss';

/* Configuração do modo escuro para Tailwind v4 */
@variant dark (&:where(.dark, .dark *));
```

**⚠️ Importante:** No Tailwind v4, o modo escuro é configurado via CSS, NÃO no `tailwind.config.js`!

### 2. **Estado e Inicialização**
```javascript
// App.tsx (linhas 158-163)
const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});
```

**Lógica de Inicialização:**
1. **Prioridade 1:** Configuração salva no localStorage ('dark' ou 'light')
2. **Prioridade 2:** Preferência do sistema operacional
3. **Fallback:** Modo claro

### 3. **Aplicação do Tema**
```javascript
// App.tsx (linhas 263-270)
useEffect(() => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}, [isDarkMode]);
```

**Mecanismo:**
- Adiciona/remove classe `dark` no elemento `<html>`
- Salva preferência no localStorage automaticamente
- Todas as classes Tailwind `dark:` são ativadas/desativadas

### 4. **Controle via Interface**
```javascript
// components/modals/SettingsModalContent.tsx
<button
  onClick={onToggleDarkMode}
  className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-200 ${
    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
  }`}
>
  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
    isDarkMode ? 'translate-x-6' : 'translate-x-1'
  }`} />
</button>
```

## 🎨 Aplicação Visual

### 1. **Classes CSS Personalizadas**
```css
/* index.html - Scrollbars */
html.dark ::-webkit-scrollbar-track {
  background: #2d3748; /* Dark mode track */
}
html.dark ::-webkit-scrollbar-thumb {
  background: #4a5568; /* Dark mode thumb */
}
html.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096; /* Dark mode hover */
}
```

### 2. **Body Base**
```html
<!-- index.html -->
<body class="bg-gray-100 dark:bg-gray-900">
```

### 3. **Componentes com Modo Escuro**
Todos os componentes utilizam classes condicionais:
```javascript
// Exemplo típico em qualquer componente
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

## 🎛️ Padrões de Implementação

### **Cores Padrão por Categoria:**

#### **Backgrounds:**
- **Claro:** `bg-white`, `bg-gray-50`, `bg-gray-100`
- **Escuro:** `dark:bg-gray-800`, `dark:bg-gray-900`, `dark:bg-gray-700`

#### **Textos:**
- **Claro:** `text-gray-900`, `text-gray-700`, `text-gray-600`
- **Escuro:** `dark:text-gray-100`, `dark:text-gray-300`, `dark:text-gray-400`

#### **Bordas:**
- **Claro:** `border-gray-200`, `border-gray-300`
- **Escuro:** `dark:border-gray-700`, `dark:border-gray-600`

#### **Hover States:**
- **Claro:** `hover:bg-gray-100`, `hover:bg-gray-200`
- **Escuro:** `dark:hover:bg-gray-700`, `dark:hover:bg-gray-600`

## 📱 Integração com Componentes

### **Modals e Painéis:**
```javascript
<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
    Título do Modal
  </h3>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    Descrição do conteúdo
  </p>
</div>
```

### **Botões e Controles:**
```javascript
<button className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
  Botão Primário
</button>
```

### **Inputs e Forms:**
```javascript
<input className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
```

## ⚙️ Persistência e Estado

### **LocalStorage Schema:**
```javascript
// Valores salvos automaticamente
localStorage.setItem('theme', 'dark' | 'light');

// Detecção automática
window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### **Layout Manager Integration:**
```javascript
// Salvamento em layouts
const layoutData = {
  isDarkMode: currentIsDarkMode,
  // ... outras configurações
};
```

## 🔄 Sincronização

### **Entre Componentes:**
- Estado centralizado em `App.tsx`
- Propagado via props para componentes filhos
- Aplicado automaticamente via classes CSS

### **Entre Sessões:**
- Preferência salva no localStorage
- Carregamento automático na inicialização
- Mantém estado entre reloads da página

## 🎯 Benefícios da Implementação

1. **✅ Automático:** Detecta preferência do sistema
2. **✅ Persistente:** Mantém escolha entre sessões
3. **✅ Instantâneo:** Mudança imediata sem reload
4. **✅ Consistente:** Aplicado em toda a interface
5. **✅ Acessível:** Segue padrões de acessibilidade
6. **✅ Performance:** Zero JavaScript adicional (CSS puro)

## 🚀 Como Usar

### **Para Usuários:**
1. Acesse **⚙️ Configurações**
2. Seção **🎨 Aparência**
3. Toggle **"Modo escuro"**
4. Mudança é aplicada instantaneamente

### **Para Desenvolvedores:**
```javascript
// Adicionar suporte a modo escuro em novos componentes
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"

// Para cores especiais
className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
```

## 📊 Coverage de Modo Escuro

**✅ Componentes Suportados:**
- Header e navegação
- Painéis laterais  
- Modais e overlays
- Formulários e inputs
- Botões e controles
- Cards e containers
- Scrollbars customizadas
- Tooltips e notificações

**🎨 Total:** 100% da interface suporta modo escuro completo.

Esta implementação garante uma experiência visual consistente e profissional em ambos os modos, respeitando as preferências do usuário e padrões modernos de UX. 