#!/bin/bash
# GasDaddy startup script

set -e

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

# Check environment variables
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "Please create backend/.env with SPONSOR_PRIVATE_KEY"
    echo ""
    echo "Example:"
    echo "SPONSOR_PRIVATE_KEY=0x..."
    echo "PORT=3001"
    echo ""
    echo "Press Enter to continue anyway, or Ctrl+C to exit..."
    read
fi

echo "🚀 Starting GasDaddy..."
echo "📡 Backend: http://localhost:3001"
echo "🎨 Frontend: http://localhost:5173"
echo ""

# Start frontend and backend
npm run dev