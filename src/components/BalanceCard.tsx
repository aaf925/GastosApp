// src/components/BalanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // <--- IMPORTANTE

interface Props {
  total: number;
}

export const BalanceCard = ({ total }: Props) => {
  return (
    // Usamos LinearGradient como contenedor principal de la tarjeta
    <LinearGradient
      // Un gradiente sutil de azul oscuro a un tono un poco más claro
      colors={['#2A2D3E', '#212435']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.label}>Balance Total</Text>
        <Ionicons name="wallet-outline" size={20} color={theme.colors.accent} />
      </View>
      
      <Text style={styles.amount}>
        {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.badge}>
          <Ionicons name="trending-up" size={14} color="#4CC9F0" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>+2.4% vs mes anterior</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24, // Bordes más redondeados
    padding: 24,
    marginTop: 20,
    // Borde muy sutil para definir la tarjeta
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    // Sombra suave y difusa (ahora se verá mejor al ser la tarjeta sólida)
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
    color: '#94A3B8', // Gris azulado elegante
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase', // Hace que se vea más técnico
    letterSpacing: 1,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 42, // Más grande
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -1.5, // Números juntos = moderno
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 201, 240, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: '#4CC9F0',
    fontSize: 12,
    fontWeight: '600',
  }
});