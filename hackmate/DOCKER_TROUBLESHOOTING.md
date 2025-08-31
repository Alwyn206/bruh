# Docker Troubleshooting Guide for HackMate

## 🚨 Common Docker Issues & Solutions

### Issue 1: Docker Desktop Not Running
**Error**: `route and version http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/images/mysql:8.0/json`

**Solutions**:
1. **Start Docker Desktop**:
   - Open Docker Desktop from Start Menu
   - Wait for it to fully start (green icon in system tray)
   - Try the deployment script again

2. **Restart Docker Desktop**:
   ```powershell
   # Close Docker Desktop completely
   # Restart from Start Menu
   ```

3. **Reset Docker Desktop**:
   - Open Docker Desktop → Settings → Troubleshoot → Reset to factory defaults

### Issue 2: API Version Compatibility
**Error**: `check if the server supports the requested API version`

**Solutions**:
1. **Update Docker Desktop**:
   - Download latest version from https://www.docker.com/products/docker-desktop/
   - Uninstall old version, install new one

2. **Use older Docker Compose syntax**:
   ```yaml
   version: '3.3'  # Instead of '3.8'
   ```

### Issue 3: Port Already in Use
**Error**: `Port 3000/8080/3306 is already in use`

**Solutions**:
```powershell
# Find and kill processes using ports
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :3306

# Kill process by PID
taskkill /PID <PID_NUMBER> /F
```

---

## 🔧 Alternative: Manual Setup (No Docker)

### Option 1: Local Development Setup

#### Backend Setup
1. **Install Java 17**:
   - Download from https://adoptium.net/
   - Set JAVA_HOME environment variable

2. **Install MySQL**:
   - Download from https://dev.mysql.com/downloads/mysql/
   - Create database: `hackmate_db`
   - User: `root`, Password: `password`

3. **Run Backend**:
   ```powershell
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

#### Frontend Setup
1. **Install Node.js 18+**:
   - Download from https://nodejs.org/

2. **Run Frontend**:
   ```powershell
   cd frontend
   npm install
   npm start
   ```

### Option 2: Use Online IDEs

#### Gitpod (Free)
1. Push code to GitHub
2. Open in Gitpod: `https://gitpod.io/#https://github.com/yourusername/hackmate`
3. Everything runs in the cloud

#### CodeSandbox (Free)
1. Import from GitHub
2. Automatic environment setup
3. Instant preview

#### Replit (Free)
1. Import repository
2. Auto-detects tech stack
3. Built-in database

---

## 🌐 Cloud Deployment (No Local Setup)

### Render.com (Recommended Free Option)
1. **Create account**: https://render.com/
2. **Deploy backend**:
   - New → Web Service
   - Connect GitHub repo
   - Root directory: `backend`
   - Build: `mvn clean package -DskipTests`
   - Start: `java -jar target/hackmate-backend-0.0.1-SNAPSHOT.jar`

3. **Deploy frontend**:
   - New → Static Site
   - Root directory: `frontend`
   - Build: `npm run build`
   - Publish: `build`

4. **Add database**:
   - New → PostgreSQL
   - Free for 90 days

### Vercel + PlanetScale
1. **Frontend on Vercel**:
   - Import GitHub repo
   - Root directory: `frontend`
   - Auto-deploys

2. **Database on PlanetScale**:
   - Free MySQL database
   - Serverless scaling

3. **Backend on Railway** (if available) or **Heroku**

---

## 🛠️ Quick Fixes

### Fix 1: Simple Docker Reset
```powershell
# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Start fresh
docker-compose up --build
```

### Fix 2: Use Different Ports
Edit `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Use port 3001 instead
  backend:
    ports:
      - "8081:8080"  # Use port 8081 instead
  mysql:
    ports:
      - "3307:3306"  # Use port 3307 instead
```

### Fix 3: Minimal Docker Setup
Create `docker-compose.simple.yml`:
```yaml
version: '3.3'
services:
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: hackmate_db
    ports:
      - "3306:3306"
```

Then run:
```powershell
docker-compose -f docker-compose.simple.yml up
# Run backend and frontend manually
```

---

## 🎯 Recommended Path

### For Beginners:
1. **Try Render.com** - No local setup needed
2. **Use Gitpod** - Cloud development environment
3. **Manual setup** - Learn the stack

### For Developers:
1. **Fix Docker** - Best development experience
2. **Use Heroku + Netlify** - Production ready
3. **Try DigitalOcean** - Good balance

---

## 📞 Getting Help

1. **Check Docker logs**:
   ```powershell
   docker-compose logs
   ```

2. **Verify Docker installation**:
   ```powershell
   docker --version
   docker-compose --version
   ```

3. **Test Docker**:
   ```powershell
   docker run hello-world
   ```

4. **Alternative: Use WSL2**:
   - Enable WSL2 in Windows
   - Install Docker in WSL2
   - Better performance

---

**Remember**: The goal is to get HackMate running. Choose the path that works best for your setup! 🚀