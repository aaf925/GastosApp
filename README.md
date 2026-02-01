# 💰 GastosApp

Una aplicación móvil completa para la gestión de gastos personales desarrollada con React Native y Expo. Permite a los usuarios llevar un control detallado de sus finanzas con categorización automática, estadísticas visuales y una interfaz intuitiva.

## 📱 Características

- **Gestión de Gastos**: Añade, edita y elimina gastos con facilidad
- **Categorización**: Organiza gastos por categorías (Comida, Transporte, Ocio, Salud, Hogar, Otros)
- **Estadísticas Visuales**: Gráficos interactivos para visualizar patrones de gasto
- **Persistencia Local**: Los datos se guardan automáticamente en el dispositivo
- **Interfaz Intuitiva**: Gestos táctiles para eliminar elementos con deslizamiento
- **Formularios Validados**: Validación robusta con Zod y React Hook Form

## 🚀 Tecnologías

- **React Native** 0.81.5 - Framework móvil multiplataforma
- **Expo** ~54.0 - Plataforma de desarrollo y despliegue
- **TypeScript** - Tipado estático para mayor robustez
- **Zustand** - Gestión de estado global ligera y eficiente
- **React Navigation** - Navegación entre pantallas
- **React Hook Form + Zod** - Formularios y validación
- **AsyncStorage** - Persistencia de datos local
- **React Native Gifted Charts** - Visualización de datos
- **React Native Gesture Handler** - Gestos táctiles avanzados

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app en tu móvil (opcional para testing)

### Pasos
1. Clona el repositorio:
```bash
git clone https://github.com/aaf925/GastosApp.git
cd GastosApp
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Escanea el código QR con Expo Go (móvil) o presiona `a` para Android/`i` para iOS simulator.

## 📱 Uso

### Pantalla Principal
- Visualiza tu balance total y lista de gastos recientes
- Desliza hacia la izquierda en cualquier gasto para eliminarlo
- Usa el botón flotante "+" para añadir nuevos gastos

### Añadir Gastos
- Completa el formulario con cantidad, categoría y notas opcionales
- La validación en tiempo real asegura datos correctos
- Los gastos se guardan automáticamente

### Estadísticas
- Accede a gráficos detallados de tus patrones de gasto
- Visualiza distribución por categorías
- Analiza tendencias temporales

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes reutilizables
│   ├── BalanceCard.tsx  # Tarjeta de balance total
│   ├── ExpenseItem.tsx  # Item individual de gasto
│   ├── FloatingButton.tsx # Botón flotante de acción
│   └── SwipeableRow.tsx # Componente con gesto de deslizamiento
├── screens/            # Pantallas principales
│   ├── HomeScreen.tsx   # Pantalla principal
│   ├── AddExpenseScreen.tsx # Formulario de gastos
│   └── StatsScreen.tsx  # Estadísticas y gráficos
├── store/              # Gestión de estado
│   └── useExpenseStore.ts # Store principal con Zustand
├── types/              # Definiciones TypeScript
│   ├── expense.ts      # Tipos de gastos y categorías
│   └── navigation.ts   # Tipos de navegación
├── theme/              # Sistema de diseño
└── utils/              # Utilidades y helpers
```

## 🎨 Diseño

La aplicación utiliza un sistema de diseño consistente con:
- **Colores**: Paleta moderna con gradientes y modo oscuro
- **Tipografía**: Jerarquía clara con diferentes pesos
- **Componentes**: Reutilizables y modulares
- **Animaciones**: Transiciones suaves y feedback visual

## 📊 Funcionalidades Clave

### Gestión de Estado
- **Zustand** para estado global reactivo
- **Persistencia automática** con AsyncStorage
- **Tipado fuerte** con TypeScript

### Validación de Datos
- **Esquemas Zod** para validación robusta
- **React Hook Form** para formularios eficientes
- **Feedback visual** de errores en tiempo real

### Experiencia de Usuario
- **Gestos táctiles** para acciones rápidas
- **Feedback háptico** en interacciones
- **Loading states** y transiciones suaves

## 🔮 Futuras Mejoras

- [ ] Autenticación de usuarios
- [ ] Sincronización en la nube
- [ ] Categorías personalizadas
- [ ] Presupuestos y límites de gasto
- [ ] Exportación de datos (CSV, PDF)
- [ ] Notificaciones push para recordatorios
- [ ] Modo offline completo
- [ ] Soporte para múltiples monedas

## 👤 Autor

**Alejandro Avilés Fernández**
- GitHub: [@aaf925](https://github.com/aaf925)
- LinkedIn: [Alejandro Avilés Fernández](https://www.linkedin.com/in/alejandro-avilés-fernández-245a6a338)
- Email: aavils200590@gmail.com

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

⭐ **¡Dale una estrella si te gusta el proyecto!**