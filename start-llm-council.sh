#!/bin/bash

# LLM Council Startup Script
# This script starts both Frontend and Backend servers, then opens the app in browser

PROJECT_DIR="/Users/mohammedaljohani/llm-council"
cd "$PROJECT_DIR" || exit 1

# Add Node and npm to PATH (for Automator compatibility)
export PATH="$HOME/.nvm/versions/node/*/bin:/usr/local/bin:/usr/bin:$PATH"

# Activate virtual environment
source "$PROJECT_DIR/.venv/bin/activate"

# Kill any existing processes (aggressive cleanup)
echo "🧹 Cleaning up old processes..."
pkill -9 -f "npm run dev" 2>/dev/null || true
pkill -9 -f "node" 2>/dev/null || true
pkill -9 -f "python.*backend.main" 2>/dev/null || true
pkill -9 -f "uvicorn" 2>/dev/null || true
# Kill processes using the ports
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true
sleep 3

# Check if node_modules exists in frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing Node dependencies..."
    cd "$PROJECT_DIR/frontend" && npm install
    cd "$PROJECT_DIR"
fi

# Install Python dependencies if needed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📦 Installing Python dependencies..."
    uv sync
fi

# Start Frontend (Vite dev server)
echo "🚀 Starting Frontend (Vite) on port 5173..."
cd "$PROJECT_DIR/frontend"
if ! npm run dev > /tmp/frontend.log 2>&1 &
then
    echo "❌ Failed to start Frontend"
    cat /tmp/frontend.log
    exit 1
fi
FRONTEND_PID=$!
sleep 5

# Start Backend (FastAPI)
echo "🚀 Starting Backend (FastAPI) on port 8001..."
cd "$PROJECT_DIR"
if ! python3 -m backend.main > /tmp/backend.log 2>&1 &
then
    echo "❌ Failed to start Backend"
    cat /tmp/backend.log
    exit 1
fi
BACKEND_PID=$!
sleep 4

# Wait for servers to be ready
echo "⏳ Waiting for servers to start..."
for i in {1..15}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1 && curl -s http://localhost:8001 > /dev/null 2>&1; then
        echo "✅ Servers are ready!"
        break
    fi
    echo "  Attempt $i/15..."
    sleep 1
done

# Open browser
echo "🌐 Opening browser..."
sleep 1
open http://localhost:5173

echo ""
echo "✅ LLM Council started successfully!"
echo ""
echo "📝 Running on:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8001"
echo ""
echo "📋 Log files:"
echo "   Frontend: tail -f /tmp/frontend.log"
echo "   Backend:  tail -f /tmp/backend.log"
echo ""
echo "🛑 To stop the servers, run:"
echo "   pkill -f 'npm run dev'; pkill -f 'python.*backend.main'"
