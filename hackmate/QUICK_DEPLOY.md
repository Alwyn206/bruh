# 🚀 Quick Deploy Guide for HackMate

**No local setup required! Deploy directly to the cloud.**

## Prerequisites
- GitHub account
- Google account (for OAuth2 setup)

## Step 1: Push to GitHub

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name: `hackmate`
   - Make it public
   - Don't initialize with README (we have files already)

2. **Upload your code**:
   - Use GitHub's web interface to upload the entire `hackmate` folder
   - Or use GitHub Desktop if you have it installed

## Step 2: Deploy Backend (Railway)

1. **Go to [Railway.app](https://railway.app/)**
2. **Sign up with GitHub**
3. **Create new project**:
   - Click "Deploy from GitHub repo"
   - Select your `hackmate` repository
   - Choose "Deploy from a folder" → `backend`

4. **Add PostgreSQL Database**:
   - In your project dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create DATABASE_URL

5. **Set Environment Variables** (in Railway dashboard):
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=hackmate-super-secure-jwt-secret-key-2024-production
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   FRONTEND_URL=https://hackmate-frontend.vercel.app
   APP_BASE_URL=https://hackmate-backend.up.railway.app
   ```

6. **Deploy**: Railway will automatically build and deploy
7. **Note your backend URL**: Something like `https://hackmate-backend.up.railway.app`

## Step 3: Deploy Frontend (Vercel)

1. **Go to [Vercel.com](https://vercel.com/)**
2. **Sign up with GitHub**
3. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your `hackmate` repository
   - Set **Root Directory** to `frontend`

4. **Configure Build Settings**:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. **Set Environment Variables** (in Vercel dashboard):
   ```
   REACT_APP_API_BASE_URL=https://your-actual-railway-url.up.railway.app
   REACT_APP_WS_URL=wss://your-actual-railway-url.up.railway.app/ws
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
   REACT_APP_NAME=HackMate
   REACT_APP_ENV=production
   ```

6. **Deploy**: Vercel will automatically build and deploy
7. **Note your frontend URL**: Something like `https://hackmate-frontend.vercel.app`

## Step 4: Set Up Google OAuth2

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create/Select Project**
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Search and enable "Google+ API"

4. **Create OAuth2 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "HackMate Production"

5. **Set Authorized Redirect URIs**:
   ```
   https://your-railway-backend-url.up.railway.app/oauth2/callback/google
   https://your-vercel-frontend-url.vercel.app/oauth2/redirect
   ```

6. **Copy Client ID and Secret**:
   - Update Railway environment variables with real values
   - Update Vercel environment variables with real Client ID

## Step 5: Update URLs

1. **Update Railway Environment Variables**:
   ```
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   APP_BASE_URL=https://your-actual-railway-url.up.railway.app
   ```

2. **Update Vercel Environment Variables**:
   ```
   REACT_APP_API_BASE_URL=https://your-actual-railway-url.up.railway.app
   REACT_APP_WS_URL=wss://your-actual-railway-url.up.railway.app/ws
   ```

3. **Redeploy both services** (they should auto-redeploy when you change env vars)

## Step 6: Test Your App! 🎉

1. Visit your Vercel URL
2. Try signing up/logging in with Google
3. Create a team
4. Test the chat functionality
5. Try the team matching features

## 🆘 Troubleshooting

### Backend Issues:
- Check Railway logs for errors
- Ensure all environment variables are set
- Verify database connection

### Frontend Issues:
- Check Vercel function logs
- Verify API URL is correct
- Check browser console for errors

### OAuth Issues:
- Double-check redirect URIs in Google Console
- Ensure Client ID/Secret are correct
- Verify URLs match exactly (no trailing slashes)

## 💰 Cost
- **Railway**: Free tier (500 hours/month)
- **Vercel**: Free tier (100GB bandwidth/month)
- **PostgreSQL**: Included in Railway free tier
- **Total**: $0/month for development and small-scale usage

---

**🎊 Congratulations! Your HackMate platform is now live!**

**Frontend**: `https://your-app.vercel.app`  
**Backend**: `https://your-app.up.railway.app`

Share your app with friends and start building amazing teams! 🚀