<<<<<<< HEAD
# 🗄️ Especificação do Banco de Dados
## Sistema de Pastas Corporativas - Evolução para Persistência Robusta

### 📋 **Visão Geral**

O sistema atual utiliza `localStorage` para persistir dados, mas para escalar e oferecer recursos empresariais, planejamos a migração para um banco de dados estruturado. Esta especificação detalha a arquitetura de dados e estratégia de migração.

---

## 🎯 **Objetivos da Migração**

### **Benefícios Alcançados:**
- ✅ **Templates Completos**: Salvamento de estruturas inteiras de pastas
- ✅ **Categorização Avançada**: Sistema de tags e categorias
- ✅ **Versionamento**: Controle de versões dos templates
- ✅ **Compartilhamento**: Templates marcados como compartilháveis
- ✅ **Estatísticas de Uso**: Tracking de aplicação de templates
- ✅ **Import/Export**: Backup e migração de templates

### **Limitações Atuais (localStorage):**
- ❌ Limite de ~5-10MB por domínio
- ❌ Não há sincronização entre dispositivos  
- ❌ Sem controle de acesso/usuários
- ❌ Backup manual necessário
- ❌ Sem histórico de alterações
- ❌ Performance degradada com grandes volumes

### **Benefícios com Banco de Dados:**
- ✅ Capacidade ilimitada de armazenamento
- ✅ Sincronização automática multi-dispositivo
- ✅ Sistema de usuários e permissões
- ✅ Backup automático e redundância
- ✅ Histórico completo de mudanças
- ✅ Queries otimizadas e indexação
- ✅ Colaboração em tempo real
- ✅ Analytics avançados

---

## 🏗️ **Arquitetura de Dados**

### **1. Schema Principal (DatabaseSchema)**

```typescript
interface DatabaseSchema {
  // Templates de organização (expandido)
  layouts: CompleteSavedLayout[];
  
  // Estruturas de pastas (separado dos templates)
  folders: Folder[];
  
  // Sistema de favoritos
  favorites: FavoriteFolderData[];
  
  // Monitoramento de pastas
  monitoring: FolderMonitoring[];
  
  // Histórico de ações (auditoria)
  history: HistoryEntry[];
  
  // Configurações da aplicação
  settings: ApplicationSettings;
  
  // Metadados do banco
  metadata: DatabaseMetadata;
}
```

### **2. Templates Completos (CompleteSavedLayout)**

**Dados Salvos por Template:**
- 📁 **Estrutura Completa**: Todas as pastas e subpastas
- 🔍 **Estado de Filtros**: Busca ativa, responsável selecionado
- 👁️ **Estado Visual**: Pastas expandidas, pasta selecionada
- 🎨 **Configuração UI**: Largura painéis, tema, visibilidade
- 🏷️ **Metadados**: Categoria, tags, descrição, versionamento
- 📊 **Estatísticas**: Uso, criação, última aplicação

**Casos de Uso:**
- **"Gestão de Projetos 2024"**: Template com estrutura específica para projetos
- **"Auditoria Fiscal"**: Organização otimizada para documentos fiscais  
- **"Contratos Teekay"**: Template focado no cliente Teekay
- **"Estrutura Departamental"**: Organização por departamentos

### **3. Sistema de Categorias**

```typescript
enum LayoutCategory {
  PROJECT = 'Projetos',           // Templates para gestão de projetos
  ADMINISTRATIVE = 'Administrativo', // Documentos administrativos
  PERSONAL = 'Pessoal',          // Organização pessoal
  DEPARTMENT = 'Departamental',   // Por departamento/equipe
  TEMPORARY = 'Temporário',       // Templates temporários
  TEMPLATE = 'Template'           // Templates compartilháveis
}
```

---

## 🚀 **Opções de Banco de Dados**

### **1. IndexedDB (Curto Prazo)**
```typescript
// Implementação navegador-nativa
enum DatabaseProvider {
  INDEXED_DB = 'indexedDB'  // ~250MB+, offline-first
}
```

**Vantagens:**
- ✅ Sem servidor necessário
- ✅ Capacidade muito maior que localStorage
- ✅ Transações ACID
- ✅ Funciona offline

**Desvantagens:**
- ❌ Ainda local ao dispositivo
- ❌ API complexa
- ❌ Sem sincronização

