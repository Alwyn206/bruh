@echo off
echo ========================================
echo HackMate Manual Setup (No Docker)
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found!
    echo Please install Java 17 from: https://adoptium.net/
    pause
    exit /b 1
)
echo [OK] Java found

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check Maven
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven not found!
    echo Please install Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo [OK] Maven found

echo.
echo All prerequisites met!
echo.
echo Starting HackMate services...
echo.

REM Start backend in new window
echo Starting backend server...
start "HackMate Backend" cmd /k "cd /d %~dp0backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev"

REM Wait a bit for backend to start
echo Waiting for backend to initialize...
timeout /t 10 /nobreak >nul

REM Start frontend in new window
echo Starting frontend server...
start "HackMate Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo HackMate is starting up!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8080
echo.
echo Note: You'll need to set up a local MySQL database
echo See DOCKER_TROUBLESHOOTING.md for database setup
echo.
echo Press any key to open the application...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo HackMate is now running!
echo Close the backend and frontend windows to stop the servers.
echo.
pause