# Finance4All

> A comprehensive, cloud-native personal finance management platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GCP](https://img.shields.io/badge/Cloud-Google%20Cloud-4285F4)](https://cloud.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933)](https://nodejs.org/)

## Overview

Finance4All is a modern personal finance management platform that helps users track their finances, visualize net worth projections, and make informed financial decisions. Built with a cloud-native architecture on Google Cloud Platform (GCP), featuring real-time updates, beautiful Gemini-themed visualizations, and smooth animations.

## Key Features

- **Real-time Net Worth Tracking** - Track your net worth with live updates across all devices
- **30-Year Financial Projections** - Visualize your financial future with configurable scenarios
- **Smart Cash Flow Analysis** - Track income and expenses with automated categorization
- **Investment Portfolio Management** - Monitor your investments and analyze performance
- **Budget Management** - Create and track budgets with overspending alerts
- **Debt Payoff Planning** - Optimize debt repayment with multiple strategies
- **AI Financial Advisor** - Get personalized financial insights powered by AI
- **Beautiful Visualizations** - Gemini-themed charts with smooth animations

## Technology Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **UI Library:** Material-UI v5 (Gemini theme)
- **Animation:** Framer Motion
- **State Management:** Redux Toolkit + RTK Query
- **Build Tool:** Vite
- **Testing:** Vitest + React Testing Library + Playwright

### Backend
- **Runtime:** Node.js 20+ with TypeScript
- **Framework:** Express.js
- **API:** GraphQL with Apollo Server
- **ORM:** Prisma
- **Authentication:** Firebase Admin SDK
- **Testing:** Jest + Supertest

### Cloud Infrastructure (GCP)
- **Compute:** Cloud Run (containerized services)
- **Database:** Cloud SQL (PostgreSQL 15)
- **Real-time:** Firestore
- **Cache:** Cloud Memorystore (Redis)
- **Storage:** Cloud Storage
- **CI/CD:** Cloud Build
- **Monitoring:** Cloud Monitoring, Logging, Trace, Error Reporting
- **Infrastructure:** Terraform

## Project Structure

```
Finance4All/
├── backend/              # Backend API (Node.js + Express + GraphQL)
├── frontend/             # Frontend application (React + TypeScript)
├── terraform/            # Infrastructure as Code (Terraform)
│   ├── environments/     # Environment-specific configs
│   └── modules/          # Reusable Terraform modules
├── .github/              # GitHub workflows and CI/CD
├── docs/                 # Documentation
├── scripts/              # Helper scripts
├── CLAUDE.md            # Project plan and guidelines
├── ProgressTracker.md   # Implementation progress tracking
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- Docker Desktop
- PostgreSQL client (psql)
- Google Cloud SDK (gcloud)
- Terraform 1.5+
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/navderek/Finance4All.git
   cd Finance4All
   ```

2. **Set up local environment**
   ```bash
   # Install dependencies for backend
   cd backend
   npm install

   # Install dependencies for frontend
   cd ../frontend
   npm install
   ```

3. **Start local services with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   cd backend
   npm run migrate
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000/graphql

### Deployment

The application uses Cloud Build for automated CI/CD pipelines:

- **Development:** Auto-deploys from `develop` branch
- **Staging:** Auto-deploys from `staging` branch
- **Production:** Manual promotion from staging

See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:e2e
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

## Infrastructure

All infrastructure is managed with Terraform. See [terraform/README.md](terraform/README.md) for details.

### Environments

- **Development:** `finance4all-dev` (Project #: 1088145444556)
- **Staging:** `finance4all-staging` (Project #: 30558336944)
- **Production:** `finance4all-prod` (Project #: 556497009492)

## Documentation

- [Project Plan (CLAUDE.md)](CLAUDE.md) - Comprehensive project plan and guidelines
- [Progress Tracker](ProgressTracker.md) - Implementation progress tracking
- [Architecture Documentation](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Development Guide](docs/development-guide.md)
- [Deployment Guide](docs/deployment.md)

## Contributing

This is a personal project, but contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Google Cloud Platform**
