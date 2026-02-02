// src/components/BalanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
}

export const BalanceCard = ({ totalExpenses, totalIncomes, balance }: Props) => {
  return (
    <LinearGradient
      colors={['#2A2D3E', '#212435']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.label}>Balance Total</Text>
        <Ionicons name="wallet-outline" size={20} color={theme.colors.accent} />
      </View>
      
      <Text style={[styles.amount, { 
        color: balance >= 0 ? theme.colors.success : theme.colors.error 
      }]}>
        {balance >= 0 ? '+' : ''}{balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
      </Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-up" size={16} color={theme.colors.success} />
          </View>
          <Text style={styles.statLabel}>Ingresos</Text>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>
            +{totalIncomes.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trending-down" size={16} color={theme.colors.error} />
          </View>
          <Text style={styles.statLabel}>Gastos</Text>
          <Text style={[styles.statValue, { color: theme.colors.error }]}>
            -{totalExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -1.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
});