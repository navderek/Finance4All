# Development Guide

This guide covers coding standards, best practices, and workflows for developing Finance4All.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Debugging](#debugging)

---

## Getting Started

### First Time Setup

1. Complete the [Local Setup Guide](local-setup.md)
2. Start the development environment: `./scripts/start-dev.sh`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Commit and push your changes

### Daily Development

```bash
# Morning: Pull latest changes
git checkout main
git pull origin main
git checkout your-branch
git rebase main

# Start development environment
./scripts/start-dev.sh

# Make changes, test, commit

# Evening: Stop environment
./scripts/stop-dev.sh
```

---

## Project Structure

```
Finance4All/
├── backend/                 # Backend API (Node.js + Express + GraphQL)
│   ├── src/
│   │   ├── index.ts        # Application entry point
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models (Prisma)
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   ├── tests/              # Test files
│   ├── prisma/             # Prisma schema and migrations
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # Frontend application (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx         # Main app component
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services (RTK Query)
│   │   ├── store/          # Redux store
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── terraform/              # Infrastructure as Code
├── monitoring/             # Monitoring dashboards and alerts
├── scripts/                # Helper scripts
├── docs/                   # Documentation
└── docker-compose.yml      # Local development environment
```

---

## Coding Standards

### TypeScript

#### General Rules

- ✅ Use TypeScript strict mode
- ✅ Prefer `interface` over `type` for object types
- ✅ Use descriptive names for variables and functions
- ✅ Add JSDoc comments for public APIs
- ❌ Avoid `any` type (use `unknown` if necessary)
- ❌ Avoid type assertions (`as`) unless absolutely necessary

#### Example

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Fetches a user by ID
 * @param id - The user's unique identifier
 * @returns Promise resolving to user object
 */
async function getUserById(id: string): Promise<User> {
  // Implementation
}

// ❌ Bad
function getUser(id: any): any {
  // Implementation
}
```

### Backend Code Style

#### Express Routes

```typescript
// ✅ Good: Organized, type-safe, with middleware
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { getUserSchema } from '../schemas/user';

const router = Router();

router.get(
  '/users/:id',
  authenticate,
  validateRequest(getUserSchema),
  async (req, res) => {
    // Handler implementation
  }
);
```

#### Error Handling

```typescript
// ✅ Good: Consistent error handling
class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// In route handler
try {
  const user = await userService.getById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user);
} catch (error) {
  next(error);
}
```

### Frontend Code Style

#### React Components

```typescript
// ✅ Good: Functional component with TypeScript
import { FC } from 'react';

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export const UserCard: FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
};
```

#### State Management (Redux)

```typescript
// ✅ Good: RTK slice with TypeScript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  current: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  current: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.current = action.payload;
    },
  },
});
```

### Code Formatting

We use Prettier and ESLint for consistent code formatting:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `userName`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Functions | camelCase | `getUserById()` |
| Classes | PascalCase | `UserService` |
| Interfaces | PascalCase | `UserInterface` |
| Types | PascalCase | `UserType` |
| Components | PascalCase | `UserCard` |
| Files | kebab-case | `user-card.tsx` |

---

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/what-changed` - Code refactoring
- `docs/what-documented` - Documentation updates
- `test/what-tested` - Test additions/updates

### Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Good commits
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(dashboard): correct net worth calculation"
git commit -m "docs(readme): update setup instructions"

# With body
git commit -m "feat(transactions): add CSV import

Implemented CSV parsing with automatic category detection.
Supports multiple date formats and currency symbols.

Closes #123"
```

### Pull Request Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Keep branch updated**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push to remote**
   ```bash
   git push origin feature/your-feature
   ```

5. **Create Pull Request on GitHub**
   - Provide clear description
   - Reference related issues
   - Request reviews

6. **Address review feedback**
   ```bash
   # Make changes
   git add .
   git commit -m "fix: address review feedback"
   git push origin feature/your-feature
   ```

7. **Merge after approval**

---

## Testing Guidelines

### Unit Tests

#### Backend (Jest)

```typescript
// user.service.test.ts
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userService.getUserById('1');

      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(userService.getUserById('999')).rejects.toThrow('User not found');
    });
  });
});
```

#### Frontend (Vitest + React Testing Library)

```typescript
// UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('renders user information', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    render(<UserCard user={user} onEdit={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const user = { id: '1', name: 'John Doe' };
    const onEdit = jest.fn();
    render(<UserCard user={user} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test
npm run test:watch
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui
```

### Test Coverage Goals

- **Overall**: >80%
- **Critical paths** (auth, transactions, calculations): >95%
- **UI components**: >80%
- **API endpoints**: >90%

---

## Debugging

### Backend Debugging

#### VSCode Launch Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Docker: Attach to Backend",
      "remoteRoot": "/app",
      "localRoot": "${workspaceFolder}/backend",
      "port": 9229,
      "restart": true
    }
  ]
}
```

Update `docker-compose.yml` for debugging:

```yaml
backend:
  command: npm run dev -- --inspect=0.0.0.0:9229
  ports:
    - "9229:9229"
```

#### Logging

```typescript
// Use structured logging
import { logger } from './utils/logger';

logger.info('User logged in', { userId, email });
logger.error('Failed to process transaction', { error, transactionId });
logger.debug('Processing request', { method, path });
```

### Frontend Debugging

#### Browser DevTools

- **React DevTools**: Install extension for component inspection
- **Redux DevTools**: Install extension for state debugging

#### Console Logging

```typescript
// Development only logging
if (import.meta.env.DEV) {
  console.log('User data:', userData);
}

// Or use a logger
import { logger } from './utils/logger';
logger.debug('API response', { data });
```

### Database Debugging

```bash
# View query logs
docker compose logs -f postgres

# Enable query logging (add to docker-compose.yml)
postgres:
  command: postgres -c log_statement=all
```

---

## Performance Best Practices

### Backend

- ✅ Use database indexes for frequently queried fields
- ✅ Implement pagination for large datasets
- ✅ Cache frequently accessed data in Redis
- ✅ Use connection pooling
- ❌ Avoid N+1 queries (use DataLoader with GraphQL)

### Frontend

- ✅ Use React.memo for expensive components
- ✅ Implement code splitting with lazy loading
- ✅ Optimize images (WebP, proper sizing)
- ✅ Use virtual scrolling for long lists
- ❌ Avoid large bundle sizes

---

## Security Best Practices

- ✅ Validate all user input
- ✅ Use parameterized queries (Prisma ORM)
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Store secrets in environment variables
- ❌ Never commit secrets to Git
- ❌ Never trust client-side validation alone

---

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Happy coding! 🚀**
