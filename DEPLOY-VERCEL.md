<<<<<<< HEAD
# Deploy no Vercel - Sistema de Pastas Corporativas

## 🚀 Como fazer o deploy

### 1. Preparação do Repositório
Primeiro, certifique-se de que o código está em um repositório Git (GitHub, GitLab, ou Bitbucket).

### 2. Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte seu repositório Git
4. Selecione o repositório do Sistema de Pastas Corporativas
5. Configure o projeto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Configurações Automáticas
O projeto já possui um arquivo `vercel.json` configurado que:
- Define o framework como Vite
- Configura rewrites para SPA (Single Page Application)
- Adiciona headers de segurança
- Configura cache para service worker

### 4. Variáveis de Ambiente (Opcional)
Se você usar funcionalidades que dependem de APIs externas:
- `GEMINI_API_KEY`: Para funcionalidades de IA (opcional)
- `SENTRY_DSN`: Para monitoramento de erros (opcional)

### 5. URLs de Acesso
Após o deploy, você receberá:
- **URL de produção**: `https://seu-projeto.vercel.app`
- **URLs de preview**: Para cada branch/commit

## 🔧 Configurações Incluídas

### vercel.json
- ✅ Configuração automática do framework Vite
- ✅ Redirecionamentos para SPA
- ✅ Headers de segurança
- ✅ Cache otimizado para service worker

### Características do Deploy
- ✅ Deploy automático a cada push
- ✅ Preview deployments para branches
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Compressão automática
- ✅ Cache inteligente

## 📱 Funcionalidades Mantidas
- ✅ Sistema de pastas offline
- ✅ Favoritos locais
- ✅ Histórico de navegação
- ✅ Temas personalizados
- ✅ Service Worker para cache
- ✅ Responsividade completa

## 🆓 Limites do Plano Gratuito
- **Builds**: 100 por mês
- **Bandwidth**: 100GB por mês
- **Domains**: 1 custom domain
- **Team members**: 1
- **Serverless functions**: 1 concurrent

## 🔄 Deployments Automáticos
- Cada push para a branch principal gera um deploy de produção
- Cada push para outras branches gera um preview deploy
- URLs de preview são compartilháveis para testes

## 🛠️ Comandos Úteis
```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy via CLI
vercel

# Deploy de produção via CLI
vercel --prod
```

## 📋 Checklist de Deploy
- [ ] Código commitado no Git
- [ ] Repositório público ou conectado ao Vercel
- [ ] Arquivo vercel.json configurado ✅
- [ ] Build local testado (`npm run build`)
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] Deploy realizado com sucesso

## 🎯 Próximos Passos
Após o deploy bem-sucedido:
1. Teste todas as funcionalidades na URL de produção
2. Configure um domínio customizado (opcional)
3. Configure analytics do Vercel (opcional)
=======
# Deploy no Vercel - Sistema de Pastas Corporativas

## 🚀 Como fazer o deploy

### 1. Preparação do Repositório
Primeiro, certifique-se de que o código está em um repositório Git (GitHub, GitLab, ou Bitbucket).

### 2. Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte seu repositório Git
4. Selecione o repositório do Sistema de Pastas Corporativas
5. Configure o projeto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Configurações Automáticas
O projeto já possui um arquivo `vercel.json` configurado que:
- Define o framework como Vite
- Configura rewrites para SPA (Single Page Application)
- Adiciona headers de segurança
- Configura cache para service worker

### 4. Variáveis de Ambiente (Opcional)
Se você usar funcionalidades que dependem de APIs externas:
- `GEMINI_API_KEY`: Para funcionalidades de IA (opcional)
- `SENTRY_DSN`: Para monitoramento de erros (opcional)

### 5. URLs de Acesso
Após o deploy, você receberá:
- **URL de produção**: `https://seu-projeto.vercel.app`
- **URLs de preview**: Para cada branch/commit

## 🔧 Configurações Incluídas

### vercel.json
- ✅ Configuração automática do framework Vite
- ✅ Redirecionamentos para SPA
- ✅ Headers de segurança
- ✅ Cache otimizado para service worker

### Características do Deploy
- ✅ Deploy automático a cada push
- ✅ Preview deployments para branches
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Compressão automática
- ✅ Cache inteligente

## 📱 Funcionalidades Mantidas
- ✅ Sistema de pastas offline
- ✅ Favoritos locais
- ✅ Histórico de navegação
- ✅ Temas personalizados
- ✅ Service Worker para cache
- ✅ Responsividade completa

## 🆓 Limites do Plano Gratuito
- **Builds**: 100 por mês
- **Bandwidth**: 100GB por mês
- **Domains**: 1 custom domain
- **Team members**: 1
- **Serverless functions**: 1 concurrent

## 🔄 Deployments Automáticos
- Cada push para a branch principal gera um deploy de produção
- Cada push para outras branches gera um preview deploy
- URLs de preview são compartilháveis para testes

## 🛠️ Comandos Úteis
```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy via CLI
vercel

# Deploy de produção via CLI
vercel --prod
```

## 📋 Checklist de Deploy
- [ ] Código commitado no Git
- [ ] Repositório público ou conectado ao Vercel
- [ ] Arquivo vercel.json configurado ✅
- [ ] Build local testado (`npm run build`)
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] Deploy realizado com sucesso

## 🎯 Próximos Passos
Após o deploy bem-sucedido:
1. Teste todas as funcionalidades na URL de produção
2. Configure um domínio customizado (opcional)
3. Configure analytics do Vercel (opcional)
>>>>>>> origin/main
4. Monitore performance e usage 