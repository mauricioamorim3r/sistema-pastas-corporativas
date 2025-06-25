# Sistema de Monitoramento de Pastas Favoritas

## 📋 Visão Geral

O Sistema de Monitoramento permite acompanhar em tempo real todas as alterações que ocorrem nas pastas marcadas como favoritas. É uma funcionalidade avançada que oferece notificações automáticas, filtros por tipo de arquivo e cronômetros para monitoramento temporal.

## 🔔 Funcionalidades Principais

### 1. Monitoramento em Tempo Real
- **Detecção automática** de arquivos criados, modificados ou excluídos
- **Notificações instantâneas** com som configurável
- **Atualização a cada 5 segundos** (configurável)
- **Persistência** entre sessões do navegador

### 2. Filtros Inteligentes por Tipo de Arquivo
- **PDF**: Documentos em formato PDF
- **Word**: Documentos .doc e .docx
- **Excel**: Planilhas .xls e .xlsx
- **PowerPoint**: Apresentações .ppt e .pptx
- **Texto**: Arquivos .txt
- **Imagens**: .jpg, .png, .gif, etc.
- **Todos os tipos**: Monitoramento completo

### 3. Sistema de Cronômetro (Timer)
- **Unidades flexíveis**: Horas, Dias, Semanas, Meses
- **Contagem regressiva** em tempo real
- **Notificação de expiração** com som diferenciado
- **Descrição personalizada** para cada timer
- **Persistência** - continua funcionando após recarregar página

### 4. Central de Notificações
- **Histórico completo** de todas as alterações
- **Status de leitura** (lida/não lida)
- **Informações detalhadas**: Nome, tipo, tamanho, horário
- **Limite configurável** de notificações por pasta
- **Limpeza em lote** de notificações

## 🚀 Como Usar

### Passo 1: Marcar Pasta como Favorita
```
1. Clique na estrela (⭐) ao lado de qualquer pasta
2. A pasta será adicionada aos favoritos automaticamente
3. Agora ela está disponível para monitoramento
```

### Passo 2: Acessar o Painel de Monitoramento
```
1. Clique no ícone de sino (🔔) no header da aplicação
2. O painel lateral será aberto à direita
3. Você verá três abas: Monitoramento, Notificações, Configurações
```

### Passo 3: Iniciar Monitoramento
```
1. Na aba "Monitoramento", localize a pasta favorita
2. Clique em "▶️ Iniciar Monitoramento"
3. A pasta começará a ser monitorada (indicador verde piscando)
4. Configure filtros e timers clicando no botão ⚙️
```

### Passo 4: Configurar Filtros (Opcional)
```
1. Clique no botão ⚙️ da pasta
2. Selecione o tipo de arquivo no dropdown "Filtrar tipo"
3. O monitoramento focará apenas nesse tipo de arquivo
4. Para voltar ao monitoramento completo, selecione "Todos os tipos"
```

### Passo 5: Configurar Timer (Opcional)
```
1. No mesmo painel expandido, configure o timer:
   - Digite a duração (número)
   - Selecione a unidade (Horas/Dias/Semanas/Meses)
   - Adicione uma descrição
2. Clique no botão ⏰ para iniciar
3. O timer aparecerá na pasta com contagem regressiva
```

## 📊 Interface do Painel

### Aba Monitoramento
- **Lista de pastas favoritas** com status de monitoramento
- **Indicadores visuais**: 
  - 🟢 Verde piscando = Monitoramento ativo
  - 🔴 Badge vermelho = Notificações não lidas
- **Estatísticas rápidas**: Total, Criados, Modificados, Excluídos
- **Controles individuais** por pasta
- **Timer em tempo real** quando ativo

### Aba Notificações
- **Agrupamento por pasta** com controles individuais
- **Ícones por tipo de ação**:
  - ➕ Arquivo criado
  - ✏️ Arquivo modificado  
  - 🗑️ Arquivo excluído
- **Informações detalhadas**: Nome, data/hora, tamanho
- **Interatividade**: Clique para marcar como lida

### Aba Configurações
- **✅ Notificações em tempo real**: Liga/desliga o sistema
- **🔊 Sons de notificação**: Controla reprodução de áudio
- **📖 Marcar automaticamente como lida**: Auto-marca notificações
- **📊 Máximo de notificações**: Limite por pasta (10-200)

## ⚡ Recursos Avançados

### Simulação de Eventos
Durante o desenvolvimento, o sistema simula eventos de arquivo para demonstração:
- **10% de chance** a cada verificação de gerar um evento
- **Tipos aleatórios**: Criação, modificação, exclusão
- **Arquivos variados**: PDF, Word, Excel, etc.
- **Respeitam filtros** configurados

### Persistência de Dados
Todos os dados são salvos no `localStorage`:
- `folder-monitoring-settings`: Configurações globais
- `folder-monitorings`: Estado de cada monitoramento
- **Restauração automática** ao recarregar página
- **Continuidade de timers** - calcula tempo restante

### Performance e Otimização
- **Intervalos otimizados**: 5s para monitoramento, 1s para timers
- **Cleanup automático**: Remove listeners ao desmontar
- **Limite de memória**: Máximo configurável de notificações
- **Re-render inteligente**: Apenas componentes necessários

