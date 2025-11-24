import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SavingsIcon from '@mui/icons-material/Savings';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * Navigation Configuration
 * Defines the main navigation menu structure
 */

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
  badge?: number;
  divider?: boolean;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardIcon />,
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    items: [
      {
        id: 'accounts',
        label: 'Accounts',
        path: '/accounts',
        icon: <AccountBalanceWalletIcon />,
      },
      {
        id: 'transactions',
        label: 'Transactions',
        path: '/transactions',
        icon: <ReceiptLongIcon />,
      },
      {
        id: 'categories',
        label: 'Categories',
        path: '/categories',
        icon: <CategoryIcon />,
      },
    ],
  },
  {
    id: 'analysis',
    title: 'Analysis',
    items: [
      {
        id: 'cash-flow',
        label: 'Cash Flow',
        path: '/cash-flow',
        icon: <TrendingUpIcon />,
      },
      {
        id: 'budgets',
        label: 'Budgets',
        path: '/budgets',
        icon: <PieChartIcon />,
      },
      {
        id: 'projections',
        label: 'Projections',
        path: '/projections',
        icon: <TimelineIcon />,
      },
      {
        id: 'goals',
        label: 'Goals',
        path: '/goals',
        icon: <SavingsIcon />,
      },
    ],
  },
  {
    id: 'settings',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: <SettingsIcon />,
        divider: true,
      },
    ],
  },
];

// Helper function to get breadcrumb path
export const getBreadcrumbs = (pathname: string): { label: string; path: string }[] => {
  const breadcrumbs: { label: string; path: string }[] = [
    { label: 'Home', path: '/dashboard' },
  ];

  if (pathname === '/dashboard') {
    return breadcrumbs;
  }

  // Find the nav item for the current path
  for (const section of navigationConfig) {
    const item = section.items.find((item) => item.path === pathname);
    if (item) {
      breadcrumbs.push({ label: item.label, path: item.path });
      break;
    }
  }

  return breadcrumbs;
};

// Helper function to get active nav item
export const getActiveNavItem = (pathname: string): NavItem | undefined => {
  for (const section of navigationConfig) {
    const item = section.items.find((item) => item.path === pathname);
    if (item) {
      return item;
    }
  }
  return undefined;
};
