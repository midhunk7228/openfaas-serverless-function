# Deploy to Production NOW - Web-Based (No CLI Required)

## ✅ Your API is Ready!

Your `brands-list` API is built and tested locally at: `http://localhost:3001`

## 🚀 Deploy to Render.com (Easiest - 5 Minutes)

**100% Free | No Credit Card | No CLI Required**

### Step 1: Create GitHub Repository

1. Go to GitHub.com and create a new repository
2. Push your code:

```bash
cd /Users/user/exthgen/openfaas
git init
git add .
git commit -m "OpenFaaS brands list API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/openfaas-api.git
git push -u origin main
```

### Step 2: Deploy to Render

1. **Go to**: https://render.com
2. **Sign Up** with GitHub (free, no credit card)
3. **Click**: "New +" button → "Web Service"
4. **Connect** your GitHub repository
5. **Configure**:
   - **Name**: `brands-list-api`
   - **Runtime**: Docker
   - **Docker Build Context Path**: `./brands-list`
   - **Dockerfile Path**: Leave empty (auto-detect)
6. **Click**: "Create Web Service"

### Step 3: Create Dockerfile for Render

Create `/Users/user/exthgen/openfaas/brands-list/Dockerfile`:

```dockerfile
FROM brands-list:latest
EXPOSE 8080
CMD ["fwatchdog"]
```

Or use this simpler approach - create a standalone Dockerfile:

```dockerfile
FROM node:20-alpine

# Install fwatchdog
ADD https://github.com/openfaas/of-watchdog/releases/download/0.10.11/fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

# Setup app user
RUN apk --no-cache add curl ca-certificates && \
    addgroup -S app && adduser -S -g app app

# Copy function code
WORKDIR /home/app
COPY package.json ./
RUN npm install

COPY index.js ./
WORKDIR /home/app/function
COPY function/ ./
RUN npm install

USER app
WORKDIR /home/app

# Configure fwatchdog
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
ENV PORT=8080

EXPOSE 8080

CMD ["fwatchdog"]
```

---

## 🎯 Alternative: Deploy to Railway (Also Easy)

### Web-Based Deployment

1. **Go to**: https://railway.app
2. **Sign up** with GitHub (free)
3. **Click**: "New Project"
4. **Choose**: "Deploy from GitHub repo"
5. **Select**: Your OpenFaaS repository
6. **Railway automatically**:
   - Detects your Dockerfile
   - Builds and deploys
   - Gives you a public URL

**Done!** Your API is live in 2 minutes.

---

## 📦 Prepare Your Code for Deployment

Create a simple standalone Dockerfile in the brands-list folder:


