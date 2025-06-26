# 🚀 Guia do Sistema Launcher

## 📋 Visão Geral

O sistema launcher permite que a aplicação **Sistema de Pastas Corporativas** seja executada em uma janela dedicada e otimizada, proporcionando uma experiência mais profissional similar a aplicativos desktop.

## 🎯 Recursos do Launcher

### ✨ **Funcionalidades Principais**
- **Janela Dedicada**: Abre a aplicação em uma janela separada com dimensões otimizadas
- **Auto-detecção de Ambiente**: Detecta automaticamente se está rodando local ou em produção
- **Suporte Mobile**: Redireciona dispositivos móveis para a versão adequada
- **Sistema de Retry**: Tenta abrir a aplicação até 3 vezes se houver problemas
- **Monitoramento**: Acompanha o status da janela da aplicação
- **Interface Moderna**: Design glassmorphism com animações suaves

### 🎨 **Características Visuais**
- Gradiente moderno com efeito blur
- Animações CSS suaves
- Design responsivo
- Spinner de carregamento animado
- Feedback visual de status
- Lista de recursos da aplicação

## 📁 Arquivos do Sistema

### **1. `launcher.html`** - Arquivo Principal
O launcher completo com interface moderna e todas as funcionalidades.

### **2. `launcher-config.json`** - Configurações
Arquivo de configuração para personalizar o comportamento sem editar código.

## 🔧 Configuração e Personalização

### **URLs da Aplicação:**
```json
{
  "urls": {
    "local": "http://localhost:5173/",
    "producao": "https://sistema-pastas-corporativas.vercel.app/",
    "desenvolvimento": "http://localhost:3000/"
  }
}
```

### **Configurações da Janela:**
```json
{
  "window": {
    "name": "SistemaPastasCorporativas",
    "width": 1400,
    "height": 900,
    "resizable": true,
    "scrollbars": true,
    "centerOnScreen": true
  }
}
```

### **Comportamento:**
```json
{
  "behavior": {
    "maxRetries": 3,
    "loadingTimeout": 3000,
    "verificationTimeout": 5000,
    "autoCloseOnSuccess": false,
    "confirmBeforeClose": true
  }
}
```

## 🚀 Como Usar

### **Desenvolvimento Local:**

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Abra o launcher:**
   - Navegue até `http://localhost:5173/launcher.html`
   - Ou abra o arquivo `launcher.html` diretamente no navegador

3. **Aguarde a abertura:**
   - O launcher detectará automaticamente o ambiente local
   - A aplicação abrirá em uma nova janela otimizada

### **Produção (Vercel):**

1. **Acesse o launcher:**
   - URL: `https://sistema-pastas-corporativas.vercel.app/launcher.html`

2. **Habilite pop-ups:**
   - Se necessário, habilite pop-ups no navegador
   - Clique em "Tentar Novamente" se houver problemas

### **Distribuição Offline:**

1. **Download dos arquivos:**
   ```
   launcher.html
   launcher-config.json (opcional)
   ```

2. **Edite as URLs no launcher.html:**
   ```javascript
   const CONFIG = {
     urlLocal: "http://localhost:5173/",
     urlProducao: "https://sua-url-producao.com/"
   };
   ```

3. **Distribua o arquivo HTML:**
   - Envie por email
   - Hospede em servidor web
   - Inclua em documentação

## 📱 Comportamento Mobile

### **Detecção Automática:**
O launcher detecta dispositivos móveis e:
- Exibe mensagem de redirecionamento
- Redireciona automaticamente para a aplicação
- Não tenta abrir pop-ups (que não funcionam bem em mobile)

### **User Agents Detectados:**
```javascript
/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
```

## ⚙️ Personalização Avançada

### **Modificar Dimensões da Janela:**
```javascript
const CONFIG = {
  largura: 1600,  // Largura em pixels
  altura: 1000,   // Altura em pixels
  // ...
};
```

### **Alterar Cores do Tema:**
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### **Customizar Logo:**
```html
<div class="logo">🏢</div> <!-- Substitua o emoji -->
```

