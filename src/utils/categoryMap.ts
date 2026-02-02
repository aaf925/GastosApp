// src/utils/categoryMap.ts
import { Category, ExpenseCategory, IncomeCategory, TransactionType } from '../types/expense';

// 1. Exportamos las listas para usarla en el selector
export const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Comida', 'Transporte', 'Ocio', 'Salud', 'Hogar', 'Otros'];
export const INCOME_CATEGORIES: IncomeCategory[] = ['Salario', 'Freelance', 'Inversiones', 'Ventas', 'Regalos', 'Otros'];

// Función para obtener categorías según el tipo
export const getCategoriesByType = (type: TransactionType): Category[] => {
  return type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
};

// Mantener compatibilidad con el código existente
export const CATEGORIES = EXPENSE_CATEGORIES;

export const getCategoryConfig = (category: Category) => {
  switch (category) {
    // Categorías de gastos
    case 'Comida':
      return { icon: 'fast-food', color: '#FF7675' };
    case 'Transporte':
      return { icon: 'car', color: '#74B9FF' };
    case 'Ocio':
      return { icon: 'game-controller', color: '#A29BFE' };
    case 'Salud':
      return { icon: 'medkit', color: '#55EFC4' };
    case 'Hogar':
      return { icon: 'home', color: '#FDCB6E' };
    
    // Categorías de ingresos
    case 'Salario':
      return { icon: 'briefcase', color: '#00B894' };
    case 'Freelance':
      return { icon: 'laptop', color: '#6C5CE7' };
    case 'Inversiones':
      return { icon: 'trending-up', color: '#00CEC9' };
    case 'Ventas':
      return { icon: 'storefront', color: '#E17055' };
    case 'Regalos':
      return { icon: 'gift', color: '#FD79A8' };
    
    case 'Otros':
    default:
      return { icon: 'grid', color: '#B2BEC3' };
  }
};