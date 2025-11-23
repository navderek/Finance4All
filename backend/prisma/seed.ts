import { PrismaClient, CategoryType, AccountType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@finance4all.com' },
    update: {},
    create: {
      firebaseUid: 'test-firebase-uid-123',
      email: 'test@finance4all.com',
      displayName: 'Test User',
      role: 'USER',
    },
  });

  console.log('✓ Created test user:', testUser.email);

  // Create default expense categories
  const expenseCategories = [
    { name: 'Housing', color: '#1A73E8', icon: 'home' },
    { name: 'Transportation', color: '#34A853', icon: 'car' },
    { name: 'Food & Dining', color: '#FBBC04', icon: 'restaurant' },
    { name: 'Utilities', color: '#EA4335', icon: 'bolt' },
    { name: 'Healthcare', color: '#A142F4', icon: 'medical' },
    { name: 'Entertainment', color: '#FF6B6B', icon: 'movie' },
    { name: 'Shopping', color: '#4ECDC4', icon: 'shopping' },
    { name: 'Personal Care', color: '#95E1D3', icon: 'spa' },
    { name: 'Education', color: '#F38181', icon: 'school' },
    { name: 'Miscellaneous', color: '#AA96DA', icon: 'more' },
  ];

  // Delete existing categories for the test user first
  await prisma.category.deleteMany({
    where: { userId: testUser.id },
  });

  for (const cat of expenseCategories) {
    await prisma.category.create({
      data: {
        userId: testUser.id,
        name: cat.name,
        type: CategoryType.EXPENSE,
        color: cat.color,
        icon: cat.icon,
        isDefault: true,
      },
    });
  }

  console.log('✓ Created default expense categories');

  // Create default income categories
  const incomeCategories = [
    { name: 'Salary', color: '#34A853', icon: 'payments' },
    { name: 'Freelance', color: '#1A73E8', icon: 'work' },
    { name: 'Investments', color: '#FBBC04', icon: 'trending_up' },
    { name: 'Other Income', color: '#A142F4', icon: 'attach_money' },
  ];

  for (const cat of incomeCategories) {
    await prisma.category.create({
      data: {
        userId: testUser.id,
        name: cat.name,
        type: CategoryType.INCOME,
        color: cat.color,
        icon: cat.icon,
        isDefault: true,
      },
    });
  }

  console.log('✓ Created default income categories');

  // Create sample accounts
  const checkingAccount = await prisma.account.create({
    data: {
      userId: testUser.id,
      name: 'Main Checking',
      type: AccountType.ASSET,
      subtype: 'Checking',
      balance: 5000.0,
      currency: 'USD',
      institution: 'Test Bank',
    },
  });

  const savingsAccount = await prisma.account.create({
    data: {
      userId: testUser.id,
      name: 'Emergency Fund',
      type: AccountType.ASSET,
      subtype: 'Savings',
      balance: 15000.0,
      currency: 'USD',
      institution: 'Test Bank',
      interestRate: 2.5,
    },
  });

  const creditCard = await prisma.account.create({
    data: {
      userId: testUser.id,
      name: 'Credit Card',
      type: AccountType.DEBT,
      subtype: 'Credit Card',
      balance: -2500.0,
      currency: 'USD',
      institution: 'Test Credit Union',
      interestRate: 18.99,
    },
  });

  console.log('✓ Created sample accounts');
  console.log('');
  console.log('Database seeding completed successfully! 🌱');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
