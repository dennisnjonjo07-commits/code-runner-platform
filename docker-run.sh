#!/bin/bash

# CodeRunner Platform - Docker Build and Run Script

echo "🚀 CodeRunner Platform - Docker Setup"
echo "======================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker found"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose found"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# Build and start containers
echo "🔨 Building Docker image..."
docker-compose build

echo "🚀 Starting containers..."
docker-compose up -d

echo ""
echo "✅ CodeRunner Platform is running!"
echo ""
echo "📍 Access the platform at: http://localhost:5000"
echo ""
echo "📋 Useful commands:"
echo "   docker-compose logs -f        # View live logs"
echo "   docker-compose stop           # Stop containers"
echo "   docker-compose down           # Stop and remove containers"
echo "   docker-compose ps             # Show running containers"
echo ""
