// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// 👇 1. IMPORTAR ESTO
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/navigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddExpenseScreen } from './src/screens/AddExpenseScreen';
import { StatsScreen } from './src/screens/StatsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // 👇 2. ENVOLVER TODO CON GestureHandlerRootView (style flex: 1 es importante)
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen 
              name="AddExpense" 
              component={AddExpenseScreen} 
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="Stats" component={StatsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}