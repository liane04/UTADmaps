import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

const STORAGE_KEY = 'utadmaps_schedule';
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.utadmaps.b-host.me';

type Aula = {
  disciplina: string;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
  sala: string;
  locationRaw: string;
};

const DIAS = [
  { key: 'segunda', ptCurto: 'Seg', enCurto: 'Mon', ptLongo: 'Segunda-feira', enLongo: 'Monday' },
  { key: 'terca',   ptCurto: 'Ter', enCurto: 'Tue', ptLongo: 'Terça-feira',   enLongo: 'Tuesday' },
  { key: 'quarta',  ptCurto: 'Qua', enCurto: 'Wed', ptLongo: 'Quarta-feira',  enLongo: 'Wednesday' },
  { key: 'quinta',  ptCurto: 'Qui', enCurto: 'Thu', ptLongo: 'Quinta-feira',  enLongo: 'Thursday' },
  { key: 'sexta',   ptCurto: 'Sex', enCurto: 'Fri', ptLongo: 'Sexta-feira',   enLongo: 'Friday' },
  { key: 'sabado',  ptCurto: 'Sáb', enCurto: 'Sat', ptLongo: 'Sábado',       enLongo: 'Saturday' },
];

// Dia de hoje → chave em PT (domingo → segunda por defeito)
const DIA_JS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
function diaHoje(): string {
  const k = DIA_JS[new Date().getDay()];
  return k === 'domingo' ? 'segunda' : k;
}

// Aceita URL completo ou só a chave
function extrairChave(input: string): string {
  const match = input.match(/chave=([a-zA-Z0-9]+)/i);
  return match ? match[1] : input.trim();
}

