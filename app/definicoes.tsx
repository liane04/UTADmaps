import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
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

  // P-04: feedback de confirmação ao mudar definições. Um pequeno toast animado
  // no topo do ecrã confirma cada alteração — antes destas correcções, o
  // utilizador via o efeito mas não recebia qualquer aviso textual.
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    Animated.timing(toastAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastAnim, { toValue: 0, duration: 240, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setToastMsg(null);
      });
    }, 1600);
  }, [toastAnim]);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const handleAltoContraste = (v: boolean) => {
    setAltoContraste(v);
    showToast(v
      ? tr('Alto contraste activado', 'High contrast on')
      : tr('Alto contraste desactivado', 'High contrast off'));
  };
  const handleTema = (novo: 'claro' | 'escuro') => {
    setTema(novo);
    showToast(novo === 'escuro'
      ? tr('Tema escuro activado', 'Dark theme on')
      : tr('Tema claro activado', 'Light theme on'));
  };
  const handleTamanho = (op: typeof tamanhoTexto) => {
    setTamanhoTexto(op);
    showToast(tr('Tamanho do texto: ', 'Text size: ') + String(op));
  };
  const handleIdioma = (lang: 'pt' | 'en') => {
    setLanguage(lang);
    showToast(lang === 'pt' ? 'Idioma: Português' : 'Language: English');
  };
  const handleRotas = (v: boolean) => {
    setRotasAcessiveis(v);
    showToast(v
      ? tr('Rotas acessíveis activadas', 'Accessible routes on')
      : tr('Rotas acessíveis desactivadas', 'Accessible routes off'));
  };
  const handleLeitor = (v: boolean) => {
    setLeitorEcra(v);
    showToast(v
      ? tr('Suporte a leitor de ecrã activado', 'Screen reader support on')
      : tr('Suporte a leitor de ecrã desactivado', 'Screen reader support off'));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/perfil')}
          accessibilityRole="button"
          accessibilityLabel={t.voltar}
          hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text, fontSize: fs(16) }]}>{t.voltar}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>{t.definicoes}</Text>
        {/* Spacer para centrar o título */}
        <View style={{ width: 80 }} />
      </View>

      {/* Toast de confirmação de alteração de definição (P-04) */}
      {toastMsg && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              backgroundColor: altoContraste ? colors.text : '#1F1F1F',
              opacity: toastAnim,
              transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }],
            },
          ]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite">
          <Ionicons name="checkmark-circle" size={18} color={altoContraste ? colors.bg : '#FFFFFF'} />
          <Text style={[styles.toastText, { color: altoContraste ? colors.bg : '#FFFFFF', fontSize: fs(14) }]}>{toastMsg}</Text>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ACESSIBILIDADE Section */}
        <Text style={[styles.sectionTitle, { color: colors.subtext, fontSize: fs(14) }]}>{t.acessibilidade}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}>
          <View style={[styles.cardRow, { flexDirection: 'column', alignItems: 'stretch', gap: 12 }]}>
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.tamanhoTexto}</Text>
            {/* 5 Pills: Pequeno / Normal / Grande / Extra / Máximo (até 200% — WCAG 1.4.4) */}
            <View style={[styles.pillsGroup, { backgroundColor: altoContraste ? colors.card : colors.inputBg }]}>
              {(['pequeno', 'normal', 'grande', 'extra', 'maximo'] as const).map((op) => {
                const ativo = tamanhoTexto === op;
                // Tamanho real do "A" para refletir a escala
                const pillFontSize =
                  op === 'pequeno' ? 11 :
                  op === 'normal'  ? 14 :
                  op === 'grande'  ? 17 :
                  op === 'extra'   ? 20 :
                  24;
                return (
                  <TouchableOpacity
                    key={op}
                    style={[
                      styles.pill,
                      { backgroundColor: ativo ? colors.primary : 'transparent',
                        borderWidth: altoContraste ? 2 : 0,
                        borderColor: colors.text }
                    ]}
                    onPress={() => handleTamanho(op)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ativo }}
                    accessibilityLabel={
                      op === 'pequeno' ? tr('Pequeno (85%)', 'Small (85%)') :
                      op === 'normal'  ? tr('Normal (100%)', 'Normal (100%)') :
                      op === 'grande'  ? tr('Grande (125%)', 'Large (125%)') :
                      op === 'extra'   ? tr('Extra grande (150%)', 'Extra large (150%)') :
                      tr('Máximo (200%)', 'Maximum (200%)')
                    }>
                    <Text style={[styles.pillText, { color: ativo ? colors.bg : colors.text, fontSize: pillFontSize, fontWeight: ativo ? '700' : '500' }]}>A</Text>
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
              onValueChange={handleAltoContraste}
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
              onValueChange={handleRotas}
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
              onValueChange={handleLeitor}
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
            onPress={() => handleIdioma(language === 'pt' ? 'en' : 'pt')}
            accessibilityRole="button"
            accessibilityLabel={`${t.idioma}: ${language === 'pt' ? 'Português' : 'English'}`}
            accessibilityHint={tr(
              `Toca para alterar o idioma para ${language === 'pt' ? 'Inglês' : 'Português'}`,
              `Tap to change language to ${language === 'pt' ? 'English' : 'Portuguese'}`,
            )}>
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.idioma}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={[styles.rowValue, { color: colors.subtext }]}>{language === 'pt' ? 'Português' : 'English'}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => handleTema(tema === 'claro' ? 'escuro' : 'claro')}
            accessibilityRole="button"
            accessibilityLabel={`${t.tema}: ${tema === 'claro' ? t.claro : t.escuro}`}
            accessibilityHint={tr(
              `Toca para alterar para o tema ${tema === 'claro' ? 'escuro' : 'claro'}`,
              `Tap to change to ${tema === 'claro' ? 'dark' : 'light'} theme`,
            )}>
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
  toast: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toastText: {
    flex: 1,
    fontWeight: '600',
  },
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
  // Pills "A" — 5 níveis de texto (até 200%, WCAG 1.4.4)
  pillsGroup: {
    flexDirection: 'row',
    borderRadius: 22,
    padding: 4,
    gap: 4,
    justifyContent: 'space-between',
  },
  pill: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    color: '#000000',
  },
});
