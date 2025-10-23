#!/bin/bash

# Deploy to Railway - Easiest Free Option
# Usage: ./deploy-railway.sh

set -e

echo "🚂 Railway Deployment Script"
echo "================================"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    echo ""
    echo "📦 Installing Railway CLI..."
    brew install railway || {
        echo "Please install Railway CLI manually:"
        echo "npm i -g @railway/cli"
        exit 1
    }
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

echo ""
echo "✅ Railway CLI ready!"
echo ""

# Function to deploy
FUNCTION_NAME=${1:-brands-list}
IMAGE_NAME="${FUNCTION_NAME}:latest"

echo "📦 Function to deploy: $FUNCTION_NAME"
echo "🐳 Docker image: $IMAGE_NAME"
echo ""

# Check if image exists
if ! docker image inspect "$IMAGE_NAME" &> /dev/null; then
    echo "❌ Docker image '$IMAGE_NAME' not found"
    echo "🔨 Building image..."
    faas-cli build -f stack.yaml --filter "$FUNCTION_NAME"
fi

echo ""
echo "🚀 Initializing Railway project..."
railway init --name "$FUNCTION_NAME-api" || true

echo ""
echo "📤 Deploying to Railway..."

# Create a simple Dockerfile wrapper if needed
cat > Dockerfile.railway << EOF
FROM ${IMAGE_NAME}
EXPOSE 8080
CMD ["fwatchdog"]
EOF

# Deploy
railway up

echo ""
echo "🌐 Getting your URL..."
RAILWAY_URL=$(railway domain)

echo ""
echo "================================"
echo "✅ Deployment Complete!"
echo "================================"
echo ""
echo "🌍 Your API is live at:"
echo "   $RAILWAY_URL"
echo ""
echo "🧪 Test it:"
echo "   curl $RAILWAY_URL"
echo ""
echo "📊 View dashboard:"
railway open