export default function HorarioScreen() {
  const router = useRouter();
  const { colors, fs } = useSettings();
  const { tr, language } = useLanguage();

  const [diaAtivo, setDiaAtivo] = useState(diaHoje);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [importado, setImportado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [chaveInput, setChaveInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega horário guardado ao montar o ecrã
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as Aula[];
        setAulas(parsed);
        setImportado(true);
      } catch {}
    });
  }, []);

  const diaInfo = DIAS.find((d) => d.key === diaAtivo) ?? DIAS[3];
  const aulasDia = aulas
    .filter((a) => a.diaSemana === diaAtivo)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const importar = useCallback(async () => {
    const chave = extrairChave(chaveInput);
    if (!chave) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/schedule/ical/import-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chave }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? tr('Erro desconhecido', 'Unknown error'));
      const lista = json.aulas as Aula[];
      setAulas(lista);
      setImportado(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
      setModalVisible(false);
      setChaveInput('');
    } catch (e: any) {
      Alert.alert(
        tr('Erro ao importar', 'Import error'),
        e.message ?? tr('Não foi possível importar o horário.', 'Could not import schedule.'),
      );
    } finally {
      setLoading(false);
    }
  }, [chaveInput, tr]);

  const limpar = useCallback(async () => {
    setAulas([]);
    setImportado(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(24) }]}>
          {tr('Horário', 'Schedule')}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.importBtn} accessibilityLabel={tr('Importar horário', 'Import schedule')}>
          <Ionicons name="cloud-upload-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Selector de dias */}
      <View style={styles.daysContainer}>
        {DIAS.map((d) => {
          const isActive = diaAtivo === d.key;
          const label = language === 'pt' ? d.ptCurto : d.enCurto;
          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.dayChip, { backgroundColor: colors.inputBg }, isActive && styles.dayChipActive]}
              onPress={() => setDiaAtivo(d.key)}>
              <Text style={[styles.dayText, { color: colors.text }, isActive && styles.dayTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.dateText}>
        {language === 'pt' ? diaInfo.ptLongo : diaInfo.enLongo}
      </Text>

      {/* Conteúdo principal */}
      {importado ? (
        <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
          {aulasDia.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="checkmark-circle-outline" size={56} color="#D1D1D6" />
              <Text style={[styles.emptyDayText, { color: colors.subtext, fontSize: fs(16) }]}>
                {tr('Sem aulas neste dia', 'No classes this day')}
              </Text>
            </View>
          ) : (
            aulasDia.map((aula, i) => (
              <TouchableOpacity
                key={i}
                style={styles.timelineRow}
                onPress={() => router.push('/navigacao-indoor')}>
                <Text style={styles.timeText}>{aula.horaInicio}</Text>
                <View style={styles.timelineLine} />
                <View style={styles.cardContainer}>
                  <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.cardContent}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.classTitle, { color: colors.text, fontSize: fs(16) }]}>
                          {aula.disciplina}
                        </Text>
                        <Text style={[styles.classLocation, { fontSize: fs(14) }]}>
                          {aula.locationRaw || aula.sala}
                        </Text>
                        <Text style={styles.classTime}>
                          {aula.horaInicio} - {aula.horaFim}
                        </Text>
                      </View>
                      <Ionicons name="navigate-outline" size={20} color="#8E8E93" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        // Estado vazio — sem horário importado
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={72} color="#D1D1D6" style={{ marginBottom: 20 }} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontSize: fs(20) }]}>
            {tr('Sem horário importado', 'No schedule imported')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext, fontSize: fs(14) }]}>
            {tr(
              'Importa o teu horário directamente do Infraestudante usando a tua chave privada.',
              'Import your schedule directly from Infraestudante using your private key.',
            )}
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={() => setModalVisible(true)}>
            <Ionicons name="cloud-upload-outline" size={20} color={colors.bg} style={{ marginRight: 8 }} />
            <Text style={[styles.emptyButtonText, { color: colors.bg, fontSize: fs(16) }]}>
              {tr('Importar Horário', 'Import Schedule')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de importação */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>

            {/* Handle de arrasto */}
            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

            <Text style={[styles.modalTitle, { color: colors.text, fontSize: fs(20) }]}>
              {tr('Importar Horário', 'Import Schedule')}
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.subtext, fontSize: fs(14) }]}>
              {tr(
                'Cola o link privado do Infraestudante ou só a chave alfanumérica.',
                'Paste your private Infraestudante link or just the alphanumeric key.',
              )}
            </Text>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.inputBg, color: colors.text, fontSize: fs(14) }]}
              value={chaveInput}
              onChangeText={setChaveInput}
              placeholder={tr(
                'https://inforestudante.utad.pt/...?chave=...',
                'https://inforestudante.utad.pt/...?chave=...',
              )}
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalCancel, { backgroundColor: colors.inputBg }]}
                onPress={() => { setModalVisible(false); setChaveInput(''); }}>
                <Text style={[styles.modalCancelText, { color: colors.text, fontSize: fs(16) }]}>
                  {tr('Cancelar', 'Cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirm,
                  { backgroundColor: colors.primary, opacity: loading || !chaveInput.trim() ? 0.5 : 1 },
                ]}
                onPress={importar}
                disabled={loading || !chaveInput.trim()}>
                {loading
                  ? <ActivityIndicator color={colors.bg} size="small" />
                  : <Text style={[styles.modalConfirmText, { color: colors.bg, fontSize: fs(16) }]}>
                      {tr('Importar', 'Import')}
                    </Text>}
              </TouchableOpacity>
            </View>

            {importado && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => { limpar(); setModalVisible(false); }}>
                <Text style={styles.clearText}>{tr('Limpar horário guardado', 'Clear saved schedule')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  importBtn: {
    padding: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dayChipActive: {
    backgroundColor: '#2C2C2E',
  },
  dayText: {
    fontSize: 14,
    color: '#000000',
  },
  dayTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  // Timeline (horário real)
  timelineContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeText: {
    width: 50,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 16,
  },
  timelineLine: {
    width: 1,
    backgroundColor: '#D1D1D6',
    marginHorizontal: 12,
    marginTop: 20,
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: '#005C7A',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  classLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  classTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  // Dia vazio (sem aulas no dia selecionado)
  emptyDay: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyDayText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  // Estado sem horário importado
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirm: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clearButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#FF3B30',
  },
});
