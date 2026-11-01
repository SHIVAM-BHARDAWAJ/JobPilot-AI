

$ErrorActionPreference = "Stop"

$Root = $PSScriptRoot

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "       JOBPILOT AI LAUNCHER       " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

$BackendPath = Join-Path $Root "backend"
$FrontendPath = Join-Path $Root "frontend"

if (!(Test-Path $BackendPath)) {
    Write-Host "Backend folder not found!" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $FrontendPath)) {
    Write-Host "Frontend folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting JobPilot Backend..." -ForegroundColor Green

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$BackendPath'; python -m uvicorn main:app --reload"
)

Start-Sleep -Seconds 3

Write-Host "Starting JobPilot Frontend..." -ForegroundColor Green

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$FrontendPath'; npm run dev"
)

Write-Host "JobPilot launch commands sent!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
