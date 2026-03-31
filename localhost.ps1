param(
  [ValidateRange(1024, 65535)]
  [int]$Port = 3000
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "EcoTech disponível em http://127.0.0.1:$Port/"
Write-Host "Pressione Ctrl+C para encerrar o servidor."

Push-Location $projectRoot

try {
  npm.cmd run dev -- --hostname 127.0.0.1 --port $Port
} finally {
  Pop-Location
}
