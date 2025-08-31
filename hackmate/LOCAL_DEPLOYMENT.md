# 🏠 HackMate Local Deployment Guide

## 📋 Languages & Technologies Used

### Backend
- **Java 17** - Main programming language
- **Spring Boot 3.2.0** - Web framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **Spring WebSocket** - Real-time chat
- **Maven** - Build tool & dependency management
- **MySQL/PostgreSQL** - Database

### Frontend
- **JavaScript (React 18.2.0)** - UI framework
- **HTML5 & CSS3** - Markup & styling
- **TailwindCSS** - CSS framework
- **Node.js & npm** - Package management

### DevOps & Configuration
- **Docker & Docker Compose** - Containerization
- **YAML** - Configuration files
- **PowerShell** - Deployment scripts
- **JSON** - Package configuration

### Additional Technologies
- **WebSocket/STOMP** - Real-time communication
- **JWT** - Token-based authentication
- **Google OAuth2** - Social login
- **Axios** - HTTP client
- **React Router** - Frontend routing

---

## 🚀 One-Click Local Deployment

**Since Railway free tier is discontinued, here's the easiest way to run HackMate locally:**

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Git](https://git-scm.com/) installed
- Google Cloud Console account (for OAuth2)

### Step 1: Quick Setup

1. **Open PowerShell in your hackmate directory**:
   ```powershell
   cd C:\Users\alwyn\Desktop\hackerank\hackmate
   ```

2. **Run the one-click deployment**:
   ```powershell
   docker-compose up --build
   ```

3. **Wait for startup** (first time takes 2-3 minutes)

4. **Access your application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Database**: localhost:3306 (MySQL)

### Step 2: Configure Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID with these URIs:
   - **Authorized origins**: `http://localhost:3000`
   - **Redirect URIs**: `http://localhost:8080/oauth2/callback/google`
4. Update `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     security:
       oauth2:
         client:
           registration:
             google:
               client-id: YOUR_GOOGLE_CLIENT_ID
               client-secret: YOUR_GOOGLE_CLIENT_SECRET
   ```

### Step 3: Restart & Enjoy!

```powershell
docker-compose down
docker-compose up
```

**🎉 Your HackMate platform is now running locally!**

---

## 🔧 Alternative: Manual Setup

### Backend Setup
```powershell
cd backend
# Install Java 17 if not installed
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```powershell
cd frontend
npm install
npm start
```

### Database Setup
```powershell
# Install MySQL/PostgreSQL locally
# Create database 'hackmate_db'
# Update connection details in application.yml
```

---

## 🌐 Cloud Alternatives (Free Options)

### Option 1: Render.com (Free Tier Available)
- **Backend**: Deploy Spring Boot to Render
- **Frontend**: Deploy React to Render Static Sites
- **Database**: PostgreSQL on Render (free 90 days)
- **Cost**: Free for 750 hours/month

### Option 2: Fly.io (Free Tier)
- **Backend**: Deploy with Dockerfile
- **Frontend**: Static site deployment
- **Database**: Fly PostgreSQL
- **Cost**: Free allowance included

### Option 3: Vercel + PlanetScale
- **Backend**: Vercel Functions (Node.js port needed)
- **Frontend**: Vercel (free)
- **Database**: PlanetScale MySQL (free tier)
- **Cost**: Generous free tiers

### Option 4: Netlify + Supabase
- **Backend**: Netlify Functions
- **Frontend**: Netlify (free)
- **Database**: Supabase PostgreSQL (free)
- **Cost**: Free tiers available

---

## 📱 Features Available Locally

✅ **User Authentication** (Google OAuth2)
✅ **User Profiles** (Skills, interests, bio)
✅ **Team Creation** (Create & manage teams)
✅ **Team Discovery** (Browse & join teams)
✅ **Real-time Chat** (WebSocket communication)
✅ **Friend Invites** (Email invitations)
✅ **Modern UI** (Discord-inspired design)
✅ **Responsive Design** (Mobile-friendly)

---

## 🛠️ Development Commands

### Docker Commands
```powershell
# Start everything
docker-compose up

# Start in background
docker-compose up -d

# Rebuild containers
docker-compose up --build

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v
docker-compose up --build
```

### Development Mode
```powershell
# Backend (with hot reload)
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend (with hot reload)
cd frontend
npm start
```

---

## 🔍 Troubleshooting

### Port Already in Use
```powershell
# Kill processes on ports 3000, 8080, 3306
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker Issues
```powershell
# Reset Docker
docker system prune -a
docker-compose down -v
docker-compose up --build
```

### Database Connection
```powershell
# Check MySQL container
docker-compose logs mysql

# Connect to database
docker exec -it hackmate_mysql mysql -u root -p
```

---

## 🎯 Next Steps

1. **Customize**: Modify features as needed
2. **Deploy**: Choose a cloud platform when ready
3. **Scale**: Add more features like video calls, file sharing
4. **Monitor**: Add logging and analytics

---

## 💡 Why Local Development?

- **No Cost**: Completely free to run
- **Full Control**: Modify anything you want
- **Fast Development**: Instant feedback
- **Learning**: Understand the full stack
- **Privacy**: Your data stays local

**Happy Coding! 🚀**