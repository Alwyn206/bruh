# HackMate Deployment Guide: DigitalOcean App Platform

## 🚀 Overview

Deploy HackMate using DigitalOcean App Platform - a modern, fully-managed platform that handles both frontend and backend with automatic scaling.

## 📋 Prerequisites

- DigitalOcean account
- GitHub account with your HackMate repository
- Google Cloud Console project (for OAuth2)
- Domain name (optional, for custom domains)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Create App Platform Configuration

Create `.do/app.yaml` in your project root:

```yaml
name: hackmate-platform
services:
  # Backend Service
  - name: hackmate-backend
    source_dir: /backend
    github:
      repo: your-username/hackmate
      branch: main
    build_command: mvn clean package -DskipTests
    run_command: java -Dspring.profiles.active=prod -jar target/hackmate-backend-0.0.1-SNAPSHOT.jar
    environment_slug: java
    instance_count: 1
    instance_size_slug: basic-xxs
    http_port: 8080
    health_check:
      http_path: /actuator/health
    env:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: JWT_SECRET
        value: ${JWT_SECRET}
      - key: GOOGLE_CLIENT_ID
        value: ${GOOGLE_CLIENT_ID}
      - key: GOOGLE_CLIENT_SECRET
        value: ${GOOGLE_CLIENT_SECRET}
      - key: FRONTEND_URL
        value: ${_self.URL}

  # Frontend Service
  - name: hackmate-frontend
    source_dir: /frontend
    github:
      repo: your-username/hackmate
      branch: main
    build_command: |
      npm install
      npm run build
    output_dir: /build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    env:
      - key: REACT_APP_API_BASE_URL
        value: ${hackmate-backend.PUBLIC_URL}
      - key: REACT_APP_WS_URL
        value: ${hackmate-backend.PUBLIC_URL}
      - key: REACT_APP_GOOGLE_CLIENT_ID
        value: ${GOOGLE_CLIENT_ID}
      - key: REACT_APP_NAME
        value: HackMate
      - key: REACT_APP_ENV
        value: production

# Database
databases:
  - name: hackmate-db
    engine: PG
    version: "13"
    size: basic
    num_nodes: 1
```

### 1.2 Update Backend Configuration

Update `backend/src/main/resources/application-prod.properties`:

```properties
# Server Configuration
server.port=${PORT:8080}

# Database Configuration (DigitalOcean provides DATABASE_URL)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/{registrationId}

# CORS Configuration
cors.allowed-origins=${FRONTEND_URL}

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.com.hackmate=INFO
logging.level.org.springframework.security=DEBUG

# WebSocket
websocket.allowed-origins=${FRONTEND_URL}

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME:}
spring.mail.password=${EMAIL_PASSWORD:}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Actuator
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

## 🚀 Step 2: Deploy to DigitalOcean

### 2.1 Using DigitalOcean Console (Recommended)

1. **Login to DigitalOcean**:
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Navigate to "Apps" in the sidebar

2. **Create New App**:
   - Click "Create App"
   - Choose "GitHub" as source
   - Select your HackMate repository
   - Choose the main branch

3. **Configure Services**:
   - DigitalOcean will auto-detect your services from `.do/app.yaml`
   - Review the configuration
   - Adjust instance sizes if needed

4. **Add Database**:
   - Click "Add Database"
   - Choose PostgreSQL
   - Select "Basic" plan
   - Name it `hackmate-db`

5. **Set Environment Variables**:
   ```
   JWT_SECRET=your-super-secret-jwt-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

6. **Deploy**:
   - Review all settings
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

### 2.2 Using DigitalOcean CLI (doctl)

```bash
# Install doctl
# macOS: brew install doctl
# Windows: Download from GitHub releases
# Linux: snap install doctl

# Authenticate
doctl auth init

# Create app from spec
doctl apps create --spec .do/app.yaml

# Get app ID and monitor deployment
doctl apps list
doctl apps get <app-id>
```

## 🔐 Step 3: Configure Google OAuth2

1. **Get Your App URLs**:
   - Backend: `https://hackmate-backend-xxxxx.ondigitalocean.app`
   - Frontend: `https://hackmate-frontend-xxxxx.ondigitalocean.app`

2. **Update Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Credentials"
   - Edit your OAuth 2.0 Client ID
   - Add authorized origins:
     ```
     https://hackmate-backend-xxxxx.ondigitalocean.app
     https://hackmate-frontend-xxxxx.ondigitalocean.app
     ```
   - Add authorized redirect URIs:
     ```
     https://hackmate-backend-xxxxx.ondigitalocean.app/login/oauth2/code/google
     ```

