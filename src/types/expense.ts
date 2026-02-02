// src/types/expense.ts

// Tipo de transacción: gasto o ingreso
export type TransactionType = 'expense' | 'income';

// Definimos las categorías para gastos
export type ExpenseCategory = 'Comida' | 'Transporte' | 'Ocio' | 'Salud' | 'Hogar' | 'Otros';

// Definimos las categorías para ingresos
export type IncomeCategory = 'Salario' | 'Freelance' | 'Inversiones' | 'Ventas' | 'Regalos' | 'Otros';

// Unión de todas las categorías
export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;          // Usaremos un string único (UUID)
  amount: number;      // El dinero
  category: Category;  // Una de las opciones de arriba
  type: TransactionType; // Si es gasto o ingreso
  date: Date;          // Cuándo ocurrió (Ojo: guardar fechas en JSON tiene truco)
  note?: string;       // Opcional: "Cena con amigos"
}

// Mantener compatibilidad con el código existente
export type Expense = Transaction;

// Esto es lo que necesitamos para CREAR una transacción (el ID se genera solo)
export type CreateTransactionInput = Omit<Transaction, 'id'>;

// Mantener compatibilidad con el código existente
export type CreateExpenseInput = CreateTransactionInput;