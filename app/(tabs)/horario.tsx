import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useAppStore } from '../../store/useAppStore';

const STORAGE_KEY = 'utadmaps_schedule_v2';
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.utadmaps.b-host.me';

type Aula = {
  disciplina: string;
  data: string;       // 'YYYY-MM-DD'
  diaSemana: string;  // 'segunda' | 'terca' | ...
  horaInicio: string;
  horaFim: string;
  sala: string;
  locationRaw: string;
};

const DIAS = [
  { key: 'segunda', ptCurto: 'Seg', enCurto: 'Mon' },
  { key: 'terca',   ptCurto: 'Ter', enCurto: 'Tue' },
  { key: 'quarta',  ptCurto: 'Qua', enCurto: 'Wed' },
  { key: 'quinta',  ptCurto: 'Qui', enCurto: 'Thu' },
  { key: 'sexta',   ptCurto: 'Sex', enCurto: 'Fri' },
  { key: 'sabado',  ptCurto: 'Sáb', enCurto: 'Sat' },
];

const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MESES_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DIAS_LONG_PT: Record<string, string> = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
};
const DIAS_LONG_EN: Record<string, string> = {
  segunda: 'Monday',
  terca: 'Tuesday',
  quarta: 'Wednesday',
  quinta: 'Thursday',
  sexta: 'Friday',
  sabado: 'Saturday',
};

const DIA_INDEX: Record<string, number> = {
  segunda: 0, terca: 1, quarta: 2, quinta: 3, sexta: 4, sabado: 5,
};

function dataDoDiaActivo(
  diaAtivo: string,
  inicioSemana: Date,
  language: 'pt' | 'en',
): string {
  const offset = DIA_INDEX[diaAtivo] ?? 0;
  const data = new Date(inicioSemana);
  data.setDate(inicioSemana.getDate() + offset);
  const dias = language === 'pt' ? DIAS_LONG_PT : DIAS_LONG_EN;
  const meses = language === 'pt' ? MESES_PT : MESES_EN;
  return `${dias[diaAtivo]}, ${data.getDate()} ${meses[data.getMonth()]}`;
}

// Segunda-feira da semana à qual pertence `hoje` + offset de semanas
function calcularSemana(offset: number): { inicio: Date; fim: Date } {
  const hoje = new Date();
  const diasAteLundas = hoje.getDay() === 0 ? 6 : hoje.getDay() - 1;
  const seg = new Date(hoje);
  seg.setDate(hoje.getDate() - diasAteLundas + offset * 7);
  seg.setHours(0, 0, 0, 0);
  const sab = new Date(seg);
  sab.setDate(seg.getDate() + 5); // sábado
  sab.setHours(23, 59, 59, 999);
  return { inicio: seg, fim: sab };
}

function labelSemana(inicio: Date, fim: Date, language: string): string {
  const m = language === 'pt' ? MESES_PT : MESES_EN;
  return `${inicio.getDate()} ${m[inicio.getMonth()]} – ${fim.getDate()} ${m[fim.getMonth()]}`;
}

// Dia de hoje → chave DIAS
const DIA_JS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
function diaHoje(): string {
  const k = DIA_JS[new Date().getDay()];
  return k === 'domingo' ? 'segunda' : k;
}

function extrairChave(input: string): string {
  const match = input.match(/chave=([a-zA-Z0-9]+)/i);
  return match ? match[1] : input.trim();
}

// Parsing dos títulos do Inforestudante.
// Formatos comuns: "Aula - CG (PL1) - F2.01"  ·  "CG (T1)"  ·  "Programação Web"
function parsearAula(raw: string): { sigla: string; tipo: string | null; sala: string | null } {
  if (!raw) return { sigla: '', tipo: null, sala: null };
  const semPrefixo = raw.replace(/^Aula\s*[-–—]\s*/i, '').trim();
  // Formato com sala: "<sigla> (<tipo>) - <sala>"
  const m1 = semPrefixo.match(/^(.+?)\s*\(([^)]+)\)\s*[-–—]\s*(.+)$/);
  if (m1) return { sigla: m1[1].trim(), tipo: m1[2].trim(), sala: m1[3].trim() };
  // Formato sem sala: "<sigla> (<tipo>)"
  const m2 = semPrefixo.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m2) return { sigla: m2[1].trim(), tipo: m2[2].trim(), sala: null };
  return { sigla: semPrefixo, tipo: null, sala: null };
}

