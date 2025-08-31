# HackMate Deployment Guide: Heroku + Netlify

## 🚀 Overview

This guide will help you deploy HackMate using:
- **Heroku** for the Spring Boot backend
- **Netlify** for the React frontend
- **Heroku PostgreSQL** for the database

## 📋 Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) installed (for local testing)
- GitHub account
- Google Cloud Console project (for OAuth2)

## 🔧 Step 1: Prepare Your Code

### 1.1 Create Heroku-specific files

Create `system.properties` in the backend directory:
```properties
java.runtime.version=17
```

Create `Procfile` in the backend directory:
```
web: java -Dspring.profiles.active=prod -Dserver.port=$PORT -jar target/hackmate-backend-0.0.1-SNAPSHOT.jar
```

### 1.2 Update application-prod.properties
Ensure your `backend/src/main/resources/application-prod.properties` includes:
```properties
# Server Configuration
server.port=${PORT:8080}

# Database Configuration (Heroku will provide DATABASE_URL)
spring.datasource.url=${DATABASE_URL}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}

# CORS Configuration
cors.allowed-origins=${FRONTEND_URL:http://localhost:3000}

# Actuator
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```

## 🗄️ Step 2: Deploy Backend to Heroku

### 2.1 Create Heroku App
```bash
# Navigate to backend directory
cd backend

# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-hackmate-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini
```

### 2.2 Set Environment Variables
```bash
# Set production profile
heroku config:set SPRING_PROFILES_ACTIVE=prod

# Set JWT secret (generate a strong secret)
heroku config:set JWT_SECRET="your-super-secret-jwt-key-here"

# Set Google OAuth2 credentials
heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Set frontend URL (will update after Netlify deployment)
heroku config:set FRONTEND_URL="https://your-hackmate-frontend.netlify.app"
```

### 2.3 Deploy to Heroku
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial backend commit"

# Add Heroku remote
heroku git:remote -a your-hackmate-backend

# Deploy
git push heroku main

# Check logs if needed
heroku logs --tail
```

### 2.4 Verify Backend Deployment
```bash
# Check if app is running
heroku ps

# Test health endpoint
curl https://your-hackmate-backend.herokuapp.com/actuator/health
```

## 🌐 Step 3: Deploy Frontend to Netlify

### 3.1 Update Frontend Environment Variables

Update `frontend/.env.production`:
```env
REACT_APP_API_BASE_URL=https://your-hackmate-backend.herokuapp.com
REACT_APP_WS_URL=wss://your-hackmate-backend.herokuapp.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_NAME=HackMate
REACT_APP_ENV=production
```

### 3.2 Build and Deploy to Netlify

**Option A: Netlify CLI (Recommended)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

**Option B: GitHub Integration**
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Add environment variables in Netlify dashboard
7. Deploy

### 3.3 Configure Netlify Settings

Create `frontend/_redirects` file:
```
/*    /index.html   200
```

This ensures React Router works properly with client-side routing.

## 🔐 Step 4: Configure Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add authorized origins:
   - `https://your-hackmate-backend.herokuapp.com`
   - `https://your-hackmate-frontend.netlify.app`
6. Add authorized redirect URIs:
   - `https://your-hackmate-backend.herokuapp.com/login/oauth2/code/google`

## 🔄 Step 5: Update CORS Configuration

Update the FRONTEND_URL in Heroku:
```bash
heroku config:set FRONTEND_URL="https://your-hackmate-frontend.netlify.app"
```

## ✅ Step 6: Test Your Deployment

1. **Backend Health Check**:
   ```
   https://your-hackmate-backend.herokuapp.com/actuator/health
   ```

2. **Frontend Access**:
   ```
   https://your-hackmate-frontend.netlify.app
   ```

3. **Test Features**:
   - User registration/login
   - Google OAuth2 login
   - Team creation
   - Real-time chat
   - Team matching

## 💰 Cost Breakdown

### Free Tier Limits:
- **Heroku**: 550-1000 dyno hours/month (free)
- **Heroku PostgreSQL**: 10,000 rows, 20 connections (free)
- **Netlify**: 100GB bandwidth, 300 build minutes/month (free)

### Paid Options:
- **Heroku Hobby**: $7/month (no sleep, custom domains)
- **Heroku Standard-1X**: $25/month (better performance)
- **Netlify Pro**: $19/month (more bandwidth, advanced features)

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   ```bash
   # Check Heroku build logs
   heroku logs --tail
   
   # Restart dyno
   heroku restart
   ```

2. **Database Connection Issues**:
   ```bash
   # Check database URL
   heroku config:get DATABASE_URL
   
   # Reset database (WARNING: deletes all data)
   heroku pg:reset DATABASE_URL
   ```

3. **CORS Errors**:
   - Verify FRONTEND_URL is set correctly
   - Check Google OAuth2 authorized origins

4. **Environment Variables**:
   ```bash
   # List all config vars
   heroku config
   
   # Set missing variables
   heroku config:set KEY=value
   ```

## 🚀 Going Live Checklist

- ✅ Backend deployed to Heroku
- ✅ Frontend deployed to Netlify
- ✅ Database connected and migrated
- ✅ Environment variables configured
- ✅ Google OAuth2 configured
- ✅ CORS settings updated
- ✅ Custom domains configured (optional)
- ✅ SSL certificates active
- ✅ Health checks passing
- ✅ All features tested

## 🎉 Success!

Your HackMate platform is now live at:
- **Frontend**: `https://your-hackmate-frontend.netlify.app`
- **Backend API**: `https://your-hackmate-backend.herokuapp.com`

Users can now register, create teams, chat in real-time, and discover team matches! 🚀

---

**Need help?** Check the troubleshooting section or refer to the official documentation:
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Netlify Docs](https://docs.netlify.com/)