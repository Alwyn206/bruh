# HackMate Local Deployment Script
# Run this script to start HackMate locally with Docker

Write-Host "Starting HackMate Local Deployment" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "Docker is not running or not installed" -ForegroundColor Red
    Write-Host "Please install Docker Desktop and start it" -ForegroundColor Red
    Write-Host "Download: https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    exit 1
}

# Check if docker-compose.yml exists
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "docker-compose.yml not found" -ForegroundColor Red
    Write-Host "Please run this script from the hackmate directory" -ForegroundColor Red
    exit 1
}

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Check if ports are available
Write-Host "Checking ports..." -ForegroundColor Yellow
$ports = @(3000, 8080, 3306)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($connection) {
        Write-Host "Port $port is in use" -ForegroundColor Yellow
        Write-Host "Attempting to free port $port..." -ForegroundColor Yellow
        
        # Try to kill process using the port
        $processes = netstat -ano | Select-String ":$port " | ForEach-Object {
            $_.ToString().Split()[-1]
        }
        
        foreach ($pid in $processes) {
            if ($pid -and $pid -ne "0") {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "Freed port $port" -ForegroundColor Green
                } catch {
                    Write-Host "Could not free port $port automatically" -ForegroundColor Yellow
                }
            }
        }
    }
}

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes on first run..." -ForegroundColor Cyan

try {
    docker-compose up --build -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Containers started successfully!" -ForegroundColor Green
        
        # Wait for services to be ready
        Write-Host "Waiting for services to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Check service health
        Write-Host "Checking service health..." -ForegroundColor Yellow
        
        # Check backend
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5 -ErrorAction Stop
            Write-Host "Backend is healthy" -ForegroundColor Green
        } catch {
            Write-Host "Backend is starting up..." -ForegroundColor Yellow
        }
        
        # Check frontend
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
            Write-Host "Frontend is healthy" -ForegroundColor Green
        } catch {
            Write-Host "Frontend is starting up..." -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "HackMate is now running locally!" -ForegroundColor Green
        Write-Host "=========================================" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "Database: localhost:3306" -ForegroundColor Cyan
        Write-Host "Health Check: http://localhost:8080/actuator/health" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Configure Google OAuth2 (see LOCAL_DEPLOYMENT.md)" -ForegroundColor White
        Write-Host "2. Open http://localhost:3000 in your browser" -ForegroundColor White
        Write-Host "3. Start building teams!" -ForegroundColor White
        Write-Host ""
        Write-Host "To stop: docker-compose down" -ForegroundColor Red
        Write-Host "View logs: docker-compose logs -f" -ForegroundColor Magenta
        Write-Host ""
        
        # Ask if user wants to open browser
        $openBrowser = Read-Host "Open browser to http://localhost:3000? (y/n)"
        if ($openBrowser -eq "y" -or $openBrowser -eq "Y" -or $openBrowser -eq "") {
            Start-Process "http://localhost:3000"
        }
        
    } else {
        Write-Host "Failed to start containers" -ForegroundColor Red
        Write-Host "Check the logs with: docker-compose logs" -ForegroundColor Yellow
        exit 1
    }
    
} catch {
    Write-Host "Error starting containers: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try running: docker-compose logs" -ForegroundColor Yellow
    exit 1
}

Write-Host "Deployment complete! Happy coding!" -ForegroundColor Green