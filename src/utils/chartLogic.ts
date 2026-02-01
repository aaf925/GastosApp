// src/utils/chartLogic.ts
import { Expense } from '../types/expense';
import { getCategoryConfig, CATEGORIES } from './categoryMap';
import { theme } from '../theme';

export const processChartData = (expenses: Expense[]) => {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Si no hay gastos, devolvemos un array vacío para manejarlo en la UI
  if (total === 0) return [];

  // Agrupamos por categoría
  const data = CATEGORIES.map((cat) => {
    // Filtramos los gastos de esta categoría
    const categoryExpenses = expenses.filter((e) => e.category === cat);
    // Sumamos el total de esta categoría
    const categoryTotal = categoryExpenses.reduce((sum, item) => sum + item.amount, 0);

    if (categoryTotal === 0) return null; // Ignoramos categorías vacías

    const config = getCategoryConfig(cat);
    const percentage = ((categoryTotal / total) * 100).toFixed(0);

    return {
      value: categoryTotal,
      color: config.color,
      text: `${percentage}%`, // Texto que saldrá en el gráfico
      // Datos extra para la leyenda
      categoryName: cat,
      categoryIcon: config.icon,
    };
  });

  // Filtramos los nulos (categorías sin gastos) y ordenamos de mayor a menor
  return data
    .filter((item) => item !== null)
    .sort((a, b) => (b?.value || 0) - (a?.value || 0)) as any[];
};