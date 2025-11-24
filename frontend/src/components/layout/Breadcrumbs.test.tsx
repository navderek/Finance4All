import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Breadcrumbs } from './Breadcrumbs';
import { lightTheme } from '@theme/index';

const renderBreadcrumbs = (initialRoute = '/dashboard', props = {}) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider theme={lightTheme}>
        <Breadcrumbs {...props} />
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Breadcrumbs', () => {
  it('renders without crashing', () => {
    renderBreadcrumbs();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('displays home breadcrumb on dashboard', () => {
    renderBreadcrumbs('/dashboard');
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('displays home icon on dashboard by default', () => {
    renderBreadcrumbs('/dashboard');
    const homeIcon = screen.getByTestId('HomeIcon');
    expect(homeIcon).toBeInTheDocument();
  });

  it('hides home icon when showHomeIcon is false', () => {
    renderBreadcrumbs('/dashboard', { showHomeIcon: false });
    const homeIcon = screen.queryByTestId('HomeIcon');
    expect(homeIcon).not.toBeInTheDocument();
  });

  it('displays two breadcrumbs for accounts page', () => {
    renderBreadcrumbs('/accounts');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('displays two breadcrumbs for transactions page', () => {
    renderBreadcrumbs('/transactions');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('displays two breadcrumbs for categories page', () => {
    renderBreadcrumbs('/categories');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('displays two breadcrumbs for cash flow page', () => {
    renderBreadcrumbs('/cash-flow');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
  });

  it('displays two breadcrumbs for budgets page', () => {
    renderBreadcrumbs('/budgets');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Budgets')).toBeInTheDocument();
  });

  it('displays two breadcrumbs for projections page', () => {
    renderBreadcrumbs('/projections');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projections')).toBeInTheDocument();
  });

  it('displays two breadcrumbs for goals page', () => {
    renderBreadcrumbs('/goals');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('displays two breadcrumbs for settings page', () => {
    renderBreadcrumbs('/settings');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('makes home breadcrumb clickable when not on dashboard', () => {
    renderBreadcrumbs('/accounts');
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/dashboard');
  });

  it('does not make the last breadcrumb clickable', () => {
    renderBreadcrumbs('/accounts');
    const accountsText = screen.getByText('Accounts');
    const accountsLink = accountsText.closest('a');
    expect(accountsLink).toBeNull();
  });

  it('displays only home when on dashboard', () => {
    renderBreadcrumbs('/dashboard');
    const breadcrumbItems = screen.getAllByRole('listitem');
    // Should only have 1 breadcrumb item (Home)
    expect(breadcrumbItems).toHaveLength(1);
  });

  it('displays breadcrumb separator', () => {
    renderBreadcrumbs('/accounts');
    // NavigateNextIcon should be present as separator
    const separator = screen.getByTestId('NavigateNextIcon');
    expect(separator).toBeInTheDocument();
  });

  it('handles unknown routes gracefully', () => {
    renderBreadcrumbs('/unknown-route');
    // Should still show home breadcrumb
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
