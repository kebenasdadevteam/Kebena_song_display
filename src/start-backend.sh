#!/bin/bash

echo "========================================"
echo " Kebena Church Backend Startup"
echo "========================================"
echo ""

echo "Checking if backend folder exists..."
if [ ! -d "kebena_backend" ]; then
    echo "ERROR: kebena_backend folder not found!"
    echo "Make sure you're running this from the project root."
    exit 1
fi

echo ""
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "Node.js version:"
node --version
echo ""

echo "Navigating to backend folder..."
cd kebena_backend

echo ""
echo "Checking if node_modules exists..."
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Installing dependencies..."
    echo "This may take a few minutes..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "ERROR: Failed to install dependencies!"
        exit 1
    fi
    echo ""
    echo "Dependencies installed successfully!"
fi

echo ""
echo "Checking .env file..."
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    echo "The .env file should have been created automatically."
    echo "Please check the setup."
    exit 1
fi

echo ""
echo "========================================"
echo " Starting Backend Server..."
echo "========================================"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Health check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
