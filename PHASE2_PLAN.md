# Phase 2: Frontend Development - Detailed Implementation Plan

## Overview

**Objective:** Build responsive, animated React frontend with Gemini design system
**Duration:** 5 weeks (estimated)
**Technology Stack:** React 18 + TypeScript + Vite + Material-UI + Framer Motion + Redux Toolkit

## Success Criteria

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations throughout (60fps)
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ >80% test coverage
- ✅ <2s page load time (LCP)
- ✅ Real-time data synchronization
- ✅ Offline-capable (PWA)

---

## Step 2.1: Frontend Project Initialization

### Implementation Tasks

1. **Project Setup**
   - [ ] Create Vite + React + TypeScript project
   - [ ] Configure TypeScript strict mode
   - [ ] Set up project structure (src/components, src/pages, src/hooks, src/utils, src/store)
   - [ ] Configure path aliases (@/, @components/, @utils/, etc.)

2. **Dependencies Installation**
   - [ ] Material-UI v5 (`@mui/material`, `@emotion/react`, `@emotion/styled`)
   - [ ] Framer Motion (`framer-motion`)
   - [ ] Redux Toolkit & RTK Query (`@reduxjs/toolkit`, `react-redux`)
   - [ ] React Router v6 (`react-router-dom`)
   - [ ] React Hook Form + Zod (`react-hook-form`, `zod`, `@hookform/resolvers`)
   - [ ] Recharts (`recharts`)
   - [ ] Firebase SDK (`firebase`)
   - [ ] Apollo Client (`@apollo/client`, `graphql`)

3. **Development Tools**
   - [ ] ESLint configuration (React + TypeScript rules)
   - [ ] Prettier configuration
   - [ ] Husky for pre-commit hooks
   - [ ] Vitest for testing (`vitest`, `@vitest/ui`)
   - [ ] React Testing Library (`@testing-library/react`, `@testing-library/user-event`)

4. **Environment Configuration**
   - [ ] Create `.env.example` with required variables
   - [ ] Set up environment variable types
   - [ ] Configure Vite for env variables

### Testing Strategy

**Build & Dev Server Tests:**
```bash
# Test 1: Verify project builds successfully
npm run build

# Test 2: Verify dev server starts
npm run dev

# Test 3: Verify TypeScript compilation
npm run type-check

# Test 4: Verify linting works
npm run lint

# Test 5: Test basic route renders
- Visit http://localhost:5173
- Verify React app loads
```

**Acceptance Criteria:**
- ✅ Project builds without errors
- ✅ Dev server runs on port 5173
- ✅ TypeScript strict mode enabled
- ✅ ESLint and Prettier configured
- ✅ Path aliases working

---

## Step 2.2: Design System & Component Library

### Implementation Tasks

1. **Gemini Theme Configuration**
   - [ ] Create `src/theme/palette.ts` with Gemini colors
   - [ ] Create `src/theme/typography.ts` with Google Sans fonts
   - [ ] Create `src/theme/spacing.ts` with consistent spacing scale
   - [ ] Create `src/theme/breakpoints.ts` for responsive design
   - [ ] Create `src/theme/index.ts` to combine all theme configs
   - [ ] Implement dark mode theme variant

2. **Core Components (src/components/ui/)**
   - [ ] **Button:** Primary, secondary, outlined, text variants with loading state
   - [ ] **Input:** Text, number, email with validation states
   - [ ] **Card:** Elevated card with hover effects
   - [ ] **Modal/Dialog:** Accessible modal with backdrop
   - [ ] **Loading:** Skeleton screens, spinners, progress bars
   - [ ] **Toast:** Success, error, warning, info notifications
   - [ ] **Tooltip:** Hover tooltips for additional info
   - [ ] **Badge:** Status badges for accounts and categories

3. **Layout Components**
   - [ ] **Container:** Max-width content container
   - [ ] **Stack:** Flexbox layout helper
   - [ ] **Grid:** Responsive grid system

4. **Storybook Setup**
   - [ ] Install and configure Storybook
   - [ ] Create stories for each component
   - [ ] Document component props and variants

### Testing Strategy

