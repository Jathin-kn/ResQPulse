# ResqPulse Deployment Script - Windows PowerShell

Write-Host "🚀 ResqPulse Deployment Script" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Error: frontend directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Building frontend..." -ForegroundColor Yellow
Set-Location frontend

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "🔥 Step 2: Deploying to Firebase..." -ForegroundColor Yellow

# Check if Firebase CLI is installed
$firebase = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebase) {
    Write-Host "📥 Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Login to Firebase
Write-Host "🔐 Logging into Firebase..." -ForegroundColor Yellow
firebase login

# Select project
Write-Host "📍 Selecting project..." -ForegroundColor Yellow
firebase use myosa-9871

# Deploy
Write-Host "🚀 Deploying..." -ForegroundColor Yellow
firebase deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your app is live at: https://myosa-9871.web.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Green
    Write-Host "1. Visit https://console.firebase.google.com/project/myosa-9871" -ForegroundColor White
    Write-Host "2. Check the Hosting section for your live URL" -ForegroundColor White
    Write-Host "3. Share the URL with beta testers" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
