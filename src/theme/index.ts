// src/theme/index.ts
export const theme = {
  colors: {
    // Gradiente de fondo (Oscuro y elegante)
    backgroundGradient: ['#1A1A2E', '#16213E', '#0F3460'] as const,
    
    // Colores principales
    primary: '#E94560',     // Un rojo rosado para acciones principales (Floating Button)
    accent: '#4CC9F0',      // Cyan para detalles positivos
    textPrimary: '#FFFFFF', // Blanco puro para títulos
    textSecondary: '#94A3B8', // Gris azulado para subtítulos
    
    // Tarjetas
    cardBackground: 'rgba(255, 255, 255, 0.08)', // Semi-transparente (Glassmorphism)
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    
    // Estados
    success: '#00B894',
    error: '#FF7675',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    m: 16,
    l: 24,
    round: 100,
  },
  fontSize: {
    s: 12,
    m: 16,
    l: 20,
    xl: 32, // Para el saldo gigante
  }
};