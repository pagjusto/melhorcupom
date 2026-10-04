@echo off
title Login Oficial do Instagram - Melhor Cupom
color 0B
echo ================================================================
echo    MELHOR CUPOM - CONEXAO OFICIAL DO INSTAGRAM
echo    Perfil: @omelhorcupom.com.br
echo ================================================================
echo.
echo Abrindo a janela oficial do Instagram na sua tela...
echo Faca login com @omelhorcupom.com.br e senha.
echo O sistema ira detectar automaticamente o seu login!
echo.
cd /d "%~dp0"
node scripts/instagram-login.cjs
echo.
echo Conexao finalizada com sucesso! Pode fechar esta janela.
pause
