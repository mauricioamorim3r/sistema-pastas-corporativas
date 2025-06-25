# Sistema de Favoritos e Cores Personalizadas

## 🎨 **Seletor de Cor da Fonte - NOVO!**

### ✅ **Funcionalidade Implementada**

Agora é possível escolher **independentemente** a cor da pasta e a cor da fonte, oferecendo total personalização visual.

#### **Onde Encontrar:**
- **Modal de Criar Pasta:** Seção "Cor da Pasta" e "Cor da Fonte" lado a lado
- **Modal de Editar Pasta:** Seção expandida com ambos os seletores
- **Preview em Tempo Real:** Visualização imediata da combinação

#### **Cores de Fonte Disponíveis:**
- 🤍 **Branco** (`text-white`)
- ⚫ **Preto** (`text-black`) 
- 🔘 **Cinza Escuro** (`text-gray-800`)
- ⚪ **Cinza Claro** (`text-gray-300`)
- 🔵 **Azul** (`text-blue-600`)
- 🟢 **Verde** (`text-green-600`)
- 🔴 **Vermelho** (`text-red-600`)
- 🟡 **Amarelo** (`text-yellow-600`)
- 🟣 **Roxo** (`text-purple-600`)
- 🩷 **Rosa** (`text-pink-600`)
- 🟠 **Laranja** (`text-orange-600`)
- 🔷 **Turquesa** (`text-teal-600`)

#### **UX/UI Melhorada:**
- **Grid Responsivo:** Cores organizadas em grid 4 colunas
- **Preview Instantâneo:** Box mostrando pasta + nome + responsável
- **Seleção Visual:** Ring azul na cor selecionada
- **Labels Claros:** "Cor da Pasta" vs "Cor da Fonte"
- **Hover Effects:** Escala 110% ao passar mouse
- **Acessibilidade:** Tooltips e aria-labels

### 🔧 **Implementação Técnica**

#### **Tipos Atualizados:**
```typescript
export interface NewFolderData {
  name: string;
  responsible: string;
  path: string;
  color: string;
  textColor?: string; // ← NOVO CAMPO
  tags: string[];
}
```

#### **Componentes Modificados:**
1. **`EditFolderModalContent.tsx`** - Seletores lado a lado + preview
2. **`CreateFolderModalContent.tsx`** - Grid responsivo + preview
3. **`types.ts`** - Novo campo `textColor` opcional
4. **`constants.ts`** - Valor padrão `text-white`
5. **`App.tsx`** - Uso do textColor personalizado

#### **Exemplo de Uso:**
```tsx
// Preview da combinação
<div className={`${formData.color} ${formData.textColor || 'text-white'} p-4 rounded-lg`}>
  <FolderPlus size={24} className="mr-3" />
  <div>
    <div className="font-medium text-lg">{formData.name}</div>
    <div className="text-sm opacity-80">{formData.responsible}</div>
  </div>
</div>
```

---

## ⭐ **Sistema de Favoritos - Como Funciona**

### 🎯 **O que acontece ao marcar como favorito?**

#### **1. Adicionar aos Favoritos**
Quando você clica na **estrela** ⭐ ao lado de uma pasta:

1. **Cópia Criada:** Uma cópia das informações da pasta é salva
2. **ID Único:** Gera ID `fav-{timestamp}` para o favorito
3. **Referência Original:** Mantém link com `originalFolderId`
4. **Data de Adição:** Registra quando foi favoritado
5. **Armazenamento Local:** Salva no `localStorage` do navegador

```javascript
const newFavorite: FavoriteFolder = {
  id: `fav-${Date.now()}`,
  name: folder.name,
  path: folder.path,
  color: folder.color,
  textColor: folder.textColor,
  responsible: folder.responsible,
  addedAt: new Date().toLocaleDateString('pt-BR'),
  originalFolderId: folder.id
};
```

#### **2. Acesso ao Painel de Favoritos**
- **Botão no Header:** Ícone ⭐ abre painel lateral direito
- **Largura:** 320px fixo
- **Posição:** Sobrepõe interface principal
- **Z-index:** 50 (acima de tudo)

#### **3. Funcionalidades do Painel**

##### **🔍 Busca Inteligente:**
- **Campos Pesquisáveis:** Nome, responsável, caminho
- **Busca em Tempo Real:** Filtra conforme digita
- **Case Insensitive:** Não diferencia maiúsculas/minúsculas

##### **📁 Lista Visual:**
- **Cards Coloridos:** Mesma cor da pasta original
- **Informações Completas:** Nome, responsável, caminho
- **Data de Adição:** "Adicionado em DD/MM/AAAA"
- **Status Visual:** Destaque se pasta está selecionada

