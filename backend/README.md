# Finance4All Backend API

A production-ready GraphQL API built with Apollo Server, Express, Prisma ORM, and Firebase Authentication.

## Tech Stack

- **Runtime:** Node.js 20+ with TypeScript
- **Framework:** Express.js
- **API:** GraphQL with Apollo Server v5
- **ORM:** Prisma for PostgreSQL
- **Authentication:** Firebase Admin SDK
- **Validation:** Zod for input validation
- **Testing:** Jest + Supertest
- **Monitoring:** Google Cloud Error Reporting & Logging

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Prisma schema with all models
│   └── seed.ts            # Database seed script
├── src/
│   ├── graphql/
│   │   ├── schema.ts      # GraphQL type definitions
│   │   ├── resolvers.ts   # GraphQL resolvers
│   │   └── context.ts     # GraphQL context (auth, prisma)
│   ├── utils/
│   │   └── auth.ts        # Firebase authentication utilities
│   └── index.ts           # Express + Apollo Server setup
├── tests/
│   ├── setup.ts           # Jest test configuration
│   └── graphql.test.ts    # Sample GraphQL tests
├── .env                   # Environment variables (local)
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- Firebase project (for authentication)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. (Optional) Seed the database:
```bash
npm run prisma:seed
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start at:
- API: `http://localhost:4000`
- GraphQL Playground: `http://localhost:4000/graphql`
- Health Check: `http://localhost:4000/health`

### Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Building for Production

Build the TypeScript project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## GraphQL API

### Endpoints

- **GraphQL Endpoint:** `/graphql`
- **Health Check:** `/health`

### Authentication

All protected queries and mutations require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### Sample Queries

#### Hello (public)
```graphql
query {
  hello
}
```

#### Get Current User (protected)
```graphql
query {
  me {
    id
    email
    displayName
    role
    createdAt
  }
}
```

### Sample Mutations

#### Create User (protected)
```graphql
mutation {
  createUser(input: {
    firebaseUid: "firebase-uid-123"
    email: "user@example.com"
    displayName: "John Doe"
  }) {
    id
    email
    displayName
  }
}
```

#### Update User (protected)
```graphql
mutation {
  updateUser(input: {
    displayName: "Jane Doe"
    photoUrl: "https://example.com/photo.jpg"
  }) {
    id
    displayName
    photoUrl
  }
}
```

## Database Schema

The Prisma schema includes:

- **Users** - User accounts with Firebase UID reference
- **Accounts** - Financial accounts (assets, investments, debts)
- **Transactions** - Income and expense transactions
- **Categories** - Transaction categories
- **Budgets** - Budget management
- **Projections** - Net worth projections
- **AuditLogs** - Change tracking for compliance

View the full schema in `prisma/schema.prisma`.

## Environment Variables

Key environment variables (see `.env.example` for complete list):

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | Production |
| `FIREBASE_PRIVATE_KEY` | Firebase service account key | Production |
| `GCP_PROJECT_ID` | Google Cloud project ID | Yes |
| `CORS_ORIGIN` | Allowed CORS origin | Yes |

## Prisma Commands

| Command | Description |
|---------|-------------|
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Create and run migrations |
| `npm run prisma:push` | Push schema to database |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:seed` | Seed the database |

## Testing

The project uses Jest with ts-jest for testing:

- **Unit Tests:** Test individual functions and utilities
- **Integration Tests:** Test GraphQL API endpoints
- **Coverage Target:** >80%

Test files are located in the `tests/` directory.

## Error Handling

All errors are:
1. Logged with structured logging
2. Reported to Google Cloud Error Reporting (if configured)
3. Returned as GraphQL errors with appropriate codes

Error codes:
- `UNAUTHENTICATED` - Not logged in
- `FORBIDDEN` - Not authorized
- `NOT_FOUND` - Resource not found
- `USER_ALREADY_EXISTS` - Duplicate user
- `INTERNAL_SERVER_ERROR` - Server error

## Security

- Firebase Authentication for user identity
- JWT token validation on all protected routes
- Role-based access control (USER, ADMIN)
- SQL injection prevention via Prisma
- Input validation with Zod
- CORS configuration
- Secure headers in production

## Monitoring & Observability

- **Structured Logging:** All logs in JSON format for Cloud Logging
- **Error Reporting:** Automatic error tracking with Google Cloud Error Reporting
- **Health Checks:** `/health` endpoint for liveness probes
- **Metrics:** Custom metrics can be added via Cloud Monitoring

## CI/CD

The backend is automatically built and deployed via Cloud Build:

1. Run tests
2. Build Docker image
3. Push to Artifact Registry
4. Deploy to Cloud Run

See `/cloudbuild.yaml` for the full pipeline.

## Local Development with Docker Compose

Start all services (PostgreSQL, Redis, Firestore, Backend):
```bash
cd ..
docker-compose up
```

See the main project README for more details.

## Contributing

1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass: `npm test`
4. Lint code: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## License

MIT
