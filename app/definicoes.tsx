import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';

export default function DefinicoesScreen() {
  const router = useRouter();
  const { language, t, setLanguage, tr } = useLanguage();
  const {
    tema,
    setTema,
    colors,
    tamanhoTexto,
    setTamanhoTexto,
    fs,
    altoContraste,
    setAltoContraste,
    rotasAcessiveis,
    setRotasAcessiveis,
    leitorEcra,
    setLeitorEcra,
  } = useSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/perfil')}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text, fontSize: fs(16) }]}>{t.voltar}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>{t.definicoes}</Text>
        <View style={{ width: 80 }} /> {/* Spacer to center title */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ACESSIBILIDADE Section */}
        <Text style={[styles.sectionTitle, { color: colors.subtext, fontSize: fs(14) }]}>{t.acessibilidade}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.tamanhoTexto}</Text>
            {/* 3 Pills: Pequeno / Normal / Grande */}
            <View style={[styles.pillsGroup, { backgroundColor: altoContraste ? colors.card : colors.inputBg }]}>
              {(['pequeno', 'normal', 'grande'] as const).map((op) => {
                const ativo = tamanhoTexto === op;
                const label = op === 'pequeno' ? 'A' : op === 'normal' ? 'A' : 'A';
                const pillFontSize = op === 'pequeno' ? 12 : op === 'normal' ? 16 : 20;
                return (
                  <TouchableOpacity
                    key={op}
                    style={[
                      styles.pill, 
                      { backgroundColor: ativo ? colors.primary : 'transparent',
                        borderWidth: altoContraste ? 2 : 0,
                        borderColor: colors.text }
                    ]}
                    onPress={() => setTamanhoTexto(op)}
                  >
                    <Text style={[styles.pillText, { color: ativo ? colors.bg : colors.text, fontSize: pillFontSize, fontWeight: ativo ? '700' : '400' }]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.altoContraste}</Text>
              <Text style={[styles.rowSubtext, { color: colors.subtext }]}>
                {tr('Cores preto/branco para máxima legibilidade', 'Black/white colours for maximum legibility')}
              </Text>
            </View>
            <Switch
              value={altoContraste}
              onValueChange={setAltoContraste}
              trackColor={{ false: '#E5E5EA', true: colors.primary }}
              thumbColor={altoContraste ? colors.bg : '#FFFFFF'}
              ios_backgroundColor="#E5E5EA"
              accessibilityLabel={t.altoContraste}
              accessibilityRole="switch"
              accessibilityState={{ checked: altoContraste }}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.rotasAcessiveis}</Text>
              <Text style={[styles.rowSubtext, { color: colors.subtext }]}>{t.evitarEscadas}</Text>
            </View>
            <Switch
              value={rotasAcessiveis}
              onValueChange={setRotasAcessiveis}
              trackColor={{ false: '#E5E5EA', true: colors.primary }}
              thumbColor={rotasAcessiveis && altoContraste ? colors.bg : '#FFFFFF'}
              ios_backgroundColor="#E5E5EA"
              accessibilityLabel={t.rotasAcessiveis}
              accessibilityRole="switch"
              accessibilityState={{ checked: rotasAcessiveis }}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.leitorEcra}</Text>
              <Text style={[styles.rowSubtext, { color: colors.subtext }]}>
                {tr('Compatível com VoiceOver e TalkBack', 'Compatible with VoiceOver and TalkBack')}
              </Text>
            </View>
            <Switch
              value={leitorEcra}
              onValueChange={setLeitorEcra}
              trackColor={{ false: '#E5E5EA', true: colors.primary }}
              thumbColor={leitorEcra && altoContraste ? colors.bg : '#FFFFFF'}
              ios_backgroundColor="#E5E5EA"
              accessibilityLabel={t.leitorEcra}
              accessibilityRole="switch"
              accessibilityState={{ checked: leitorEcra }}
            />
          </View>
        </View>

        {/* PERSONALIZAÇÃO Section */}
        <Text style={[styles.sectionTitle, { color: colors.subtext, fontSize: fs(14) }]}>{t.personalizacao}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          >
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.idioma}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.subtext }]}>{language === 'pt' ? 'Português' : 'English'}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => setTema(tema === 'claro' ? 'escuro' : 'claro')}
          >
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.tema}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.subtext }]}>{tema === 'claro' ? t.claro : t.escuro}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </View>
          </TouchableOpacity>
        </View>

        {/* SOBRE Section */}
        <Text style={[styles.sectionTitle, { color: colors.subtext, fontSize: fs(14) }]}>{t.sobre}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => router.push('/suporte')}
            accessibilityRole="button"
            accessibilityLabel={t.suporteAjuda}>
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.suporteAjuda}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={[styles.footerText, { color: colors.subtext }]}>UTAD Maps v1.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
    fontSize: 16,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  rowText: {
    fontSize: 16,
    color: '#000000',
  },
  rowSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  rowValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 16,
    marginRight: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 32,
    marginBottom: 32,
  },
  // Pills "A" — 44×44 cumpre WCAG 2.5.5 (Target Size Enhanced AAA)
  pillsGroup: {
    flexDirection: 'row',
    borderRadius: 22,
    padding: 4,
    gap: 4,
  },
  pill: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    color: '#000000',
  },
});
