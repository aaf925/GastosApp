// src/screens/AddExpenseScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { ScreenLayout } from '../components/ScreenLayout';
import { theme } from '../theme';
import { useExpenseStore } from '../store/useExpenseStore';
import { getCategoriesByType, getCategoryConfig } from '../utils/categoryMap';
import { TransactionType, Category } from '../types/expense';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

const transactionSchema = z.object({
  amount: z.string().min(1, "Ingresa un monto"),
  note: z.string().max(50, "Máximo 50 caracteres").optional(),
  category: z.string(),
  type: z.enum(['expense', 'income'] as const),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export const AddExpenseScreen = ({ navigation, route }: Props) => {
  const { addTransaction, updateTransaction } = useExpenseStore();
  const expenseToEdit = route.params?.expense;
  const isEditing = !!expenseToEdit;

  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [availableCategories, setAvailableCategories] = useState<Category[]>(getCategoriesByType('expense'));

  const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: '',
      note: '',
      category: availableCategories[0] || '',
      type: 'expense',
    }
  });

  const selectedCategory = watch('category');
  const selectedType = watch('type');

  useEffect(() => {
    if (expenseToEdit) {
      const type = expenseToEdit.type || 'expense';
      setTransactionType(type);
      setValue('amount', expenseToEdit.amount.toString());
      setValue('note', expenseToEdit.note || '');
      setValue('category', expenseToEdit.category);
      setValue('type', type);
      navigation.setOptions({ 
        title: type === 'expense' ? 'Editar Gasto' : 'Editar Ingreso'
      });
    }
  }, [expenseToEdit]);

  useEffect(() => {
    const newCategories = getCategoriesByType(transactionType);
    setAvailableCategories(newCategories);
    
    // Si la categoría actual no está en las nuevas categorías, cambiar a la primera
    if (!newCategories.includes(selectedCategory as Category)) {
      setValue('category', newCategories[0] || '');
    }
  }, [transactionType]);

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setValue('type', type);
  };

  const onSubmit = (data: TransactionFormData) => {
    const numericAmount = parseFloat(data.amount.replace(',', '.'));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "El monto debe ser válido");
      return;
    }

    const transactionData = {
      amount: numericAmount,
      note: data.note || '',
      category: data.category as Category,
      type: data.type,
      date: isEditing ? expenseToEdit.date : new Date(),
    };

    if (isEditing) {
      updateTransaction(expenseToEdit.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    navigation.goBack();
  };

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {isEditing 
            ? (selectedType === 'expense' ? 'Editar Gasto' : 'Editar Ingreso')
            : (transactionType === 'expense' ? 'Nuevo Gasto' : 'Nuevo Ingreso')
          }
        </Text>

        {/* SELECTOR DE TIPO DE TRANSACCIÓN */}
        {!isEditing && (
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActive]}
              onPress={() => handleTypeChange('expense')}
            >
              <Ionicons 
                name="trending-down" 
                size={20} 
                color={transactionType === 'expense' ? '#FFF' : theme.colors.error} 
              />
              <Text style={[
                styles.typeButtonText,
                transactionType === 'expense' && styles.typeButtonTextActive
              ]}>Gasto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActive]}
              onPress={() => handleTypeChange('income')}
            >
              <Ionicons 
                name="trending-up" 
                size={20} 
                color={transactionType === 'income' ? '#FFF' : theme.colors.success} 
              />
              <Text style={[
                styles.typeButtonText,
                transactionType === 'income' && styles.typeButtonTextActive
              ]}>Ingreso</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* INPUT: MONTO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Monto (€)</Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                autoFocus={!isEditing}
              />
            )}
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}
        </View>

        {/* INPUT: NOTA */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nota (Opcional)</Text>
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Ej: Cena..."
                placeholderTextColor={theme.colors.textSecondary}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.note && <Text style={styles.errorText}>{errors.note.message}</Text>}
        </View>

        {/* NUEVO: SELECTOR DE CATEGORÍA VISUAL */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoryGrid}>
            {availableCategories.map((cat) => {
              const { icon, color } = getCategoryConfig(cat);
              const isSelected = selectedCategory === cat;

              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    isSelected && { backgroundColor: color, borderColor: color }
                  ]}
                  onPress={() => setValue('category', cat)}
                >
                  <Ionicons 
                    name={icon as any} 
                    size={24} 
                    color={isSelected ? '#FFF' : color}
                  />
                  <Text style={[
                    styles.categoryText,
                    isSelected && { color: '#FFF', fontWeight: 'bold' }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitText}>
            {isEditing 
              ? (selectedType === 'expense' ? 'Actualizar Gasto' : 'Actualizar Ingreso')
              : (transactionType === 'expense' ? 'Guardar Gasto' : 'Guardar Ingreso')
            }
          </Text>
        </TouchableOpacity>
        
        {/* Espacio extra abajo para que no se pegue al borde en pantallas pequeñas */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: theme.fontSize.xl, color: theme.colors.textPrimary, fontWeight: 'bold', marginVertical: theme.spacing.l, textAlign: 'center' },
  
  // Estilos para el selector de tipo
  typeContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.m,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  typeButtonText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: theme.fontSize.m,
  },
  typeButtonTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  inputContainer: { marginBottom: theme.spacing.l },
  label: { color: theme.colors.textSecondary, marginBottom: theme.spacing.s, fontWeight: '600' },
  input: { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder, borderWidth: 1, borderRadius: theme.borderRadius.m, padding: theme.spacing.m, color: theme.colors.textPrimary, fontSize: theme.fontSize.l },
  errorText: { color: theme.colors.error, fontSize: theme.fontSize.s, marginTop: 4 },
  submitButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, alignItems: 'center', marginTop: theme.spacing.l },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: theme.fontSize.m },
  
  // Estilos del Grid de Categorías
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.s,
    marginTop: 8,
  }
});