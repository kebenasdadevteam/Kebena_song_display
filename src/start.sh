#!/bin/bash

echo "========================================"
echo "Kebena Church Song Display - Starting"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if backend dependencies are installed
if [ ! -d "kebena_backend/node_modules" ]; then
    echo -e "${RED}[ERROR]${NC} Backend dependencies not installed"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${RED}[ERROR]${NC} Frontend dependencies not installed"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Starting Backend Server..."
cd kebena_backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

echo "Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo ""
echo "========================================"
echo "Application Started!"
echo "========================================"
echo ""
echo -e "Backend:  ${GREEN}http://localhost:5000${NC}"
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo ""
echo "Login credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo -e "${YELLOW}[IMPORTANT]${NC} Change the admin password after first login!"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Try to open browser
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:5173
fi

# Wait for processes
wait
