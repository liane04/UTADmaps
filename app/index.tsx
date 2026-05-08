import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAppStore } from '../store/useAppStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.utadmaps.b-host.me';
const STORAGE_KEY = 'utadmaps_schedule_v2';
const ONBOARDING_KEY = 'utadmaps_onboarding_seen';

/** Devolve para onde ir após login/skip — onboarding se for primeiro acesso. */
async function rotaInicial(): Promise<'/onboarding' | '/(tabs)'> {
  try {
    const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
    return seen ? '/(tabs)' : '/onboarding';
  } catch {
    return '/(tabs)';
  }
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { language, t, setLanguage, tr } = useLanguage();
  const { colors, altoContraste } = useSettings();
  const { setAuth } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed || !password) {
      Alert.alert(
        tr('Campos obrigatórios', 'Required fields'),
        tr('Introduz o email e a password.', 'Enter your email and password.'),
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? tr('Erro de autenticação', 'Authentication error'));

      setAuth(json.user, json.token);

      // Auto-import schedule if a chave was previously saved
      const chave = json.user.user_metadata?.ical_chave;
      if (chave) {
        try {
          const schedRes = await fetch(`${API_URL}/api/schedule/ical/import-url`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${json.token}`,
            },
            body: JSON.stringify({ chave }),
          });
          if (schedRes.ok) {
            const schedJson = await schedRes.json();
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(schedJson.aulas));
          }
        } catch {}
      }

      router.replace(await rotaInicial());
    } catch (e: any) {
      Alert.alert(tr('Erro ao entrar', 'Sign in error'), e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    router.replace(await rotaInicial());
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: colors.subtext }]}>Ü</Text>
            <Ionicons name="compass-outline" size={24} color={colors.subtext} style={styles.logoIcon} />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t.welcome}</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>{t.welcomeSubtitle}</Text>

        <Text style={[styles.label, { color: colors.text }]}>Language</Text>
        <View style={styles.languageToggle}>
          <TouchableOpacity
            style={[styles.languagePill, { 
              backgroundColor: language === 'pt' ? colors.primary : colors.inputBg, 
              borderColor: colors.text, 
              borderWidth: altoContraste ? 2 : 1 
            }]}
            onPress={() => setLanguage('pt')}>
            <Ionicons name={language === 'pt' ? 'radio-button-on' : 'radio-button-off'} size={20} color={language === 'pt' ? colors.bg : colors.subtext} />
            <Text style={[styles.languageText, { color: language === 'pt' ? colors.bg : colors.text }, language === 'pt' && styles.languageTextSelected]}>Português</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.languagePill, { 
              backgroundColor: language === 'en' ? colors.primary : colors.inputBg, 
              borderColor: colors.text, 
              borderWidth: altoContraste ? 2 : 1 
            }]}
            onPress={() => setLanguage('en')}>
            <Ionicons name={language === 'en' ? 'radio-button-on' : 'radio-button-off'} size={20} color={language === 'en' ? colors.bg : colors.subtext} />
            <Text style={[styles.languageText, { color: language === 'en' ? colors.bg : colors.text }, language === 'en' && styles.languageTextSelected]}>English</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: colors.text }]}>{t.emailLabel}</Text>
        <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={t.emailPlaceholder}
            placeholderTextColor={colors.subtext}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
        <View style={[styles.inputContainer, styles.passwordContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, styles.passwordInput, { color: colors.text }]}
            placeholder="••••••"
            placeholderTextColor={colors.subtext}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={loading}>
          {loading
            ? <ActivityIndicator color={colors.bg} size="small" />
            : <Text style={[styles.buttonText, { color: colors.bg }]}>{tr('Entrar', 'Sign In')}</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: colors.text }]}>{t.saltarExplorar}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  logoIcon: {
    position: 'absolute',
    bottom: 5,
    right: -15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  languageToggle: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  languagePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#000000',
  },
  languageTextSelected: {
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeBtn: {
    paddingHorizontal: 14,
  },
  button: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 32,
  },
  skipText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
});