## 🎵 Sistema de Áudio

### Som de Notificação
```javascript
// Som suave para notificações normais
Frequência: 800Hz → 600Hz
Duração: 0.2 segundos
Volume: 10%
```

### Som de Timer Expirado
```javascript
// Som mais longo para alertas importantes
Frequência: 400Hz constante
Duração: 1 segundo
Volume: 10%
```

## 🔧 Configurações Técnicas

### Intervalos de Verificação
- **Monitoramento de arquivos**: 5.000ms (5 segundos)
- **Atualização de timers**: 1.000ms (1 segundo)
- **Timeout de notificação**: Configurável por tipo

### Limites e Restrições
- **Máximo de notificações**: 10-200 por pasta
- **Tipos de arquivo suportados**: 12 tipos principais
- **Pastas simultâneas**: Sem limite (limitado pela performance)
- **Duração máxima de timer**: 999 meses

### Formato de Dados
```typescript
interface FolderMonitoring {
  isActive: boolean
  path: string
  notifications: FolderNotification[]
  fileTypeFilter?: string
  timer?: MonitoringTimer
  lastScan: string
  scanInterval: number
}
```

## 📱 Responsividade

O painel é otimizado para diferentes tamanhos de tela:
- **Desktop**: Painel lateral 400px com scroll interno
- **Tablet**: Adaptação automática de largura
- **Mobile**: Layout vertical com tabs otimizadas

## 🔄 Estados e Indicadores

### Status de Monitoramento
- ⚪ **Inativo**: Pasta não está sendo monitorada
- 🟢 **Ativo**: Monitoramento em andamento (pulsando)
- 🔴 **Com notificações**: Badge com número de não lidas

### Status de Timer
- 🔵 **Timer Ativo**: Contagem regressiva em azul
- 🔴 **Timer Expirado**: Alerta vermelho
- ⚪ **Sem Timer**: Nenhum timer configurado

### Status de Notificações
- 🔵 **Não lida**: Fundo azul claro
- ⚪ **Lida**: Fundo branco
- 🗑️ **Removível**: Pode ser limpa

## 🎯 Casos de Uso

### 1. Monitoramento de Projetos
```
Cenário: Acompanhar entregas de documentos
- Marcar pasta "Projetos/Cliente-A" como favorita
- Filtrar apenas arquivos PDF
- Configurar timer de 2 dias
- Receber notificação de qualquer PDF adicionado
```

### 2. Controle de Qualidade
```
Cenário: Verificar modificações em planilhas
- Monitorar pasta "Relatórios/Mensal"
- Filtrar apenas Excel (.xlsx)
- Timer de 1 semana para deadline
- Alertas de qualquer alteração
```

### 3. Backup e Segurança
```
Cenário: Detectar alterações suspeitas
- Monitorar pastas críticas
- Sem filtro (todos os tipos)
- Sem timer, monitoramento contínuo
- Histórico completo de mudanças
```

## 🚨 Resolução de Problemas

### Monitoramento Não Funciona
1. Verificar se a pasta está marcada como favorita
2. Confirmar se o monitoramento foi iniciado
3. Verificar configurações na aba "Configurações"
4. Recarregar a página para restaurar estado

### Timer Não Atualiza
1. Confirmar que o timer foi iniciado corretamente
2. Verificar se a página não está inativa por muito tempo
3. Recarregar página para restaurar contagem

### Notificações Não Aparecem
1. Verificar se "Notificações em tempo real" está ativado
2. Confirmar se o tipo de arquivo está sendo filtrado
3. Verificar se atingiu limite máximo de notificações

### Som Não Funciona
1. Verificar se "Sons de notificação" está ativado
2. Confirmar se o navegador permite reprodução de áudio
3. Testar em outras abas/navegadores

## 📈 Futuras Melhorias

### Em Desenvolvimento
- [ ] **API real de File System Watcher** para monitoramento nativo
- [ ] **Notificações do navegador** com Web Notifications API
- [ ] **Exportar relatórios** de atividade por período
- [ ] **Integração com email** para alertas externos
- [ ] **Monitoramento de tamanho** - alertas por espaço em disco
- [ ] **Padrões de arquivos** - regex para filtros avançados

### Melhorias de UX
- [ ] **Arrastar e soltar** pastas para favoritos
- [ ] **Atalhos de teclado** para controles rápidos
- [ ] **Themes customizáveis** para o painel
- [ ] **Widgets na dashboard** com métricas principais
- [ ] **Tutorial interativo** para primeiros usuários

## 🔒 Segurança e Privacidade

- **Dados locais**: Tudo armazenado no navegador do usuário
- **Sem transmissão**: Nenhum dado enviado para servidores externos
- **Controle total**: Usuário pode limpar dados a qualquer momento
- **Simulação segura**: Eventos simulados não afetam arquivos reais

---

**💡 Dica**: O sistema de monitoramento é uma simulação para demonstração. Em produção, seria integrado com APIs reais de file system ou serviços de cloud storage para monitoramento efetivo. 