import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';

export default function DefinicoesScreen() {
  const router = useRouter();
  const { language, t, setLanguage } = useLanguage();
  const { 
    tema, setTema, 
    colors, 
    tamanhoTexto, setTamanhoTexto, 
    fs,
    altoContraste, setAltoContraste,
    rotasAcessiveis, setRotasAcessiveis,
    leitorEcra, setLeitorEcra
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
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.altoContraste}</Text>
            <Switch
              value={altoContraste}
              onValueChange={setAltoContraste}
              trackColor={{ false: altoContraste ? '#767577' : '#E5E5EA', true: colors.primary }}
              thumbColor={altoContraste ? colors.bg : '#FFFFFF'}
              activeThumbColor={altoContraste ? colors.bg : '#FFFFFF'}
              ios_backgroundColor="#E5E5EA"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.cardRow}>
            <View>
              <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.rotasAcessiveis}</Text>
              <Text style={[styles.rowSubtext, { color: colors.subtext }]}>{t.evitarEscadas}</Text>
            </View>
            <Switch
              value={rotasAcessiveis}
              onValueChange={setRotasAcessiveis}
              trackColor={{ false: altoContraste ? '#767577' : '#E5E5EA', true: colors.primary }}
              thumbColor={altoContraste ? colors.bg : '#FFFFFF'}
              activeThumbColor={altoContraste ? colors.bg : '#FFFFFF'}
              ios_backgroundColor="#E5E5EA"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.cardRow}>
            <Text style={[styles.rowText, { color: colors.text, fontSize: fs(16) }]}>{t.leitorEcra}</Text>
            <Switch
              value={leitorEcra}
              onValueChange={setLeitorEcra}
              trackColor={{ false: altoContraste ? '#767577' : '#E5E5EA', true: colors.primary }}
              thumbColor={altoContraste ? colors.bg : '#FFFFFF'}
              activeThumbColor={altoContraste ? colors.bg : '#FFFFFF'}
              ios_backgroundColor="#E5E5EA"
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
          >
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
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 16,
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
    color: '#8E8E93',
    marginTop: 2,
  },
  rowValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C7C7CC',
    marginLeft: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 32,
    marginBottom: 32,
  },
  // Pills "A"
  pillsGroup: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  pill: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    color: '#000000',
  },
});
