# ⚡ Render Backend - Quick Configuration

## 🔧 Service Settings

**Language:** `Docker`  
**Dockerfile:** `backend/Dockerfile`  
**Root Directory:** `backend`  

**Build Command:**
```bash
# Render will automatically build using Dockerfile
```

**Start Command:**
```bash
# Render will use CMD from Dockerfile
```

## 🌍 Environment Variables (Copy & Paste)

### Database (PostgreSQL - Recommended)
```
SPRING_DATASOURCE_URL=postgresql://your-postgres-url-from-render
SPRING_DATASOURCE_USERNAME=your_db_username
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
```

### JWT & Security
```
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random-123456789
JWT_EXPIRATION=86400000
```

### Google OAuth2 (Optional)
```
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=your-google-client-id
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### CORS & Server
```
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=production
```

## 📋 Quick Steps

1. **Connect Repository** to Render
2. **Select Service Type**: Web Service
3. **Configure**:
   - Language: Docker
   - Root Directory: `backend`
   - Dockerfile: Auto-detected
   - Build & Start: Handled by Docker
4. **Add Environment Variables** (see above)
5. **Deploy** 🚀

## 📁 Required Files (All Present ✅)

- `Dockerfile` - Docker configuration
- `.dockerignore` - Build optimization
- `pom.xml` - Maven configuration
- Maven wrapper files (`mvnw`, `mvnw.cmd`, `.mvn/`)

## 🗄️ Database Setup

**For PostgreSQL (Recommended):**
1. Create PostgreSQL database on Render
2. Copy connection URL to `SPRING_DATASOURCE_URL`
3. Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

**Your API URL:** `https://your-service-name.onrender.com`