### **2. Firebase (Médio Prazo)**
```typescript
enum DatabaseProvider {
  FIREBASE = 'firebase'  // Firestore + Auth
}
```

**Vantagens:**
- ✅ Sincronização em tempo real
- ✅ Autenticação integrada
- ✅ Escalabilidade automática
- ✅ Backup automático

**Configuração:**
```typescript
// Firebase Collections
/users/{userId}/layouts/{layoutId}
/users/{userId}/folders/{folderId}
/users/{userId}/settings
/shared-templates/{templateId}  // Templates públicos
```

### **3. Supabase (Médio Prazo)**
```typescript
enum DatabaseProvider {
  SUPABASE = 'supabase'  // PostgreSQL + Auth
}
```

**Vantagens:**
- ✅ PostgreSQL completo
- ✅ Row Level Security (RLS)
- ✅ APIs automáticas
- ✅ Self-hosting option

### **4. MongoDB (Longo Prazo)**
```typescript
enum DatabaseProvider {
  MONGODB = 'mongodb'  // Para volumes enterprise
}
```

**Estrutura:**
```javascript
// Users Collection
{
  _id: ObjectId,
  email: "user@company.com",
  name: "João Silva",
  role: "admin|user|viewer",
  company: "TeeKay Corp",
  createdAt: ISODate,
  settings: ApplicationSettings
}

// Layouts Collection
{
  _id: ObjectId,
  userId: ObjectId,
  name: "Gestão Projetos 2024",
  category: "Projetos",
  isTemplate: true,
  isPublic: false,
  data: CompleteSavedLayout,
  stats: LayoutStats,
  permissions: ["read", "write", "share"]
}

// Folders Collection  
{
  _id: ObjectId,
  userId: ObjectId,
  layoutId: ObjectId,
  parentId: ObjectId,
  data: Folder,
  path: "PRODUÇÃO/Contratos/Teekay"
}
```

---

## 📈 **Estratégia de Migração**

### **Fase 1: Preparação (Atual)**
- ✅ **Estruturas de Dados**: Interfaces TypeScript definidas
- ✅ **Templates Expandidos**: Sistema de salvamento completo
- ✅ **Compatibilidade**: Migração automática de layouts antigos
- ✅ **Categorização**: Sistema de tags e categorias

### **Fase 2: IndexedDB (2 semanas)**
```typescript
// Database Manager
class DatabaseManager {
  private provider: DatabaseProvider = DatabaseProvider.INDEXED_DB;
  
  async saveLayout(layout: CompleteSavedLayout): Promise<void>
  async loadLayouts(): Promise<CompleteSavedLayout[]>
  async migrateFromLocalStorage(): Promise<void>
}
```

### **Fase 3: Firebase/Supabase (1-2 meses)**
```typescript
// Cloud Database
class CloudDatabaseManager extends DatabaseManager {
  async syncWithCloud(): Promise<void>
  async shareTemplate(templateId: string): Promise<string>
  async collaborateRealTime(layoutId: string): Promise<void>
}
```

### **Fase 4: Features Avançadas (3-6 meses)**
- 👥 **Multi-usuário**: Sistema de contas e equipes
- 🔄 **Sincronização**: Tempo real entre dispositivos
- 📊 **Analytics**: Dashboard de uso de templates
- 🔐 **Permissões**: Controle granular de acesso
- 🔍 **Busca Avançada**: Full-text search nos templates
- 📱 **API**: Endpoints para integrações

---

## 🛡️ **Segurança e Compliance**

### **Controle de Acesso**
```typescript
interface UserPermissions {
  layouts: {
    create: boolean;
    read: string[];      // IDs dos layouts
    update: string[];
    delete: string[];
    share: string[];
  };
  folders: {
    sensitive: boolean;   // Acesso a pastas sensíveis
  };
}
```

### **Auditoria**
```typescript
interface AuditLog {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'share' | 'apply';
  entityType: 'layout' | 'folder' | 'template';
  entityId: string;
  timestamp: string;
  metadata: {
    ip?: string;
    userAgent?: string;
    changes?: any[];
  };
}
```

---

## 📊 **Métricas e Analytics**

