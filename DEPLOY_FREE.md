# Deploy to Production - FREE Options

## Overview

Your OpenFaaS functions are containerized and can be deployed to various free platforms. Here are the best options:

## Option 1: Fly.io (Recommended - Easiest)

**Free Tier**: 3 shared-cpu VMs, 3GB storage, 160GB bandwidth/month

### Setup Steps

1. **Install Fly CLI**:

```bash
# macOS
brew install flyctl

# Or use install script
curl -L https://fly.io/install.sh | sh
```

2. **Sign Up / Login**:

```bash
flyctl auth signup
# or
flyctl auth login
```

3. **Deploy Your Functions**:

For each function, create a `fly.toml` file:

**brands-list on Fly.io:**

```bash
cd /Users/user/exthgen/openfaas

# Create fly app for brands-list
flyctl launch --name brands-list-api --no-deploy

# Edit fly.toml if needed, then deploy
flyctl deploy --local-only --image brands-list:latest
```

Or use this automated script (see below).

### Fly.io Configuration

Create `fly.toml` in your project root:

```toml
app = "brands-list-api"
primary_region = "sjc"

[build]
  image = "brands-list:latest"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

---

## Option 2: Google Cloud Run (Most Generous Free Tier)

**Free Tier**: 2 million requests/month, 360,000 GB-seconds, 180,000 vCPU-seconds

### Setup Steps

1. **Install Google Cloud CLI**:

```bash
# macOS
brew install --cask google-cloud-sdk

# Initialize
gcloud init
```

2. **Configure Docker for GCR**:

```bash
gcloud auth configure-docker
```

3. **Tag and Push Your Image**:

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Tag image
docker tag brands-list:latest gcr.io/$PROJECT_ID/brands-list:latest

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/brands-list:latest
```

4. **Deploy to Cloud Run**:

```bash
gcloud run deploy brands-list \
  --image gcr.io/$PROJECT_ID/brands-list:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

**Your API will be live at**: `https://brands-list-[hash]-uc.a.run.app`

---

## Option 3: Railway (Easiest Setup)

**Free Tier**: $5 credit/month (enough for hobby projects)

### Setup Steps

1. **Sign up at**: https://railway.app

2. **Install Railway CLI**:

```bash
# macOS
brew install railway

# Login
railway login
```

3. **Deploy**:

```bash
cd /Users/user/exthgen/openfaas

# Initialize project
railway init

# Deploy brands-list
railway up --service brands-list

# Get URL
railway domain
```

Or deploy via GitHub (easier):

- Push your code to GitHub
- Connect Railway to your GitHub repo
- Railway auto-deploys on push

---

## Option 4: Render (Zero Config)

**Free Tier**: 750 hours/month, sleeps after inactivity

### Setup Steps

1. **Sign up at**: https://render.com

2. **Deploy via Web UI**:

   - Click "New +" → "Web Service"
   - Connect your Docker registry or GitHub
   - Select your repo
   - Render auto-detects Dockerfile
   - Click "Create Web Service"

3. **Or use render.yaml**:

Create `render.yaml`:

```yaml
services:
  - type: web
    name: brands-list-api
    runtime: docker
    dockerfilePath: ./template/node20/Dockerfile
    dockerContext: ./brands-list
    envVars:
      - key: PORT
        value: 8080
    healthCheckPath: /
```

---

## Quick Deploy Script for Fly.io

Create this script to deploy all functions:

```bash
#!/bin/bash
# deploy-flyio.sh

echo "🚀 Deploying OpenFaaS Functions to Fly.io"

# Function to deploy
deploy_function() {
    local FUNCTION_NAME=$1
    local APP_NAME="${FUNCTION_NAME}-api"

    echo "📦 Deploying ${FUNCTION_NAME}..."

    # Create fly.toml
    cat > fly-${FUNCTION_NAME}.toml << EOF
app = "${APP_NAME}"
primary_region = "sjc"

[build]
  image = "${FUNCTION_NAME}:latest"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
EOF

    # Deploy
    flyctl deploy --config fly-${FUNCTION_NAME}.toml --local-only --image ${FUNCTION_NAME}:latest

    echo "✅ ${FUNCTION_NAME} deployed!"
    flyctl status --config fly-${FUNCTION_NAME}.toml
}

# Deploy functions
deploy_function "brands-list"
deploy_function "get-info"

echo "🎉 All functions deployed!"
```

---

## Easiest Option: Railway (Recommended for Beginners)

### Step-by-Step Railway Deployment:

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click**: "New Project" → "Deploy from GitHub repo"
4. **Select**: Your OpenFaaS repo
5. **Railway** automatically:
   - Detects Dockerfile
   - Builds container
   - Deploys your app
   - Gives you a public URL

**Done!** Your API is live in ~2 minutes.

---

## Cost Comparison

| Platform             | Free Tier              | Best For          |
| -------------------- | ---------------------- | ----------------- |
| **Fly.io**           | 3 VMs, 160GB bandwidth | Multiple services |
| **Google Cloud Run** | 2M requests/month      | High traffic      |
| **Railway**          | $5 credit/month        | Easiest setup     |
| **Render**           | 750 hours/month        | Simple projects   |

---

## Recommended: Start with Railway

**Why Railway?**

- ✅ Zero configuration
- ✅ GitHub integration
- ✅ Automatic HTTPS
- ✅ Free domain included
- ✅ Easy environment variables
- ✅ Built-in monitoring

### Railway Quick Start

```bash
# 1. Install CLI
brew install railway

# 2. Login
railway login

# 3. Create project
cd /Users/user/exthgen/openfaas
railway init

# 4. Link to service
railway link

# 5. Deploy
railway up

# 6. Open in browser
railway open
```

**Your API will be live at**: `https://your-project.up.railway.app`

---

## Testing Your Deployed API

Once deployed, test with:

```bash
# Replace with your actual URL
export API_URL="https://your-app.up.railway.app"

# Test brands list
curl $API_URL

# Test with filters
curl "$API_URL?category=Technology"

# Test with search
curl "$API_URL?search=nike"
```

---

## Next Steps

1. **Choose a platform** (Railway recommended)
2. **Build your images** (already done!)
3. **Deploy using the steps above**
4. **Get your public URL**
5. **Share your API!**

## Need Help?

Each platform has excellent documentation:

- Railway: https://docs.railway.app
- Fly.io: https://fly.io/docs
- Google Cloud Run: https://cloud.google.com/run/docs
- Render: https://render.com/docs
