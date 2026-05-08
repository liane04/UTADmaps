import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

export const ONBOARDING_KEY = 'utadmaps_onboarding_seen';

type Slide = {
  icon: keyof typeof import('@expo/vector-icons/build/Ionicons').default.glyphMap;
  iconColor: string;
  title: { pt: string; en: string };
  body: { pt: string; en: string };
};

const SLIDES: Slide[] = [
  {
    icon: 'map-outline',
    iconColor: '#2563EB',
    title: { pt: 'Encontra qualquer sala', en: 'Find any room' },
    body: {
      pt: 'Pesquisa pelo código (F0.01, E2.10) ou pelo nome do edifício e abre a navegação directa até à porta certa.',
      en: 'Search by code (F0.01, E2.10) or building name and navigate directly to the right door.',
    },
  },
  {
    icon: 'calendar-outline',
    iconColor: '#EA580C',
    title: { pt: 'Horário sempre à mão', en: 'Schedule at your fingertips' },
    body: {
      pt: 'Importa o calendário do Inforestudante uma vez. A app avisa-te quando a próxima aula está prestes a começar.',
      en: 'Import your Inforestudante calendar once. The app alerts you when your next class is about to start.',
    },
  },
  {
    icon: 'accessibility-outline',
    iconColor: '#16A34A',
    title: { pt: 'Inclusivo por design', en: 'Inclusive by design' },
    body: {
      pt: 'Alto contraste, tamanho de texto ajustável, suporte para leitor de ecrã e tradução PT/EN. Em Definições.',
      en: 'High contrast, adjustable text size, screen-reader support and PT/EN translation. In Settings.',
    },
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, fs } = useSettings();
  const { tr, language } = useLanguage();
  const [page, setPage] = useState(0);

  const finalizar = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      // ignora
    }
    router.replace('/(tabs)');
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const w = e.nativeEvent.layoutMeasurement.width;
    setPage(Math.round(x / w));
  };

  const ultimo = page === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Skip no canto sup direito */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={finalizar}
          style={styles.skipBtn}
          accessibilityRole="button"
          accessibilityLabel={tr('Saltar tutorial', 'Skip tutorial')}>
          <Text style={[styles.skipText, { color: colors.subtext, fontSize: fs(15) }]}>
            {tr('Saltar', 'Skip')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides em scroll horizontal paginado */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scroll}>
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={[styles.iconCircle, { backgroundColor: s.iconColor + '22' }]}>
              <Ionicons name={s.icon} size={64} color={s.iconColor} />
            </View>
            <Text style={[styles.title, { color: colors.text, fontSize: fs(26) }]}>
              {s.title[language]}
            </Text>
            <Text style={[styles.body, { color: colors.subtext, fontSize: fs(16) }]}>
              {s.body[language]}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Indicador de páginas */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === page ? colors.primary : colors.border },
              i === page && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Botão acção */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={finalizar}
          accessibilityRole="button">
          <Text style={[styles.buttonText, { color: colors.bg, fontSize: fs(16) }]}>
            {ultimo ? tr('Começar', 'Get started') : tr('Saltar tutorial', 'Skip tutorial')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    minWidth: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipText: {
    fontWeight: '500',
  },
  scroll: {
    flexGrow: 0,
  },
  slide: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
  },
});
