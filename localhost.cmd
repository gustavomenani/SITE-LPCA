@echo off
setlocal

set "PORT=%~1"
if "%PORT%"=="" set "PORT=5500"

cd /d "%~dp0"
echo EcoTech disponivel em http://127.0.0.1:%PORT%/
echo Pressione Ctrl+C para encerrar o servidor.

python scripts\sync_site.py
if errorlevel 1 exit /b %errorlevel%
python -m http.server %PORT% --bind 127.0.0.1