**Unit Tests (Vitest + RTL):**
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// Similar tests for Input, Card, Modal, etc.
```

**Accessibility Tests:**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Visual Regression Tests (Storybook):**
- Use Storybook to visually verify components
- Screenshot each variant
- Verify responsive behavior

**Acceptance Criteria:**
- ✅ All core components built and tested
- ✅ 100% accessibility compliance (axe-core)
- ✅ Storybook with stories for all components
- ✅ Dark mode working
- ✅ Unit test coverage >90%

---

## Step 2.3: Animation System Setup

### Implementation Tasks

1. **Animation Components (src/components/animations/)**
   - [ ] **PageTransition:** Fade + slide transitions between pages
   - [ ] **FadeIn:** Fade in with configurable delay
   - [ ] **SlideIn:** Slide from direction with spring animation
   - [ ] **StaggerList:** Stagger children animations
   - [ ] **CountUp:** Animated number counter for metrics
   - [ ] **SkeletonLoader:** Shimmer loading effect

2. **Animation Variants (src/theme/animations.ts)**
   - [ ] Define standard animation variants (fadeIn, slideIn, scaleIn)
   - [ ] Define easing curves (ease-in-out, spring)
   - [ ] Define timing constants (fast: 200ms, medium: 400ms, slow: 600ms)

3. **Animation Hooks (src/hooks/)**
   - [ ] **useScrollAnimation:** Trigger on scroll into view
   - [ ] **useInView:** Detect element visibility
   - [ ] **useReducedMotion:** Respect prefers-reduced-motion

### Testing Strategy

**Performance Tests:**
```typescript
describe('Animation Performance', () => {
  it('maintains 60fps during animation', async () => {
    const { rerender } = render(<FadeIn><div>Content</div></FadeIn>);

    // Measure frame rate during animation
    const fps = await measureFPS(() => {
      rerender(<FadeIn><div>Updated</div></FadeIn>);
    });

    expect(fps).toBeGreaterThanOrEqual(60);
  });

  it('uses transform and opacity for GPU acceleration', () => {
    render(<SlideIn direction="left"><div>Content</div></SlideIn>);
    const element = screen.getByText('Content');
    const styles = window.getComputedStyle(element);

    // Should use transform, not margin/padding
    expect(styles.transform).toBeDefined();
  });
});
```

**Reduced Motion Tests:**
```typescript
it('disables animations when prefers-reduced-motion is set', () => {
  // Mock matchMedia
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  render(<FadeIn><div>Content</div></FadeIn>);

  // Animation should be instant
  expect(screen.getByText('Content')).toHaveStyle({ opacity: 1 });
});
```

**Acceptance Criteria:**
- ✅ All animation components working smoothly
- ✅ 60fps performance verified
- ✅ Reduced motion support working
- ✅ GPU-accelerated animations (transform/opacity)
- ✅ No layout shifts during animations

---

## Step 2.4: Authentication UI

### Implementation Tasks

1. **Authentication Pages (src/pages/auth/)**
   - [ ] **Login:** Email/password + Google OAuth
   - [ ] **SignUp:** Email/password + name
   - [ ] **ForgotPassword:** Email input with reset link
   - [ ] **EmailVerification:** Prompt to verify email

2. **Firebase Integration**
   - [ ] Initialize Firebase SDK (src/lib/firebase.ts)
   - [ ] Create auth service (src/services/auth.ts)
   - [ ] Implement sign in with email/password
   - [ ] Implement sign up
   - [ ] Implement Google OAuth
   - [ ] Implement password reset
   - [ ] Implement email verification check

3. **Form Validation**
   - [ ] Create Zod schemas for auth forms (src/schemas/auth.ts)
   - [ ] Integrate React Hook Form
   - [ ] Add real-time validation feedback
   - [ ] Add password strength indicator

4. **Protected Routes**
   - [ ] Create ProtectedRoute component
   - [ ] Redirect unauthenticated users to /login
   - [ ] Store intended destination for post-login redirect

5. **Auth State Management**
   - [ ] Create auth slice (src/store/authSlice.ts)
   - [ ] Store user data (uid, email, displayName, photoURL)
   - [ ] Handle token refresh
   - [ ] Persist auth state to localStorage

### Testing Strategy

**Unit Tests:**
```typescript
describe('Login Page', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid email', async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab(); // Blur to trigger validation

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data', async () => {
    const onSubmit = vi.fn();
    render(<Login onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
    });
  });
});
```

**Integration Tests:**
```typescript
describe('Authentication Flow', () => {
  it('signs in user and redirects to dashboard', async () => {
    // Mock Firebase signInWithEmailAndPassword
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: { uid: '123', email: 'test@example.com' },
    });

    render(<App />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});
```

**E2E Tests (Playwright):**
```typescript
test('complete sign up flow', async ({ page }) => {
  await page.goto('/signup');

  await page.fill('input[name="displayName"]', 'Test User');
  await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
  await page.fill('input[name="password"]', 'Password123!');
  await page.fill('input[name="confirmPassword"]', 'Password123!');

  await page.click('button[type="submit"]');

  // Should redirect to email verification page
  await expect(page).toHaveURL('/verify-email');
  await expect(page.getByText(/verification email sent/i)).toBeVisible();
});
```

**Acceptance Criteria:**
- ✅ All auth pages functional
- ✅ Email/password auth working
- ✅ Google OAuth working
- ✅ Form validation with real-time feedback
- ✅ Protected routes redirecting correctly
- ✅ Auth state persisted across refreshes
- ✅ E2E tests passing

---

## Step 2.5: Layout & Navigation

### Implementation Tasks

1. **Main Layout (src/components/layout/)**
   - [ ] **AppLayout:** Main app shell with sidebar and header
   - [ ] **Sidebar:** Navigation with icons and labels
   - [ ] **Header:** App bar with user menu and theme toggle
   - [ ] **MobileNav:** Bottom navigation for mobile
   - [ ] **Breadcrumbs:** Page location indicator

2. **Navigation Setup**
   - [ ] Configure React Router routes
   - [ ] Create route config (src/config/routes.ts)
   - [ ] Implement lazy loading for pages
   - [ ] Add page transitions with Framer Motion

3. **Theme Toggle**
   - [ ] Create ThemeProvider wrapper
   - [ ] Implement light/dark mode switcher
   - [ ] Persist theme preference to localStorage
   - [ ] Add smooth theme transition

### Testing Strategy

**Navigation Tests:**
```typescript
describe('Sidebar Navigation', () => {
  it('navigates to dashboard on click', async () => {
    render(<App />);

    await userEvent.click(screen.getByRole('link', { name: /dashboard/i }));

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('highlights active route', () => {
    render(<App />, { initialRoute: '/accounts' });

    const accountsLink = screen.getByRole('link', { name: /accounts/i });
    expect(accountsLink).toHaveAttribute('aria-current', 'page');
  });
});
```

**Responsive Tests:**
```typescript
describe('Responsive Layout', () => {
  it('shows sidebar on desktop', () => {
    window.innerWidth = 1024;
    render(<AppLayout />);

    expect(screen.getByRole('navigation')).toBeVisible();
  });

  it('hides sidebar and shows mobile nav on mobile', () => {
    window.innerWidth = 375;
    render(<AppLayout />);

    expect(screen.queryByRole('navigation')).not.toBeVisible();
    expect(screen.getByRole('navigation', { name: /mobile/i })).toBeVisible();
  });
});
```

**Acceptance Criteria:**
- ✅ Sidebar navigation functional
- ✅ Mobile navigation on small screens
- ✅ Theme toggle working
- ✅ Breadcrumbs showing current location
- ✅ Page transitions smooth
- ✅ Keyboard navigation working

---

## Step 2.6: Dashboard - Main View

### Implementation Tasks

1. **Dashboard Layout (src/pages/Dashboard/)**
   - [ ] Create responsive grid layout
   - [ ] Implement metric cards section
   - [ ] Add charts section
   - [ ] Add recent transactions section

2. **Metric Cards (src/components/dashboard/)**
   - [ ] **NetWorthCard:** Current net worth with trend
   - [ ] **IncomeCard:** Monthly income
   - [ ] **ExpensesCard:** Monthly expenses
   - [ ] **CashFlowCard:** Income - expenses

3. **Animated Count-Up**
   - [ ] Create CountUp component with easing
   - [ ] Add formatting for currency
   - [ ] Add trend indicators (up/down arrows)

4. **Loading States**
   - [ ] Create skeleton loaders for cards
   - [ ] Add shimmer effect
   - [ ] Implement progressive loading

5. **API Integration**
   - [ ] Set up Apollo Client
   - [ ] Create GraphQL queries (src/graphql/queries.ts)
   - [ ] Implement RTK Query endpoints
   - [ ] Add error handling and retry logic

### Testing Strategy

**Unit Tests:**
```typescript
describe('Dashboard Metric Cards', () => {
  it('displays net worth with formatted currency', () => {
    render(<NetWorthCard value={150000} />);
    expect(screen.getByText('$150,000')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(<NetWorthCard loading />);
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('animates count-up on mount', async () => {
    render(<NetWorthCard value={1000} />);

    // Initially shows 0
    expect(screen.getByText('$0')).toBeInTheDocument();

    // Animates to 1000
    await waitFor(() => {
      expect(screen.getByText('$1,000')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
```

**Integration Tests:**
```typescript
describe('Dashboard with API', () => {
  it('fetches and displays net worth', async () => {
    // Mock GraphQL response
    const mocks = [{
      request: { query: GET_NET_WORTH },
      result: { data: { netWorth: { netWorth: 150000 } } },
    }];

    render(<Dashboard />, { apolloMocks: mocks });

    await waitFor(() => {
      expect(screen.getByText('$150,000')).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    const mocks = [{
      request: { query: GET_NET_WORTH },
      error: new Error('Network error'),
    }];

    render(<Dashboard />, { apolloMocks: mocks });

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});
```

**Acceptance Criteria:**
- ✅ All metric cards displaying correctly
- ✅ Count-up animations smooth
- ✅ Skeleton loaders during data fetch
- ✅ Responsive grid layout
- ✅ Error states handled gracefully
- ✅ Data refreshes automatically

---

## Step 2.7: Dashboard - Charts & Visualizations

### Implementation Tasks

1. **Chart Components (src/components/charts/)**
   - [ ] **NetWorthTrendChart:** Line chart (12-month)
   - [ ] **CashFlowChart:** Bar chart (income vs expenses, 6-month)
   - [ ] **ExpenseBreakdownChart:** Donut chart (by category)
   - [ ] **AccountDistributionChart:** Stacked bar chart

2. **Chart Configuration**
   - [ ] Apply Gemini color palette
   - [ ] Add responsive sizing
   - [ ] Configure tooltips with formatting
   - [ ] Add legends with interaction

3. **Chart Animations**
   - [ ] Smooth entry animations
   - [ ] Data transition animations
   - [ ] Hover interactions

4. **Empty States**
   - [ ] "No data yet" messages
   - [ ] Call-to-action buttons
   - [ ] Illustrations

### Testing Strategy

**Unit Tests:**
```typescript
describe('NetWorthTrendChart', () => {
  it('renders line chart with data', () => {
    const data = [
      { month: '2024-01', netWorth: 10000 },
      { month: '2024-02', netWorth: 12000 },
    ];

    render(<NetWorthTrendChart data={data} />);

    // Recharts renders SVG
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<NetWorthTrendChart data={[]} />);
    expect(screen.getByText(/no data yet/i)).toBeInTheDocument();
  });

  it('formats tooltip values as currency', async () => {
    const data = [{ month: '2024-01', netWorth: 10000 }];
    render(<NetWorthTrendChart data={data} />);

    // Hover over chart
    const chart = screen.getByRole('img');
    await userEvent.hover(chart);

    await waitFor(() => {
      expect(screen.getByText('$10,000')).toBeInTheDocument();
    });
  });
});
```

**Visual Tests:**
- Screenshot charts with different data sets
- Verify color consistency
- Check responsive behavior

**Performance Tests:**
```typescript
it('renders large dataset efficiently', () => {
  const largeData = Array.from({ length: 365 }, (_, i) => ({
    date: new Date(2024, 0, i + 1),
    value: Math.random() * 10000,
  }));

  const startTime = performance.now();
  render(<NetWorthTrendChart data={largeData} />);
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(100); // <100ms render
});
```

**Acceptance Criteria:**
- ✅ All charts rendering correctly
- ✅ Smooth animations (60fps)
- ✅ Interactive tooltips
- ✅ Responsive sizing
- ✅ Empty states implemented
- ✅ Performance optimized (<100ms render)

---

## Step 2.8: Dashboard - Real-time Updates

### Implementation Tasks

1. **Firestore Integration**
   - [ ] Set up Firestore listeners (src/services/firestore.ts)
   - [ ] Create real-time hooks (src/hooks/useRealtimeData.ts)
   - [ ] Implement collection subscriptions

2. **Optimistic Updates**
   - [ ] Implement optimistic UI for mutations
   - [ ] Add rollback on error
   - [ ] Show pending indicators

3. **Data Synchronization**
   - [ ] Merge server and local state
   - [ ] Handle conflicts
   - [ ] Implement debouncing for rapid updates

4. **Visual Indicators**
   - [ ] Add pulse animation for live updates
   - [ ] Show "Live" badge
   - [ ] Smooth data transitions in charts

### Testing Strategy

**Real-time Tests:**
```typescript
describe('Real-time Dashboard Updates', () => {
  it('updates net worth when data changes', async () => {
    const { updateNetWorth } = renderWithFirestore(<Dashboard />);

    expect(screen.getByText('$10,000')).toBeInTheDocument();

    // Simulate Firestore update
    await updateNetWorth(15000);

    await waitFor(() => {
      expect(screen.getByText('$15,000')).toBeInTheDocument();
    });
  });

  it('shows live indicator during sync', async () => {
    render(<Dashboard />);

    // Trigger update
    simulateFirestoreUpdate();

    expect(screen.getByText(/live/i)).toBeVisible();

    await waitFor(() => {
      expect(screen.queryByText(/live/i)).not.toBeVisible();
    });
  });
});
```

**Acceptance Criteria:**
- ✅ Real-time data updates working
- ✅ Optimistic UI implemented
- ✅ Smooth transitions between data states
- ✅ Live indicators functional
- ✅ No flashing or jarring updates

---

## Step 2.9: Accounts Management UI

### Implementation Tasks

1. **Accounts List (src/pages/Accounts/)**
   - [ ] Create table/grid view
   - [ ] Add filters (type, active/inactive)
   - [ ] Add sorting (name, balance, type)
   - [ ] Add search
   - [ ] Show account cards with balances

2. **Account Form (src/components/accounts/)**
   - [ ] Create/edit form with validation
   - [ ] Account type selector
   - [ ] Currency selector
   - [ ] Interest rate input (for debt/savings)
   - [ ] Institution autocomplete

3. **Account Details**
   - [ ] Balance display
   - [ ] Transaction history for account
   - [ ] Edit and delete actions
   - [ ] Confirmation dialogs

### Testing Strategy

**Unit Tests:**
```typescript
describe('Account Form', () => {
  it('validates required fields', async () => {
    render(<AccountForm />);

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/type is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<AccountForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Main Checking');
    await userEvent.selectOptions(screen.getByLabelText(/type/i), 'ASSET');
    await userEvent.type(screen.getByLabelText(/balance/i), '5000');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Main Checking',
        type: 'ASSET',
        balance: 5000,
      });
    });
  });
});
```

**E2E Tests:**
```typescript
test('create new account flow', async ({ page }) => {
  await page.goto('/accounts');
  await page.click('button:has-text("Add Account")');

  await page.fill('input[name="name"]', 'Savings Account');
  await page.selectOption('select[name="type"]', 'ASSET');
  await page.fill('input[name="balance"]', '10000');

  await page.click('button[type="submit"]');

  await expect(page.getByText('Account created successfully')).toBeVisible();
  await expect(page.getByText('Savings Account')).toBeVisible();
});
```

**Acceptance Criteria:**
- ✅ Accounts list with filtering and sorting
- ✅ Create/edit/delete operations working
- ✅ Form validation comprehensive
- ✅ Confirmation dialogs implemented
- ✅ E2E tests passing

---

## Step 2.10: Transaction Entry UI

### Implementation Tasks

1. **Transaction Form**
   - [ ] Amount input with currency formatting
   - [ ] Date picker
   - [ ] Account selector
   - [ ] Category selector with icons
   - [ ] Income/Expense toggle
   - [ ] Description and notes fields
   - [ ] Recurring transaction checkbox

2. **Transaction List**
   - [ ] Infinite scroll or pagination
   - [ ] Filters (date range, category, account, type)
   - [ ] Search by description
   - [ ] Bulk selection
   - [ ] Inline editing
   - [ ] Delete with confirmation

3. **Quick Add Modal**
   - [ ] Simplified form for fast entry
   - [ ] Recent categories
   - [ ] Keyboard shortcuts

### Testing Strategy

**Form Tests:**
```typescript
describe('Transaction Form', () => {
  it('calculates correct date', async () => {
    render(<TransactionForm />);

    // Date should default to today
    const dateInput = screen.getByLabelText(/date/i);
    expect(dateInput).toHaveValue(new Date().toISOString().split('T')[0]);
  });

  it('formats amount as currency on blur', async () => {
    render(<TransactionForm />);

    const amountInput = screen.getByLabelText(/amount/i);
    await userEvent.type(amountInput, '1234.56');
    await userEvent.tab();

    expect(amountInput).toHaveValue('$1,234.56');
  });
});
```

**E2E Tests:**
```typescript
test('add transaction and see it in list', async ({ page }) => {
  await page.goto('/transactions');
  await page.click('button:has-text("Add Transaction")');

  await page.fill('input[name="amount"]', '50.00');
  await page.selectOption('select[name="type"]', 'EXPENSE');
  await page.selectOption('select[name="category"]', 'Groceries');
  await page.fill('input[name="description"]', 'Weekly groceries');

  await page.click('button[type="submit"]');

  await expect(page.getByText('Weekly groceries')).toBeVisible();
  await expect(page.getByText('$50.00')).toBeVisible();
});
```

**Acceptance Criteria:**
- ✅ Transaction form with all fields
- ✅ List with filtering and search
- ✅ Quick add modal functional
- ✅ Inline editing working
- ✅ Bulk operations supported

---

## Step 2.11: Cash Flow Pages

### Implementation Tasks

1. **Income Page**
   - [ ] Income list grouped by category
   - [ ] Monthly income chart
   - [ ] Income sources breakdown chart
   - [ ] Add income button

2. **Expenses Page**
   - [ ] Expenses list grouped by category
   - [ ] Monthly expenses chart
   - [ ] Expenses by category chart
   - [ ] Add expense button

3. **Category Management**
   - [ ] Category list with colors and icons
   - [ ] Create/edit category form
   - [ ] Icon picker
   - [ ] Color picker
   - [ ] Merge categories functionality

### Testing Strategy

**Integration Tests:**
```typescript
describe('Cash Flow Pages', () => {
  it('displays income breakdown correctly', async () => {
    const mocks = [{
      request: { query: GET_CASH_FLOW },
      result: {
        data: {
          cashFlow: {
            incomeByCategory: [
              { categoryName: 'Salary', amount: 5000 },
              { categoryName: 'Freelance', amount: 1000 },
            ],
          },
        },
      },
    }];

    render(<IncomePage />, { apolloMocks: mocks });

    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('$5,000')).toBeInTheDocument();
    });
  });
});
```

**Acceptance Criteria:**
- ✅ Income and expenses pages functional
- ✅ Charts displaying correctly
- ✅ Category management working
- ✅ Icon and color pickers functional

---

## Step 2.12: Net Worth Projection UI

### Implementation Tasks

1. **Projection Configuration Panel**
   - [ ] Income growth rate slider
   - [ ] Investment return slider
   - [ ] Inflation rate slider
   - [ ] Retirement age input
   - [ ] Current age input
   - [ ] Save/load scenarios

2. **30-Year Projection Chart**
   - [ ] Line chart with projections
   - [ ] Scenario comparison (optimistic/realistic/pessimistic)
   - [ ] Milestone markers
   - [ ] Zoomable time range
   - [ ] Interactive tooltips

3. **Projection Summary**
   - [ ] Projected net worth at retirement
   - [ ] Years to millionaire
   - [ ] Debt-free date
   - [ ] Savings rate needed

4. **What-If Scenario Builder**
   - [ ] Add one-time expenses/income
   - [ ] Adjust recurring expenses
   - [ ] Compare scenarios side-by-side

### Testing Strategy

**Calculation Tests:**
```typescript
describe('Projection Calculations', () => {
  it('calculates correct future value with growth', () => {
    const result = calculateProjection({
      currentNetWorth: 100000,
      annualSavings: 20000,
      investmentReturn: 7,
      years: 10,
    });

    // Expected: FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
    expect(result.finalNetWorth).toBeCloseTo(470989, 0);
  });
});
```

**E2E Tests:**
```typescript
test('create and save projection scenario', async ({ page }) => {
  await page.goto('/projections');

  await page.fill('input[name="incomeGrowthRate"]', '3');
  await page.fill('input[name="investmentReturn"]', '7');
  await page.fill('input[name="inflationRate"]', '2.5');

  await page.click('button:has-text("Calculate")');

  await expect(page.getByText(/projected net worth/i)).toBeVisible();

  await page.click('button:has-text("Save Scenario")');
  await page.fill('input[name="scenarioName"]', 'Conservative Plan');
  await page.click('button[type="submit"]');

  await expect(page.getByText('Conservative Plan')).toBeVisible();
});
```

**Acceptance Criteria:**
- ✅ Configuration panel functional
- ✅ Chart displaying projections correctly
- ✅ Milestones detected and shown
- ✅ Scenario comparison working
- ✅ What-if builder functional
- ✅ Calculations accurate

---

## Overarching Testing Strategy

### Test Pyramid

```
           /\
          /  \     E2E Tests (10%)
         /____\    - Critical user workflows
        /      \   - Playwright
       /  Inte  \  Integration Tests (20%)
      /  gration \  - Component interactions
     /___________\  - API mocking
    /             \
   /     Unit      \ Unit Tests (70%)
  /______________  \ - Component logic
                     - Hooks, utilities
                     - React Testing Library
```

### Continuous Testing

1. **Pre-commit Hooks:**
   ```bash
   npm run lint        # ESLint
   npm run type-check  # TypeScript
   npm run test:unit   # Fast unit tests
   ```

2. **CI Pipeline:**
   ```bash
   npm run lint
   npm run type-check
   npm run test:unit -- --coverage
   npm run test:integration
   npm run test:e2e
   npm run build
   ```

3. **Manual Testing Checklist:**
   - [ ] Test on Chrome, Firefox, Safari
   - [ ] Test on mobile (iOS, Android)
   - [ ] Test with screen reader
   - [ ] Test keyboard navigation
   - [ ] Test with slow 3G network
   - [ ] Test offline functionality

### Performance Benchmarks

- **Lighthouse Score:** >90
- **LCP (Largest Contentful Paint):** <2s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1
- **Bundle Size:** <500KB (gzipped)

---

## Risk Mitigation

### Potential Risks

1. **Firebase Authentication Issues**
   - Risk: OAuth popup blockers
   - Mitigation: Add redirect flow as fallback

2. **Real-time Performance**
   - Risk: Firestore listener overhead
   - Mitigation: Implement debouncing and batch updates

3. **Chart Performance with Large Datasets**
   - Risk: Slow rendering with 1000+ data points
   - Mitigation: Data aggregation and virtualization

4. **Mobile Performance**
   - Risk: Animations laggy on low-end devices
   - Mitigation: Reduce animation complexity, use CSS transforms

---

## Success Metrics

- ✅ All pages responsive (mobile, tablet, desktop)
- ✅ >80% test coverage
- ✅ <2s page load time
- ✅ WCAG 2.1 AA compliant
- ✅ Smooth 60fps animations
- ✅ Real-time updates working
- ✅ Offline-capable (PWA)
- ✅ Zero critical accessibility issues

---

## Ready to Begin?

This comprehensive plan provides:
- ✅ Step-by-step implementation guide
- ✅ Detailed testing strategy for each step
- ✅ Acceptance criteria
- ✅ Risk mitigation
- ✅ Performance benchmarks

**Estimated Timeline:** 5 weeks (40 hours/week)
- Week 1: Steps 2.1-2.3 (Setup, Design System, Animations)
- Week 2: Steps 2.4-2.5 (Auth, Layout)
- Week 3: Steps 2.6-2.8 (Dashboard)
- Week 4: Steps 2.9-2.10 (Accounts, Transactions)
- Week 5: Steps 2.11-2.12 (Cash Flow, Projections)

Ready to proceed with Step 2.1: Frontend Project Initialization?
