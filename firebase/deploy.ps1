# AgroSathi Firebase Deployment Script (PowerShell)

Write-Host "🚀 Deploying AgroSathi to Firebase Hosting..." -ForegroundColor Green

# Navigate to web directory
Set-Location ..\web

# Build the web app
Write-Host "📦 Building web app..." -ForegroundColor Blue
npm run build

# Deploy to Firebase
Write-Host "🌐 Deploying to Firebase..." -ForegroundColor Blue
npx firebase deploy --only hosting

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your app is now live at: https://agrosathi-app.web.app" -ForegroundColor Yellow
