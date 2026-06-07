#!/bin/bash

# Code Hosting Platform - Railway Setup Script
# This script prepares everything for Railway deployment

echo "🚀 Code Hosting Platform - Railway Setup"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Run: git init"
    exit 1
fi

echo "✅ Git repository found"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js not found. Install from https://nodejs.org"
else
    echo "✅ Node.js $(node --version) found"
fi

# Check if npm packages are installed
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "========================================"
echo "🎉 Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy to Railway'"
    echo "   git push origin deploy-railway"
echo ""
echo "2. Go to https://railway.app"
echo ""
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo ""
echo "4. Select your repository and branch (deploy-railway)"
echo ""
echo "5. Click 'Deploy'"
echo ""
echo "6. Add environment variables:"
echo "   PORT=5000"
echo "   NODE_ENV=production"
echo "   DOMAIN=your-project.railway.app"
echo ""
echo "7. Click 'Deploy' - Done! 🎉"
echo ""
echo "Your platform will be live at: https://your-project.railway.app"
echo ""