### **Modificar Lista de Recursos:**
```html
<div class="app-features">
  <strong>🚀 Recursos da Aplicação:</strong>
  <ul>
    <li>Seu recurso personalizado 1</li>
    <li>Seu recurso personalizado 2</li>
    <!-- ... -->
  </ul>
</div>
```

## 🔍 Troubleshooting

### **Problema: Pop-up Bloqueado**
**Sintomas:** Janela não abre, mensagem de erro aparece
**Soluções:**
1. Habilitar pop-ups no navegador
2. Adicionar site à lista de exceções
3. Tentar em modo incógnito
4. Usar navegador diferente

### **Problema: Janela Não Centraliza**
**Causa:** Configurações de tela múltipla
**Solução:** Verificar função `calcularPosicao()` no código

### **Problema: Aplicação Não Carrega**
**Verificações:**
1. URL da aplicação está correta
2. Servidor está rodando
3. Não há bloqueios de CORS
4. Rede está funcionando

### **Problema: Launcher Não Fecha**
**Causa:** Configuração `autoCloseOnSuccess: false`
**Solução:** Alterar para `true` ou fechar manualmente

## 📊 Monitoramento e Analytics

### **Eventos Rastreados:**
- Tentativas de abertura
- Sucessos/falhas
- Tempo de carregamento
- Fechamento da aplicação

### **Logs Disponíveis:**
```javascript
console.log('Aplicação iniciada com sucesso');
console.error('Erro ao abrir aplicação:', error);
console.log('Janela fechada pelo usuário');
```

## 🌐 Integração com CI/CD

### **Build Automático:**
```yaml
# .github/workflows/deploy.yml
- name: Update Launcher URLs
  run: |
    sed -i 's|http://localhost:5173/|https://${{ secrets.VERCEL_URL }}/|g' launcher.html
```

### **Variáveis de Ambiente:**
```javascript
const urlProducao = process.env.VITE_APP_URL || "https://default-url.com/";
```

## 🎁 Recursos Extras

### **Atalhos de Teclado no Launcher:**
- `Space`: Tentar novamente
- `Escape`: Fechar launcher
- `Enter`: Focar na aplicação (se aberta)

### **Indicadores Visuais:**
- 🔄 Carregando
- ✅ Sucesso
- ❌ Erro
- ⚠️ Aviso

### **Responsividade:**
- Desktop: Janela pop-up otimizada
- Tablet: Redirecionamento ou janela menor
- Mobile: Redirecionamento direto

## 📋 Checklist de Deploy

### **Antes do Deploy:**
- [ ] URLs atualizadas no código
- [ ] Testes em diferentes navegadores
- [ ] Verificação de pop-ups
- [ ] Teste em dispositivos móveis
- [ ] Validação de HTTPS em produção

### **Pós-Deploy:**
- [ ] Launcher acessível via URL
- [ ] Abertura da aplicação funcionando
- [ ] Comportamento mobile correto
- [ ] Monitoramento de erros ativo

## 🔗 Links Úteis

- **Aplicação Principal:** `http://localhost:5173/`
- **Launcher Local:** `http://localhost:5173/launcher.html`
- **Produção:** `https://sistema-pastas-corporativas.vercel.app/launcher.html`
- **Configuração:** `launcher-config.json`

---

## 💡 Dicas de Uso

### **Para Desenvolvedores:**
- Use o launcher local durante desenvolvimento
- Configure URLs de staging/produção conforme necessário
- Monitore logs do console para debug

### **Para Usuários Finais:**
- Habilite pop-ups antes de usar
- Mantenha a aba do launcher aberta até a aplicação carregar
- Use o botão "Tentar Novamente" se houver problemas

### **Para Administradores:**
- Distribua o launcher como ponto de entrada oficial
- Configure allowlist de pop-ups corporativos
- Monitore métricas de uso e erros

**🎯 O sistema launcher está pronto para uso em produção!** 