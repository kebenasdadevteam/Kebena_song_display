#!/bin/bash

echo "========================================"
echo "Kebena Church Song Display - Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Node.js is installed: $(node --version)"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}[WARNING]${NC} MySQL command not found in PATH"
    echo "Please ensure MySQL is installed and running"
    echo "Install on Mac: brew install mysql"
    echo "Install on Ubuntu: sudo apt install mysql-server"
    echo ""
fi

echo "========================================"
echo "Step 1: Installing Backend Dependencies"
echo "========================================"
cd kebena_backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Failed to install backend dependencies"
    exit 1
fi
echo -e "${GREEN}[OK]${NC} Backend dependencies installed"
echo ""

echo "========================================"
echo "Step 2: Creating uploads folder"
echo "========================================"
mkdir -p uploads
chmod 755 uploads
echo -e "${GREEN}[OK]${NC} Uploads folder ready"
echo ""

cd ..

echo "========================================"
echo "Step 3: Installing Frontend Dependencies"
echo "========================================"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Failed to install frontend dependencies"
    exit 1
fi
echo -e "${GREEN}[OK]${NC} Frontend dependencies installed"
echo ""

echo "========================================"
echo "Step 4: Database Setup"
echo "========================================"
echo ""
echo "Please ensure MySQL is running before continuing."
echo ""
echo "Default credentials in .env file:"
echo "  DB_HOST=localhost"
echo "  DB_USER=root"
echo "  DB_PASSWORD=(empty - change if you have a password)"
echo "  DB_NAME=kebena_church_db"
echo ""
read -p "Continue with database initialization? (Y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Setup paused. Please update kebena_backend/.env with your MySQL credentials"
    echo "Then run: cd kebena_backend && npm run init-db"
    echo ""
    exit 0
fi

cd kebena_backend
npm run init-db
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Database initialization failed"
    echo "Please check:"
    echo "  1. MySQL is running"
    echo "  2. Credentials in .env file are correct"
    echo "  3. You have permission to create databases"
    echo ""
    echo "You can manually initialize later with: cd kebena_backend && npm run init-db"
    cd ..
    exit 1
fi
echo -e "${GREEN}[OK]${NC} Database initialized successfully"
cd ..
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Review kebena_backend/.env file and update MySQL password if needed"
echo "  2. Run ./start.sh to launch the application"
echo "  3. Open http://localhost:5173 in your browser"
echo "  4. Login with: admin / admin123"
echo ""
echo -e "${YELLOW}[IMPORTANT]${NC} Change the admin password after first login!"
echo ""
