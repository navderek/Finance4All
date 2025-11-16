# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Finance4All is a comprehensive, cloud-native personal finance management platform designed to help users track their finances, visualize net worth projections, and make informed financial decisions. The application emphasizes real-time updates, beautiful visualizations with Gemini-themed design, smooth animations, and a clean, modern, responsive interface deployed on Google Cloud Platform (GCP).

## Project Vision

**Core Philosophy:**

* Users can start entering data anywhere they like (non-linear data entry)
* All views update automatically when new data is entered
* Backend calculations trigger instantly upon data changes
* Dashboard consolidates everything with no data entry required on main page
* Clean, modern, intuitive, and responsive interface
* Gemini-themed design with smooth animations for delightful UX
* Cloud-native architecture for scalability, reliability, and performance

**Key Features:**

* Real-time net worth calculations and 30-year projections
* Cash flow tracking (income, expenses)
* Account balance management (assets, investments, debt & liabilities)
* Manual data entry with historical CSV import support
* Advanced budgeting and "what if" scenario modeling
* Investment portfolio analysis
* Multiple chart visualizations with animations
* Gamified dashboard with achievements and progress tracking

## Technology Stack

### Frontend Stack
* **Framework:** React 18+ with TypeScript
* **UI Library:** Material-UI v5 (customized with Gemini theme)
* **Animation:** Framer Motion for smooth, engaging animations
* **State Management:** Redux Toolkit + RTK Query for API integration
* **Real-time:** Firebase SDK for Firestore real-time updates
* **Charts:** Recharts (React-based) with custom Gemini styling
* **Form Handling:** React Hook Form with Zod validation
* **Routing:** React Router v6
* **Build Tool:** Vite for fast development and optimized builds
* **Testing:** Vitest + React Testing Library + Playwright for E2E
* **Styling:** Emotion (CSS-in-JS) with Gemini design tokens

### Backend Stack
* **Runtime:** Node.js 20+ with TypeScript
* **Framework:** Express.js with TypeScript
* **API:** GraphQL with Apollo Server (better for complex financial data relationships)
* **ORM:** Prisma for type-safe database access
* **Validation:** Zod for runtime type validation
* **Authentication:** Firebase Admin SDK
* **Real-time:** Firestore for live updates, Pub/Sub for async jobs
* **Testing:** Jest + Supertest for API testing
* **Documentation:** GraphQL Playground + TypeDoc

### Database & Storage
* **Primary Database:** Cloud SQL (PostgreSQL 15+) for transactional financial data
* **Real-time Database:** Firestore for live sync and presence
* **Cache:** Cloud Memorystore (Redis) for session and calculation caching
* **File Storage:** Cloud Storage for CSV uploads, documents, exports
* **Backup:** Automated Cloud SQL backups + point-in-time recovery

### GCP Cloud-Native Infrastructure
* **Compute:** Cloud Run for containerized backend and frontend services
* **Serverless Functions:** Cloud Functions (2nd gen) for event-driven tasks
* **Container Registry:** Artifact Registry for Docker images
* **Load Balancing:** Cloud Load Balancer with Cloud CDN
* **Networking:** VPC with private service access for Cloud SQL
* **Security:**
  - Firebase Authentication for user identity
  - Secret Manager for credentials and API keys
  - Cloud Armor for DDoS protection and WAF
  - IAM for fine-grained access control
* **CI/CD:**
  - Cloud Build for automated builds and tests
  - Cloud Deploy for deployment pipelines
  - GitHub integration for source control
* **Monitoring & Observability:**
  - Cloud Monitoring for metrics and dashboards
  - Cloud Logging for centralized logs
  - Cloud Trace for distributed tracing
  - Error Reporting for error tracking
  - Uptime checks for availability monitoring
* **Infrastructure as Code:** Terraform for reproducible infrastructure

### Development Tools
* **Version Control:** Git with GitHub
* **Code Quality:** ESLint, Prettier, Husky for pre-commit hooks
* **API Testing:** Postman/Insomnia collections
* **Load Testing:** Artillery or k6 for performance testing
* **Documentation:** Storybook for UI components, GraphQL schema documentation

## Gemini Design System

