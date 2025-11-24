# Changelog

All notable changes to the Finance4All project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.0] - 2025-11-23

### Added - Accounts Management UI (Step 2.9)
- **Account Components (6 components):**
  - `AccountBadge.tsx` - Account type badge with icon and color coding
  - `AccountCard.tsx` - Animated account summary card with Framer Motion
  - `AccountsList.tsx` - Main list with filtering, sorting, search, and pagination
  - `AccountForm.tsx` - Full form with React Hook Form + Zod validation
  - `AccountDetail.tsx` - Detailed view dialog with all account information
  - `DeleteAccountDialog.tsx` - Confirmation dialog for account deletion

- **Account Features:**
  - Full CRUD operations (Create, Read, Update, Delete)
  - Search by name and institution
  - Filter by type (18 account types) and category (ASSET, LIABILITY, INVESTMENT)
  - Sort by name, type, balance, or creation date
  - Grid/List view toggle
  - Pagination support
  - Form validation with Zod schemas
  - Mock data for development (4 sample accounts)
  - Animated grid with stagger effects
  - Responsive design (mobile, tablet, desktop)

- **Accounts Page:**
  - `frontend/src/pages/accounts/AccountsPage.tsx` - Full page with CRUD operations
  - Integrated all account components
  - State management for dialogs
  - Handler functions for all operations
  - Added `/accounts` route to App.tsx

- **Account Tests (6 test files):**
  - `AccountBadge.test.tsx` - Badge rendering tests
  - `AccountCard.test.tsx` - Card rendering and action tests
  - `AccountsList.test.tsx` - List filtering, sorting, search tests
  - `AccountForm.test.tsx` - Form validation and submission tests
  - `AccountDetail.test.tsx` - Detail view and actions tests
  - `DeleteAccountDialog.test.tsx` - Confirmation dialog tests
  - 83 tests total, 75 passing (90% pass rate)

### Added - Transaction Entry UI (Step 2.10)
- **Transaction Types & Categories:**
  - `frontend/src/types/transaction.ts` - Transaction types and validation
  - TransactionType enum (INCOME, EXPENSE)
  - 20+ predefined categories with icons and colors:
    - Income: Salary, Freelance, Investment, Gift, Refund, Other
    - Expense: Housing, Transportation, Food, Groceries, Utilities, Healthcare, Entertainment, Shopping, Education, Insurance, Personal Care, Subscriptions, Travel, Other
  - Zod validation schemas (transactionSchema, transactionFormSchema)
  - Helper functions (getCategoryIcon, getCategoryColor, filterCategoriesByType)

- **Transaction Components (6 components):**
  - `CategoryBadge.tsx` - Category display with icon and color
  - `TransactionTypeBadge.tsx` - Income/Expense type indicator
  - `TransactionCard.tsx` - Transaction summary card with all details
  - `TransactionForm.tsx` - Full form with date picker and validation
  - `TransactionsList.tsx` - Advanced list with filtering and pagination
  - `QuickAddTransaction.tsx` - Simplified quick-entry modal

- **Transaction Features:**
  - Full CRUD operations
  - Advanced filtering:
    - Search by description
    - Filter by type (All, Income, Expense)
    - Filter by category (multi-select)
    - Filter by account (multi-select)
  - Sorting by date, amount, or description (ascending/descending)
  - Pagination (12 items per page)
  - Tags support with #hashtags
  - Date picker integration (@mui/x-date-pickers + date-fns)
  - Floating Action Button (FAB) for quick add
  - Mock data for development (5 sample transactions)
  - Animated grid layout with stagger
  - Responsive design

- **Transactions Page:**
  - `frontend/src/pages/transactions/TransactionsPage.tsx` - Full page with CRUD operations
  - Integrated all transaction components
  - State management for form and quick-add dialogs
  - Handler functions for all operations
  - Added `/transactions` route to App.tsx

### Changed
- **Frontend:**
  - Updated `frontend/src/App.tsx` to include `/accounts` and `/transactions` routes
  - Updated application routing with new pages

### Fixed
- **Account Components:**
  - Removed nested Typography in DialogTitle to fix hydration errors
  - Used specific role-based selectors for elements with duplicate text
  - Updated MUI class selectors to match MUI v5 patterns
  - Used regex patterns for flexible error message matching in tests
  - Simplified toggle button tests

### Tested
- **Account Management:**
  - 83 tests for account components
  - 75 passing (90% pass rate)
  - Coverage: rendering, interactions, validation, filtering, sorting, search

- **Transaction Management:**
  - Component rendering and interactions
  - Form validation and submission
  - Filtering and sorting
  - Date picker integration
  - Tag management

---

## [0.2.1] - 2025-11-16

### Added - Monitoring & Observability (Step 0.4)
- **Backend Error Reporting:**
  - Added `@google-cloud/error-reporting` v3.0.5 dependency
  - Integrated Error Reporting client with automatic error capture
  - Added `/test/error` endpoint for error reporting validation

