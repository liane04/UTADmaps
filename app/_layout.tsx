import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="navigacao-outdoor" />
        <Stack.Screen name="navigacao-indoor" />
        <Stack.Screen name="definicoes" />
      </Stack>
    </SafeAreaProvider>
  );
}
