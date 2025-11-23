#!/bin/bash

# Finance4All - Reset Local Database
# This script resets the local PostgreSQL database

set -e  # Exit on error

echo "======================================"
echo "Finance4All - Reset Database"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Navigate to project root
cd "$(dirname "$0")/.."

# Warning
echo -e "${RED}⚠️  WARNING: This will delete ALL data in the local database!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Reset cancelled."
    exit 1
fi

echo "Stopping backend service..."
docker compose stop backend

echo ""
echo "Resetting database..."

# Drop and recreate database
docker compose exec -T postgres psql -U finance4all_user -d postgres <<-EOSQL
    -- Terminate existing connections
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'finance4all'
      AND pid <> pg_backend_pid();

    -- Drop and recreate database
    DROP DATABASE IF EXISTS finance4all;
    CREATE DATABASE finance4all;
    GRANT ALL PRIVILEGES ON DATABASE finance4all TO finance4all_user;
EOSQL

echo ""
echo "Reconnecting to new database and running init script..."

# Run init script
docker compose exec -T postgres psql -U finance4all_user -d finance4all < scripts/init-db.sql

echo ""
echo "Restarting backend service..."
docker compose start backend

echo ""
echo -e "${GREEN}======================================"
echo "Database Reset Complete! ✅"
echo "======================================${NC}"
echo ""
echo "The database has been reset to its initial state."
echo "You can now run migrations and seed data if needed."
echo ""
