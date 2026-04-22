import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';

export default function DefinicoesScreen() {
  const router = useRouter();
  const { language, t, setLanguage } = useLanguage();
  const { tema, setTema, colors } = useSettings();

  const [altoContraste, setAltoContraste] = useState(false);
  const [rotasAcessiveis, setRotasAcessiveis] = useState(true);
  const [leitorEcra, setLeitorEcra] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/perfil')}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>{t.voltar}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t.definicoes}</Text>
        <View style={{ width: 80 }} /> {/* Spacer to center title */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ACESSIBILIDADE Section */}
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>{t.acessibilidade}</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardRow}>
            <Text style={[styles.rowText, { color: colors.text }]}>{t.tamanhoTexto}</Text>
            {/* Visual Slider */}
            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderTextSmall, { color: colors.subtext }]}>A</Text>
              <View style={[styles.sliderTrack, { backgroundColor: colors.border }]}>
                <View style={[styles.sliderFill, { backgroundColor: colors.text }]} />
                <View style={styles.sliderThumb} />
              </View>
              <Text style={[styles.sliderTextLarge, { color: colors.text }]}>A</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <View style={styles.cardRow}>
            <Text style={[styles.rowText, { color: colors.text }]}>{t.altoContraste}</Text>
            <Switch
              value={altoContraste}
              onValueChange={setAltoContraste}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              ios_backgroundColor="#E5E5EA"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.cardRow}>
            <View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t.rotasAcessiveis}</Text>
              <Text style={styles.rowSubtext}>{t.evitarEscadas}</Text>
            </View>
            <Switch
              value={rotasAcessiveis}
              onValueChange={setRotasAcessiveis}
              trackColor={{ false: '#E5E5EA', true: '#2C2C2E' }}
              ios_backgroundColor="#E5E5EA"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.cardRow}>
            <Text style={[styles.rowText, { color: colors.text }]}>{t.leitorEcra}</Text>
            <Switch
              value={leitorEcra}
              onValueChange={setLeitorEcra}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              ios_backgroundColor="#E5E5EA"
            />
          </View>
        </View>

        {/* PERSONALIZAÇÃO Section */}
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>{t.personalizacao}</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          >
            <Text style={[styles.rowText, { color: colors.text }]}>{t.idioma}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={styles.rowValue}>{language === 'pt' ? 'Português' : 'English'}</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => setTema(tema === 'claro' ? 'escuro' : 'claro')}
          >
            <Text style={[styles.rowText, { color: colors.text }]}>{t.tema}</Text>
            <View style={styles.rowValueContainer}>
              <Text style={styles.rowValue}>{tema === 'claro' ? t.claro : t.escuro}</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* SOBRE Section */}
        <Text style={[styles.sectionTitle, { color: colors.subtext }]}>{t.sobre}</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.cardRow}>
            <Text style={[styles.rowText, { color: colors.text }]}>{t.suporteAjuda}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
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
  // Slider styles
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
  },
  sliderTextSmall: {
    fontSize: 14,
    color: '#000000',
    marginRight: 8,
  },
  sliderTextLarge: {
    fontSize: 18,
    color: '#000000',
    marginLeft: 8,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    width: '60%',
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    left: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