### **Dashboard de Uso**
- 📈 Templates mais utilizados
- 👥 Usuários mais ativos
- 🕒 Padrões de uso por horário
- 📁 Estruturas de pastas mais comuns
- 🏷️ Tags mais populares

### **Otimizações**
- 🚀 Cache inteligente de templates
- 🗜️ Compressão de dados grandes
- 📱 Progressive loading
- 🔄 Sincronização incremental

---

## 🎯 **Próximos Passos**

### **Imediato (Esta Semana)**
1. ✅ **Implementação Completa**: Sistema de templates expandido
2. ✅ **Categorização**: Organização por categoria e tags
3. ✅ **Import/Export**: Backup e compartilhamento
4. ✅ **Migração Legacy**: Compatibilidade com layouts antigos

### **Curto Prazo (2-4 semanas)**
1. 🔄 **IndexedDB**: Migração do localStorage
2. 📊 **Analytics**: Tracking de uso dos templates
3. 🔍 **Busca**: Filtros avançados por categoria/tags
4. 📱 **Performance**: Otimização para grandes volumes

### **Médio Prazo (2-3 meses)**
1. ☁️ **Cloud Database**: Firebase ou Supabase
2. 👥 **Multi-usuário**: Sistema de contas
3. 🔄 **Sincronização**: Entre dispositivos
4. 🤝 **Colaboração**: Templates compartilhados

### **Longo Prazo (6+ meses)**
1. 🏢 **Enterprise**: MongoDB + microserviços
2. 📊 **BI**: Dashboard executivo
3. 🔗 **Integrações**: APIs para sistemas externos
4. 🤖 **IA**: Sugestões automáticas de organização

---

## 💡 **Conclusão**

O sistema atual já oferece uma base sólida com **templates completos** que salvam toda a estrutura de pastas, filtros e estado visual. A migração para banco de dados será incremental, mantendo sempre a compatibilidade e melhorando progressivamente as capacidades de:

- 📁 **Gestão de Templates**
- 🏷️ **Organização por Categorias** 
- 📊 **Analytics de Uso**
- 🤝 **Colaboração em Equipe**
- ☁️ **Sincronização Multi-dispositivo**

=======
# 🗄️ Especificação do Banco de Dados
## Sistema de Pastas Corporativas - Evolução para Persistência Robusta

### 📋 **Visão Geral**

O sistema atual utiliza `localStorage` para persistir dados, mas para escalar e oferecer recursos empresariais, planejamos a migração para um banco de dados estruturado. Esta especificação detalha a arquitetura de dados e estratégia de migração.

---

## 🎯 **Objetivos da Migração**

### **Benefícios Alcançados:**
- ✅ **Templates Completos**: Salvamento de estruturas inteiras de pastas
- ✅ **Categorização Avançada**: Sistema de tags e categorias
- ✅ **Versionamento**: Controle de versões dos templates
- ✅ **Compartilhamento**: Templates marcados como compartilháveis
- ✅ **Estatísticas de Uso**: Tracking de aplicação de templates
- ✅ **Import/Export**: Backup e migração de templates

### **Limitações Atuais (localStorage):**
- ❌ Limite de ~5-10MB por domínio
- ❌ Não há sincronização entre dispositivos  
- ❌ Sem controle de acesso/usuários
- ❌ Backup manual necessário
- ❌ Sem histórico de alterações
- ❌ Performance degradada com grandes volumes

### **Benefícios com Banco de Dados:**
- ✅ Capacidade ilimitada de armazenamento
- ✅ Sincronização automática multi-dispositivo
- ✅ Sistema de usuários e permissões
- ✅ Backup automático e redundância
- ✅ Histórico completo de mudanças
- ✅ Queries otimizadas e indexação
- ✅ Colaboração em tempo real
- ✅ Analytics avançados

---

## 🏗️ **Arquitetura de Dados**

### **1. Schema Principal (DatabaseSchema)**

```typescript
interface DatabaseSchema {
  // Templates de organização (expandido)
  layouts: CompleteSavedLayout[];
  
  // Estruturas de pastas (separado dos templates)
  folders: Folder[];
  
  // Sistema de favoritos
  favorites: FavoriteFolderData[];
  
  // Monitoramento de pastas
  monitoring: FolderMonitoring[];
  
  // Histórico de ações (auditoria)
  history: HistoryEntry[];
  
  // Configurações da aplicação
  settings: ApplicationSettings;
  
  // Metadados do banco
  metadata: DatabaseMetadata;
}
```

