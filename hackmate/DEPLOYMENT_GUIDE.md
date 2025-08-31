# HackMate Deployment Guide

This guide will help you deploy the HackMate platform to production using free cloud services.

## Prerequisites

- GitHub account
- Google Cloud Console account (for OAuth2)
- Railway account (for backend)
- Vercel account (for frontend)

## Step 1: Prepare Your Repository

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/hackmate.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `https://your-backend-app.railway.app/oauth2/callback/google`
   - `https://your-frontend-app.vercel.app/oauth2/redirect`
6. Note down Client ID and Client Secret

## Step 3: Deploy Backend to Railway

1. **Sign up at [Railway](https://railway.app/)**

2. **Create new project from GitHub**:
   - Connect your GitHub account
   - Select your hackmate repository
   - Choose the `backend` folder as root

3. **Add PostgreSQL database**:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway will automatically provide DATABASE_URL

4. **Set environment variables**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=https://your-frontend-app.vercel.app
   APP_BASE_URL=https://your-backend-app.railway.app
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```

5. **Deploy**:
   - Railway will automatically build and deploy
   - Note your backend URL: `https://your-backend-app.railway.app`

## Step 4: Deploy Frontend to Vercel

1. **Sign up at [Vercel](https://vercel.com/)**

2. **Import project**:
   - Click "New Project"
   - Import from GitHub
   - Select your hackmate repository
   - Set root directory to `frontend`

3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Set environment variables**:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-app.railway.app
   REACT_APP_WS_URL=wss://your-backend-app.railway.app/ws
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_NAME=HackMate
   REACT_APP_ENV=production
   ```

5. **Deploy**:
   - Vercel will automatically build and deploy
   - Note your frontend URL: `https://your-frontend-app.vercel.app`

## Step 5: Update OAuth2 Redirect URIs

1. Go back to Google Cloud Console
2. Update OAuth2 client with actual URLs:
   - Backend: `https://your-actual-backend-url.railway.app/oauth2/callback/google`
   - Frontend: `https://your-actual-frontend-url.vercel.app/oauth2/redirect`

## Step 6: Update Environment Variables

1. **Update Railway backend environment**:
   ```
   FRONTEND_URL=https://your-actual-frontend-url.vercel.app
   APP_BASE_URL=https://your-actual-backend-url.railway.app
   ```

2. **Update Vercel frontend environment**:
   ```
   REACT_APP_API_BASE_URL=https://your-actual-backend-url.railway.app
   REACT_APP_WS_URL=wss://your-actual-backend-url.railway.app/ws
   ```

## Step 7: Test Your Deployment

1. Visit your frontend URL
2. Test user registration/login
3. Test team creation and joining
4. Test real-time chat functionality
5. Test team matching features

## Alternative Deployment Options

### Option 1: Heroku + Netlify
- Backend: Deploy to Heroku with Heroku Postgres
- Frontend: Deploy to Netlify

### Option 2: DigitalOcean App Platform
- Deploy both frontend and backend to DigitalOcean
- Use DigitalOcean Managed Database

### Option 3: AWS
- Backend: AWS Elastic Beanstalk
- Frontend: AWS Amplify
- Database: AWS RDS

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure FRONTEND_URL is correctly set in backend
   - Check app.cors.allowed-origins in application-prod.properties

2. **OAuth2 Not Working**:
   - Verify redirect URIs in Google Console
   - Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

3. **Database Connection Issues**:
   - Verify DATABASE_URL format
   - Ensure database is accessible from Railway

4. **WebSocket Connection Failed**:
   - Check REACT_APP_WS_URL format (wss:// for HTTPS)
   - Verify WebSocket allowed origins in backend

## Security Checklist

- [ ] JWT secret is at least 32 characters
- [ ] Database credentials are secure
- [ ] OAuth2 redirect URIs are exact matches
- [ ] CORS origins are restricted to your domains
- [ ] Email credentials use app passwords
- [ ] All sensitive data is in environment variables

## Monitoring and Maintenance

1. **Health Checks**:
   - Backend: `https://your-backend-url/actuator/health`
   - Frontend: Monitor via Vercel dashboard

2. **Logs**:
   - Railway: View logs in Railway dashboard
   - Vercel: View function logs in Vercel dashboard

3. **Database Backups**:
   - Railway automatically backs up PostgreSQL
   - Consider additional backup strategies for production

## Cost Estimation

- **Railway**: Free tier includes 500 hours/month
- **Vercel**: Free tier includes 100GB bandwidth
- **PostgreSQL**: Included in Railway free tier
- **Total**: $0/month for small to medium usage

---

**Your HackMate platform is now live! 🚀**

Frontend: `https://your-frontend-app.vercel.app`
Backend: `https://your-backend-app.railway.app`