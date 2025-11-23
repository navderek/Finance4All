#!/bin/bash

# Finance4All - Stop Local Development Environment
# This script stops all Docker Compose services

set -e  # Exit on error

echo "======================================"
echo "Finance4All - Stopping Development"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Navigate to project root
cd "$(dirname "$0")/.."

echo "Stopping all services..."
docker compose down

echo ""
echo -e "${GREEN}======================================"
echo "Development Environment Stopped ✅"
echo "======================================${NC}"
echo ""
echo "Data is preserved in Docker volumes."
echo "To completely remove all data, run:"
echo "  docker compose down -v"
echo ""
echo "To start again:"
echo "  ./scripts/start-dev.sh"
echo ""