### **2. Templates Completos (CompleteSavedLayout)**

**Dados Salvos por Template:**
- 📁 **Estrutura Completa**: Todas as pastas e subpastas
- 🔍 **Estado de Filtros**: Busca ativa, responsável selecionado
- 👁️ **Estado Visual**: Pastas expandidas, pasta selecionada
- 🎨 **Configuração UI**: Largura painéis, tema, visibilidade
- 🏷️ **Metadados**: Categoria, tags, descrição, versionamento
- 📊 **Estatísticas**: Uso, criação, última aplicação

**Casos de Uso:**
- **"Gestão de Projetos 2024"**: Template com estrutura específica para projetos
- **"Auditoria Fiscal"**: Organização otimizada para documentos fiscais  
- **"Contratos Teekay"**: Template focado no cliente Teekay
- **"Estrutura Departamental"**: Organização por departamentos

### **3. Sistema de Categorias**

```typescript
enum LayoutCategory {
  PROJECT = 'Projetos',           // Templates para gestão de projetos
  ADMINISTRATIVE = 'Administrativo', // Documentos administrativos
  PERSONAL = 'Pessoal',          // Organização pessoal
  DEPARTMENT = 'Departamental',   // Por departamento/equipe
  TEMPORARY = 'Temporário',       // Templates temporários
  TEMPLATE = 'Template'           // Templates compartilháveis
}
```

---

## 🚀 **Opções de Banco de Dados**

### **1. IndexedDB (Curto Prazo)**
```typescript
// Implementação navegador-nativa
enum DatabaseProvider {
  INDEXED_DB = 'indexedDB'  // ~250MB+, offline-first
}
```

**Vantagens:**
- ✅ Sem servidor necessário
- ✅ Capacidade muito maior que localStorage
- ✅ Transações ACID
- ✅ Funciona offline

**Desvantagens:**
- ❌ Ainda local ao dispositivo
- ❌ API complexa
- ❌ Sem sincronização

### **2. Firebase (Médio Prazo)**
```typescript
enum DatabaseProvider {
  FIREBASE = 'firebase'  // Firestore + Auth
}
```

**Vantagens:**
- ✅ Sincronização em tempo real
- ✅ Autenticação integrada
- ✅ Escalabilidade automática
- ✅ Backup automático

**Configuração:**
```typescript
// Firebase Collections
/users/{userId}/layouts/{layoutId}
/users/{userId}/folders/{folderId}
/users/{userId}/settings
/shared-templates/{templateId}  // Templates públicos
```

### **3. Supabase (Médio Prazo)**
```typescript
enum DatabaseProvider {
  SUPABASE = 'supabase'  // PostgreSQL + Auth
}
```

**Vantagens:**
- ✅ PostgreSQL completo
- ✅ Row Level Security (RLS)
- ✅ APIs automáticas
- ✅ Self-hosting option

### **4. MongoDB (Longo Prazo)**
```typescript
enum DatabaseProvider {
  MONGODB = 'mongodb'  // Para volumes enterprise
}
```

**Estrutura:**
```javascript
// Users Collection
{
  _id: ObjectId,
  email: "user@company.com",
  name: "João Silva",
  role: "admin|user|viewer",
  company: "TeeKay Corp",
  createdAt: ISODate,
  settings: ApplicationSettings
}

// Layouts Collection
{
  _id: ObjectId,
  userId: ObjectId,
  name: "Gestão Projetos 2024",
  category: "Projetos",
  isTemplate: true,
  isPublic: false,
  data: CompleteSavedLayout,
  stats: LayoutStats,
  permissions: ["read", "write", "share"]
}

// Folders Collection  
{
  _id: ObjectId,
  userId: ObjectId,
  layoutId: ObjectId,
  parentId: ObjectId,
  data: Folder,
  path: "PRODUÇÃO/Contratos/Teekay"
}
```

---

## 📈 **Estratégia de Migração**

### **Fase 1: Preparação (Atual)**
- ✅ **Estruturas de Dados**: Interfaces TypeScript definidas
- ✅ **Templates Expandidos**: Sistema de salvamento completo
- ✅ **Compatibilidade**: Migração automática de layouts antigos
- ✅ **Categorização**: Sistema de tags e categorias

