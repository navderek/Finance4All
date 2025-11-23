#!/bin/bash

# Finance4All - Local Development Setup Script
# This script sets up the local development environment

set -e  # Exit on error

echo "======================================"
echo "Finance4All - Local Setup"
echo "======================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker Desktop from: https://docs.docker.com/desktop/install/windows-install/"
    echo "Make sure to enable WSL2 integration"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker Compose is available${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} is installed${NC}"

# Navigate to project root
cd "$(dirname "$0")/.."

echo ""
echo "Setting up environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating backend/.env from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ backend/.env created${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists, skipping${NC}"
fi

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Creating frontend/.env.local from .env.example...${NC}"
    cp frontend/.env.example frontend/.env.local
    echo -e "${GREEN}✅ frontend/.env.local created${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env.local already exists, skipping${NC}"
fi

echo ""
echo "Installing dependencies..."

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

echo ""
echo -e "${GREEN}======================================"
echo "Setup Complete! ✅"
echo "======================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Start the development environment:"
echo "     ./scripts/start-dev.sh"
echo ""
echo "  2. Access the application:"
echo "     - Frontend: http://localhost:5173"
echo "     - Backend:  http://localhost:4000"
echo "     - Firestore UI: http://localhost:4000 (emulator)"
echo ""
echo "  3. Stop the environment:"
echo "     ./scripts/stop-dev.sh"
echo ""
