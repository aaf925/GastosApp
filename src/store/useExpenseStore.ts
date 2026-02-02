import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, CreateExpenseInput, Transaction, TransactionType } from '../types/expense';
// import uuid from 'react-native-uuid'; // Si te da error, usa la versión manual abajo

interface ExpenseState {
  expenses: Expense[]; // Mantener compatibilidad, pero ahora incluye todos los tipos
  transactions: Transaction[]; // Nuevo array más descriptivo
  addTransaction: (input: CreateExpenseInput) => void;
  addExpense: (input: CreateExpenseInput) => void; // Mantener compatibilidad
  deleteExpense: (id: string) => void;
  deleteTransaction: (id: string) => void; // Nuevo método más descriptivo
  updateExpense: (id: string, input: CreateExpenseInput) => void;
  updateTransaction: (id: string, input: CreateExpenseInput) => void; // Nuevo método más descriptivo
  getTotalExpenses: () => number;
  getTotalIncomes: () => number;
  getBalance: () => number;
  getExpenses: () => Transaction[];
  getIncomes: () => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getMonthlyData: () => Array<{
    month: string;
    expenses: number;
    incomes: number;
    balance: number;
  }>;
  _migrate: () => void;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      transactions: [],

      // Migrar datos si es necesario
      _migrate: () => {
        const { expenses, transactions } = get();
        if (expenses.length > 0 && transactions.length === 0) {
          // Migrar gastos existentes añadiendo el campo 'type'
          const migratedTransactions = expenses.map(expense => ({
            ...expense,
            type: 'expense' as TransactionType
          }));
          set({ transactions: migratedTransactions });
        }
      },

      addTransaction: (input) => {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          ...input,
          date: input.date 
        };

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          expenses: [newTransaction, ...state.expenses] // Mantener compatibilidad
        }));
      },

      addExpense: (input) => {
        const expenseInput = { ...input, type: 'expense' as TransactionType };
        get().addTransaction(expenseInput);
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          expenses: state.expenses.filter((e) => e.id !== id) // Mantener compatibilidad
        }));
      },

      deleteExpense: (id) => {
        get().deleteTransaction(id);
      },

      updateTransaction: (id, input) => {
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id 
              ? { ...t, ...input, date: input.date }
              : t
          ),
          expenses: state.expenses.map((e) => 
            e.id === id 
              ? { ...e, ...input, date: input.date }
              : e
          ) // Mantener compatibilidad
        }));
      },

      updateExpense: (id, input) => {
        get().updateTransaction(id, input);
      },

      getTotalExpenses: () => {
        const { transactions } = get();
        return transactions
          .filter(t => t.type === 'expense')
          .reduce((total, item) => total + item.amount, 0);
      },

      getTotalIncomes: () => {
        const { transactions } = get();
        return transactions
          .filter(t => t.type === 'income')
          .reduce((total, item) => total + item.amount, 0);
      },

      getBalance: () => {
        const { getTotalIncomes, getTotalExpenses } = get();
        return getTotalIncomes() - getTotalExpenses();
      },

      getExpenses: () => {
        const { transactions } = get();
        return transactions.filter(t => t.type === 'expense');
      },

      getIncomes: () => {
        const { transactions } = get();
        return transactions.filter(t => t.type === 'income');
      },

      getTransactionsByType: (type: TransactionType) => {
        const { transactions } = get();
        return transactions.filter(t => t.type === type);
      },

      getMonthlyData: () => {
        const { transactions } = get();
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
      },
    }),
    {
      name: 'expenses-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ejecutar migración después de cargar datos
          setTimeout(() => state._migrate?.(), 0);
        }
      },
    }
  )
);