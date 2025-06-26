# 🚀 Sistema Launcher - Início Rápido

## ⚡ Uso Imediato

### **1. Desenvolvimento Local:**
```bash
# 1. Inicie o servidor
npm run dev

# 2. Acesse o launcher
http://localhost:5173/launcher.html
```

### **2. Produção:**
```
https://sistema-pastas-corporativas.vercel.app/launcher.html
```

## 🎯 O que o Launcher Faz

✅ **Abre a aplicação em janela dedicada** (1400x900px)  
✅ **Detecta ambiente automaticamente** (local/produção)  
✅ **Suporte mobile** com redirecionamento  
✅ **Sistema de retry** se pop-ups forem bloqueados  
✅ **Interface moderna** com feedback visual  

## 📱 Comportamento

- **Desktop**: Abre nova janela otimizada
- **Mobile**: Redireciona diretamente para a app
- **Pop-up bloqueado**: Mostra instruções e botão retry

## 🔧 Customização Rápida

**Alterar dimensões da janela:**
```javascript
// No launcher.html, linha ~225
largura: 1600,  // Nova largura
altura: 1000,   // Nova altura
```

**Alterar URLs:**
```javascript
// No launcher.html, linha ~220
urlLocal: "http://localhost:3000/",
urlProducao: "https://sua-url.com/",
```

## 📋 Checklist de Teste

- [ ] Abrir `launcher.html` no navegador
- [ ] Verificar se nova janela abre
- [ ] Testar botão "Tentar Novamente"
- [ ] Testar em dispositivo mobile
- [ ] Verificar dimensões da janela

## 🆘 Problemas Comuns

**Pop-up bloqueado:**
1. Habilitar pop-ups no navegador
2. Adicionar localhost às exceções
3. Usar modo incógnito

**Janela não abre:**
1. Verificar se aplicação está rodando
2. Conferir URLs no código
3. Testar em outro navegador

---

**📄 Documentação completa:** `LAUNCHER-GUIDE.md` 