##### **⚠️ Validação de Integridade:**
- **Pasta Órfã:** Ícone ⚠️ se pasta original foi deletada
- **Link Quebrado:** Opção de remover favoritos órfãos
- **Sincronização:** Busca pasta atual na estrutura

#### **4. Interações Disponíveis**

##### **Clicar na Pasta Favorita:**
1. Fecha o painel de favoritos
2. Seleciona a pasta original na árvore principal
3. Abre painel de detalhes (se fechado)
4. Destaca pasta selecionada

##### **Remover dos Favoritos:**
1. Clica na estrela ⭐ preenchida
2. Remove da lista de favoritos
3. Atualiza localStorage
4. Atualiza contadores

### 📊 **Dados Armazenados**

#### **Estrutura do Favorito:**
```typescript
interface FavoriteFolder {
  id: string;                    // "fav-1703123456789"
  name: string;                  // "Documentos Murphy"
  path?: string;                 // "C:\Projetos\Murphy"
  color: string;                 // "bg-emerald-700"
  textColor?: string;            // "text-white"
  responsible?: string;          // "Ricardo Alves"
  addedAt: string;              // "20/03/2025"
  originalFolderId: string | number; // "murphy"
}
```

#### **Armazenamento Local:**
- **Chave:** `favorite-folders`
- **Formato:** JSON array
- **Persistência:** Mantém entre sessões
- **Sincronização:** Automática entre abas

### 🎨 **Design e UX**

#### **Estados Visuais:**
- **Não Favoritado:** ⭐ Estrela vazia (transparente)
- **Favoritado:** ⭐ Estrela preenchida (amarela)
- **Hover:** Background semi-transparente
- **Selecionado:** Border azul + background azul claro

#### **Responsividade:**
- **Desktop:** Painel lateral 320px
- **Mobile:** Painel fullscreen
- **Tablet:** Painel 280px

#### **Acessibilidade:**
- **Tooltips:** "Adicionar/Remover dos Favoritos"
- **Aria-labels:** Descrições para screen readers
- **Keyboard Navigation:** Tab entre elementos
- **Focus Indicators:** Rings visuais

### 🔄 **Fluxos de Uso**

#### **Fluxo 1: Adicionar Favorito**
1. Navegar pela árvore de pastas
2. Hover sobre pasta desejada
3. Clicar na estrela ⭐ vazia
4. Estrela fica preenchida ⭐
5. Toast confirma "Adicionado aos favoritos"

#### **Fluxo 2: Acessar Favoritos**
1. Clicar no botão ⭐ no header
2. Painel lateral abre
3. Ver lista de pastas favoritadas
4. Buscar se necessário
5. Clicar na pasta desejada
6. Painel fecha + pasta selecionada

#### **Fluxo 3: Remover Favorito**
1. Abrir painel de favoritos
2. Clicar na estrela ⭐ da pasta
3. Pasta removida da lista
4. Contador atualizado
5. Toast confirma "Removido dos favoritos"

### 📈 **Benefícios**

#### **Produtividade:**
- **Acesso Rápido:** Pastas mais usadas sempre visíveis
- **Busca Eficiente:** Filtro em tempo real
- **Navegação Direta:** Clique → seleciona pasta

#### **Organização:**
- **Categorização:** Agrupa pastas importantes
- **Histórico Visual:** Data de quando foi favoritada
- **Status Claro:** Diferencia favoritadas vs normais

#### **Usabilidade:**
- **Interface Intuitiva:** Padrão conhecido (estrela)
- **Feedback Visual:** Estados claros
- **Persistência:** Mantém entre sessões

### 🛠️ **Integração com Outras Funcionalidades**

#### **Sistema de Histórico:**
- Favoritar/desfavoritar **NÃO** cria entrada no histórico
- Ações são instantâneas e reversíveis

#### **Exportar/Importar:**
- Favoritos **NÃO** são incluídos na exportação JSON
- São específicos do usuário/dispositivo

#### **Busca Global:**
- Favoritos **NÃO** aparecem na busca principal
- Têm busca própria no painel

#### **Tema Escuro/Claro:**
- Cores automáticas conforme tema
- Contraste garantido
- Ícones adaptáveis

---

## 🚀 **Status: 100% Implementado**

### ✅ **Cor da Fonte:**
- Seletor completo com 12 cores
- Preview em tempo real
- Grid responsivo
- Integração em criar e editar pasta

### ✅ **Sistema de Favoritos:**
- Painel lateral funcional
- Busca em tempo real
- Persistência local
- Validação de integridade
- Design responsivo e acessível

**Todas as funcionalidades estão funcionando perfeitamente e prontas para uso!** 🎉 