# 🚀 HackMate Backend Deployment on Render

This guide will help you deploy the HackMate Spring Boot backend on Render.com.

## 📋 Prerequisites

- GitHub repository with your HackMate backend code
- Render.com account (free tier available)
- MySQL database (can use Render's PostgreSQL or external MySQL)

## 🔧 Render Configuration

### **Language & Runtime**
- **Language**: `Docker`
- **Dockerfile**: Located in `backend/Dockerfile`

### **Build Command**
```bash
# Render will automatically build using Dockerfile
```

### **Start Command**
```bash
# Render will use CMD from Dockerfile
```

### **Root Directory**
```
backend
```

## 🌍 Environment Variables

Add these environment variables in your Render service settings:

### **Database Configuration**
```env
# Database URL (replace with your database details)
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/hackmate_db
SPRING_DATASOURCE_USERNAME=your_db_username
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQL8Dialect
```

### **JWT Configuration**
```env
# JWT Secret (generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRATION=86400000
```

### **Google OAuth2 Configuration**
```env
# Google OAuth2 (get from Google Cloud Console)
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=your-google-client-id
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **CORS Configuration**
```env
# Frontend URL (update with your frontend domain)
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
```

### **Server Configuration**
```env
# Server settings
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=production
```

## 📁 Required Files in Backend Directory

Ensure these files exist in your `backend/` directory:

- `pom.xml` - Maven configuration ✅
- `Dockerfile` - Docker configuration for Render ✅
- `.dockerignore` - Docker build optimization ✅
- `mvnw` - Maven wrapper script ✅
- `mvnw.cmd` - Maven wrapper for Windows ✅
- `.mvn/wrapper/maven-wrapper.properties` ✅
- `.mvn/wrapper/maven-wrapper.jar` ✅

**Note**: All Docker files have been configured for Render deployment with dynamic port support and build optimization.

### **1. pom.xml** (Maven configuration)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.hackmate</groupId>
    <artifactId>hackmate-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>hackmate-backend</name>
    <description>HackMate Backend API</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-oauth2-client</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### **2. mvnw** (Maven Wrapper)
Ensure you have the Maven wrapper files:
- `mvnw` (Unix/Linux)
- `mvnw.cmd` (Windows)
- `.mvn/wrapper/maven-wrapper.properties`
- `.mvn/wrapper/maven-wrapper.jar`

If missing, generate them with:
```bash
mvn wrapper:wrapper
```

## 🗄️ Database Setup

### **Option 1: Render PostgreSQL (Recommended)**
1. Create a PostgreSQL database on Render
2. Update environment variables:
```env
SPRING_DATASOURCE_URL=postgresql://your-postgres-url
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
```
3. Add PostgreSQL dependency to `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### **Option 2: External MySQL**
- Use PlanetScale, AWS RDS, or any MySQL provider
- Configure connection details in environment variables

## 🚀 Deployment Steps

### **1. Prepare Repository**
```bash
# Ensure your backend code is in the 'backend' directory
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### **2. Create Render Service**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hackmate-backend`
   - **Language**: `Docker`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile` (auto-detected)
   - **Build & Start**: Handled automatically by Docker

### **3. Add Environment Variables**
In the Render dashboard, go to your service → Environment tab and add all the environment variables listed above.

### **4. Deploy**
Click "Create Web Service" and wait for deployment to complete.

## 🔍 Troubleshooting

### **Common Issues**

**Docker Build Failures**
- Ensure Dockerfile syntax is correct
- Check if all required files are present in backend directory
- Verify Maven wrapper files have correct permissions
- Check Java version compatibility (using OpenJDK 17)
- Ensure Docker build context includes all necessary files

**Database Connection Issues**
- Double-check database URL format
- Ensure database credentials are correct
- Verify database server allows connections from Render IPs

**Runtime Issues**
- Check environment variables are set correctly in Render dashboard
- Verify database connection string format
- Check application logs in Render dashboard
- Ensure Docker container has sufficient memory (512MB recommended)

**Port Issues**
- Dockerfile is configured to use `$PORT` environment variable
- Render automatically sets `PORT` for Docker deployments
- Application defaults to port 8080 if `PORT` is not set

**Memory Issues**
- Docker container memory limits are handled by Render
- Monitor memory usage in Render dashboard
- Consider upgrading to higher tier if memory issues persist

### **Logs**
View logs in Render dashboard → Your Service → Logs tab

## 🌐 API Endpoints

Once deployed, your API will be available at:
```
https://your-service-name.onrender.com
```

Test endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `GET /api/teams` - Get teams

## 🔗 Next Steps

1. **Frontend Deployment**: Deploy your React frontend on Vercel/Netlify
2. **Domain Setup**: Configure custom domain if needed
3. **SSL**: Render provides free SSL certificates
4. **Monitoring**: Set up health checks and monitoring

## 📚 Additional Resources

- [Render Java Documentation](https://render.com/docs/deploy-java)
- [Spring Boot on Render](https://render.com/docs/deploy-spring-boot)
- [Environment Variables](https://render.com/docs/environment-variables)

---

**🎉 Your HackMate backend should now be running on Render!**