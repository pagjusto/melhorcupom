@echo off
setlocal
cd /d "%~dp0"
cls

echo ========================================================
echo   Enviando Melhor Cupom para o GitHub:
echo   https://github.com/pagjusto/melhorcupom
echo ========================================================
echo.

set PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%

git push -u origin main

echo.
echo ========================================================
echo   Envio finalizado!
echo ========================================================
pause
