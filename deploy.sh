#!/bin/bash
# Production deployment script
# Usage: ./deploy.sh

set -e

echo "🚀 CodeRunner Production Deployment"
echo "====================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running on production server
if [ "$NODE_ENV" != "production" ]; then
    echo -e "${YELLOW}⚠️  Warning: NODE_ENV is not set to production${NC}"
fi

echo -e "${GREEN}✅ Pulling latest code from GitHub...${NC}"
git fetch origin
git reset --hard origin/main

echo -e "${GREEN}✅ Installing dependencies...${NC}"
npm ci --only=production

echo -e "${GREEN}✅ Building application...${NC}"
npm run build --if-present

echo -e "${GREEN}✅ Restarting application...${NC}"
npm run pm2-restart --if-present

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Status:"
pm2 status
