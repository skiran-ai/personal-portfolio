# Quick-start script for Suryakiran's Portfolio
# Run this from PowerShell: .\start_portfolio.ps1

Write-Host "Starting Suryakiran Portfolio..." -ForegroundColor Cyan

# Start Django backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\personal portfolio\backend'; & '.\venv\Scripts\python.exe' manage.py runserver 127.0.0.1:8000"

# Wait a moment for Django to boot
Start-Sleep 2

# Start React frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\personal portfolio\frontend'; npm run dev"

# Wait for Vite
Start-Sleep 3

# Open in default browser
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Portfolio running at: http://localhost:5173" -ForegroundColor Green
Write-Host "Django API at:        http://127.0.0.1:8000/api/" -ForegroundColor Green
Write-Host "Django Admin:         http://127.0.0.1:8000/admin/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Admin Portal passcode: admin123 (or click Quick Unlock)" -ForegroundColor Magenta
