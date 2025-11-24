# Finance4All Frontend

A modern, responsive personal finance management application built with React 18, TypeScript, and Material-UI with Gemini-themed design.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI v5 (Gemini theme)
- **Animation:** Framer Motion
- **State Management:** Redux Toolkit + RTK Query
- **Real-time:** Firebase/Firestore
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router v6
- **Testing:** Vitest + React Testing Library + Playwright

## Project Structure

```
src/
├── animations/          # Animation components (FadeIn, SlideIn, etc.)
├── components/
│   ├── charts/         # Chart components (NetWorth, CashFlow, etc.)
│   ├── common/         # Common UI components (Button, Input, Card)
│   ├── layout/         # Layout components (Sidebar, TopBar, etc.)
│   └── ...
├── config/             # Configuration (Firebase, theme)
├── hooks/              # Custom React hooks
├── pages/              # Page components (Dashboard, Accounts, etc.)
├── store/              # Redux store and slices
├── styles/             # Global styles and theme
├── types/              # TypeScript types and interfaces
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Testing
npm test                 # Run all tests
npm test -- --watch      # Run tests in watch mode
npm test -- <file>       # Run specific test file

# Code Quality
npm run type-check       # TypeScript type checking
npm run lint             # ESLint
npm run format           # Prettier formatting

# Build
npm run build            # Production build
npm run preview          # Preview production build
```

## Development Guidelines

### Component Structure

All components should follow this pattern:
- Use TypeScript with proper interfaces
- Include comprehensive unit tests
- Support loading and error states
- Implement responsive design (mobile-first)
- Include accessibility features (ARIA labels, keyboard navigation)

### Form Validation

All forms use React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  // ... more fields
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### Animation Guidelines

- Use Framer Motion for all animations
- Keep animations fast (200-300ms for micro-interactions)
- Respect `prefers-reduced-motion` setting
- Use GPU-accelerated properties (transform, opacity)

### Testing Strategy

- **Unit Tests:** Test individual components and functions
- **Integration Tests:** Test component interactions
- **E2E Tests:** Test complete user flows (Playwright)

Aim for >80% test coverage on all new code.

## Design System

### Gemini Theme Colors

- **Primary Blue:** #1A73E8
- **Secondary Purple:** #A142F4
- **Success Green:** #34A853
- **Warning Yellow:** #FBBC04
- **Error Red:** #EA4335

### Typography

- **Font Family:** Google Sans (primary), Roboto (fallback)
- **Headings:** Google Sans Display
- **Body:** Google Sans Text
- **Numbers:** Roboto Mono

## Features Completed

### Phase 2 Progress (70% Complete)

- ✅ Step 2.1: Project initialization
- ✅ Step 2.2: Design system & component library
- ✅ Step 2.3: Animation system
- ✅ Step 2.4: Authentication UI
- ✅ Step 2.5: Layout & navigation
- ✅ Step 2.6: Dashboard main view
- ✅ Step 2.7: Dashboard charts & visualizations
- ✅ Step 2.8: Real-time updates
- 🟡 Step 2.9: Accounts management UI (20% - in progress)

See [ProgressTracker.md](../ProgressTracker.md) for detailed progress.

## Testing

Current test statistics:
- **Total Tests:** 145+
- **Pass Rate:** 100%
- **Categories:**
  - Layout: 46 tests
  - Dashboard: 10 tests
  - Charts: 72 tests
  - Animations: 14 tests
  - Hooks: 13 tests

## Contributing

1. Create a feature branch from `main`
2. Write tests for new features
3. Ensure all tests pass (`npm test`)
4. Run linting (`npm run lint`)
5. Format code (`npm run format`)
6. Commit with descriptive messages
7. Create pull request

## Documentation

- [Progress Tracker](../ProgressTracker.md) - Overall project progress
- [Next Session Guide](../NEXT_SESSION.md) - Quick start for resuming work
- [Project Instructions](../CLAUDE.md) - Complete project overview and implementation plan

## License

Private - Finance4All Project
