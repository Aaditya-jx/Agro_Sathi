#!/bin/bash

# AgroSathi Firebase Deployment Script

echo "🚀 Deploying AgroSathi to Firebase Hosting..."

# Navigate to web directory
cd ../web

# Build the web app
echo "📦 Building web app..."
npm run build

# Deploy to Firebase
echo "🌐 Deploying to Firebase..."
npx firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is now live at: https://agrosathi-app.web.app"
