# 📂 Guia de Drag and Drop Avançado

## 🎯 Funcionalidades Implementadas

### 1. **Movimentação PARA DENTRO** de Pastas
- **Como usar**: Arraste uma pasta e solte no **centro** de outra pasta
- **Feedback visual**: Anel azul + overlay com mensagem "Soltar aqui → dentro de..."
- **Resultado**: A pasta é movida para dentro da pasta de destino

### 2. **Reordenação ENTRE LINHAS** (Nova Funcionalidade!)
- **Como usar**: Arraste uma pasta e solte na **parte superior ou inferior** de outra pasta
- **Zonas de detecção**:
  - **25% superior**: Inserir ANTES da pasta (linha verde no topo)
  - **50% central**: Mover PARA DENTRO da pasta (anel azul)
  - **25% inferior**: Inserir DEPOIS da pasta (linha verde embaixo)

### 3. **Feedback Visual Inteligente**

#### ✅ Reordenação (Linhas Verdes)
- **Linha verde superior**: "Inserir [pasta] antes de [destino]"
- **Linha verde inferior**: "Inserir [pasta] depois de [destino]"

#### ✅ Movimentação Interna (Anel Azul)
- **Anel azul + overlay**: "Soltar [pasta] aqui → dentro de [destino]"

#### ❌ Movimento Inválido (Anel Vermelho)
- **Anel vermelho**: Quando tenta mover pasta para dentro de si mesma

### 4. **Validações Automáticas**
- ✅ **Reordenação**: Só permite entre pastas do mesmo nível
- ✅ **Movimentação**: Previne loops infinitos (pasta dentro de si mesma)
- ✅ **Feedback em tempo real**: Mostra se a operação é válida ou não

### 5. **Auto-Expansão de Pastas**
- **Comportamento**: Ao arrastar sobre uma pasta fechada por 800ms, ela se expande automaticamente
- **Benefício**: Facilita a navegação em hierarquias profundas

## 🚀 Como Usar

### Para **Reorganizar a Ordem** das Pastas:
1. Clique e segure uma pasta
2. Arraste até a **borda superior ou inferior** de outra pasta
3. Veja a **linha verde** indicando a posição
4. Solte para confirmar a reordenação

### Para **Mover Pasta Para Dentro** de Outra:
1. Clique e segure uma pasta
2. Arraste até o **centro** de outra pasta
3. Veja o **anel azul** e overlay de confirmação
4. Solte para mover para dentro

### Para **Mover para Área Raiz**:
1. Clique e segure uma pasta
2. Arraste para a **área de drop** no final da lista (ícone 🎯)
3. Ou arraste para qualquer área vazia (ícone 🏠)
4. Solte para mover para o nível raiz

## 💡 Dicas de Uso

- **Precisão**: O sistema detecta automaticamente sua intenção baseado na posição do mouse
- **Feedback instantâneo**: Sempre veja o feedback visual antes de soltar
- **Segurança**: Todas as operações são validadas e podem ser desfeitas (Ctrl+Z)
- **Hierarquia**: Reordenação só funciona entre pastas do mesmo nível (pai)

## 🎨 Cores do Feedback Visual

- 🟢 **Verde**: Reordenação entre linhas (antes/depois)
- 🔵 **Azul**: Movimentação para dentro de pasta
- 🔴 **Vermelho**: Operação inválida
- 🏠 **Azul claro**: Área raiz disponível

## ⚡ Performance

- **Auto-expansão**: 800ms de delay para evitar expansões acidentais
- **Estados limpos**: Todos os estados são resetados após cada operação
- **Histórico completo**: Todas as movimentações ficam no histórico para undo/redo

---

✨ **Agora a movimentação de pastas é muito mais intuitiva e precisa!** 