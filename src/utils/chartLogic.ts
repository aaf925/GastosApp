// src/utils/chartLogic.ts
import { Transaction, TransactionType } from '../types/expense';
import { getCategoryConfig } from './categoryMap';

export const processChartData = (transactions: Transaction[]) => {
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);

  // Si no hay transacciones, devolvemos un array vacío para manejarlo en la UI
  if (total === 0) return [];

  // Agrupamos por categoría
  const categoryData = new Map<string, number>();
  
  transactions.forEach(transaction => {
    const currentAmount = categoryData.get(transaction.category) || 0;
    categoryData.set(transaction.category, currentAmount + transaction.amount);
  });

  const data = Array.from(categoryData.entries()).map(([category, amount]) => {
    const config = getCategoryConfig(category as any);
    const percentage = ((amount / total) * 100).toFixed(0);

    return {
      value: amount,
      color: config.color,
      text: `${percentage}%`,
      categoryName: category,
      categoryIcon: config.icon,
    };
  });

  // Ordenamos de mayor a menor
  return data.sort((a, b) => b.value - a.value);
};

export const processMonthlyData = (transactions: Transaction[]) => {
  const monthlyData = new Map<string, { expenses: number; incomes: number }>();

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { expenses: 0, incomes: 0 });
    }
    
    const monthData = monthlyData.get(monthKey)!;
    if (transaction.type === 'expense') {
      monthData.expenses += transaction.amount;
    } else {
      monthData.incomes += transaction.amount;
    }
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      ...data,
      balance: data.incomes - data.expenses
    }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12); // Últimos 12 meses
};

export const processBalanceData = (transactions: Transaction[]) => {
  const daily = new Map<string, number>();
  
  transactions.forEach(transaction => {
    const dateKey = transaction.date.toISOString().split('T')[0];
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    daily.set(dateKey, (daily.get(dateKey) || 0) + amount);
  });

  let runningBalance = 0;
  return Array.from(daily.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayChange]) => {
      runningBalance += dayChange;
      return {
        date,
        balance: runningBalance,
        change: dayChange,
      };
    });
};