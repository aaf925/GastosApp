// src/screens/StatsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '../components/ScreenLayout';
import { theme } from '../theme';
import { useExpenseStore } from '../store/useExpenseStore';
import { processChartData, processMonthlyData, processBalanceData } from '../utils/chartLogic';

const { width: screenWidth } = Dimensions.get('window');

export const StatsScreen = () => {
  const navigation = useNavigation();
  const { 
    transactions, 
    getTotalExpenses, 
    getTotalIncomes, 
    getBalance, 
    getExpenses, 
    getIncomes, 
    getMonthlyData 
  } = useExpenseStore();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'expenses' | 'incomes' | 'monthly'>('overview');

  const totalExpenses = getTotalExpenses();
  const totalIncomes = getTotalIncomes();
  const balance = getBalance();
  const monthlyData = getMonthlyData();

  const expenseChartData = processChartData(getExpenses());
  const incomeChartData = processChartData(getIncomes());

  const renderOverview = () => (
    <View>
      {/* TARJETAS DE RESUMEN */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { borderLeftColor: theme.colors.success }]}>
          <Text style={styles.summaryLabel}>Ingresos</Text>
          <Text style={[styles.summaryAmount, { color: theme.colors.success }]}>
            +{totalIncomes.toFixed(2)}€
          </Text>
        </View>
        
        <View style={[styles.summaryCard, { borderLeftColor: theme.colors.error }]}>
          <Text style={styles.summaryLabel}>Gastos</Text>
          <Text style={[styles.summaryAmount, { color: theme.colors.error }]}>
            -{totalExpenses.toFixed(2)}€
          </Text>
        </View>
        
        <View style={[styles.summaryCard, { borderLeftColor: balance >= 0 ? theme.colors.success : theme.colors.error }]}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.summaryAmount, { color: balance >= 0 ? theme.colors.success : theme.colors.error }]}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)}€
          </Text>
        </View>
      </View>

      {/* GRÁFICO DE BALANCE MENSUAL */}
      {monthlyData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Evolución Mensual</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={monthlyData.slice(0, 6).reverse().map((item, index) => ({
                value: item.balance,
                label: item.month.split('-')[1],
                labelTextStyle: { color: theme.colors.textSecondary, fontSize: 12 },
              }))}
              height={200}
              width={screenWidth - 80}
              color={theme.colors.primary}
              thickness={3}
              startFillColor={theme.colors.primary}
              endFillColor="transparent"
              startOpacity={0.3}
              endOpacity={0.1}
              initialSpacing={20}
              spacing={45}
              rulesType="dashed"
              rulesColor={theme.colors.cardBorder}
              yAxisColor="transparent"
              xAxisColor="transparent"
              noOfSections={4}
              yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 12 }}
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderCategoryChart = (data: any[], title: string, color: string) => (
    <View style={styles.chartSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay datos para mostrar</Text>
        </View>
      ) : (
        <>
          <View style={styles.chartContainer}>
            <PieChart
              data={data}
              donut
              showText
              textColor="white"
              radius={100}
              innerRadius={60}
              textSize={12}
              fontWeight="bold"
              backgroundColor="transparent"
              centerLabelComponent={() => (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 10 }}>Total</Text>
                  <Text style={{ color: color, fontSize: 16, fontWeight: 'bold' }}>
                    {data.reduce((sum, item) => sum + item.value, 0).toFixed(0)}€
                  </Text>
                </View>
              )}
            />
          </View>

          <View style={styles.legendContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={styles.legendLeft}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]}>
                    <Ionicons name={item.categoryIcon} size={12} color="white" />
                  </View>
                  <Text style={styles.legendText}>{item.categoryName}</Text>
                </View>
                <View style={styles.legendRight}>
                  <Text style={styles.legendAmount}>{item.value.toFixed(2)} €</Text>
                  <Text style={[styles.legendPercent, { color: item.color }]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );

  const renderMonthlyStats = () => (
    <View style={styles.chartSection}>
      <Text style={styles.sectionTitle}>Estadísticas Mensuales</Text>
      {monthlyData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay datos mensuales</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {monthlyData.slice(0, 6).map((item, index) => (
            <View key={index} style={styles.monthCard}>
              <Text style={styles.monthTitle}>
                {new Date(item.month + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })}
              </Text>
              <View style={styles.monthStats}>
                <View style={styles.monthStat}>
                  <Text style={styles.monthStatLabel}>Ingresos</Text>
                  <Text style={[styles.monthStatValue, { color: theme.colors.success }]}>
                    +{item.incomes.toFixed(0)}€
                  </Text>
                </View>
                <View style={styles.monthStat}>
                  <Text style={styles.monthStatLabel}>Gastos</Text>
                  <Text style={[styles.monthStatValue, { color: theme.colors.error }]}>
                    -{item.expenses.toFixed(0)}€
                  </Text>
                </View>
                <View style={styles.monthStat}>
                  <Text style={styles.monthStatLabel}>Balance</Text>
                  <Text style={[styles.monthStatValue, { color: item.balance >= 0 ? theme.colors.success : theme.colors.error }]}>
                    {item.balance >= 0 ? '+' : ''}{item.balance.toFixed(0)}€
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
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
        <View style={{ width: 40 }} /> 
      </View>

      {/* TABS DE NAVEGACIÓN */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'overview' && styles.tabActive]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.tabTextActive]}>
            General
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'expenses' && styles.tabActive]}
          onPress={() => setSelectedTab('expenses')}
        >
          <Text style={[styles.tabText, selectedTab === 'expenses' && styles.tabTextActive]}>
            Gastos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'incomes' && styles.tabActive]}
          onPress={() => setSelectedTab('incomes')}
        >
          <Text style={[styles.tabText, selectedTab === 'incomes' && styles.tabTextActive]}>
            Ingresos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'monthly' && styles.tabActive]}
          onPress={() => setSelectedTab('monthly')}
        >
          <Text style={[styles.tabText, selectedTab === 'monthly' && styles.tabTextActive]}>
            Mensual
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'expenses' && renderCategoryChart(expenseChartData, 'Gastos por Categoría', theme.colors.error)}
        {selectedTab === 'incomes' && renderCategoryChart(incomeChartData, 'Ingresos por Categoría', theme.colors.success)}
        {selectedTab === 'monthly' && renderMonthlyStats()}
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
    marginBottom: theme.spacing.m,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: theme.fontSize.l,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.m,
    padding: 4,
    marginBottom: theme.spacing.m,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.s,
    alignItems: 'center',
    borderRadius: theme.borderRadius.m - 4,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
  },

  // Summary Cards
  summaryContainer: {
    gap: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  summaryCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    borderLeftWidth: 4,
  },
  summaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: theme.fontSize.l,
    fontWeight: 'bold',
  },

  // Chart Sections
  chartSection: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.m,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
  },
  
  // Empty state
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.m,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.m,
  },

  // Legend
  legendContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginTop: theme.spacing.m,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  legendText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.s,
    fontWeight: '500',
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendAmount: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: theme.fontSize.s,
  },
  legendPercent: {
    fontSize: theme.fontSize.s,
    fontWeight: 'bold',
  },

  // Monthly cards
  monthCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginRight: theme.spacing.m,
    minWidth: 150,
  },
  monthTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  monthStats: {
    gap: theme.spacing.s,
  },
  monthStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthStatLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
  },
  monthStatValue: {
    fontSize: theme.fontSize.s,
    fontWeight: 'bold',
  },
});