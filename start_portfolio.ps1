# Quick-start script for Suryakiran's Portfolio
# Run this from PowerShell: .\start_portfolio.ps1

Write-Host "Starting Suryakiran Portfolio for all devices & browsers..." -ForegroundColor Cyan

# Detect machine's local Wi-Fi / Ethernet IPv4 address
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*', 'Ethernet*', 'Local Area Connection*' -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.)' } | Select-Object -ExpandProperty IPAddress -First 1)
if (-not $localIp) { $localIp = "127.0.0.1" }

# Start Django backend bound to 0.0.0.0:8000 so phones and external devices on network can connect
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\personal portfolio\backend'; & '.\venv\Scripts\python.exe' manage.py runserver 0.0.0.0:8000"

# Wait a moment for Django to boot
Start-Sleep 2

# Start React frontend with Vite (configured to host on 0.0.0.0 and proxy /api)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\personal portfolio\frontend'; npm run dev"

# Wait for Vite dev server
Start-Sleep 3

# Open in default browser on host PC
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SURYAKIRAN P J - PORTFOLIO RUNNING ON ALL DEVICES" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🖥️  On this Computer:     http://localhost:5173" -ForegroundColor Green
Write-Host "  📱  On Mobile / Tablets:   http://$($localIp):5173" -ForegroundColor Yellow
Write-Host "  ⚙️  Django API Backend:    http://127.0.0.1:8000/api/ (bound to 0.0.0.0:8000)" -ForegroundColor Green
Write-Host "  🔑  Admin Portal:            Access Restricted to Administrator" -ForegroundColor Magenta
Write-Host "  📧  Inquiries Target:      suryakiranpjineesh@gmail.com" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  📱 Browser tips for phones:" -ForegroundColor Gray
Write-Host "  1. Connect your phone / tablet to the same Wi-Fi network as this PC." -ForegroundColor Gray
Write-Host "  2. Open any browser (Chrome, Opera, Opera Mini, Safari, Edge) and go to:" -ForegroundColor Gray
Write-Host "     http://$($localIp):5173" -ForegroundColor Yellow
Write-Host "  3. In Opera Mini: Use 'High' or 'Normal' mode (Extreme mode proxies via cloud servers)." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
