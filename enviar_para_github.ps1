Set-Location $PSScriptRoot
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\Git\bin;" + $env:Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Enviando Melhor Cupom para o GitHub: pagjusto/melhorcupom" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

git push -u origin main

Write-Host ""
Write-Host "Processo finalizado!" -ForegroundColor Green
Read-Host -Prompt "Pressione Enter para fechar"
