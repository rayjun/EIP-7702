@echo off
echo 🎯 GasDaddy - EIP-7702 Gas Sponsorship Platform
echo =============================================

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm run install:all
) else if not exist "backend\node_modules" (
    echo 📦 Installing dependencies...
    call npm run install:all
) else if not exist "frontend\node_modules" (
    echo 📦 Installing dependencies...
    call npm run install:all
)

REM Check environment variables
if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env file not found!
    echo Please create backend\.env with:
    echo SPONSOR_PRIVATE_KEY=0x...
    echo.
)

echo 🚀 Starting GasDaddy platform...
echo 📡 Backend will run on: http://localhost:3001
echo 🎨 Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start frontend and backend
npm run dev

pause