// Gera blocos "Livre" entre aulas consecutivas com gap >= 60 min
type ItemTimeline =
  | { kind: 'aula'; aula: Aula }
  | { kind: 'livre'; horaInicio: string; horaFim: string };

function montarTimeline(aulasOrdenadas: Aula[]): ItemTimeline[] {
  const out: ItemTimeline[] = [];
  for (let i = 0; i < aulasOrdenadas.length; i++) {
    const a = aulasOrdenadas[i];
    out.push({ kind: 'aula', aula: a });
    const proxima = aulasOrdenadas[i + 1];
    if (!proxima) continue;
    const [h1, m1] = a.horaFim.split(':').map(Number);
    const [h2, m2] = proxima.horaInicio.split(':').map(Number);
    const gap = h2 * 60 + m2 - (h1 * 60 + m1);
    if (gap >= 60) {
      out.push({ kind: 'livre', horaInicio: a.horaFim, horaFim: proxima.horaInicio });
    }
  }
  return out;
}

export default function HorarioScreen() {
  const router = useRouter();
  const { colors, fs, altoContraste } = useSettings();
  const { tr, language } = useLanguage();
  const { token, user } = useAppStore();

  const [diaAtivo, setDiaAtivo] = useState(diaHoje);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [importado, setImportado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [chaveInput, setChaveInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Aula[];
          if (parsed.length > 0 && parsed[0].data) {
            setAulas(parsed);
            setImportado(true);
            return;
          }
        } catch {}
      }
      // No local schedule — auto-import if user has a saved chave
      const chave = user?.user_metadata?.ical_chave;
      if (!chave) return;
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_URL}/api/schedule/ical/import-url`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ chave }),
        });
        if (!res.ok) return;
        const json = await res.json();
        const lista = json.aulas as Aula[];
        setAulas(lista);
        setImportado(true);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
      } catch {}
    });
  }, []);

  const { inicio: inicioSemana, fim: fimSemana } = useMemo(
    () => calcularSemana(semanaOffset),
    [semanaOffset],
  );

  // Aulas da semana seleccionada
  const aulasSemana = useMemo(() =>
    aulas.filter((a) => {
      const d = new Date(`${a.data}T12:00:00`);
      return d >= inicioSemana && d <= fimSemana;
    }),
    [aulas, inicioSemana, fimSemana],
  );

  // Aulas do dia activo dentro dessa semana
  const aulasDia = useMemo(() =>
    aulasSemana
      .filter((a) => a.diaSemana === diaAtivo)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)),
    [aulasSemana, diaAtivo],
  );

  // Timeline com blocos "Livre" intercalados
  const timeline = useMemo(() => montarTimeline(aulasDia), [aulasDia]);

  const importar = useCallback(async () => {
    const chave = extrairChave(chaveInput);
    if (!chave) return;
    setLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/api/schedule/ical/import-url`, {
        method: 'POST',
        headers,
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
      setSemanaOffset(0);
    } catch (e: any) {
      Alert.alert(
        tr('Erro ao importar', 'Import error'),
        e.message ?? tr('Não foi possível importar o horário.', 'Could not import schedule.'),
      );
    } finally {
      setLoading(false);
    }
  }, [chaveInput, token, tr]);

  const limpar = useCallback(async () => {
    setAulas([]);
    setImportado(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(20) }]}>
          {tr('Horário', 'Schedule')}
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.importBtn}
          accessibilityRole="button"
          accessibilityLabel={tr('Importar horário', 'Import schedule')}>
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
              style={[
                styles.dayChip, 
                { backgroundColor: isActive ? colors.primary : colors.inputBg,
                  borderWidth: altoContraste ? 2 : 0, 
                  borderColor: colors.text }
              ]}
              onPress={() => setDiaAtivo(d.key)}>
              <Text style={[
                styles.dayText, 
                { color: isActive ? colors.bg : colors.text, 
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontSize: fs(14)
                }
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Data do dia activo (por extenso) */}
      <Text style={[styles.dataExtenso, { color: colors.text, fontSize: fs(15) }]}>
        {dataDoDiaActivo(diaAtivo, inicioSemana, language)}
      </Text>

      {/* Navegação de semana — discreta */}
      <View style={styles.weekNav}>
        <TouchableOpacity
          onPress={() => setSemanaOffset(o => o - 1)}
          style={styles.weekNavBtn}
          accessibilityRole="button"
          accessibilityLabel={tr('Semana anterior', 'Previous week')}>
          <Ionicons name="chevron-back" size={18} color={colors.subtext} />
        </TouchableOpacity>
        <Text style={[styles.weekLabel, { color: colors.subtext, fontSize: fs(13) }]}>
          {labelSemana(inicioSemana, fimSemana, language)}
        </Text>
        <TouchableOpacity
          onPress={() => setSemanaOffset(o => o + 1)}
          style={styles.weekNavBtn}
          accessibilityRole="button"
          accessibilityLabel={tr('Próxima semana', 'Next week')}>
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {importado ? (
        <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
          {timeline.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="checkmark-circle-outline" size={56} color={colors.subtext} />
              <Text style={[styles.emptyDayText, { color: colors.subtext, fontSize: fs(16) }]}>
                {tr('Sem aulas neste dia', 'No classes this day')}
              </Text>
            </View>
          ) : (
            timeline.map((item, i) => {
              if (item.kind === 'livre') {
                return (
                  <View key={`livre-${i}`} style={styles.timelineRow}>
                    <Text style={[styles.timeText, { color: colors.subtext, fontSize: fs(13) }]}>
                      {item.horaInicio}
                    </Text>
                    <View style={[styles.timelineLine, { backgroundColor: colors.divider }]} />
                    <View style={styles.cardContainer}>
                      <View style={[styles.livreBlock, { borderColor: colors.divider }]}>
                        <Text style={[styles.livreText, { color: colors.subtext, fontSize: fs(14) }]}>
                          {tr('Livre', 'Free')}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }
              const { aula } = item;
              const parsed = parsearAula(aula.disciplina);
              const titulo = parsed.tipo ? `${parsed.sigla} · ${parsed.tipo}` : parsed.sigla;
              const local = aula.sala || parsed.sala || aula.locationRaw;
              return (
                <TouchableOpacity
                  key={`aula-${i}`}
                  style={styles.timelineRow}
                  onPress={() => router.push('/navigacao-indoor')}
                  accessibilityRole="button"
                  accessibilityLabel={tr(
                    `Navegar para ${titulo} em ${local}`,
                    `Navigate to ${titulo} at ${local}`,
                  )}>
                  <Text style={[styles.timeText, { color: colors.subtext, fontSize: fs(13) }]}>
                    {aula.horaInicio}
                  </Text>
                  <View style={[styles.timelineLine, { backgroundColor: colors.divider }]} />
                  <View style={styles.cardContainer}>
                    <View
                      style={[
                        styles.card,
                        {
                          backgroundColor: colors.card,
                          borderWidth: altoContraste ? 2 : 0,
                          borderColor: colors.border,
                        },
                      ]}>
                      <View style={styles.cardContent}>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[styles.classTitle, { color: colors.text, fontSize: fs(16) }]}
                            numberOfLines={1}>
                            {titulo}
                          </Text>
                          {!!local && (
                            <Text
                              style={[styles.classLocation, { color: colors.subtext, fontSize: fs(14) }]}
                              numberOfLines={1}>
                              {local}
                            </Text>
                          )}
                          <Text style={[styles.classTime, { color: colors.subtext, fontSize: fs(12) }]}>
                            {aula.horaInicio} – {aula.horaFim}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={72} color={colors.subtext} style={{ marginBottom: 20 }} />
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
              placeholder="https://inforestudante.utad.pt/...?chave=..."
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalCancel, { backgroundColor: colors.inputBg, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}
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
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '600',
    textAlign: 'center',
  },
  importBtn: {
    position: 'absolute',
    right: 8,
    top: 6,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  // Data do dia activo
  dataExtenso: {
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 4,
  },
  // Navegação de semana
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 8,
  },
  weekNavBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekLabel: {
    minWidth: 120,
    textAlign: 'center',
  },
  // Timeline
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
  // Bloco "Livre"
  livreBlock: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  livreText: {
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  // Dia sem aulas
  emptyDay: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyDayText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  // Estado sem horário
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