### **Fase 2: IndexedDB (2 semanas)**
```typescript
// Database Manager
class DatabaseManager {
  private provider: DatabaseProvider = DatabaseProvider.INDEXED_DB;
  
  async saveLayout(layout: CompleteSavedLayout): Promise<void>
  async loadLayouts(): Promise<CompleteSavedLayout[]>
  async migrateFromLocalStorage(): Promise<void>
}
```

### **Fase 3: Firebase/Supabase (1-2 meses)**
```typescript
// Cloud Database
class CloudDatabaseManager extends DatabaseManager {
  async syncWithCloud(): Promise<void>
  async shareTemplate(templateId: string): Promise<string>
  async collaborateRealTime(layoutId: string): Promise<void>
}
```

### **Fase 4: Features Avançadas (3-6 meses)**
- 👥 **Multi-usuário**: Sistema de contas e equipes
- 🔄 **Sincronização**: Tempo real entre dispositivos
- 📊 **Analytics**: Dashboard de uso de templates
- 🔐 **Permissões**: Controle granular de acesso
- 🔍 **Busca Avançada**: Full-text search nos templates
- 📱 **API**: Endpoints para integrações

---

## 🛡️ **Segurança e Compliance**

### **Controle de Acesso**
```typescript
interface UserPermissions {
  layouts: {
    create: boolean;
    read: string[];      // IDs dos layouts
    update: string[];
    delete: string[];
    share: string[];
  };
  folders: {
    sensitive: boolean;   // Acesso a pastas sensíveis
  };
}
```

### **Auditoria**
```typescript
interface AuditLog {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'share' | 'apply';
  entityType: 'layout' | 'folder' | 'template';
  entityId: string;
  timestamp: string;
  metadata: {
    ip?: string;
    userAgent?: string;
    changes?: any[];
  };
}
```

---

## 📊 **Métricas e Analytics**

### **Dashboard de Uso**
- 📈 Templates mais utilizados
- 👥 Usuários mais ativos
- 🕒 Padrões de uso por horário
- 📁 Estruturas de pastas mais comuns
- 🏷️ Tags mais populares

### **Otimizações**
- 🚀 Cache inteligente de templates
- 🗜️ Compressão de dados grandes
- 📱 Progressive loading
- 🔄 Sincronização incremental

---

## 🎯 **Próximos Passos**

### **Imediato (Esta Semana)**
1. ✅ **Implementação Completa**: Sistema de templates expandido
2. ✅ **Categorização**: Organização por categoria e tags
3. ✅ **Import/Export**: Backup e compartilhamento
4. ✅ **Migração Legacy**: Compatibilidade com layouts antigos

### **Curto Prazo (2-4 semanas)**
1. 🔄 **IndexedDB**: Migração do localStorage
2. 📊 **Analytics**: Tracking de uso dos templates
3. 🔍 **Busca**: Filtros avançados por categoria/tags
4. 📱 **Performance**: Otimização para grandes volumes

### **Médio Prazo (2-3 meses)**
1. ☁️ **Cloud Database**: Firebase ou Supabase
2. 👥 **Multi-usuário**: Sistema de contas
3. 🔄 **Sincronização**: Entre dispositivos
4. 🤝 **Colaboração**: Templates compartilhados

### **Longo Prazo (6+ meses)**
1. 🏢 **Enterprise**: MongoDB + microserviços
2. 📊 **BI**: Dashboard executivo
3. 🔗 **Integrações**: APIs para sistemas externos
4. 🤖 **IA**: Sugestões automáticas de organização

---

## 💡 **Conclusão**

O sistema atual já oferece uma base sólida com **templates completos** que salvam toda a estrutura de pastas, filtros e estado visual. A migração para banco de dados será incremental, mantendo sempre a compatibilidade e melhorando progressivamente as capacidades de:

- 📁 **Gestão de Templates**
- 🏷️ **Organização por Categorias** 
- 📊 **Analytics de Uso**
- 🤝 **Colaboração em Equipe**
- ☁️ **Sincronização Multi-dispositivo**

>>>>>>> origin/main
Esta especificação garante que temos uma estratégia clara para evoluir de um sistema de documentos pessoal para uma **plataforma empresarial robusta** de gestão documental. 