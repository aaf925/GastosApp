import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types/expense';
import { theme } from '../theme';
import { getCategoryConfig } from '../utils/categoryMap';

interface Props {
  item: Transaction;
  onPress: () => void;     // Para editar
  onLongPress: () => void; // Para borrar
}

export const ExpenseItem = ({ item, onPress, onLongPress }: Props) => {
  const { icon, color } = getCategoryConfig(item.category);
  const isIncome = item.type === 'income';
  
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
      delayLongPress={500}
    >
      {/* Icono */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>

      {/* Info Central */}
      <View style={styles.info}>
        <View style={styles.categoryRow}>
          <Text style={styles.category}>{item.category}</Text>
          <View style={[styles.typeIndicator, { 
            backgroundColor: isIncome ? theme.colors.success : theme.colors.error 
          }]}>
            <Ionicons 
              name={isIncome ? 'trending-up' : 'trending-down'} 
              size={12} 
              color="#FFF" 
            />
          </View>
        </View>
        {item.note ? (
          <Text style={styles.note} numberOfLines={1}>
            {item.note}
          </Text>
        ) : null}
      </View>

      {/* Info Derecha */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { 
          color: isIncome ? theme.colors.success : theme.colors.error 
        }]}>
          {isIncome ? '+' : '-'}{item.amount.toLocaleString('es-ES', { 
            style: 'currency', 
            currency: 'EUR' 
          })}
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
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  category: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: theme.fontSize.m,
  },
  typeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'bold',
    fontSize: theme.fontSize.m,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
    marginTop: 4,
  }
});