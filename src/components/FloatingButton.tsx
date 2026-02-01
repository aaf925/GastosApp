// src/components/FloatingButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface Props {
  onPress: () => void;
}

export const FloatingButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress} 
      activeOpacity={0.8} // Efecto visual al tocar
    >
      <Ionicons name="add" size={32} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute', // Flota sobre todo lo demás
    bottom: theme.spacing.xl, // Distancia desde abajo
    right: theme.spacing.l,   // Distancia desde la derecha
    width: 60,
    height: 60,
    borderRadius: 30, // Redondo perfecto
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra potente para que parezca que levita (Glow effect)
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, // Más intenso
    shadowRadius: 8,
    elevation: 8, // Sombra en Android
  },
});