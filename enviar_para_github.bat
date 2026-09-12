@echo off
chcp 65001 > nul
echo ========================================================
echo   Enviando Melhor Cupom para o GitHub: pagjusto/melhorcupom
echo ========================================================
echo.

set "GIT_CMD=git"

where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    ) else if exist "C:\Program Files\Git\bin\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\bin\git.exe"
    ) else (
        echo [!] Git não encontrado.
        pause
        exit /b
    )
)

echo [*] Usando: %GIT_CMD%
echo [*] Inicializando repositório Git local...
"%GIT_CMD%" init
"%GIT_CMD%" branch -M main

echo [*] Adicionando arquivos do projeto (respeitando .gitignore)...
"%GIT_CMD%" add .

echo [*] Criando commit inicial...
"%GIT_CMD%" commit -m "feat: initial commit - Plataforma Melhor Cupom completa com branding, busca por cidade e portal do lojista"

echo [*] Configurando repositório remoto: https://github.com/pagjusto/melhorcupom.git
"%GIT_CMD%" remote remove origin 2>nul
"%GIT_CMD%" remote add origin https://github.com/pagjusto/melhorcupom.git

echo.
echo [*] Enviando arquivos para a branch main do GitHub...
"%GIT_CMD%" push -u origin main

echo.
echo ========================================================
echo   Envio finalizado!
echo   Acesse o repositório em: https://github.com/pagjusto/melhorcupom
echo ========================================================
pause
