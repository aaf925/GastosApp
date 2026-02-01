import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, CreateExpenseInput } from '../types/expense';
// import uuid from 'react-native-uuid'; // Si te da error, usa la versión manual abajo

interface ExpenseState {
  expenses: Expense[];
  addExpense: (input: CreateExpenseInput) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, input: CreateExpenseInput) => void; // <--- NUEVA FUNCIÓN
  getTotalExpenses: () => number;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],

      addExpense: (input) => {
        const newExpense: Expense = {
          // id: uuid.v4() as string, // Usa esto si te funciona la librería
          id: Date.now().toString(), // ID temporal basado en fecha
          ...input,
          date: input.date 
        };

        set((state) => ({
          expenses: [newExpense, ...state.expenses] 
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id)
        }));
      },

      // 👇 Lógica para actualizar
      updateExpense: (id, input) => {
        set((state) => ({
          expenses: state.expenses.map((e) => 
            e.id === id 
              ? { ...e, ...input, date: input.date } // Mantenemos ID, actualizamos datos
              : e
          )
        }));
      },

      getTotalExpenses: () => {
        const { expenses } = get();
        return expenses.reduce((total, item) => total + item.amount, 0);
      },
    }),
    {
      name: 'expenses-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);