# HackMate Deployment Script for Windows
# Run this script to prepare your project for deployment

Write-Host "🚀 HackMate Deployment Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - HackMate platform"
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

# Check if frontend dependencies are installed
Write-Host "📦 Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location "frontend"
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

# Test frontend build
Write-Host "🔨 Testing frontend build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

# Test backend build
Write-Host "🔨 Testing backend build..." -ForegroundColor Yellow
Set-Location "backend"
if (Test-Path "mvnw.cmd") {
    .\mvnw.cmd clean package -DskipTests
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend build successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend build failed" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
} else {
    Write-Host "⚠️  Maven wrapper not found. Please ensure Maven is installed." -ForegroundColor Yellow
}

Set-Location ".."

Write-Host "" 
Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host "" 
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. Follow the DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor White
Write-Host "3. Set up Railway for backend deployment" -ForegroundColor White
Write-Host "4. Set up Vercel for frontend deployment" -ForegroundColor White
Write-Host "" 
Write-Host "📖 Read DEPLOYMENT_GUIDE.md for complete instructions" -ForegroundColor Yellow
Write-Host "" 

# Display important URLs
Write-Host "Important URLs to bookmark:" -ForegroundColor Cyan
Write-Host "• Railway: https://railway.app" -ForegroundColor White
Write-Host "• Vercel: https://vercel.com" -ForegroundColor White
Write-Host "• Google Cloud Console: https://console.cloud.google.com" -ForegroundColor White