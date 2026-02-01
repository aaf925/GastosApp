// src/components/SwipeableRow.tsx
import React, { useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface Props {
  children: React.ReactNode;
  onDelete: () => void;
}

export const SwipeableRow = ({ children, onDelete }: Props) => {
  const swipeableRef = useRef<Swipeable>(null);

  // Esta función renderiza lo que se ve al deslizar (el botón rojo)
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    // Animación simple: el botón aparece deslizándose
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          // Cerramos el swipe antes de borrar para evitar glitches visuales
          swipeableRef.current?.close();
          onDelete();
        }}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text style={styles.deleteText}>Borrar</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      // Ajustamos el umbral para que no se dispare con un toque accidental
      friction={2}
      rightThreshold={40}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%', // Ocupa toda la altura disponible
    // Importante: Ajustamos márgenes para que coincida con el ExpenseItem
    marginBottom: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    // Lo movemos un poco a la izquierda para que quede pegado a la tarjeta al deslizar
    marginLeft: 10, 
  },
  deleteText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  }
});