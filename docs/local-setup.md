# Local Development Setup Guide

This guide will help you set up the Finance4All development environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Docker Desktop** (version 4.0+)
   - Download: https://docs.docker.com/desktop/install/windows-install/
   - **Important for WSL2 users**: Enable WSL2 integration in Docker Desktop settings

2. **Node.js** (version 20+)
   - Download: https://nodejs.org/
   - Verify: `node --version`

3. **Git**
   - Download: https://git-scm.com/downloads
   - Verify: `git --version`

4. **PostgreSQL Client** (optional, for direct database access)
   - Ubuntu/WSL2: `sudo apt install postgresql-client`
   - Verify: `psql --version`

### System Requirements

- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 10GB free space
- **OS**: Windows 10/11 with WSL2, macOS, or Linux

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/navderek/Finance4All.git
cd Finance4All
```

### 2. Run Setup Script

```bash
./scripts/setup-local.sh
```

This script will:
- ✅ Check for required dependencies
- ✅ Create `.env` files from `.env.example`
- ✅ Install npm dependencies for backend and frontend

### 3. Start Development Environment

```bash
./scripts/start-dev.sh
```

This will start all services in Docker containers:
- PostgreSQL database
- Redis cache
- Firestore emulator
- Backend API
- Frontend application

### 4. Access the Application

Once all services are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Backend Health**: http://localhost:4000/health
- **Firestore Emulator UI**: http://localhost:4000

### 5. Stop Development Environment

```bash
./scripts/stop-dev.sh
```

---

## Detailed Setup Instructions

### Installing Docker Desktop on Windows (WSL2)

1. **Download Docker Desktop**
   - Visit: https://docs.docker.com/desktop/install/windows-install/
   - Download the installer

2. **Install Docker Desktop**
   - Run the installer
   - Follow the installation wizard
   - Restart your computer when prompted

3. **Enable WSL2 Integration**
   - Open Docker Desktop
   - Go to **Settings** → **Resources** → **WSL Integration**
   - Enable integration with your WSL2 distribution (e.g., Ubuntu)
   - Click **Apply & Restart**

4. **Verify Installation**
   ```bash
   docker --version
   docker compose version
   ```

### Manual Environment Configuration

If you prefer to configure environment variables manually:

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update values as needed. For local development with Docker Compose, use:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://finance4all_user:local_dev_password_change_in_prod@postgres:5432/finance4all
REDIS_URL=redis://redis:6379
FIRESTORE_EMULATOR_HOST=firestore-emulator:8080
GCP_PROJECT_ID=finance4all-dev
```

#### Frontend (.env.local)

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
VITE_NODE_ENV=development
VITE_BACKEND_URL=http://localhost:4000
```

### Manual Dependency Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Service Architecture

### Docker Compose Services

| Service | Container Name | Ports | Purpose |
|---------|---------------|-------|---------|
| postgres | finance4all-postgres | 5432 | PostgreSQL database |
| redis | finance4all-redis | 6379 | Redis cache |
| firestore-emulator | finance4all-firestore-emulator | 8080, 4000 | Firestore emulator |
| backend | finance4all-backend | 4000 | Node.js API |
| frontend | finance4all-frontend | 5173 | React application |

### Data Persistence

Docker volumes are used to persist data across container restarts:

- `finance4all-postgres-data`: PostgreSQL database files
- `finance4all-redis-data`: Redis cache data

---

## Development Workflow

### Starting Services

```bash
# Start all services
./scripts/start-dev.sh

# Start specific services only
docker compose up -d postgres redis

# Start with logs
docker compose up
```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail=100 backend
```

### Restarting Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend

# Rebuild and restart (after code changes)
docker compose up -d --build backend
```

### Stopping Services

```bash
# Stop all services (preserves data)
./scripts/stop-dev.sh

# OR
docker compose down

