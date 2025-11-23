import { PrismaClient } from '@prisma/client';

// ============================================
// NET WORTH CALCULATIONS
// ============================================

export interface NetWorthResult {
  totalAssets: number;
  totalInvestments: number;
  totalDebts: number;
  totalLiabilities: number;
  netWorth: number;
  accounts: {
    id: string;
    name: string;
    type: string;
    balance: number;
  }[];
  calculatedAt: Date;
}

export async function calculateNetWorth(
  prisma: PrismaClient,
  userId: string
): Promise<NetWorthResult> {
  const accounts = await prisma.account.findMany({
    where: { userId, isActive: true },
    select: {
      id: true,
      name: true,
      type: true,
      balance: true,
    },
  });

  let totalAssets = 0;
  let totalInvestments = 0;
  let totalDebts = 0;
  let totalLiabilities = 0;

  accounts.forEach((account) => {
    const balance = parseFloat(account.balance.toString());

    switch (account.type) {
      case 'ASSET':
        totalAssets += balance;
        break;
      case 'INVESTMENT':
        totalInvestments += balance;
        break;
      case 'DEBT':
        totalDebts += Math.abs(balance); // Debts are stored as negative
        break;
      case 'LIABILITY':
        totalLiabilities += Math.abs(balance);
        break;
    }
  });

  const netWorth = (totalAssets + totalInvestments) - (totalDebts + totalLiabilities);

  return {
    totalAssets,
    totalInvestments,
    totalDebts,
    totalLiabilities,
    netWorth,
    accounts: accounts.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      balance: parseFloat(a.balance.toString()),
    })),
    calculatedAt: new Date(),
  };
}

// ============================================
// CASH FLOW CALCULATIONS
// ============================================

export interface CashFlowResult {
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  incomeByCategory: {
    categoryId: string | null;
    categoryName: string;
    amount: number;
  }[];
  expensesByCategory: {
    categoryId: string | null;
    categoryName: string;
    amount: number;
  }[];
  monthlyBreakdown: {
    month: string;
    income: number;
    expenses: number;
    netCashFlow: number;
  }[];
  calculatedAt: Date;
}

export async function calculateCashFlow(
  prisma: PrismaClient,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CashFlowResult> {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  let totalIncome = 0;
  let totalExpenses = 0;
  const incomeByCategoryMap = new Map<string, { name: string; amount: number }>();
  const expensesByCategoryMap = new Map<string, { name: string; amount: number }>();
  const monthlyMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.amount.toString());
    const monthKey = transaction.date.toISOString().substring(0, 7); // YYYY-MM

    if (transaction.type === 'INCOME') {
      totalIncome += amount;

      const categoryKey = transaction.categoryId || 'uncategorized';
      const categoryName = transaction.category?.name || 'Uncategorized';
      const existing = incomeByCategoryMap.get(categoryKey) || { name: categoryName, amount: 0 };
      existing.amount += amount;
      incomeByCategoryMap.set(categoryKey, existing);

      const monthly = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };
      monthly.income += amount;
      monthlyMap.set(monthKey, monthly);
    } else if (transaction.type === 'EXPENSE') {
      totalExpenses += amount;

      const categoryKey = transaction.categoryId || 'uncategorized';
      const categoryName = transaction.category?.name || 'Uncategorized';
      const existing = expensesByCategoryMap.get(categoryKey) || { name: categoryName, amount: 0 };
      existing.amount += amount;
      expensesByCategoryMap.set(categoryKey, existing);

      const monthly = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };
      monthly.expenses += amount;
      monthlyMap.set(monthKey, monthly);
    }
  });

  const incomeByCategory = Array.from(incomeByCategoryMap.entries()).map(([id, data]) => ({
    categoryId: id === 'uncategorized' ? null : id,
    categoryName: data.name,
    amount: data.amount,
  }));

  const expensesByCategory = Array.from(expensesByCategoryMap.entries()).map(([id, data]) => ({
    categoryId: id === 'uncategorized' ? null : id,
    categoryName: data.name,
    amount: data.amount,
  }));

  const monthlyBreakdown = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      netCashFlow: data.income - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    period: {
      startDate,
      endDate,
    },
    totalIncome,
    totalExpenses,
    netCashFlow: totalIncome - totalExpenses,
    incomeByCategory,
    expensesByCategory,
    monthlyBreakdown,
    calculatedAt: new Date(),
  };
}

// ============================================
// 30-YEAR PROJECTION CALCULATIONS
// ============================================