### Color Palette
* **Primary:** Gemini Blue (#1A73E8) for main actions and highlights
* **Secondary:** Gemini Purple (#A142F4) for accents and secondary actions
* **Success:** Gemini Green (#34A853) for positive metrics (income, gains)
* **Warning:** Gemini Yellow (#FBBC04) for alerts and pending items
* **Error:** Gemini Red (#EA4335) for negative metrics (expenses, losses)
* **Background:**
  - Light mode: White (#FFFFFF), Light Gray (#F8F9FA)
  - Dark mode: Dark Gray (#202124), Darker Gray (#292A2D)
* **Text:**
  - Light mode: Dark Gray (#202124), Medium Gray (#5F6368)
  - Dark mode: White (#FFFFFF), Light Gray (#E8EAED)

### Typography
* **Font Family:** Google Sans (primary), Roboto (fallback)
* **Headings:** Google Sans Display (bold, large sizes)
* **Body:** Google Sans Text (regular, readable sizes)
* **Code/Numbers:** Roboto Mono (monospace for financial figures)

### Animation Principles
* **Timing:** 200-300ms for micro-interactions, 400-600ms for transitions
* **Easing:** Cubic-bezier curves for natural, smooth motion
* **Purpose:** Every animation should serve a purpose (feedback, guidance, delight)
* **Performance:** Use transform and opacity for GPU-accelerated animations
* **Types:**
  - Page transitions: Slide and fade
  - Card reveals: Stagger animations for lists
  - Number counting: Animated count-up for financial figures
  - Chart animations: Smooth data transitions and entry animations
  - Loading states: Skeleton screens with shimmer effects
  - Success/error: Celebratory or attention-grabbing animations

## Development Principles

When implementing features:

1. **Data Reactivity:** Ensure all UI components react to data changes instantly
2. **Non-linear UX:** Users can navigate and enter data in any order
3. **Calculation Pipeline:** Backend calculations must trigger automatically on data changes
4. **Dashboard Separation:** Keep dashboard read-only with consolidated views
5. **Security:** Financial data requires strong authentication, encryption at rest/transit, and secure database practices
6. **Cloud-Native:** Design for horizontal scaling, stateless services, and GCP-managed services
7. **Testing First:** Write tests before or alongside code (TDD approach preferred)
8. **Performance:** Optimize for Core Web Vitals (LCP, FID, CLS)
9. **Accessibility:** WCAG 2.1 AA compliance for inclusive design
10. **Mobile-First:** Design and build for mobile, then enhance for desktop

## Architecture Considerations

### Application Architecture
* **Pattern:** Microservices architecture with API gateway pattern
* **Services:**
  - API Gateway (GraphQL server)
  - Calculation Engine (Cloud Function)
  - Notification Service (Cloud Function)
  - Import/Export Service (Cloud Function)
  - Real-time Sync Service (Firestore triggers)

### State Management Strategy
* **Server State:** RTK Query for API caching and synchronization
* **Client State:** Redux Toolkit for complex UI state
* **Real-time State:** Firestore listeners for live data
* **Form State:** React Hook Form for isolated form state
* **URL State:** React Router for navigation state

### Calculation Engine
* **Location:** Cloud Function triggered by Pub/Sub messages
* **Caching:** Redis cache for frequently accessed calculations
* **Jobs:**
  - Net worth projection (30-year forecast)
  - Cash flow analysis
  - Investment returns calculation
  - Debt payoff schedules
  - Tax estimation

### Data Validation & Security
* **Input Validation:** Zod schemas on both frontend and backend
* **SQL Injection:** Prisma ORM prevents SQL injection
* **XSS Protection:** React's built-in XSS protection + Content Security Policy
* **CSRF Protection:** SameSite cookies + CSRF tokens
* **Rate Limiting:** Cloud Armor + application-level rate limiting
* **Encryption:**
  - TLS 1.3 for data in transit
  - Cloud SQL encryption at rest
  - Sensitive data encrypted with Cloud KMS

### Audit Trail & Compliance
* **Change Tracking:** All financial data changes logged with timestamp and user ID
* **Immutable Logs:** Cloud Logging with retention policies
* **Data Export:** GDPR-compliant data export functionality
* **Data Deletion:** Complete user data deletion on request

### Performance Optimization
* **Frontend:**
  - Code splitting by route
  - Lazy loading for charts and heavy components
  - Image optimization (WebP format, responsive images)
  - Service Worker for offline capability (PWA)
  - Virtual scrolling for large lists
* **Backend:**
  - Database query optimization with indexes
  - N+1 query prevention with DataLoader
  - Response caching with Redis
  - Pagination for large datasets
  - Background jobs for heavy calculations
* **Network:**
  - GraphQL query batching
  - HTTP/2 for multiplexing
  - Cloud CDN for static assets
  - GZIP/Brotli compression

## Detailed Implementation Plan

### Phase 0: Infrastructure & DevOps Setup (Week 1-2)

**Objective:** Establish cloud infrastructure, CI/CD pipelines, and development environment

#### Step 0.1: GCP Project Setup
- Create GCP project with billing enabled
- Enable required APIs (Cloud Run, Cloud SQL, Cloud Build, etc.)
- Set up IAM roles and service accounts
- Configure VPC and networking
- **Testing:** Verify API access and permissions with gcloud CLI

#### Step 0.2: Terraform Infrastructure as Code
- Create Terraform configuration for:
  - Cloud SQL instance (PostgreSQL)
  - Firestore database
  - Cloud Storage buckets
  - Cloud Memorystore (Redis)
  - Secret Manager secrets
  - VPC and networking
  - Cloud Run services (placeholder)
- **Testing:** Run terraform plan and validate configuration
- **Testing:** Deploy to dev environment and verify resources

#### Step 0.3: CI/CD Pipeline Setup
- Configure Cloud Build triggers for:
  - Backend: Build, test, containerize, deploy
  - Frontend: Build, test, containerize, deploy
- Set up GitHub repository with branch protection
- Configure automated testing in pipeline
- Set up staging and production environments
- **Testing:** Trigger build with dummy application
- **Testing:** Verify deployment to Cloud Run

#### Step 0.4: Monitoring & Observability Setup
- Configure Cloud Monitoring dashboards
- Set up log-based metrics
- Configure uptime checks
- Set up error reporting
- Create alert policies for critical metrics
- **Testing:** Generate test logs and errors, verify alerting

#### Step 0.5: Local Development Environment
- Create Docker Compose for local development
- Set up local PostgreSQL and Redis
- Configure environment variables and secrets
- Create development documentation
- **Testing:** Verify local environment setup on clean machine

**Deliverables:**
- Fully provisioned GCP infrastructure
- Automated CI/CD pipelines
- Monitoring and alerting configured
- Local development environment

---

### Phase 1: Core Foundation - Backend (Week 3-6)

**Objective:** Build robust backend API with authentication, database models, and core business logic

#### Step 1.1: Backend Project Initialization
- Initialize Node.js project with TypeScript
- Set up Express.js server with middleware
- Configure Apollo Server for GraphQL
- Set up Prisma ORM with PostgreSQL
- Configure environment variables and secrets
- **Unit Testing:** Test server startup and basic health endpoint
- **Integration Testing:** Verify database connection

#### Step 1.2: Database Schema Design & Migration
- Design comprehensive Prisma schema:
  - Users (with Firebase UID reference)
  - Accounts (assets, investments, debts)
  - Transactions (income, expenses)
  - Categories
  - Budgets
  - Projections
  - AuditLogs
- Create initial migration
- Seed database with test data
- **Testing:** Validate schema constraints and relationships
- **Testing:** Test migrations (up and down)

#### Step 1.3: Authentication & Authorization
- Integrate Firebase Admin SDK
- Create authentication middleware
- Implement JWT token validation
- Set up role-based access control (RBAC)
- Create user profile endpoints
- **Unit Testing:** Test authentication middleware
- **Integration Testing:** Test protected routes
- **Security Testing:** Test unauthorized access scenarios

#### Step 1.4: GraphQL Schema & Resolvers - User Management
- Define GraphQL schema for users
- Implement resolvers for:
  - getUserProfile
  - updateUserProfile
  - deleteUserAccount
- Add input validation with Zod
- **Unit Testing:** Test each resolver
- **Integration Testing:** Test GraphQL queries/mutations
- **E2E Testing:** Test user flows with Postman

#### Step 1.5: GraphQL Schema & Resolvers - Accounts
- Define GraphQL schema for accounts
- Implement resolvers for:
  - getAccounts (with filtering and pagination)
  - getAccountById
  - createAccount
  - updateAccount
  - deleteAccount
- Add real-time subscription for account updates
- **Unit Testing:** Test account CRUD operations
- **Integration Testing:** Test with database
- **E2E Testing:** Test account management flows

#### Step 1.6: GraphQL Schema & Resolvers - Transactions
- Define GraphQL schema for transactions
- Implement resolvers for:
  - getTransactions (with filtering, sorting, pagination)
  - getTransactionById
  - createTransaction
  - updateTransaction
  - deleteTransaction
  - bulkCreateTransactions
- Add transaction categorization logic
- **Unit Testing:** Test transaction operations
- **Integration Testing:** Test category assignment
- **E2E Testing:** Test transaction flows

#### Step 1.7: Calculation Engine - Net Worth
- Create Cloud Function for net worth calculation
- Implement calculation logic:
  - Current net worth (assets - liabilities)
  - Historical net worth tracking
  - Account balance aggregation
- Integrate with Pub/Sub for async processing
- Add Redis caching for results
- **Unit Testing:** Test calculation formulas
- **Integration Testing:** Test with real data
- **Performance Testing:** Test with large datasets (10k+ transactions)

#### Step 1.8: Calculation Engine - Cash Flow
- Extend calculation engine for cash flow:
  - Monthly income totals
  - Monthly expense totals by category
  - Cash flow trends (6-month, 12-month)
  - Income vs. expense comparison
- **Unit Testing:** Test cash flow calculations
- **Integration Testing:** Test historical analysis
- **Performance Testing:** Verify calculation speed (<500ms)

#### Step 1.9: Calculation Engine - Projections
- Implement 30-year net worth projection:
  - Configurable assumptions (growth rate, inflation, income growth)
  - Account for recurring income/expenses
  - Investment growth calculations (compound interest)
  - Debt payoff schedules
- **Unit Testing:** Test projection formulas
- **Integration Testing:** Test with various scenarios
- **Validation Testing:** Compare with financial calculator results

#### Step 1.10: Real-time Updates with Firestore
- Set up Firestore collections for real-time sync
- Create sync triggers for data changes
- Implement Firestore listeners
- Add presence detection
- **Integration Testing:** Test real-time data sync
- **Performance Testing:** Test with multiple concurrent connections

**Deliverables:**
- Fully functional GraphQL API
- Authentication and authorization system
- Complete database schema with migrations
- Calculation engine for financial metrics
- Real-time update infrastructure
- Comprehensive test coverage (>80%)

---

### Phase 2: Core Foundation - Frontend (Week 7-11)

**Objective:** Build responsive, animated frontend with Gemini design system

#### Step 2.1: Frontend Project Initialization
- Initialize React project with Vite + TypeScript
- Set up Material-UI with custom Gemini theme
- Configure Framer Motion for animations
- Set up Redux Toolkit and RTK Query
- Configure routing with React Router
- Set up ESLint, Prettier, and pre-commit hooks
- **Testing:** Verify build and dev server

#### Step 2.2: Design System & Component Library
- Create Gemini theme configuration:
  - Color palette (light and dark modes)
  - Typography scale
  - Spacing system
  - Breakpoints for responsive design
- Build core components:
  - Button (with loading and disabled states)
  - Input (with validation states)
  - Card (with elevation and hover effects)
  - Modal/Dialog
  - Loading indicators
  - Toast notifications
- Add Storybook for component documentation
- **Unit Testing:** Test each component with RTL
- **Visual Testing:** Create Storybook stories
- **Accessibility Testing:** Test keyboard navigation and ARIA labels

#### Step 2.3: Animation System Setup
- Create reusable animation components:
  - PageTransition
  - FadeIn
  - SlideIn
  - StaggerList
  - CountUp (for numbers)
  - LoadingSkeletons
- Define animation variants and timing
- Create animation hooks (useScrollAnimation, useInView)
- **Testing:** Test animation performance (60fps)
- **Testing:** Verify reduced motion preference support

#### Step 2.4: Authentication UI
- Build authentication pages:
  - Login (with email/password and Google OAuth)
  - Sign up
  - Password reset
  - Email verification
- Integrate Firebase Authentication SDK
- Add form validation with React Hook Form + Zod
- Implement protected routes
- Add authentication state management
- **Unit Testing:** Test form validation
- **Integration Testing:** Test auth flow with Firebase
- **E2E Testing:** Test complete sign-up and login flows with Playwright

#### Step 2.5: Layout & Navigation
- Create main application layout:
  - Responsive sidebar navigation
  - Top app bar with user menu
  - Mobile navigation drawer
  - Breadcrumb navigation
- Add route-based navigation
- Implement theme toggle (light/dark mode)
- Add page transitions
- **Unit Testing:** Test navigation components
- **Responsive Testing:** Test on mobile, tablet, desktop viewports
- **Accessibility Testing:** Test keyboard navigation

#### Step 2.6: Dashboard - Main View (Read-Only)
- Create dashboard layout with grid system
- Build metric cards with animated count-up:
  - Current net worth
  - Monthly income
  - Monthly expenses
  - Cash flow (income - expenses)
- Add skeleton loading states
- Implement responsive grid (1-col mobile, 2-col tablet, 4-col desktop)
- **Unit Testing:** Test dashboard components
- **Integration Testing:** Test with API data
- **Visual Testing:** Verify responsive layouts

#### Step 2.7: Dashboard - Charts & Visualizations
- Implement animated charts:
  - Net worth trend (line chart, 12-month view)
  - Cash flow bar chart (income vs. expenses, 6-month view)
  - Expense breakdown (donut chart by category)
  - Account distribution (stacked bar chart)
- Add interactive tooltips and legends
- Implement chart animations (smooth entry and transitions)
- Add loading and empty states
- **Unit Testing:** Test chart data transformations
- **Integration Testing:** Test with real API data
- **Performance Testing:** Test render time with large datasets

#### Step 2.8: Dashboard - Real-time Updates
- Integrate Firestore listeners for live data
- Add optimistic UI updates
- Implement smooth data transitions in charts
- Add visual indicators for real-time updates (pulse animation)
- **Integration Testing:** Test real-time sync
- **Testing:** Simulate multiple concurrent updates

#### Step 2.9: Accounts Management UI
- Create accounts list view:
  - Filterable and sortable table
  - Account type badges
  - Current balance display
  - Quick actions (edit, delete)
- Build account detail view
- Create account form (add/edit):
  - Account name, type, balance
  - Form validation
  - Animated form transitions
- Add confirmation dialogs for deletion
- **Unit Testing:** Test account components
- **Integration Testing:** Test CRUD operations with API
- **E2E Testing:** Test complete account management flow

#### Step 2.10: Transaction Entry UI
- Create transaction form:
  - Amount, date, category, account
  - Income vs. expense toggle
  - Notes field
  - Form validation with instant feedback
- Build transaction list view:
  - Infinite scroll or pagination
  - Filters (date range, category, account, type)
  - Search functionality
  - Bulk selection and actions
- Add quick-add transaction modal
- Implement inline editing
- **Unit Testing:** Test transaction form and list
- **Integration Testing:** Test transaction operations
- **E2E Testing:** Test transaction entry and editing flows

#### Step 2.11: Cash Flow Pages
- Create income page:
  - Income list with categorization
  - Monthly income chart
  - Income sources breakdown
- Create expenses page:
  - Expense list with categorization
  - Monthly expense chart
  - Expense by category breakdown
- Add category management:
  - Create custom categories
  - Edit category colors and icons
  - Merge categories
- **Unit Testing:** Test cash flow components
- **Integration Testing:** Test with API
- **Accessibility Testing:** Test screen reader compatibility

#### Step 2.12: Net Worth Projection UI
- Create projection configuration panel:
  - Growth rate assumptions (salary, investments, inflation)
  - Recurring income/expense settings
  - Debt payoff strategies
- Build 30-year projection chart:
  - Interactive line chart
  - Scenario comparison (optimistic, realistic, pessimistic)
  - Milestone markers (retirement, debt-free)
  - Zoomable time range
- Add projection summary cards
- Implement "what-if" scenario builder
- **Unit Testing:** Test projection components
- **Integration Testing:** Test calculation accuracy
- **E2E Testing:** Test scenario creation and comparison

**Deliverables:**
- Fully functional, responsive React application
- Complete Gemini design system implementation
- Smooth animations throughout UI
- Real-time data synchronization
- Core financial management features (dashboard, accounts, transactions)
- Comprehensive test coverage (>80%)

---

### Phase 3: Advanced Analytics (Week 12-15)

**Objective:** Add advanced financial analysis features

#### Step 3.1: CSV/Excel Import - Backend
- Create Cloud Function for file processing
- Implement CSV parser with validation:
  - Date format detection
  - Amount parsing (handles currency symbols)
  - Category mapping
  - Duplicate detection
- Add Excel support (XLSX parser)
- Create import preview endpoint
- Implement bulk transaction creation
- Add import history tracking
- **Unit Testing:** Test parsing with various CSV formats
- **Integration Testing:** Test with sample bank exports
- **Error Testing:** Test malformed files and error handling

#### Step 3.2: CSV/Excel Import - Frontend
- Create import wizard UI:
  - File upload with drag-and-drop
  - Column mapping interface
  - Data preview table
  - Category assignment
  - Import confirmation
- Add import progress indicator
- Implement error handling and validation feedback
- Create import history view
- **Unit Testing:** Test import components
- **Integration Testing:** Test import flow
- **E2E Testing:** Test complete import process

#### Step 3.3: Advanced Budgeting - Backend
- Extend database schema for budgets:
  - Budget categories
  - Budget amounts (monthly, annual)
  - Budget periods
- Create budget calculation engine:
  - Actual vs. budget comparison
  - Budget utilization percentage
  - Overspending alerts
- Implement budget rollover logic
- **Unit Testing:** Test budget calculations
- **Integration Testing:** Test with transaction data
- **Testing:** Verify monthly budget resets

#### Step 3.4: Advanced Budgeting - Frontend
- Create budget management UI:
  - Budget creation and editing
  - Category budget allocation
  - Budget templates
- Build budget overview dashboard:
  - Progress bars for each category
  - Overspending warnings (animated)
  - Budget vs. actual charts
- Add budget alerts and notifications
- Implement zero-based budgeting mode
- **Unit Testing:** Test budget components
- **Integration Testing:** Test budget CRUD operations
- **E2E Testing:** Test budget creation and monitoring

#### Step 3.5: Investment Portfolio Analysis - Backend
- Extend schema for investment tracking:
  - Holdings (stocks, bonds, ETFs, crypto)
  - Purchase price and current value
  - Dividends and distributions
- Implement portfolio calculations:
  - Total return (absolute and percentage)
  - Asset allocation
  - Diversification metrics
  - Performance vs. benchmarks
- Integrate with market data API (Alpha Vantage or similar)
- **Unit Testing:** Test investment calculations
- **Integration Testing:** Test with market data API
- **Testing:** Test calculation accuracy

#### Step 3.6: Investment Portfolio Analysis - Frontend
- Create investment portfolio dashboard:
  - Portfolio value chart (with gains/losses)
  - Asset allocation pie chart
  - Holdings table with performance metrics
  - Sector/asset class breakdown
- Build investment entry form
- Add performance comparison charts
- Implement rebalancing recommendations
- **Unit Testing:** Test portfolio components
- **Integration Testing:** Test with API data
- **Visual Testing:** Test chart accuracy

#### Step 3.7: Retirement Planning Calculator
- Implement retirement projection engine:
  - Target retirement age and income
  - Current savings and contribution rate
  - Expected returns and inflation
  - Social Security estimation
  - Retirement spending needs
- Create retirement readiness score
- **Unit Testing:** Test retirement calculations
- **Integration Testing:** Test with user data
- **Validation Testing:** Compare with retirement calculators

#### Step 3.8: Retirement Planning UI
- Create retirement planning wizard:
  - Input collection (age, income, goals)
  - Scenario configuration
  - Results visualization
- Build retirement projection chart (30-40 year view)
- Add retirement savings recommendations
- Implement catch-up contribution suggestions
- **Unit Testing:** Test retirement components
- **E2E Testing:** Test planning wizard flow

#### Step 3.9: Debt Payoff Strategies
- Implement debt payoff calculators:
  - Avalanche method (highest interest first)
  - Snowball method (smallest balance first)
  - Custom payoff plans
- Calculate payoff timelines and interest saved
- Create debt-free date projections
- **Unit Testing:** Test payoff calculations
- **Integration Testing:** Test with debt accounts
- **Validation Testing:** Verify against debt calculators

#### Step 3.10: Debt Payoff UI
- Create debt payoff planner:
  - Debt list with balances and interest rates
  - Strategy selector
  - Payment schedule visualization
  - Progress tracking
- Build debt payoff chart (timeline to debt-free)
- Add extra payment simulator
- Implement progress celebrations (animations)
- **Unit Testing:** Test debt components
- **E2E Testing:** Test payoff planning flow

#### Step 3.11: Tax Projections - Backend
- Implement tax estimation engine:
  - Income tax calculation (federal and state)
  - Deduction tracking (standard vs. itemized)
  - Tax bracket analysis
  - Estimated quarterly payments
- Add tax optimization suggestions
- **Unit Testing:** Test tax calculations
- **Integration Testing:** Test with income data
- **Validation Testing:** Compare with tax software

#### Step 3.12: Tax Projections - Frontend
- Create tax projection dashboard:
  - Annual tax estimate
  - Tax bracket visualization
  - Deduction tracker
  - Quarterly payment schedule
- Add tax optimization recommendations
- Implement tax document upload (for future)
- **Unit Testing:** Test tax components
- **Integration Testing:** Test tax estimates

#### Step 3.13: Savings Goals Tracking
- Extend schema for savings goals:
  - Goal name, target amount, target date
  - Current progress
  - Priority level
- Implement goal progress calculations
- Create goal achievement projections
- **Unit Testing:** Test goal calculations
- **Integration Testing:** Test goal tracking

#### Step 3.14: Savings Goals UI
- Create goals management interface:
  - Goal creation wizard
  - Goals list with progress bars
  - Goal detail view with milestones
- Build goal progress visualization
- Add goal achievement celebrations (confetti animation)
- Implement automatic savings suggestions
- **Unit Testing:** Test goal components
- **E2E Testing:** Test goal creation and tracking

**Deliverables:**
- CSV/Excel import functionality
- Advanced budgeting system
- Investment portfolio tracking
- Retirement planning tools
- Debt payoff strategies
- Tax projections
- Savings goal tracking
- Enhanced testing coverage

---

### Phase 4: Automation & Intelligence (Week 16-18)

**Objective:** Add AI/ML features for smart automation

#### Step 4.1: ML Model Setup & Infrastructure
- Set up Vertex AI on GCP
- Create ML training pipeline with Cloud Build
- Set up model registry and versioning
- Configure AutoML or custom model training
- **Testing:** Verify ML infrastructure setup

#### Step 4.2: Transaction Categorization Model
- Collect and prepare training data:
  - Historical transactions (anonymized if using external data)
  - Category labels
  - Feature engineering (merchant name, amount patterns)
- Train classification model:
  - Try AutoML Tables
  - Or custom TensorFlow/scikit-learn model
- Deploy model to Cloud Run or Vertex AI endpoints
- **Testing:** Evaluate model accuracy (>85% target)
- **Testing:** Test inference latency (<100ms)

#### Step 4.3: Auto-Categorization Integration
- Integrate ML model with transaction creation
- Implement confidence scoring
- Add user feedback loop for corrections
- Create re-training pipeline with user corrections
- **Integration Testing:** Test categorization accuracy
- **Testing:** Verify feedback loop improves accuracy

#### Step 4.4: Auto-Categorization UI
- Add category suggestions in transaction form
- Show confidence indicators
- Implement one-click category confirmation
- Add bulk re-categorization tool
- Display learning progress
- **Unit Testing:** Test suggestion UI
- **E2E Testing:** Test correction and learning flow

#### Step 4.5: Recurring Transaction Detection
- Implement pattern detection algorithm:
  - Amount similarity (exact or range)
  - Date pattern detection (weekly, monthly, annual)
  - Merchant matching
- Create recurring transaction templates
- Add automated transaction creation for recurring items
- **Unit Testing:** Test detection algorithms
- **Integration Testing:** Test with historical data
- **Testing:** Verify detection accuracy

#### Step 4.6: Recurring Transactions UI
- Create recurring transactions manager:
  - Detected recurring transactions list
  - Manual recurring transaction setup
  - Editing and deletion
- Add automated transaction notifications
- Implement skip/modify options for scheduled transactions
- **Unit Testing:** Test recurring transaction components
- **E2E Testing:** Test recurring transaction management

#### Step 4.7: Predictive Analytics - Cash Flow Forecasting
- Build cash flow prediction model:
  - Historical transaction patterns
  - Seasonal trends
  - Recurring transactions
  - Income/expense forecasting
- Generate 3-month and 6-month forecasts
- Calculate prediction confidence intervals
- **Testing:** Validate forecast accuracy with backtesting
- **Integration Testing:** Test predictions with real data

#### Step 4.8: Predictive Analytics UI
- Create forecast visualization:
  - Predicted cash flow chart
  - Confidence bands
  - Scenario comparisons
- Add forecast assumptions display
- Implement forecast adjustment tools
- **Unit Testing:** Test forecast components
- **Visual Testing:** Verify chart clarity

#### Step 4.9: Smart Alerts & Insights Engine
- Implement insights generation:
  - Unusual spending detection
  - Budget overrun warnings
  - Saving opportunity identification
  - Bill payment reminders
  - Low balance alerts
  - Investment rebalancing suggestions
- Create notification prioritization
- Add insight dismissal and feedback
- **Unit Testing:** Test insight generation logic
- **Integration Testing:** Test alert triggers

#### Step 4.10: Smart Alerts UI
- Create notification center:
  - Prioritized insights list
  - Alert categories
  - Read/unread states
  - Action buttons
- Add in-app notifications with animations
- Implement notification preferences
- Add email/push notification support (via Firebase Cloud Messaging)
- **Unit Testing:** Test notification components
- **E2E Testing:** Test notification flow

**Deliverables:**
- ML-based transaction categorization
- Recurring transaction automation
- Predictive cash flow forecasting
- Smart alerts and insights system
- Improved user experience with automation

---

### Phase 5: Premium Features (Week 19-22)

**Objective:** Add collaboration, mobile optimization, and AI advisor

#### Step 5.1: Multi-User Support - Backend
- Extend schema for multi-user:
  - Households/families
  - User roles (owner, admin, viewer)
  - Permissions (read, write, admin)
  - Shared accounts and budgets
- Implement role-based access control
- Add invitation system
- Create activity logs for shared data
- **Unit Testing:** Test permission logic
- **Integration Testing:** Test multi-user scenarios
- **Security Testing:** Test unauthorized access prevention

#### Step 5.2: Multi-User Support - Frontend
- Create household management UI:
  - Invite members
  - Manage roles and permissions
  - View member activity
- Add user switching
- Implement shared dashboard views
- Add collaborative budgeting features
- **Unit Testing:** Test multi-user components
- **E2E Testing:** Test collaboration workflows

#### Step 5.3: Real-time Collaboration
- Implement operational transformation for concurrent edits
- Add presence indicators (who's viewing what)
- Create collaborative cursors/indicators
- Implement conflict resolution
- **Integration Testing:** Test concurrent editing
- **Testing:** Test with multiple simultaneous users

#### Step 5.4: Mobile Optimization & PWA
- Enhance mobile responsive design:
  - Touch-optimized controls
  - Mobile-specific navigation
  - Optimized chart sizes
- Implement Progressive Web App features:
  - Service Worker for offline support
  - App manifest
  - Install prompts
  - Offline data caching
- Add mobile-specific features:
  - Pull-to-refresh
  - Swipe gestures
  - Mobile camera for receipt scanning (future)
- **Responsive Testing:** Test on iOS and Android
- **PWA Testing:** Test installation and offline mode
- **Performance Testing:** Test on low-end devices

#### Step 5.5: Document Storage - Backend
- Set up Cloud Storage buckets for documents
- Implement file upload API:
  - File type validation
  - Virus scanning (Cloud Security Scanner)
  - Size limits
  - Thumbnail generation
- Create document metadata storage
- Add document search and retrieval
- **Unit Testing:** Test file upload logic
- **Integration Testing:** Test Cloud Storage integration
- **Security Testing:** Test file upload vulnerabilities

#### Step 5.6: Document Storage - Frontend
- Create document manager UI:
  - Drag-and-drop upload
  - Document list with previews
  - Document categorization (receipts, statements, tax docs)
  - Search and filtering
- Add document viewer
- Implement document sharing (within household)
- **Unit Testing:** Test document components
- **E2E Testing:** Test document upload and management

#### Step 5.7: AI Financial Advisor - Backend
- Integrate with AI service (Vertex AI Gemini or OpenAI):
  - Set up API credentials
  - Implement chat interface backend
  - Create conversation history storage
- Build financial context aggregator:
  - User financial data summary
  - Recent transactions
  - Budget status
  - Goals progress
- Implement RAG (Retrieval-Augmented Generation):
  - Financial document embeddings
  - Semantic search for relevant context
- Add response safety filters
- **Unit Testing:** Test AI integration
- **Integration Testing:** Test conversation flow
- **Testing:** Verify response quality and accuracy

#### Step 5.8: AI Financial Advisor - Frontend
- Create chat interface:
  - Chat message list with animations
  - Input field with suggestions
  - Typing indicators
  - Markdown support for responses
- Add conversation history
- Implement quick action prompts:
  - "How can I save more?"
  - "Analyze my spending"
  - "Am I on track for retirement?"
- Add citation/source display for AI responses
- **Unit Testing:** Test chat components
- **E2E Testing:** Test AI conversation flow

#### Step 5.9: Export & Reporting - Backend
- Implement report generation:
  - Monthly financial summary (PDF)
  - Annual tax report
  - Net worth statement
  - Custom date range reports
- Add export formats:
  - CSV for transactions
  - Excel for multi-sheet reports
  - PDF for formatted reports
- Create scheduled report delivery
- **Unit Testing:** Test report generation
- **Integration Testing:** Test PDF/Excel creation
- **Testing:** Validate report accuracy

#### Step 5.10: Export & Reporting - Frontend
- Create reports page:
  - Report templates
  - Date range selector
  - Format options
  - Custom report builder
- Add export buttons throughout UI
- Implement scheduled reports configuration
- Add report history and re-download
- **Unit Testing:** Test report components
- **E2E Testing:** Test report generation and download

**Deliverables:**
- Multi-user collaboration features
- Mobile-optimized PWA
- Document storage and management
- AI financial advisor chatbot
- Advanced reporting and export

---

### Phase 6: Gamification & Polish (Week 23-24)

**Objective:** Add gamification elements and final polish

#### Step 6.1: Gamification System - Backend
- Design gamification schema:
  - Achievements (milestones, badges)
  - Points system
  - Streaks (consecutive data entry days)
  - Levels (beginner, intermediate, advanced)
  - Leaderboards (optional, privacy-conscious)
- Implement achievement triggers:
  - First transaction recorded
  - First budget created
  - 30-day streak
  - Net worth milestones ($10k, $50k, $100k, etc.)
  - Debt payoff milestones
  - Savings goal achieved
- Create points calculation engine
- **Unit Testing:** Test achievement logic
- **Integration Testing:** Test achievement unlocking

#### Step 6.2: Gamification UI - Achievements
- Create achievements display:
  - Achievement cards with icons
  - Progress bars for in-progress achievements
  - Locked vs. unlocked states
  - Achievement details modal
- Add achievement unlock animations:
  - Celebratory confetti
  - Badge reveal animation
  - Sound effects (optional, user-controlled)
- Implement achievement notifications
- **Unit Testing:** Test achievement components
- **Visual Testing:** Test animations

#### Step 6.3: Gamification UI - Progress & Levels
- Create user progress dashboard:
  - Current level and XP bar
  - Points earned
  - Active streaks with flame icons
  - Recent achievements
- Build level-up celebration animation
- Add milestone markers on charts
- Implement progress widgets on main dashboard
- **Unit Testing:** Test progress components
- **E2E Testing:** Test progression flow

#### Step 6.4: Financial Health Score
- Implement financial health calculation:
  - Savings rate (% of income saved)
  - Debt-to-income ratio
  - Emergency fund coverage (months)
  - Budget adherence
  - Net worth growth rate
- Create composite health score (0-100)
- Add personalized recommendations
- **Unit Testing:** Test health score calculations
- **Integration Testing:** Test with user data
- **Validation Testing:** Verify score accuracy

#### Step 6.5: Financial Health Score UI
- Create health score dashboard widget:
  - Circular progress indicator
  - Score breakdown by category
  - Trend over time
  - Improvement suggestions
- Add score history chart
- Implement animated score updates
- **Unit Testing:** Test score components
- **Visual Testing:** Test score display

#### Step 6.6: Challenges & Goals Gamification
- Create financial challenges:
  - "No-spend weekend"
  - "Save $100 this week"
  - "Track expenses for 7 days"
  - "Review budget this month"
- Implement challenge tracking and completion
- Add challenge rewards (points, badges)
- **Unit Testing:** Test challenge logic
- **Integration Testing:** Test challenge completion

#### Step 6.7: Challenges UI
- Create challenges page:
  - Active challenges
  - Available challenges
  - Completed challenges
  - Challenge leaderboard (optional)
- Add challenge acceptance flow
- Implement challenge progress tracking
- Add challenge completion celebration
- **Unit Testing:** Test challenge components
- **E2E Testing:** Test challenge participation

#### Step 6.8: Onboarding Experience
- Create interactive onboarding:
  - Welcome tour with product highlights
  - Step-by-step setup guide
  - Sample data demonstration
  - Contextual tooltips
- Add progress tracking for setup
- Implement skip and resume options
- **Unit Testing:** Test onboarding components
- **E2E Testing:** Test complete onboarding flow

#### Step 6.9: Accessibility Enhancements
- Conduct accessibility audit:
  - WCAG 2.1 AA compliance check
  - Screen reader testing
  - Keyboard navigation testing
  - Color contrast verification
- Add accessibility features:
  - Skip navigation links
  - ARIA labels and descriptions
  - Focus indicators
  - Reduced motion support
  - High contrast mode
- **Accessibility Testing:** Test with screen readers (NVDA, JAWS, VoiceOver)
- **Keyboard Testing:** Test all interactions without mouse

#### Step 6.10: Performance Optimization
- Frontend optimization:
  - Code splitting and lazy loading audit
  - Image optimization (WebP, proper sizing)
  - Bundle size reduction
  - Remove unused dependencies
  - Implement virtual scrolling for large lists
- Backend optimization:
  - Database query optimization
  - Add missing indexes
  - Implement query result caching
  - Optimize GraphQL queries (N+1 prevention)
- **Performance Testing:** Lighthouse audit (90+ score target)
- **Load Testing:** Test with Artillery (1000+ concurrent users)
- **Testing:** Verify Core Web Vitals

#### Step 6.11: Security Hardening
- Security audit:
  - Dependency vulnerability scanning
  - OWASP Top 10 testing
  - Penetration testing (basic)
  - Code security review
- Implement security headers:
  - Content Security Policy
  - X-Frame-Options
  - HSTS
  - X-Content-Type-Options
- Add rate limiting and DDoS protection
- **Security Testing:** Automated vulnerability scanning
- **Testing:** Manual security testing

#### Step 6.12: Final Polish & Bug Fixes
- UI/UX polish:
  - Consistent spacing and alignment
  - Animation timing refinement
  - Loading state improvements
  - Error message clarity
  - Empty state designs
- Bug bash testing session:
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Cross-device testing (iOS, Android, desktop)
  - Edge case testing
  - Regression testing
- Documentation updates:
  - User guide
  - API documentation
  - Deployment documentation
  - Architecture documentation
- **Testing:** Complete regression test suite
- **User Testing:** Beta user feedback session

**Deliverables:**
- Gamification system with achievements and challenges
- Financial health score
- Polished onboarding experience
- WCAG 2.1 AA accessibility compliance
- Optimized performance (90+ Lighthouse score)
- Security hardened application
- Production-ready application

---

## Testing Strategy

### Testing Pyramid
1. **Unit Tests (70%)**: Test individual functions and components in isolation
2. **Integration Tests (20%)**: Test interactions between components and services
3. **E2E Tests (10%)**: Test complete user workflows

### Testing Tools & Frameworks
* **Frontend Unit/Integration:** Vitest + React Testing Library
* **Backend Unit/Integration:** Jest + Supertest
* **E2E Testing:** Playwright (cross-browser)
* **API Testing:** Postman/Insomnia + automated tests
* **Load Testing:** Artillery or k6
* **Accessibility Testing:** axe-core + manual testing
* **Visual Regression:** Percy or Chromatic (optional)
* **Security Testing:** OWASP ZAP + Snyk

### Continuous Testing
* Run unit tests on every commit (pre-commit hook)
* Run full test suite on pull requests
* Run E2E tests on staging deployments
* Run load tests weekly on staging
* Run security scans weekly
* Monitor production with synthetic tests

### Test Coverage Goals
* Overall code coverage: >80%
* Critical paths (auth, transactions, calculations): >95%
* UI components: >80%
* API endpoints: >90%

---

## Deployment Strategy

### Environments
1. **Local Development:** Docker Compose with hot reload
2. **Development (Dev):** Auto-deploy from `develop` branch
3. **Staging:** Auto-deploy from `staging` branch, mirrors production
4. **Production:** Manual promotion from staging after approval

### Deployment Pipeline
1. **Build:**
   - Run linters and formatters
   - Run unit tests
   - Build Docker images
   - Push to Artifact Registry
2. **Test:**
   - Run integration tests
   - Run E2E tests on staging
   - Run security scans
3. **Deploy:**
   - Deploy to Cloud Run
   - Run smoke tests
   - Monitor error rates
4. **Post-Deployment:**
   - Run synthetic tests
   - Monitor performance metrics
   - Alert on anomalies

### Rollback Strategy
* Keep previous 5 Cloud Run revisions
* Instant rollback capability
* Database migration rollback procedures
* Automated health checks trigger rollback

---

## Success Metrics

### Performance Metrics
* Page load time: <2s (LCP)
* Time to interactive: <3s (TTI)
* First Input Delay: <100ms
* Cumulative Layout Shift: <0.1
* API response time: p95 <500ms

### Quality Metrics
* Test coverage: >80%
* Bug escape rate: <5%
* Production incidents: <1 per month
* Mean time to recovery: <1 hour

### User Metrics
* User retention: >70% after 30 days
* Daily active users: Track growth
* Feature adoption: >50% for core features
* User satisfaction: >4.5/5 rating

---

## Future Enhancements (Post-Launch)

* **Bank Integration:** Plaid API for automatic transaction sync
* **International Support:** Multi-currency support, localization
* **Advanced AI:** Personalized financial coaching, anomaly detection
* **Social Features:** Anonymous spending comparisons, financial community
* **Premium Tiers:** Advanced features for power users
* **Mobile Apps:** Native iOS and Android apps
* **Voice Interface:** Alexa/Google Assistant integration
* **API Access:** Public API for third-party integrations
