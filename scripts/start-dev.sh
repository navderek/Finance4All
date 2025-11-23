#!/bin/bash

# Finance4All - Start Local Development Environment
# This script starts all services using Docker Compose

set -e  # Exit on error

echo "======================================"
echo "Finance4All - Starting Development"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Run ./scripts/setup-local.sh first${NC}"
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env.local not found. Run ./scripts/setup-local.sh first${NC}"
    exit 1
fi

# Start Docker Compose services
echo "Starting services with Docker Compose..."
echo ""

# Start infrastructure services first (postgres, redis, firestore-emulator)
echo -e "${YELLOW}Step 1/2: Starting infrastructure services...${NC}"
docker compose up -d postgres redis firestore-emulator

# Wait for services to be healthy
echo ""
echo "Waiting for services to be ready..."
sleep 5

# Check PostgreSQL health
echo -n "Checking PostgreSQL... "
until docker compose exec -T postgres pg_isready -U finance4all_user -d finance4all > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✅${NC}"

# Check Redis health
echo -n "Checking Redis... "
until docker compose exec -T redis redis-cli ping > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✅${NC}"

# Start application services (backend, frontend)
echo ""
echo -e "${YELLOW}Step 2/2: Starting application services...${NC}"
docker compose up -d backend frontend

echo ""
echo -e "${GREEN}======================================"
echo "Development Environment Started! ✅"
echo "======================================${NC}"
echo ""
echo "Services:"
echo "  📊 PostgreSQL:      localhost:5432"
echo "  🔴 Redis:           localhost:6379"
echo "  🔥 Firestore UI:    http://localhost:4000"
echo "  🔙 Backend API:     http://localhost:4000"
echo "  🎨 Frontend:        http://localhost:5173"
echo ""
echo "Useful commands:"
echo "  View logs:          docker compose logs -f"
echo "  View backend logs:  docker compose logs -f backend"
echo "  View frontend logs: docker compose logs -f frontend"
echo "  Stop services:      ./scripts/stop-dev.sh"
echo "  Restart services:   docker compose restart"
echo ""
echo -e "${YELLOW}Opening frontend in browser...${NC}"
sleep 2

# Try to open browser (works in WSL2 with Windows browser)
if command -v wslview &> /dev/null; then
    wslview http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
fi

echo ""
echo "Press Ctrl+C to stop following logs, or run ./scripts/stop-dev.sh to stop all services"
echo ""

# Follow logs
docker compose logs -f