- **Structured Logging:**
  - Implemented structured logging using `console.log()` for Cloud Run compatibility
  - Added request logging with severity levels (INFO, ERROR, WARNING)
  - Added `/test/log` endpoint for logging validation
  - Enhanced error logging with full stack traces and context

- **GCP Monitoring Resources:**
  - Created 2 uptime checks (backend health, frontend availability)
  - Created 4 log-based metrics (backend errors, backend requests, frontend errors, 4xx errors)
  - Created 4 alert policies (high error rate, service down, high CPU, high memory)
  - Configured email notification channel for alerts

- **Monitoring Dashboards:**
  - `monitoring/dashboards/infrastructure-dashboard.json` - Cloud Run, SQL, Redis resource metrics
  - `monitoring/dashboards/application-dashboard.json` - Request rates, latency, error counts
  - `monitoring/dashboards/database-dashboard.json` - Database and cache performance metrics

### Added - Local Development Environment (Step 0.5)
- **Docker Compose:**
  - Created `docker-compose.yml` with 5 services (PostgreSQL, Redis, Firestore, Backend, Frontend)
  - Configured custom bridge network `finance4all-network`
  - Added named volumes for data persistence (postgres_data, redis_data)
  - Configured health checks for PostgreSQL and Redis
  - Set up service dependencies for proper startup order

- **Docker Development Files:**
  - `backend/Dockerfile.dev` - Development container with hot reload support
  - `frontend/Dockerfile.dev` - Development container with Vite HMR

- **Firestore Emulator:**
  - `firebase.json` - Firestore emulator configuration (ports 8080, 9099)
  - `firestore.rules` - Development security rules (open access for local dev)

- **Database Initialization:**
  - `scripts/init-db.sql` - PostgreSQL initialization script (UUID extension, health_check table)

- **Helper Scripts:**
  - `scripts/setup-local.sh` - One-time setup automation (prerequisites check, .env creation, npm install)
  - `scripts/start-dev.sh` - Start all services with health checks and log following
  - `scripts/stop-dev.sh` - Gracefully stop all services
  - `scripts/reset-db.sh` - Database reset utility with confirmation prompt

- **Documentation:**
  - `docs/local-setup.md` - Comprehensive local setup guide (300+ lines)
  - `docs/development-guide.md` - Development standards and best practices (400+ lines)

### Changed
- **Backend:**
  - Updated `backend/package.json` to v0.2.1
  - Enhanced `backend/src/index.ts` with error reporting and structured logging
  - Updated `backend/.env.example` with Docker-specific configurations and detailed comments

- **Frontend:**
  - Updated `frontend/.env.example` with Vite variable naming and emulator configuration

### Fixed
- **Backend Container Issue:**
  - Fixed "ts-node-dev: not found" error by creating dedicated `Dockerfile.dev`
  - Ensured all dependencies (including devDependencies) are installed in development container

- **Firestore Emulator Issue:**
  - Fixed "Java 21+ JRE" error by switching to `andreysenov/firebase-tools:latest` Docker image
  - Resolved Java version compatibility issues

- **Port Conflict:**
  - Resolved port 4000 conflict between Firestore UI and Backend
  - Moved Firestore UI to standard port 9099

### Tested
- **Monitoring & Observability:**
  - Verified error reporting with test errors
  - Validated structured logging in Cloud Logging
  - Confirmed uptime checks are running and reporting healthy status
  - Tested log-based metrics collection
  - Validated dashboard JSON configurations

- **Local Development Environment:**
  - PostgreSQL: Connection, queries, health checks
  - Redis: PING, SET/GET operations, AOF persistence
  - Firestore: Emulator startup, port accessibility, UI access
  - Backend: All endpoints, hot reload, database connectivity
  - Frontend: Vite dev server, HMR, backend connectivity
  - End-to-end: All 5 services running together, network connectivity, data persistence

---

## [0.1.0] - 2025-11-16

### Added - CI/CD Pipeline (Step 0.3)
- **Backend Application:**
  - Created Node.js 20 + Express + TypeScript backend application
  - Added health check endpoint (`/health`)
  - Added API status endpoint (`/api`)
  - Implemented CORS support
  - Added graceful shutdown handlers

- **Frontend Application:**
  - Created React 18 + Vite + TypeScript frontend application
  - Implemented Gemini-themed design system
  - Created system status dashboard
  - Added backend health check integration
  - Implemented responsive layout (mobile, tablet, desktop)

- **Docker Containerization:**
  - `backend/Dockerfile` - Multi-stage production build (45s build time)
  - `frontend/Dockerfile` - Multi-stage build with Nginx (50s build time)
  - `frontend/nginx.conf` - Nginx configuration with security headers and GZIP

