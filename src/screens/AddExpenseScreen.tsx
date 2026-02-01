// src/screens/AddExpenseScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Importamos Iconos
import { RootStackParamList } from '../types/navigation';
import { ScreenLayout } from '../components/ScreenLayout';
import { theme } from '../theme';
import { useExpenseStore } from '../store/useExpenseStore';
import { CATEGORIES, getCategoryConfig } from '../utils/categoryMap'; // Importamos la lista y la config

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

const expenseSchema = z.object({
  amount: z.string().min(1, "Ingresa un monto"),
  note: z.string().max(50, "Máximo 50 caracteres").optional(),
  category: z.enum(['Comida', 'Transporte', 'Ocio', 'Salud', 'Hogar', 'Otros'] as const),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export const AddExpenseScreen = ({ navigation, route }: Props) => {
  const { addExpense, updateExpense } = useExpenseStore();
  const expenseToEdit = route.params?.expense;
  const isEditing = !!expenseToEdit;

  // Añadimos 'watch' y 'setValue' para manejar la selección manual de botones
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: '',
      note: '',
      category: 'Comida', // Valor inicial
    }
  });

  // Observamos el valor actual de 'category' para iluminar el botón correcto
  const selectedCategory = watch('category');

  useEffect(() => {
    if (expenseToEdit) {
      setValue('amount', expenseToEdit.amount.toString());
      setValue('note', expenseToEdit.note || '');
      setValue('category', expenseToEdit.category);
      navigation.setOptions({ title: 'Editar Gasto' });
    }
  }, [expenseToEdit]);

  const onSubmit = (data: ExpenseFormData) => {
    const numericAmount = parseFloat(data.amount.replace(',', '.'));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "El monto debe ser válido");
      return;
    }

    if (isEditing) {
      updateExpense(expenseToEdit.id, {
        amount: numericAmount,
        note: data.note || '',
        category: data.category,
        date: expenseToEdit.date,
      });
    } else {
      addExpense({
        amount: numericAmount,
        note: data.note || '',
        category: data.category,
        date: new Date(),
      });
    }
    navigation.goBack();
  };

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}
        </Text>

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
            {CATEGORIES.map((cat) => {
              const { icon, color } = getCategoryConfig(cat);
              const isSelected = selectedCategory === cat;

              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    isSelected && { backgroundColor: color, borderColor: color } // Si está seleccionado, se pinta
                  ]}
                  onPress={() => setValue('category', cat)} // Al tocar, cambiamos el valor del formulario
                >
                  {/* Icono */}
                  <Ionicons 
                    name={icon as any} 
                    size={24} 
                    color={isSelected ? '#FFF' : color} // Blanco si está seleccionado, color original si no
                  />
                  {/* Texto */}
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
            {isEditing ? 'Actualizar Gasto' : 'Guardar Gasto'}
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
  inputContainer: { marginBottom: theme.spacing.l },
  label: { color: theme.colors.textSecondary, marginBottom: theme.spacing.s, fontWeight: '600' },
  input: { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder, borderWidth: 1, borderRadius: theme.borderRadius.m, padding: theme.spacing.m, color: theme.colors.textPrimary, fontSize: theme.fontSize.l },
  errorText: { color: theme.colors.error, fontSize: theme.fontSize.s, marginTop: 4 },
  submitButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, alignItems: 'center', marginTop: theme.spacing.l },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: theme.fontSize.m },
  
  // Estilos del Grid de Categorías
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los botones bajen a la siguiente línea
    justifyContent: 'space-between',
    gap: 10, // Espacio entre botones (si usas Expo SDK nuevo)
  },
  categoryButton: {
    width: '30%', // Aproximadamente 3 por fila
    aspectRatio: 1, // Cuadrado perfecto
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