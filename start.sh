#!/bin/bash
# Quick deployment script for Railway or Render
# This is executed automatically by the platform

echo "🚀 CodeRunner Platform - Starting..."

# Install dependencies
echo "📚 Installing dependencies..."
npm install --production

# Create necessary directories
echo "📋 Creating directories..."
mkdir -p uploads
mkdir -p logs

# Start the application
echo "🎉 Starting application..."
node backend/server.js