- **Cloud Build Pipelines:**
  - `backend/cloudbuild.yaml` - Automated backend build, push, and deploy
  - `frontend/cloudbuild.yaml` - Automated frontend build, push, and deploy
  - Configured Artifact Registry: `us-central1-docker.pkg.dev/finance4all-dev/finance4all`

- **GitHub Repository:**
  - Initialized Git repository
  - Created comprehensive `.gitignore` with GCP security rules
  - Created `README.md` with project overview and setup instructions
  - Repository: https://github.com/navderek/Finance4All

- **Cloud Run Deployments:**
  - Backend service: `finance4all-backend-dev` (https://finance4all-backend-dev-td4xdlhf3q-uc.a.run.app)
  - Frontend service: `finance4all-frontend-dev` (https://finance4all-frontend-dev-td4xdlhf3q-uc.a.run.app)
  - Configured public access (allUsers IAM role)
  - Deployed to us-central1 region

### Fixed
- TypeScript unused parameter errors (added `_` prefix)
- Cloud Build SHORT_SHA issue (added _IMAGE_TAG substitution)
- .gitignore excluding tsconfig*.json files (fixed pattern)
- Frontend build failure (committed missing TypeScript configs)

---

## [0.0.2] - 2025-11-15

### Added - Terraform Infrastructure (Step 0.2)
- Created comprehensive Terraform configuration for GCP infrastructure
- Deployed 26 cloud resources:
  - VPC Network with custom subnet
  - Firewall rules (egress, internal, health checks)
  - VPC Serverless Connector
  - Cloud SQL PostgreSQL 15 instance (db-f1-micro)
  - Cloud Memorystore Redis (1GB BASIC tier)
  - Firestore database (native mode)
  - Cloud Storage buckets (uploads, exports, backups)
  - Service accounts with IAM roles
  - Secret Manager secrets placeholders

- Organized Terraform files:
  - `terraform/main.tf` - Provider and backend configuration
  - `terraform/variables.tf` - Input variables with defaults
  - `terraform/vpc.tf` - Network infrastructure
  - `terraform/sql.tf` - Cloud SQL configuration
  - `terraform/redis.tf` - Memorystore configuration
  - `terraform/firestore.tf` - Firestore configuration
  - `terraform/storage.tf` - Cloud Storage buckets
  - `terraform/iam.tf` - Service accounts and IAM
  - `terraform/secrets.tf` - Secret Manager configuration
  - `terraform/outputs.tf` - Output values

- Created `terraform/.env.example` for sensitive variables
- Updated `ProgressTracker.md` with Step 0.2 completion

### Tested
- Terraform plan validation (0 errors)
- Successful deployment to dev environment
- Resource verification via GCP Console
- Cloud SQL connection test
- Redis connection test
- Firestore database access

---

## [0.0.1] - 2025-11-14

### Added - Initial Setup (Step 0.1)
- Created GCP project: `finance4all-dev`
- Enabled required GCP APIs:
  - Compute Engine API
  - Cloud SQL Admin API
  - Cloud Run API
  - Cloud Build API
  - Container Registry API
  - Artifact Registry API
  - Cloud Storage API
  - Firestore API
  - Cloud Memorystore for Redis API
  - VPC Access API
  - Secret Manager API
  - Cloud Monitoring API
  - Cloud Logging API
  - Error Reporting API

- Configured billing and project settings
- Set up IAM roles and permissions
- Created project structure and documentation:
  - `CLAUDE.md` - Comprehensive project plan (400+ lines)
  - `ProgressTracker.md` - Detailed progress tracking
  - Project directory structure (backend, frontend, terraform, docs, scripts)

---

## Upcoming

### Phase 1: Core Foundation - Backend (Week 3-6)
- Step 1.1: Backend Project Initialization (Prisma, Apollo GraphQL)
- Step 1.2: Database Schema Design & Migration
- Step 1.3: Authentication & Authorization (Firebase Admin SDK)
- Step 1.4-1.6: GraphQL Schema & Resolvers (Users, Accounts, Transactions)
- Step 1.7-1.9: Calculation Engine (Net Worth, Cash Flow, Projections)
- Step 1.10: Real-time Updates with Firestore

### Phase 2: Core Foundation - Frontend (Week 7-11)
- Design system and component library
- Authentication UI
- Dashboard with real-time updates
- Account and transaction management
- Charts and visualizations

---

## Version History Summary

- **v0.2.1** (2025-11-16) - Monitoring & Local Development (Steps 0.4 & 0.5 complete)
- **v0.1.0** (2025-11-16) - CI/CD Pipeline (Step 0.3 complete)
- **v0.0.2** (2025-11-15) - Terraform Infrastructure (Step 0.2 complete)
- **v0.0.1** (2025-11-14) - GCP Project Setup (Step 0.1 complete)

**Phase 0: Infrastructure & DevOps Setup** - ✅ COMPLETE (100%)