export interface ProjectionAssumptions {
  incomeGrowthRate: number; // Annual percentage (e.g., 3 for 3%)
  investmentReturn: number; // Annual percentage (e.g., 7 for 7%)
  inflationRate: number; // Annual percentage (e.g., 2.5 for 2.5%)
  expectedSalary?: number; // Optional: override current income
  expectedExpenses?: number; // Optional: override current expenses
}

export interface ProjectionYearData {
  year: number;
  age?: number;
  netWorth: number;
  totalAssets: number;
  totalInvestments: number;
  totalDebts: number;
  annualIncome: number;
  annualExpenses: number;
  annualSavings: number;
}

export interface ProjectionResult {
  assumptions: ProjectionAssumptions;
  currentNetWorth: number;
  projectedYears: ProjectionYearData[];
  milestones: {
    debtFreeYear?: number;
    millionaireYear?: number;
    retirementReadyYear?: number;
  };
  calculatedAt: Date;
}

export async function calculate30YearProjection(
  prisma: PrismaClient,
  userId: string,
  assumptions: ProjectionAssumptions,
  userAge?: number
): Promise<ProjectionResult> {
  // Get current financial state
  const netWorthData = await calculateNetWorth(prisma, userId);

  // Get last 12 months of cash flow to estimate annual figures
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const cashFlowData = await calculateCashFlow(prisma, userId, twelveMonthsAgo, new Date());

  // Calculate annual income and expenses from last 12 months
  const annualIncome = assumptions.expectedSalary || cashFlowData.totalIncome;
  const annualExpenses = assumptions.expectedExpenses || cashFlowData.totalExpenses;

  const projectedYears: ProjectionYearData[] = [];
  const milestones: {
    debtFreeYear?: number;
    millionaireYear?: number;
    retirementReadyYear?: number;
  } = {};

  let currentAssets = netWorthData.totalAssets;
  let currentInvestments = netWorthData.totalInvestments;
  let currentDebts = netWorthData.totalDebts;
  let currentIncome = annualIncome;
  let currentExpenses = annualExpenses;

  // Project 30 years
  for (let year = 0; year <= 30; year++) {
    const currentAge = userAge ? userAge + year : undefined;

    // Apply growth rates
    if (year > 0) {
      // Income grows with income growth rate
      currentIncome *= (1 + assumptions.incomeGrowthRate / 100);

      // Expenses grow with inflation
      currentExpenses *= (1 + assumptions.inflationRate / 100);

      // Investments grow with investment return
      currentInvestments *= (1 + assumptions.investmentReturn / 100);

      // Add annual savings (income - expenses) to assets
      const savings = currentIncome - currentExpenses;
      if (savings > 0) {
        // Positive savings go to investments for growth
        currentInvestments += savings;
      } else {
        // Negative savings reduce assets first, then investments
        if (currentAssets >= Math.abs(savings)) {
          currentAssets += savings;
        } else {
          currentInvestments += (savings + currentAssets);
          currentAssets = 0;
        }
      }

      // Pay down debt with 10% of savings (if debt exists and savings are positive)
      if (currentDebts > 0 && savings > 0) {
        const debtPayment = Math.min(savings * 0.1, currentDebts);
        currentDebts -= debtPayment;
        currentInvestments -= debtPayment; // Reduce investments by the payment amount
      }
    }

    const netWorth = (currentAssets + currentInvestments) - currentDebts;

    projectedYears.push({
      year,
      age: currentAge,
      netWorth: Math.round(netWorth),
      totalAssets: Math.round(currentAssets),
      totalInvestments: Math.round(currentInvestments),
      totalDebts: Math.round(currentDebts),
      annualIncome: Math.round(currentIncome),
      annualExpenses: Math.round(currentExpenses),
      annualSavings: Math.round(currentIncome - currentExpenses),
    });

    // Track milestones
    if (!milestones.debtFreeYear && currentDebts <= 0) {
      milestones.debtFreeYear = year;
    }
    if (!milestones.millionaireYear && netWorth >= 1000000) {
      milestones.millionaireYear = year;
    }
    if (!milestones.retirementReadyYear && netWorth >= annualExpenses * 25) {
      // 25x rule for retirement (4% withdrawal rate)
      milestones.retirementReadyYear = year;
    }
  }

  return {
    assumptions,
    currentNetWorth: netWorthData.netWorth,
    projectedYears,
    milestones,
    calculatedAt: new Date(),
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getDateRange(months: number): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return { startDate, endDate };
}

export function getCurrentMonthRange(): { startDate: Date; endDate: Date } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

export function getYearToDateRange(): { startDate: Date; endDate: Date } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = now;

  return { startDate, endDate };
}
