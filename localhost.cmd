@echo off
setlocal

set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"

cd /d "%~dp0"
echo EcoTech disponivel em http://127.0.0.1:%PORT%/
echo Pressione Ctrl+C para encerrar o servidor.

npm.cmd run dev -- --hostname 127.0.0.1 --port %PORT%
