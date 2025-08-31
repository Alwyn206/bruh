# 🚀 HackMate Deployment Options Guide

## 📋 Project Overview

**HackMate** is a full-stack team-matching platform built with:

### 🔧 Technologies Used
- **Backend**: Java 17 + Spring Boot 3.2.0 + MySQL/PostgreSQL
- **Frontend**: React 18 + TailwindCSS + JavaScript
- **Real-time**: WebSocket + STOMP protocol
- **Authentication**: Google OAuth2 + JWT
- **Build Tools**: Maven + npm
- **Containerization**: Docker + Docker Compose

---

## 🏠 Option 1: Local Development (Recommended)

**✅ Best for**: Development, testing, learning, no cost

### Quick Start (One Command)
```powershell
# Run this in PowerShell from hackmate directory
.\start-local.ps1
```

### Manual Start
```powershell
docker-compose up --build
```

**Access URLs**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: localhost:3306

**📖 Full Guide**: [LOCAL_DEPLOYMENT.md](LOCAL_DEPLOYMENT.md)

---

## ☁️ Option 2: Cloud Deployment

### 🆓 Free Cloud Options

#### A) Render.com (Recommended Free Option)
- **Backend**: Free 750 hours/month
- **Frontend**: Unlimited static sites
- **Database**: Free PostgreSQL (90 days)
- **Setup Time**: 15 minutes

#### B) Fly.io
- **Backend**: Free allowance included
- **Frontend**: Static deployment
- **Database**: Fly PostgreSQL
- **Setup Time**: 20 minutes

#### C) Vercel + PlanetScale
- **Backend**: Vercel Functions (requires Node.js port)
- **Frontend**: Vercel (unlimited)
- **Database**: PlanetScale MySQL (free tier)
- **Setup Time**: 30 minutes

### 💰 Paid Cloud Options

#### A) Heroku + Netlify
- **Cost**: $7/month (Heroku) + Free (Netlify)
- **Setup Time**: 10 minutes
- **📖 Guide**: [HEROKU_NETLIFY_DEPLOY.md](HEROKU_NETLIFY_DEPLOY.md)

#### B) DigitalOcean App Platform
- **Cost**: $12/month (all-in-one)
- **Setup Time**: 15 minutes
- **📖 Guide**: [DIGITALOCEAN_DEPLOY.md](DIGITALOCEAN_DEPLOY.md)

#### C) AWS Amplify + Elastic Beanstalk
- **Cost**: ~$15-25/month
- **Setup Time**: 45 minutes
- **📖 Guide**: [AWS_DEPLOY.md](AWS_DEPLOY.md)

---

## 🎯 Deployment Comparison

| Option | Cost | Difficulty | Time | Best For |
|--------|------|------------|------|----------|
| **Local Docker** | Free | Easy | 5 min | Development, Learning |
| **Render.com** | Free | Easy | 15 min | MVP, Testing |
| **Fly.io** | Free | Medium | 20 min | Small Projects |
| **Heroku + Netlify** | $7/mo | Easy | 10 min | Production Ready |
| **DigitalOcean** | $12/mo | Medium | 15 min | Scalable Apps |
| **AWS** | $15-25/mo | Hard | 45 min | Enterprise |

---

## 🚀 Quick Start Recommendations

### For Beginners
1. **Start Local**: Use `start-local.ps1` script
2. **Learn & Develop**: Modify features locally
3. **Deploy Free**: Try Render.com when ready

### For Production
1. **Heroku + Netlify**: Easiest paid option
2. **DigitalOcean**: Best value for money
3. **AWS**: Enterprise-grade scaling

---

## 📱 Features Available

✅ **User Authentication** (Google OAuth2)
✅ **User Profiles** (Skills, interests, bio)
✅ **Team Creation** (Create & manage teams)
✅ **Team Discovery** (Browse & join teams)
✅ **Real-time Chat** (WebSocket communication)
✅ **Friend Invites** (Email invitations)
✅ **Modern UI** (Discord-inspired design)
✅ **Responsive Design** (Mobile-friendly)
✅ **Team Matching** (Algorithm-based suggestions)
✅ **Project Management** (Basic team tools)

---

## 🔧 Development Setup

### Prerequisites
- **Docker Desktop** (for local development)
- **Java 17** (for backend development)
- **Node.js 18+** (for frontend development)
- **Git** (version control)

### Environment Variables Needed
```env
# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT
JWT_SECRET=your_jwt_secret_key

# Database (auto-configured in Docker)
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/hackmate_db
```

---

## 🛠️ Troubleshooting

### Local Development Issues
```powershell
# Reset everything
docker-compose down -v
docker system prune -a
docker-compose up --build

# Check logs
docker-compose logs -f

# Free ports
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Cloud Deployment Issues
- **Build Failures**: Check Java version (must be 17)
- **Database Issues**: Verify connection strings
- **CORS Errors**: Update frontend URLs in backend config
- **OAuth Issues**: Check redirect URIs in Google Console

---

## 📚 Documentation Files

- **[LOCAL_DEPLOYMENT.md](LOCAL_DEPLOYMENT.md)** - Complete local setup guide
- **[HEROKU_NETLIFY_DEPLOY.md](HEROKU_NETLIFY_DEPLOY.md)** - Heroku + Netlify deployment
- **[DIGITALOCEAN_DEPLOY.md](DIGITALOCEAN_DEPLOY.md)** - DigitalOcean App Platform
- **[AWS_DEPLOY.md](AWS_DEPLOY.md)** - AWS Amplify + Elastic Beanstalk
- **[RAILWAY_TROUBLESHOOTING.md](RAILWAY_TROUBLESHOOTING.md)** - Railway fixes (deprecated)
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Original quick deploy guide

---

## 🎉 Success Metrics

After deployment, you should have:
- ✅ Working authentication system
- ✅ User registration and profiles
- ✅ Team creation and management
- ✅ Real-time chat functionality
- ✅ Team discovery and matching
- ✅ Mobile-responsive interface
- ✅ Production-ready security

---

## 💡 Next Steps

1. **Choose your deployment method** from the options above
2. **Follow the specific guide** for your chosen platform
3. **Configure Google OAuth2** for authentication
4. **Test all features** to ensure everything works
5. **Share with users** and start building teams!

**Happy Team Building! 🚀**