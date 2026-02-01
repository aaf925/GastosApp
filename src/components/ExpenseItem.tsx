import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Expense } from '../types/expense';
import { theme } from '../theme';
import { getCategoryConfig } from '../utils/categoryMap';

interface Props {
  item: Expense;
  onPress: () => void;     // Para editar
  onLongPress: () => void; // Para borrar
}

export const ExpenseItem = ({ item, onPress, onLongPress }: Props) => {
  const { icon, color } = getCategoryConfig(item.category);
  
  // Aseguramos que la fecha sea válida
  const dateObj = new Date(item.date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      onLongPress={onLongPress}
      activeOpacity={0.7}
      delayLongPress={500} // Medio segundo para activar el borrado
    >
      {/* Icono */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        {/* @ts-ignore */}
        <Ionicons name={icon} size={24} color={color} />
      </View>

      {/* Info Central */}
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        {item.note ? (
          <Text style={styles.note} numberOfLines={1}>
            {item.note}
          </Text>
        ) : null}
      </View>

      {/* Info Derecha */}
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>
          -{item.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    marginBottom: theme.spacing.s,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  info: {
    flex: 1,
  },
  category: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: theme.fontSize.m,
  },
  note: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: theme.fontSize.m,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
    marginTop: 4,
  }
});