const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Criar a janela principal da aplicação
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    title: 'Pastas Corporativas',
    show: false, // Não mostrar até estar pronto
    titleBarStyle: 'default',
    autoHideMenuBar: false,
    resizable: true,
    maximizable: true,
    fullscreenable: true
  });

  // Carregar a aplicação
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Abrir DevTools em desenvolvimento
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carregar o arquivo HTML da pasta dist
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Menu personalizado
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // Funcionalidade pode ser implementada via IPC se necessário
          }
        },
        {
          label: 'Recarregar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
        { role: 'selectall', label: 'Selecionar Tudo' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'forceReload', label: 'Forçar Recarregamento' },
        { role: 'toggleDevTools', label: 'Ferramentas do Desenvolvedor' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Aumentar Zoom' },
        { role: 'zoomOut', label: 'Diminuir Zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela Cheia' }
      ]
    },
    {
      label: 'Janela',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Fechar' }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            const aboutWindow = new BrowserWindow({
              width: 400,
              height: 300,
              resizable: false,
              parent: mainWindow,
              modal: true,
              show: false,
              webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
              }
            });
            aboutWindow.loadURL('data:text/html;charset=utf-8,' + encodeURI(`
              <html>
                <head>
                  <title>Sobre</title>
                  <style>
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                      text-align: center; 
                      padding: 50px; 
                      margin: 0;
                      background: #f5f5f5;
                    }
                    h1 { color: #333; margin-bottom: 10px; }
                    p { color: #666; margin: 5px 0; }
                    .version { font-weight: bold; color: #007acc; }
                  </style>
                </head>
                <body>
                  <h1>🗂️ Pastas Corporativas</h1>
                  <p>Sistema de Gerenciamento de Pastas</p>
                  <p class="version">Versão 1.0.0</p>
                  <p>Desenvolvido com Electron + React + Vite</p>
                  <p style="margin-top: 30px; font-size: 12px; color: #999;">
                    © 2025 - Todos os direitos reservados
                  </p>
                </body>
              </html>
            `));
            aboutWindow.once('ready-to-show', () => {
              aboutWindow.show();
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return mainWindow;
}

// Este método será chamado quando o Electron terminar a inicialização
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // No macOS, é comum recriar uma janela quando o ícone do dock é clicado
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Sair quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  // No macOS, é comum que aplicações permaneçam ativas até que o usuário saia explicitamente com Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

// Configurações de segurança
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    // Prevenir abertura de novas janelas maliciosas
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
}); 