# Stop and remove volumes (deletes all data)
docker compose down -v
```

### Database Operations

#### Accessing PostgreSQL

```bash
# Using psql (if installed locally)
psql -h localhost -U finance4all_user -d finance4all

# Using Docker
docker compose exec postgres psql -U finance4all_user -d finance4all
```

#### Resetting Database

```bash
./scripts/reset-db.sh
```

**Warning**: This will delete ALL data in the local database!

#### Running SQL Scripts

```bash
# From local file
docker compose exec -T postgres psql -U finance4all_user -d finance4all < path/to/script.sql

# Inline SQL
docker compose exec postgres psql -U finance4all_user -d finance4all -c "SELECT * FROM health_check;"
```

### Redis Operations

```bash
# Access Redis CLI
docker compose exec redis redis-cli

# Test Redis connection
docker compose exec redis redis-cli ping

# View all keys
docker compose exec redis redis-cli KEYS '*'

# Flush all data (careful!)
docker compose exec redis redis-cli FLUSHALL
```

---

## Troubleshooting

### Common Issues

#### 1. Docker not running

**Error**: `Cannot connect to the Docker daemon`

**Solution**:
- Ensure Docker Desktop is running
- In WSL2, verify WSL integration is enabled in Docker Desktop settings

#### 2. Port already in use

**Error**: `Bind for 0.0.0.0:5432 failed: port is already allocated`

**Solution**:
```bash
# Find process using the port
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Stop the conflicting service or change port in docker-compose.yml
```

#### 3. Permission denied on scripts

**Error**: `Permission denied: ./scripts/setup-local.sh`

**Solution**:
```bash
chmod +x scripts/*.sh
```

#### 4. PostgreSQL connection refused

**Solution**:
```bash
# Wait for PostgreSQL to be ready
docker compose exec postgres pg_isready -U finance4all_user

# Check logs
docker compose logs postgres
```

#### 5. Frontend can't connect to backend

**Solution**:
- Verify backend is running: `curl http://localhost:4000/health`
- Check `VITE_BACKEND_URL` in `frontend/.env.local`
- Ensure CORS is properly configured in backend

#### 6. Firestore emulator not starting

**Solution**:
```bash
# Check emulator logs
docker compose logs firestore-emulator

# Restart emulator
docker compose restart firestore-emulator
```

### Checking Service Health

```bash
# Check all service status
docker compose ps

# Check specific service health
docker compose exec postgres pg_isready -U finance4all_user
docker compose exec redis redis-cli ping

# Check backend health
curl http://localhost:4000/health
```

### Cleaning Up

```bash
# Remove stopped containers
docker compose down

# Remove containers and volumes (deletes data)
docker compose down -v

# Remove images
docker compose down --rmi all

# Complete cleanup
docker system prune -a --volumes
```

---

## Advanced Configuration

### Running Without Docker

If you prefer to run services locally without Docker:

1. **Install PostgreSQL 15**
2. **Install Redis 7**
3. **Install Firestore Emulator**
   ```bash
   npm install -g firebase-tools
   firebase emulators:start --only firestore
   ```

4. **Update environment variables**:
   - Use `localhost` instead of service names in `.env`
   - Start backend: `cd backend && npm run dev`
   - Start frontend: `cd frontend && npm run dev`

### Custom Docker Compose Configuration

Create `docker-compose.override.yml` for local customizations:

```yaml
version: '3.9'

services:
  backend:
    ports:
      - "4001:4000"  # Custom port
    environment:
      - LOG_LEVEL=debug  # More verbose logging
```

---

## Next Steps

- Read the [Development Guide](development-guide.md) for coding standards
- Review [Architecture Documentation](architecture.md)
- Check [API Documentation](api.md) for backend endpoints

---

## Need Help?

- Check the [Troubleshooting](#troubleshooting) section above
- Review logs: `docker compose logs -f`
- Open an issue on GitHub: https://github.com/navderek/Finance4All/issues
