<<<<<<< HEAD
@echo off
echo ==========================================
echo     CRIANDO EXECUTÁVEL PASTAS CORPORATIVAS
echo ==========================================
echo.

echo [1/3] Limpando build anterior...
if exist dist-electron rmdir /s /q dist-electron
if exist dist rmdir /s /q dist

echo [2/3] Compilando aplicação React...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha na compilação da aplicação React
    pause
    exit /b 1
)

echo [3/3] Criando executável Electron...
call npx electron-builder --win
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha na criação do executável
    pause
    exit /b 1
)

echo.
echo ==========================================
echo           BUILD CONCLUÍDO COM SUCESSO!
echo ==========================================
echo.
echo Executável criado em: dist-electron\
dir dist-electron\*.exe
echo.
echo ARQUIVO PRONTO PARA DISTRIBUIÇÃO:
echo PastasCorporativas-Portable-1.0.0.exe
echo.
echo ✅ PROBLEMA DE ES MODULES CORRIGIDO
echo ✅ Aplicação funciona offline
echo ✅ Não requer instalação
echo.
echo Para testar: duplo-clique no arquivo .exe
echo.
=======
@echo off
echo ==========================================
echo     CRIANDO EXECUTÁVEL PASTAS CORPORATIVAS
echo ==========================================
echo.

echo [1/3] Limpando build anterior...
if exist dist-electron rmdir /s /q dist-electron
if exist dist rmdir /s /q dist

echo [2/3] Compilando aplicação React...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha na compilação da aplicação React
    pause
    exit /b 1
)

echo [3/3] Criando executável Electron...
call npx electron-builder --win
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha na criação do executável
    pause
    exit /b 1
)

echo.
echo ==========================================
echo           BUILD CONCLUÍDO COM SUCESSO!
echo ==========================================
echo.
echo Executável criado em: dist-electron\
dir dist-electron\*.exe
echo.
echo ARQUIVO PRONTO PARA DISTRIBUIÇÃO:
echo PastasCorporativas-Portable-1.0.0.exe
echo.
echo ✅ PROBLEMA DE ES MODULES CORRIGIDO
echo ✅ Aplicação funciona offline
echo ✅ Não requer instalação
echo.
echo Para testar: duplo-clique no arquivo .exe
echo.
>>>>>>> origin/main
pause 