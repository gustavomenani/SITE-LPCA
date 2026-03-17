param(
  [ValidateRange(1024, 65535)]
  [int]$Port = 5500
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue

if (-not $pythonCommand) {
  throw "Python não encontrado no PATH. Instale o Python ou ajuste o comando deste script."
}

Write-Host "EcoTech disponível em http://127.0.0.1:$Port/"
Write-Host "Pressione Ctrl+C para encerrar o servidor."

Push-Location $projectRoot

try {
  & $pythonCommand.Source "scripts\sync_site.py"
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao sincronizar o site antes de iniciar o servidor."
  }
  & $pythonCommand.Source -m http.server $Port --bind 127.0.0.1
} finally {
  Pop-Location
}
