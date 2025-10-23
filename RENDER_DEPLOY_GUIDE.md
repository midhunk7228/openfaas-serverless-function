# 🚀 Deploy to Render - Complete Step-by-Step Guide

## ✅ Prerequisites Checklist

- [x] Your API is built and tested locally (http://localhost:3001)
- [x] Git repository initialized
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Service deployed

---

## Step 1: Push Your Code to GitHub

### 1.1 Create a GitHub Repository

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `openfaas-brands-api` (or any name you like)
   - **Description**: "OpenFaaS Brands List API"
   - **Public** or **Private**: Your choice
   - ❌ Don't initialize with README (you already have files)
3. Click **"Create repository"**

### 1.2 Push Your Code

Copy the commands GitHub shows you, or use these:

```bash
cd /Users/user/exthgen/openfaas

# Set the branch to main
git branch -M main

# Add your GitHub repo as remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push your code
git push -u origin main
```

**Example:**

```bash
git remote add origin https://github.com/johndoe/openfaas-brands-api.git
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Step 2: Sign Up on Render

1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Choose **"Sign up with GitHub"** (easiest)
4. Authorize Render to access your GitHub account
5. ✅ You're logged in!

---

## Step 3: Create a New Web Service

1. On Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select your repository: `openfaas-brands-api`
5. Click **"Connect"**

---

## Step 4: Configure Your Service

Now you'll see a configuration page. Fill it in exactly like this:

### Basic Settings:

```
Name: brands-list-api
Region: Oregon (US West) [or your preferred region]
Branch: main
```

### Build Settings:

**IMPORTANT: Choose the right option based on your deployment method:**

---

### 🐳 OPTION A: Docker Deployment (RECOMMENDED)

```
Environment: Docker
Root Directory: brands-list
Dockerfile Path: ./Dockerfile
Docker Build Context: ./
```

**Leave these EMPTY:**

- Build Command: (empty)
- Start Command: (empty)

---

### 📦 OPTION B: Node.js Deployment (Alternative)

```
Environment: Node
Root Directory: brands-list
Build Command: npm install
Start Command: node index.js
Node Version: 20
```

---

### Instance Settings:

```
Instance Type: Free
```

### Environment Variables (Optional):

You can add these if needed:

```
PORT = 8080
```

---

## Step 5: Deploy!

1. Scroll to the bottom
2. Click **"Create Web Service"**
3. ⏳ Wait for deployment (2-5 minutes)
4. Watch the build logs in real-time

You'll see:

```
==> Building...
==> Deploying...
==> Your service is live at https://brands-list-api.onrender.com
```

---

## Step 6: Test Your Deployed API

Once deployed, you'll get a URL like:

```
https://brands-list-api-xxxx.onrender.com
```

### Test it:

```bash
# Save your URL
export API_URL="https://brands-list-api-xxxx.onrender.com"

# Test all brands
curl $API_URL

# Test with filters
curl "$API_URL?category=Technology"

# Test search
curl "$API_URL?search=nike"

# Test pagination
curl "$API_URL?limit=3"
```

---

## 🎉 You're Live!

Your API is now:

- ✅ Deployed to the internet
- ✅ Has HTTPS automatically
- ✅ Auto-deploys when you push to GitHub
- ✅ Free forever (with reasonable usage)

---

## 📝 Quick Reference Card

Copy this for when you configure Render:

### Docker Deployment:

```
Name:              brands-list-api
Environment:       Docker
Branch:            main
Root Directory:    brands-list
Dockerfile Path:   ./Dockerfile
Build Command:     (empty)
Start Command:     (empty)
Instance Type:     Free
```

### Node.js Deployment:

```
Name:              brands-list-api
Environment:       Node
Branch:            main
Root Directory:    brands-list
Build Command:     npm install
Start Command:     node index.js
Instance Type:     Free
```

---

## 🐛 Troubleshooting

### Build Fails?

**Check these:**

1. Is Root Directory set to `brands-list`?
2. Did you select the correct Environment (Docker or Node)?
3. Is your code pushed to GitHub?

### Service Won't Start?

**Common fixes:**

1. Make sure Dockerfile exists in `brands-list/` folder
2. Check build logs for errors
3. Verify PORT environment variable is set to 8080

### Can't Access API?

**Try:**

1. Wait 1-2 minutes after deployment
2. Check if service is running (should say "Live")
3. Use the full URL provided by Render

---

## 🔄 Update Your API Later

To update your deployed API:

```bash
cd /Users/user/exthgen/openfaas

# Make your changes to brands-list/handler.js

# Commit and push
git add .
git commit -m "Update API"
git push

# Render auto-deploys! ✨
```

---

## 💡 Pro Tips

1. **Free Tier Limits:**

   - Service sleeps after 15 min of inactivity
   - First request after sleep takes ~30 seconds
   - 750 free hours/month

2. **Keep it Awake:**

   - Use a service like UptimeRobot to ping your API every 10 min
   - Or upgrade to paid tier ($7/month) for always-on

3. **View Logs:**

   - Click your service → "Logs" tab
   - See real-time requests and errors

4. **Custom Domain:**
   - Settings → "Custom Domain"
   - Add your own domain (free SSL included)

---

## ✅ Next Steps

After deployment:

1. ✅ Save your API URL
2. ✅ Test all endpoints
3. ✅ Share your API!
4. ✅ Add it to your portfolio

---

## 📞 Need More Help?

- Render Docs: https://render.com/docs
- Check build logs in Render dashboard
- Your API documentation: `brands-list/README.md`

---

**Ready to deploy? Follow Step 1 above! 🚀**
