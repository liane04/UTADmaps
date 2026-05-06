import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../contexts/LanguageContext';
import { SettingsProvider } from '../contexts/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
    <LanguageProvider>
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="indoor-3d" />
        <Stack.Screen name="navigacao-outdoor" />
        <Stack.Screen name="navigacao-indoor" />
        <Stack.Screen name="definicoes" />
      </Stack>
    </SafeAreaProvider>
    </LanguageProvider>
    </SettingsProvider>
  );
}
