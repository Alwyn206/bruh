# HackMate Deployment Guide: AWS Amplify + Elastic Beanstalk

## 🚀 Overview

Deploy HackMate using AWS services:
- **AWS Amplify** for the React frontend
- **AWS Elastic Beanstalk** for the Spring Boot backend
- **Amazon RDS PostgreSQL** for the database

## 📋 Prerequisites

- AWS Account with billing enabled
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured
- [EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) installed
- GitHub account with your HackMate repository
- Google Cloud Console project (for OAuth2)

## 🔧 Step 1: Prepare Backend for Elastic Beanstalk

### 1.1 Create Elastic Beanstalk Configuration

Create `.ebextensions/01-java.config` in backend directory:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    SERVER_PORT: 5000
    SPRING_PROFILES_ACTIVE: prod
  aws:elasticbeanstalk:container:java:
    JVMOptions: '-Xmx512m -Xms256m'
  aws:autoscaling:launchconfiguration:
    InstanceType: t3.micro
    IamInstanceProfile: aws-elasticbeanstalk-ec2-role
```

Create `.ebextensions/02-nginx.config`:

```yaml
files:
  "/etc/nginx/conf.d/proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      upstream nodejs {
        server 127.0.0.1:5000;
        keepalive 256;
      }
      
      server {
        listen 80;
        
        if ($time_iso8601 ~ "^(\d{4})-(\d{2})-(\d{2})T(\d{2})") {
          set $year $1;
          set $month $2;
          set $day $3;
          set $hour $4;
        }
        access_log /var/log/nginx/healthd/application.log.$year-$month-$day-$hour healthd;
        access_log /var/log/nginx/access.log main;
        
        location / {
          proxy_pass http://nodejs;
          proxy_set_header Connection "";
          proxy_http_version 1.1;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        gzip on;
        gzip_comp_level 4;
        gzip_types
          text/plain
          text/css
          application/json
          application/javascript
          text/xml
          application/xml
          application/xml+rss
          text/javascript;
      }
```

### 1.2 Update Application Properties

Update `backend/src/main/resources/application-prod.properties`:

```properties
# Server Configuration
server.port=5000

# Database Configuration
spring.datasource.url=jdbc:postgresql://${RDS_HOSTNAME:localhost}:${RDS_PORT:5432}/${RDS_DB_NAME:hackmate}
spring.datasource.username=${RDS_USERNAME:postgres}
spring.datasource.password=${RDS_PASSWORD:password}
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
management.server.port=5001
```

### 1.3 Create Buildfile

Create `buildfile` in backend root:

```yaml
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
  build:
    commands:
      - echo Build started on `date`
      - mvn clean package -DskipTests
  post_build:
    commands:
      - echo Build completed on `date`
artifacts:
  files:
    - target/hackmate-backend-0.0.1-SNAPSHOT.jar
    - .ebextensions/**/*
```

## 🗄️ Step 2: Set Up Amazon RDS Database

### 2.1 Create RDS Instance

```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name hackmate-db-subnet-group \
  --db-subnet-group-description "HackMate DB Subnet Group" \
  --subnet-ids subnet-12345678 subnet-87654321

# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier hackmate-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 13.7 \
  --master-username hackmate \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --db-subnet-group-name hackmate-db-subnet-group \
  --vpc-security-group-ids sg-12345678 \
  --backup-retention-period 7 \
  --storage-encrypted
```

### 2.2 Configure Security Group

```bash
# Create security group for RDS
aws ec2 create-security-group \
  --group-name hackmate-rds-sg \
  --description "HackMate RDS Security Group"

# Allow PostgreSQL access from Elastic Beanstalk
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 5432 \
  --source-group sg-87654321
```

## 🚀 Step 3: Deploy Backend to Elastic Beanstalk

### 3.1 Initialize Elastic Beanstalk

```bash
# Navigate to backend directory
cd backend

# Initialize EB application
eb init hackmate-backend --platform java-17 --region us-east-1

# Create environment
eb create hackmate-prod --instance-type t3.small
```

### 3.2 Set Environment Variables

```bash
# Set environment variables
eb setenv \
  SPRING_PROFILES_ACTIVE=prod \
  JWT_SECRET="your-super-secret-jwt-key-here" \
  GOOGLE_CLIENT_ID="your-google-client-id" \
  GOOGLE_CLIENT_SECRET="your-google-client-secret" \
  RDS_HOSTNAME="hackmate-db.xxxxx.us-east-1.rds.amazonaws.com" \
  RDS_PORT="5432" \
  RDS_DB_NAME="hackmate" \
  RDS_USERNAME="hackmate" \
  RDS_PASSWORD="YourSecurePassword123!" \
  EMAIL_USERNAME="your-email@gmail.com" \
  EMAIL_PASSWORD="your-app-password"
```

### 3.3 Deploy Backend

```bash
# Build and deploy
mvn clean package -DskipTests
eb deploy

# Check status
eb status
eb health

# View logs if needed
eb logs
```

## 🌐 Step 4: Deploy Frontend to AWS Amplify

### 4.1 Prepare Frontend Configuration

Update `frontend/.env.production`:

```env
REACT_APP_API_BASE_URL=https://hackmate-prod.us-east-1.elasticbeanstalk.com
REACT_APP_WS_URL=wss://hackmate-prod.us-east-1.elasticbeanstalk.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_NAME=HackMate
REACT_APP_ENV=production
```

Create `amplify.yml` in frontend root:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### 4.2 Deploy with AWS Amplify Console

1. **Go to AWS Amplify Console**:
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" > "Host web app"

2. **Connect Repository**:
   - Choose "GitHub"
   - Authorize AWS Amplify
   - Select your HackMate repository
   - Choose the main branch

3. **Configure Build Settings**:
   - App name: `hackmate-frontend`
   - Environment: `production`
   - Build and test settings: Use the `amplify.yml` file

4. **Add Environment Variables**:
   ```
   REACT_APP_API_BASE_URL=https://hackmate-prod.us-east-1.elasticbeanstalk.com
   REACT_APP_WS_URL=wss://hackmate-prod.us-east-1.elasticbeanstalk.com
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_NAME=HackMate
   REACT_APP_ENV=production
   ```

5. **Deploy**:
   - Review settings
   - Click "Save and deploy"
   - Wait for build and deployment (5-10 minutes)

### 4.3 Configure Custom Domain (Optional)

```bash
# Add custom domain via AWS CLI
aws amplify create-domain-association \
  --app-id d1234567890123 \
  --domain-name yourdomain.com \
  --sub-domain-settings prefix=www,branchName=main
```

## 🔐 Step 5: Configure Google OAuth2

1. **Get Your App URLs**:
   - Backend: `https://hackmate-prod.us-east-1.elasticbeanstalk.com`
   - Frontend: `https://main.d1234567890123.amplifyapp.com`

2. **Update Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" > "Credentials"
   - Edit your OAuth 2.0 Client ID
   - Add authorized origins:
     ```
     https://hackmate-prod.us-east-1.elasticbeanstalk.com
     https://main.d1234567890123.amplifyapp.com
     ```
   - Add authorized redirect URIs:
     ```
     https://hackmate-prod.us-east-1.elasticbeanstalk.com/login/oauth2/code/google
     ```

## 🔄 Step 6: Update CORS Configuration

```bash
# Update frontend URL in Elastic Beanstalk
eb setenv FRONTEND_URL="https://main.d1234567890123.amplifyapp.com"

# Redeploy backend
eb deploy
```

## 📊 Step 7: Set Up Monitoring and Scaling

### 7.1 CloudWatch Monitoring

```bash
# Enable detailed monitoring
aws elasticbeanstalk put-configuration-template \
  --application-name hackmate-backend \
  --template-name monitoring-template \
  --option-settings Namespace=aws:autoscaling:launchconfiguration,OptionName=MonitoringInterval,Value=detailed
```

### 7.2 Auto Scaling Configuration

Create `.ebextensions/03-autoscaling.config`:

```yaml
option_settings:
  aws:autoscaling:asg:
    MinSize: 1
    MaxSize: 4
  aws:autoscaling:trigger:
    MeasureName: CPUUtilization
    Statistic: Average
    Unit: Percent
    LowerThreshold: 20
    UpperThreshold: 70
    ScaleUpIncrement: 1
    ScaleDownIncrement: -1
```

## 💰 AWS Pricing Estimate

### Development/Testing:
- **Elastic Beanstalk**: t3.micro (~$8.50/month)
- **RDS PostgreSQL**: db.t3.micro (~$13/month)
- **Amplify**: 5GB storage + 15GB bandwidth (~$1/month)
- **Total**: ~$22.50/month

### Production:
- **Elastic Beanstalk**: t3.small (~$17/month)
- **RDS PostgreSQL**: db.t3.small (~$26/month)
- **Amplify**: 15GB storage + 100GB bandwidth (~$2/month)
- **Load Balancer**: ~$18/month
- **Total**: ~$63/month

### High Traffic:
- **Elastic Beanstalk**: Multiple t3.medium instances (~$100/month)
- **RDS PostgreSQL**: db.t3.medium (~$52/month)
- **Amplify**: 50GB storage + 500GB bandwidth (~$6/month)
- **CloudFront CDN**: ~$10/month
- **Total**: ~$168/month

## ✅ Step 8: Testing Your Deployment

1. **Backend Health Check**:
   ```bash
   curl https://hackmate-prod.us-east-1.elasticbeanstalk.com/actuator/health
   ```

2. **Frontend Access**:
   ```
   https://main.d1234567890123.amplifyapp.com
   ```

3. **Database Connection**:
   ```bash
   # Test from EC2 instance
   psql -h hackmate-db.xxxxx.us-east-1.rds.amazonaws.com -U hackmate -d hackmate
   ```

4. **Load Testing**:
   ```bash
   # Install Apache Bench
   sudo apt-get install apache2-utils
   
   # Test API endpoints
   ab -n 1000 -c 10 https://hackmate-prod.us-east-1.elasticbeanstalk.com/api/health
   ```

## 🔧 Troubleshooting

### Common Issues:

1. **Elastic Beanstalk Deployment Failures**:
   ```bash
   # Check logs
   eb logs
   
   # SSH into instance
   eb ssh
   
   # Check application logs
   sudo tail -f /var/log/eb-engine.log
   ```

2. **Database Connection Issues**:
   ```bash
   # Test connectivity
   telnet hackmate-db.xxxxx.us-east-1.rds.amazonaws.com 5432
   
   # Check security groups
   aws ec2 describe-security-groups --group-ids sg-12345678
   ```

3. **Amplify Build Failures**:
   - Check build logs in Amplify Console
   - Verify environment variables
   - Check `amplify.yml` configuration

4. **High Costs**:
   ```bash
   # Monitor costs
   aws ce get-cost-and-usage --time-period Start=2023-01-01,End=2023-01-31 --granularity MONTHLY --metrics BlendedCost
   
   # Set up billing alerts
   aws budgets create-budget --account-id 123456789012 --budget file://budget.json
   ```

## 🚀 Advanced AWS Features

### 1. CloudFront CDN

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### 2. Route 53 DNS

```bash
# Create hosted zone
aws route53 create-hosted-zone --name yourdomain.com --caller-reference $(date +%s)

# Create DNS records
aws route53 change-resource-record-sets --hosted-zone-id Z123456789 --change-batch file://dns-changes.json
```

### 3. AWS Certificate Manager

```bash
# Request SSL certificate
aws acm request-certificate --domain-name yourdomain.com --validation-method DNS
```

### 4. AWS WAF (Web Application Firewall)

```bash
# Create WAF web ACL
aws wafv2 create-web-acl --scope CLOUDFRONT --default-action Allow={} --name HackMateWAF
```

## 🚀 Going Live Checklist

- ✅ RDS database created and configured
- ✅ Elastic Beanstalk environment deployed
- ✅ Amplify frontend deployed
- ✅ Environment variables configured
- ✅ Google OAuth2 configured
- ✅ Security groups configured
- ✅ Auto-scaling enabled
- ✅ Monitoring and alerts set up
- ✅ SSL certificates configured
- ✅ Custom domain configured (optional)
- ✅ CDN configured (optional)
- ✅ WAF configured (optional)
- ✅ All features tested
- ✅ Load testing completed
- ✅ Backup strategy implemented

## 🎉 Success!

Your HackMate platform is now live on AWS with enterprise-grade features:

- **Auto-scaling** based on traffic
- **Managed database** with automated backups
- **Global CDN** for fast content delivery
- **SSL certificates** with auto-renewal
- **Web Application Firewall** for security
- **Comprehensive monitoring** and alerting
- **99.99% uptime SLA**

**Your URLs**:
- Frontend: `https://main.d1234567890123.amplifyapp.com`
- Backend: `https://hackmate-prod.us-east-1.elasticbeanstalk.com`
- Custom Domain: `https://yourdomain.com` (if configured)

Your platform is now ready to handle thousands of users with enterprise-level reliability and security! 🚀

---

**Need help?** Check [AWS Documentation](https://docs.aws.amazon.com/) or [AWS Support](https://aws.amazon.com/support/)