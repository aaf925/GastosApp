// src/types/expense.ts

// Definimos las categorías posibles para evitar errores de texto libre
export type Category = 'Comida' | 'Transporte' | 'Ocio' | 'Salud' | 'Hogar' | 'Otros';

export interface Expense {
  id: string;          // Usaremos un string único (UUID)
  amount: number;      // El dinero
  category: Category;  // Una de las opciones de arriba
  date: Date;          // Cuándo ocurrió (Ojo: guardar fechas en JSON tiene truco)
  note?: string;       // Opcional: "Cena con amigos"
}

// Esto es lo que necesitamos para CREAR un gasto (el ID se genera solo)
export type CreateExpenseInput = Omit<Expense, 'id'>;