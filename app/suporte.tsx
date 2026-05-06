import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

type Pergunta = { q: { pt: string; en: string }; a: { pt: string; en: string } };

const FAQ: Pergunta[] = [
  {
    q: {
      pt: 'Como importo o meu horário do Inforestudante?',
      en: 'How do I import my schedule from Inforestudante?',
    },
    a: {
      pt: 'No separador "Horário", toca no ícone de nuvem ☁ no canto superior direito e cola a chave alfanumérica do teu calendário Inforestudante. A chave fica guardada na tua conta para futuros logins.',
      en: 'In the "Schedule" tab, tap the cloud icon ☁ at the top right and paste your Inforestudante calendar key. The key is saved to your account for future logins.',
    },
  },
  {
    q: {
      pt: 'Onde encontro a chave do Infraestudante?',
      en: 'Where do I find the Inforestudante key?',
    },
    a: {
      pt: 'Inicia sessão em inforestudante.utad.pt → "Sincronização de Horário" (ou "Calendário") → copia o URL ou apenas a parte alfanumérica depois de "chave=".',
      en: 'Sign in at inforestudante.utad.pt → "Schedule Sync" (or "Calendar") → copy the URL or just the alphanumeric part after "chave=".',
    },
  },
  {
    q: {
      pt: 'Como adiciono um local aos favoritos?',
      en: 'How do I add a place to favourites?',
    },
    a: {
      pt: 'No separador "Pesquisa", toca no ícone ♡ ao lado de qualquer resultado. Os favoritos ficam disponíveis no separador próprio e sincronizam entre dispositivos quando estás autenticado.',
      en: 'In the "Search" tab, tap the ♡ icon next to any result. Favourites appear in their own tab and sync across devices when you are signed in.',
    },
  },
  {
    q: {
      pt: 'A localização não é precisa. Porquê?',
      en: 'My location is inaccurate. Why?',
    },
    a: {
      pt: 'O sinal GPS não penetra no interior dos edifícios. Para navegação outdoor, certifica-te que estás ao ar livre e que deste permissão de localização à app.',
      en: 'GPS signal does not penetrate buildings. For outdoor navigation, make sure you are outside and that you granted location permission to the app.',
    },
  },
  {
    q: {
      pt: 'Posso usar a app sem fazer login?',
      en: 'Can I use the app without signing in?',
    },
    a: {
      pt: 'Sim, basta tocar em "Saltar e explorar" no ecrã de boas-vindas. Não terás horário sincronizado nem favoritos guardados na conta, mas todas as outras funcionalidades estão disponíveis.',
      en: 'Yes — tap "Skip and explore" on the welcome screen. You will not have schedule sync or favourites saved to the account, but all other features are available.',
    },
  },
  {
    q: {
      pt: 'Como ativo o alto contraste?',
      en: 'How do I enable high contrast?',
    },
    a: {
      pt: 'Em Definições → Acessibilidade → Alto Contraste. As cores passam para preto e branco com contraste máximo (rácio > 21:1).',
      en: 'In Settings → Accessibility → High Contrast. Colours switch to pure black/white with maximum contrast (ratio > 21:1).',
    },
  },
];

const REPORT_EMAIL = 'utadmaps@alunos.utad.pt';

export default function SuporteScreen() {
  const router = useRouter();
  const { colors, fs, altoContraste } = useSettings();
  const { tr, language } = useLanguage();

  const [expanded, setExpanded] = useState<number | null>(null);

  const reportarErro = async () => {
    const subject = encodeURIComponent(tr('Reportar erro UTAD Maps', 'UTAD Maps bug report'));
    const body = encodeURIComponent(
      tr(
        'Descreve o problema que encontraste:\n\n\n— Ecrã onde aconteceu:\n— Passos para reproduzir:\n— Resultado esperado:\n',
        'Describe the issue you found:\n\n\n— Screen where it happened:\n— Steps to reproduce:\n— Expected result:\n',
      ),
    );
    const url = `mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`;
    try {
      await Linking.openURL(url);
    } catch {
      // fallback silencioso
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderWidth: altoContraste ? 2 : 0,
      borderColor: colors.border,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/definicoes'))}
          accessibilityRole="button"
          accessibilityLabel={tr('Voltar', 'Back')}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text, fontSize: fs(16) }]}>
            {tr('Voltar', 'Back')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>
          {tr('Suporte e Ajuda', 'Support and Help')}
        </Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* FAQ */}
        <Text style={[styles.sectionTitle, { color: colors.subtext, fontSize: fs(14) }]}>
          {tr('PERGUNTAS FREQUENTES', 'FREQUENTLY ASKED QUESTIONS')}
        </Text>
        <View style={cardStyle}>
          {FAQ.map((item, i) => {
            const open = expanded === i;
            return (
              <View key={i}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}
                <TouchableOpacity
                  style={styles.faqRow}
                  onPress={() => setExpanded(open ? null : i)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  accessibilityLabel={item.q[language]}>
                  <Text
                    style={[styles.faqQuestion, { color: colors.text, fontSize: fs(15) }]}
                    numberOfLines={open ? undefined : 2}>
                    {item.q[language]}
                  </Text>
                  <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.subtext}
                  />
                </TouchableOpacity>
                {open && (
                  <Text style={[styles.faqAnswer, { color: colors.subtext, fontSize: fs(14) }]}>
                    {item.a[language]}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Contacto */}
        <Text style={[styles.sectionTitle, { color: colors.subtext, fontSize: fs(14) }]}>
          {tr('CONTACTO', 'CONTACT')}
        </Text>
        <View style={cardStyle}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={reportarErro}
            accessibilityRole="button"
            accessibilityLabel={tr('Reportar erro por email', 'Report bug via email')}>
            <Ionicons name="mail-outline" size={22} color={colors.text} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actionTitle, { color: colors.text, fontSize: fs(16) }]}>
                {tr('Reportar erro', 'Report a bug')}
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.subtext, fontSize: fs(13) }]}>
                {REPORT_EMAIL}
              </Text>
            </View>
            <Ionicons name="open-outline" size={18} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Sobre */}
        <Text style={[styles.sectionTitle, { color: colors.subtext, fontSize: fs(14) }]}>
          {tr('SOBRE', 'ABOUT')}
        </Text>
        <View style={cardStyle}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text, fontSize: fs(15) }]}>
              {tr('Versão', 'Version')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.subtext, fontSize: fs(15) }]}>
              UTAD Maps v1.0
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text, fontSize: fs(15) }]}>
              {tr('Plataforma', 'Platform')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.subtext, fontSize: fs(15) }]}>
              {Platform.OS === 'web' ? 'Web' : Platform.OS === 'ios' ? 'iOS' : 'Android'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text, fontSize: fs(15) }]}>
              {tr('Disciplina', 'Course')}
            </Text>
            <Text style={[styles.infoValue, { color: colors.subtext, fontSize: fs(15) }]}>
              IPC 2025/2026
            </Text>
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.subtext, fontSize: fs(12) }]}>
          {tr(
            'Desenvolvido para a Universidade de Trás-os-Montes e Alto Douro.',
            'Developed for the University of Trás-os-Montes and Alto Douro.',
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  backText: {
    marginLeft: 4,
  },
  headerTitle: {
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontWeight: '500',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  actionTitle: {
    fontWeight: '500',
  },
  actionSubtitle: {
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoValue: {
    fontWeight: '400',
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
  },
});
