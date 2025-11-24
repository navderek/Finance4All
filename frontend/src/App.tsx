import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { theme } from './theme';
import { apolloClient } from './graphql/client';
import { AppLayout } from './components/layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { AccountsPage } from './pages/accounts';
import { TransactionsPage } from './pages/transactions';

/**
 * App Component
 *
 * Main application component that sets up:
 * - Theme provider (Material-UI with Gemini theme)
 * - Apollo Client (GraphQL)
 * - Routing
 * - Application layout
 */
function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Main routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />

              {/* TODO: Add more routes as pages are developed */}
              {/* <Route path="/categories" element={<CategoriesPage />} /> */}
              {/* <Route path="/cash-flow" element={<CashFlowPage />} /> */}
              {/* <Route path="/budgets" element={<BudgetsPage />} /> */}
              {/* <Route path="/projections" element={<ProjectionsPage />} /> */}
              {/* <Route path="/goals" element={<GoalsPage />} /> */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}

              {/* 404 fallback - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
