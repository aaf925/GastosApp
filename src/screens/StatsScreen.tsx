// src/screens/StatsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useNavigation } from '@react-navigation/native'; // <--- Importante para navegar
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { theme } from '../theme';
import { useExpenseStore } from '../store/useExpenseStore';
import { processChartData } from '../utils/chartLogic';

export const StatsScreen = () => {
  const navigation = useNavigation(); // <--- Hook para controlar la navegación
  const expenses = useExpenseStore(state => state.expenses);
  const chartData = processChartData(expenses);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <ScreenLayout>
      {/* HEADER PERSONALIZADO CON BOTÓN ATRÁS */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        {/* Vista vacía para equilibrar el título al centro */}
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {chartData.length === 0 ? (
          <View style={styles.emptyContainer}>
             <Text style={styles.emptyText}>Añade gastos para ver estadísticas</Text>
          </View>
        ) : (
          <>
            {/* GRÁFICO CENTRAL */}
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                donut
                showText
                textColor="white"
                radius={120}
                innerRadius={70}
                textSize={14}
                fontWeight="bold"
                backgroundColor="transparent"
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Total</Text>
                    <Text style={{ color: theme.colors.textPrimary, fontSize: 18, fontWeight: 'bold' }}>
                      {total}€
                    </Text>
                  </View>
                )}
              />
            </View>

            {/* LEYENDA DETALLADA */}
            <View style={styles.legendContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  {/* Icono y Nombre */}
                  <View style={styles.legendLeft}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]}>
                      {/* @ts-ignore */}
                      <Ionicons name={item.categoryIcon} size={14} color="white" />
                    </View>
                    <Text style={styles.legendText}>{item.categoryName}</Text>
                  </View>
                  
                  {/* Monto y Porcentaje */}
                  <View style={styles.legendRight}>
                    <Text style={styles.legendAmount}>{item.value} €</Text>
                    <Text style={[styles.legendPercent, { color: item.color }]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  // Estilos del Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.m,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start', // Alineado a la izquierda
  },
  headerTitle: {
    fontSize: theme.fontSize.l,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },

  // Resto de estilos igual que antes
  chartContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.m,
  },
  emptyContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.m,
  },
  legendContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
    marginBottom: 40,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  legendText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: '500',
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendAmount: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  legendPercent: {
    fontSize: theme.fontSize.s,
    fontWeight: 'bold',
  }
});