## 🔄 Step 4: Update Environment Variables

In DigitalOcean Console:
1. Go to your app dashboard
2. Click "Settings" tab
3. Update environment variables with actual URLs:
   ```
   FRONTEND_URL=https://hackmate-frontend-xxxxx.ondigitalocean.app
   ```
4. Redeploy the app

## 📊 Step 5: Monitor and Scale

### 5.1 Monitoring
- **App Dashboard**: Real-time metrics and logs
- **Health Checks**: Automatic monitoring of `/actuator/health`
- **Alerts**: Set up notifications for downtime or errors

### 5.2 Scaling
```yaml
# Update .do/app.yaml for auto-scaling
services:
  - name: hackmate-backend
    instance_count: 1
    instance_size_slug: basic-xs  # Upgrade for better performance
    autoscaling:
      min_instance_count: 1
      max_instance_count: 3
      metrics:
        cpu:
          percent: 80
```

## 💰 Pricing

### Basic Setup (Recommended for MVP):
- **Backend**: Basic XXS ($5/month)
- **Frontend**: Basic XXS ($5/month) 
- **Database**: Basic ($15/month)
- **Total**: ~$25/month

### Production Setup:
- **Backend**: Basic XS ($12/month)
- **Frontend**: Basic XS ($12/month)
- **Database**: Basic ($15/month)
- **Total**: ~$39/month

### Enterprise Setup:
- **Backend**: Professional XS ($24/month)
- **Frontend**: Professional XS ($24/month)
- **Database**: Professional ($60/month)
- **Total**: ~$108/month

## 🔧 Advanced Configuration

### Custom Domains

1. **Add Domain in DigitalOcean**:
   - Go to app settings
   - Click "Domains"
   - Add your custom domain
   - Update DNS records as instructed

2. **SSL Certificates**:
   - Automatically provisioned by DigitalOcean
   - Let's Encrypt certificates
   - Auto-renewal

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to DigitalOcean
        uses: digitalocean/app_action@v1.1.5
        with:
          app_name: hackmate-platform
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
```

## ✅ Testing Your Deployment

1. **Health Checks**:
   ```bash
   curl https://hackmate-backend-xxxxx.ondigitalocean.app/actuator/health
   ```

2. **Frontend Access**:
   ```
   https://hackmate-frontend-xxxxx.ondigitalocean.app
   ```

3. **Database Connection**:
   - Check app logs for successful database migrations
   - Test user registration and login

4. **Real-time Features**:
   - Test WebSocket connections
   - Verify chat functionality
   - Check team matching features

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   ```bash
   # Check build logs in DigitalOcean console
   # Common fixes:
   # - Ensure Java 17 is specified
   # - Check Maven dependencies
   # - Verify file paths in app.yaml
   ```

2. **Database Connection**:
   ```bash
   # Check environment variables
   # Ensure DATABASE_URL is properly set
   # Verify database is running
   ```

3. **CORS Issues**:
   ```bash
   # Update FRONTEND_URL environment variable
   # Check Google OAuth2 origins
   # Verify CORS configuration in Spring Boot
   ```

4. **Memory Issues**:
   ```yaml
   # Upgrade instance size in app.yaml
   instance_size_slug: basic-xs  # or higher
   ```

## 🚀 Going Live Checklist

- ✅ App deployed successfully
- ✅ Database connected and migrated
- ✅ Environment variables configured
- ✅ Google OAuth2 configured
- ✅ Custom domain configured (optional)
- ✅ SSL certificates active
- ✅ Health checks passing
- ✅ Monitoring and alerts set up
- ✅ All features tested
- ✅ Performance optimized

## 🎉 Success!

Your HackMate platform is now live on DigitalOcean App Platform with:

- **Automatic scaling** based on traffic
- **Built-in monitoring** and alerting
- **Zero-downtime deployments**
- **Managed database** with automatic backups
- **SSL certificates** with auto-renewal
- **Global CDN** for fast content delivery

**Your URLs**:
- Frontend: `https://hackmate-frontend-xxxxx.ondigitalocean.app`
- Backend: `https://hackmate-backend-xxxxx.ondigitalocean.app`

Users can now enjoy a fully-featured team matching platform with enterprise-grade reliability! 🚀

---

**Need help?** Check [DigitalOcean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)