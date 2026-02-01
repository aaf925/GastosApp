// src/utils/categoryMap.ts
import { Category } from '../types/expense';

// 1. Exportamos la lista para usarla en el selector
export const CATEGORIES: Category[] = ['Comida', 'Transporte', 'Ocio', 'Salud', 'Hogar', 'Otros'];

export const getCategoryConfig = (category: Category) => {
  switch (category) {
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
    case 'Otros':
    default:
      return { icon: 'grid', color: '#B2BEC3' };
  }
};