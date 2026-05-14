import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../contexts/LanguageContext';
import { SettingsProvider } from '../contexts/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
    <LanguageProvider>
    <SafeAreaProvider>
      <Head>
        <title>UTAD Maps — Navegação inteligente no campus</title>
      </Head>
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
