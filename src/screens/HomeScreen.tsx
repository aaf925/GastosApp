import React from 'react';
import { Text, StyleSheet, View, FlatList, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ScreenLayout } from '../components/ScreenLayout';
import { BalanceCard } from '../components/BalanceCard';
import { FloatingButton } from '../components/FloatingButton';
import { ExpenseItem } from '../components/ExpenseItem';
import { theme } from '../theme';
import { useExpenseStore } from '../store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { SwipeableRow } from '../components/SwipeableRow';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const { 
    transactions, 
    getTotalExpenses, 
    getTotalIncomes, 
    getBalance, 
    deleteTransaction 
  } = useExpenseStore();
  
  const totalExpenses = getTotalExpenses();
  const totalIncomes = getTotalIncomes();
  const balance = getBalance();

  // Función para manejar el borrado con confirmación
  const handleDelete = (id: string, type: 'expense' | 'income') => {
    const itemType = type === 'expense' ? 'gasto' : 'ingreso';
    Alert.alert(
      `Eliminar ${itemType}`,
      `¿Estás seguro de que quieres borrar este ${itemType}? No se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => deleteTransaction(id) 
        }
      ]
    );
  };

  return (
    <ScreenLayout>
      {/* Header Personalizado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, Usuario</Text>
          <Text style={styles.subtitle}>Tus finanzas al día</Text>
        </View>
        
        {/* Botón para ir a Estadísticas */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Stats')}
          style={styles.statsButton}
        >
          <Ionicons name="pie-chart" size={24} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>

      <BalanceCard 
        totalExpenses={totalExpenses} 
        totalIncomes={totalIncomes} 
        balance={balance} 
      />

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Últimos movimientos</Text>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🐳</Text>
            <Text style={styles.emptyText}>Todo tranquilo por aquí...</Text>
            <Text style={styles.emptySubText}>Pulsa el + para añadir tu primera transacción</Text>
          </View>
        ) : (
          <FlatList
            data={transactions.slice(0, 20)} // Mostrar solo las últimas 20 transacciones
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <ExpenseItem 
                item={item}
                onPress={() => navigation.navigate('AddExpense', { expense: item })}
                onLongPress={() => handleDelete(item.id, item.type || 'expense')}
              />
            )}
          />
        )}
      </View>

      <FloatingButton onPress={() => navigation.navigate('AddExpense')} />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  greeting: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.l,
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.m,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  listSection: {
    marginTop: 40,
    flex: 1,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.l,
    fontWeight: '600',
    marginBottom: theme.spacing.m,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: 'bold',
  },
  emptySubText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
    marginTop: 5,
  },
  statsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 201, 240, 0.1)', // Accent muy suave
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.3)',
  }
});