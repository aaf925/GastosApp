import { Expense } from './expense';

export type RootStackParamList = {
  Home: undefined;
  // Ahora AddExpense acepta opcionalmente un objeto 'expense' para editar
  AddExpense: { expense?: Expense } | undefined;
  Stats: undefined;
};