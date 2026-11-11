# Quick-start script for Suryakiran's Portfolio
# Run from PowerShell: .\start_portfolio.ps1

Write-Host "Starting Suryakiran Portfolio (React + Django REST API)..." -ForegroundColor Cyan

# Detect machine's local Wi-Fi / Ethernet IPv4 address
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*', 'Ethernet*', 'Local Area Connection*' -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.)' } | Select-Object -ExpandProperty IPAddress -First 1)
if (-not $localIp) { $localIp = "127.0.0.1" }

# Start Django backend bound to 0.0.0.0:8000
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\personal portfolio\backend'; & '.\venv\Scripts\python.exe' manage.py runserver 0.0.0.0:8000"

Start-Sleep -Seconds 2

# Start React frontend with Vite (bound to 0.0.0.0:5173 with /api proxy)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\personal portfolio\frontend'; npm run dev"

Start-Sleep -Seconds 3

# Open in default browser on host PC
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SURYAKIRAN P J - PORTFOLIO RUNNING ON ALL DEVICES" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Local Computer : http://localhost:5173" -ForegroundColor Green
Write-Host "  LAN / Mobile   : http://$($localIp):5173" -ForegroundColor Yellow
Write-Host "  Django API     : http://127.0.0.1:8000/api/ (bound to 0.0.0.0:8000)" -ForegroundColor Green
Write-Host "  Command Palette: Press Ctrl+K" -ForegroundColor Cyan
Write-Host "  Admin Console  : Press Ctrl+Shift+A or visit /admin" -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Cyan
