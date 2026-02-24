#!/bin/bash
# ResqPulse Deployment Script - Linux/macOS

echo "🚀 ResqPulse Deployment Script"
echo "==============================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -d "frontend" ]; then
    echo -e "${RED}Error: frontend directory not found!${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}Step 1: Building frontend...${NC}"
cd frontend
npm install
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful!${NC}"
cd ..

echo -e "${YELLOW}Step 2: Deploying to Firebase...${NC}"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
fi

# Login to Firebase
firebase login

# Select project
firebase use myosa-9871

# Deploy
firebase deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo ""
    echo "🎉 Your app is live at: https://myosa-9871.web.app"
    echo ""
    echo "Next steps:"
    echo "1. Visit https://console.firebase.google.com/project/myosa-9871"
    echo "2. Check the Hosting section for your live URL"
    echo "3. Share the URL with beta testers"
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi
