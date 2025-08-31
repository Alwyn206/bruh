# Railway Deployment Troubleshooting Guide

## 🔧 Fixed Issues

### 1. Docker Build Failure
**Problem**: Railway build failed due to missing Maven wrapper files
**Solution**: Updated Dockerfile to use multi-stage build with Maven image

### 2. Updated Dependencies
- ✅ Fixed deprecated MySQL connector
- ✅ Added Spring Boot Actuator for health checks
- ✅ Corrected JAR file naming in deployment config

## 🚀 Deployment Steps

### Option 1: Railway (Recommended)
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Fix Docker build issues"
   git push origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `backend` folder as root
   - Railway will automatically detect the Dockerfile

3. **Environment Variables** (Set in Railway dashboard):
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### Option 2: Heroku Alternative
1. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL addon**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Deploy**:
   ```bash
   git subtree push --prefix=backend heroku main
   ```

### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Select backend folder
3. Configure environment variables
4. Deploy automatically

## 🔍 Common Issues & Solutions

### Build Timeout
- **Cause**: Large dependencies download
- **Solution**: Use Docker layer caching (already implemented)

### Memory Issues
- **Cause**: Insufficient memory allocation
- **Solution**: Added JVM memory settings in Dockerfile

### Database Connection
- **Cause**: Wrong database URL format
- **Solution**: Use Railway's provided DATABASE_URL

### Health Check Failures
- **Cause**: Missing actuator endpoint
- **Solution**: Added Spring Boot Actuator dependency

## 📋 Pre-deployment Checklist

- ✅ Dockerfile updated with multi-stage build
- ✅ Maven dependencies fixed
- ✅ Health check endpoint available
- ✅ Environment variables configured
- ✅ Database connection string ready
- ✅ Google OAuth2 credentials set

## 🎯 Expected Results

After successful deployment:
- Backend API available at: `https://your-app.railway.app`
- Health check: `https://your-app.railway.app/actuator/health`
- API endpoints: `https://your-app.railway.app/api/*`

## 💡 Tips for Success

1. **Test locally first**: Ensure Docker build works locally
2. **Check logs**: Use Railway dashboard to monitor build logs
3. **Environment variables**: Double-check all required variables are set
4. **Database**: Ensure PostgreSQL addon is properly connected
5. **CORS**: Update frontend URL in backend configuration

## 🆘 Still Having Issues?

If deployment still fails:
1. Check Railway build logs for specific errors
2. Verify all environment variables are set
3. Test Docker build locally: `docker build -t hackmate-backend .`
4. Consider using GitHub Actions for CI/CD pipeline

---

**Next Steps**: Follow the deployment guide and your HackMate platform will be live! 🚀