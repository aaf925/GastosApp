// src/components/ScreenLayout.tsx
import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface Props {
  children: React.ReactNode;
}

export const ScreenLayout = ({ children }: Props) => {
  return (
    // El gradiente cubre TODA la pantalla
    <LinearGradient
      colors={theme.colors.backgroundGradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      {/* SafeAreaView asegura que no escribamos sobre el notch del iPhone o la cámara */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.m, // Margen general para toda la app
  },
});