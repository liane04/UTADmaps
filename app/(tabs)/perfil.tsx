import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppStore } from '../../store/useAppStore';
import { rotaIndoorParaSala } from '../../lib/navigation';

const STORAGE_KEY = 'utadmaps_schedule_v2';

type Aula = {
  disciplina: string;
  data: string;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
  sala: string;
  locationRaw: string;
};

const MESES_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MESES_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DIAS_PT: Record<string, string> = {
  segunda: 'Segunda', terca: 'Terça', quarta: 'Quarta',
  quinta: 'Quinta', sexta: 'Sexta', sabado: 'Sábado',
};
const DIAS_EN: Record<string, string> = {
  segunda: 'Monday', terca: 'Tuesday', quarta: 'Wednesday',
  quinta: 'Thursday', sexta: 'Friday', sabado: 'Saturday',
};

function nomeDoEmail(email: string | undefined): string {
  if (!email) return '';
  const local = email.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function inicialDoEmail(email: string | undefined): string {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}

// Compara duas chaves "YYYY-MM-DD HH:MM" em string (ordem lexicográfica = ordem temporal)
function chaveAula(a: Aula): string {
  return `${a.data} ${a.horaInicio}`;
}

function formatarData(dataISO: string, language: 'pt' | 'en'): string {
  const [y, m, d] = dataISO.split('-').map(Number);
  if (!y || !m || !d) return dataISO;
  const data = new Date(y, m - 1, d);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  if (data.getTime() === hoje.getTime()) return language === 'pt' ? 'Hoje' : 'Today';
  if (data.getTime() === amanha.getTime()) return language === 'pt' ? 'Amanhã' : 'Tomorrow';
  const meses = language === 'pt' ? MESES_PT : MESES_EN;
  return `${d} ${meses[m - 1]}`;
}

/** Devolve minutos até ao início da aula (negativo se já começou). */
function minutosAteAula(aula: Aula, agora: Date): number {
  const [y, m, d] = aula.data.split('-').map(Number);
  const [h, min] = aula.horaInicio.split(':').map(Number);
  const inicio = new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0);
  return Math.round((inicio.getTime() - agora.getTime()) / 60000);
}

function emCurso(aula: Aula, agora: Date): boolean {
  const inicioMin = minutosAteAula(aula, agora);
  if (inicioMin > 0) return false;
  // calcular fim
  const [y, m, d] = aula.data.split('-').map(Number);
  const [h, min] = aula.horaFim.split(':').map(Number);
  const fim = new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0);
  return fim.getTime() > agora.getTime();
}

/** Texto humano do tempo até à aula. */
function textoTempoAula(aula: Aula, language: 'pt' | 'en', agora: Date): string {
  if (emCurso(aula, agora)) {
    return language === 'pt' ? 'A decorrer agora' : 'Happening now';
  }
  const min = minutosAteAula(aula, agora);
  if (min < 0) return ''; // já passou
  if (min < 1) {
    return language === 'pt' ? 'Começa agora' : 'Starting now';
  }
  if (min < 60) {
    return language === 'pt' ? `Começa em ${min} min` : `Starts in ${min} min`;
  }
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) {
    if (m === 0) {
      return language === 'pt' ? `Daqui a ${h} h` : `In ${h} h`;
    }
    return language === 'pt' ? `Daqui a ${h} h ${m} min` : `In ${h} h ${m} min`;
  }
  return ''; // > 24h: usa formatarData
}

export default function PerfilScreen() {
  const router = useRouter();
  const { colors, fs, altoContraste } = useSettings();
  const { tr, language } = useLanguage();
  const { user, favorites, logout } = useAppStore();

  const [proximaAula, setProximaAula] = useState<Aula | null>(null);
  const [loadingAula, setLoadingAula] = useState(true);
  // Tick a cada 30s para atualizar "Começa em X min" sem refazer a query toda
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setAgora(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setProximaAula(null);
          return;
        }
        const aulas: Aula[] = JSON.parse(raw);
        const ahora = new Date();
        // Aceita aula que está em curso ou ainda no futuro próximo
        const candidatas = aulas
          .filter((a) => {
            const [h, min] = a.horaFim.split(':').map(Number);
            const [y, m, d] = a.data.split('-').map(Number);
            const fim = new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0);
            return fim.getTime() > ahora.getTime();
          })
          .sort((a, b) => chaveAula(a).localeCompare(chaveAula(b)));
        setProximaAula(candidatas[0] ?? null);
      } catch {
        setProximaAula(null);
      } finally {
        setLoadingAula(false);
      }
    })();
  }, []);

  // Calcula estado da próxima aula a partir do tick
  const aulaInfo = useMemo(() => {
    if (!proximaAula) return { tempoTexto: '', urgente: false, emCurso: false };
    const min = minutosAteAula(proximaAula, agora);
    const curso = emCurso(proximaAula, agora);
    return {
      tempoTexto: textoTempoAula(proximaAula, language, agora),
      urgente: min > 0 && min <= 30, // < 30 min destaca
      emCurso: curso,
    };
  }, [proximaAula, agora, language]);

  const handleLogout = () => {
    const confirmar = () => {
      logout();
      router.replace('/');
    };
    if (typeof window !== 'undefined' && typeof (window as any).confirm === 'function') {
      if ((window as any).confirm(tr('Terminar sessão?', 'Sign out?'))) confirmar();
    } else {
      Alert.alert(
        tr('Terminar sessão', 'Sign out'),
        tr('Tens a certeza?', 'Are you sure?'),
        [
          { text: tr('Cancelar', 'Cancel'), style: 'cancel' },
          { text: tr('Terminar', 'Sign out'), style: 'destructive', onPress: confirmar },
        ],
      );
    }
  };

  const nome = nomeDoEmail(user?.email);
  const inicial = inicialDoEmail(user?.email);
  const isAnonimo = !user;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.inputBg, borderColor: colors.border, borderWidth: altoContraste ? 2 : 4 }]}>
            <Text style={[styles.avatarText, { color: colors.subtext }]}>{isAnonimo ? '?' : inicial}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text, fontSize: fs(24) }]}>
            {isAnonimo ? tr('Convidado', 'Guest') : nome}
          </Text>
          <Text style={[styles.email, { fontSize: fs(16), color: colors.subtext }]}>
            {isAnonimo ? tr('Sem sessão iniciada', 'Not signed in') : user?.email}
          </Text>
        </View>

        {/* Próxima aula (se logado) */}
        {!isAnonimo && (
          <View style={styles.nextClassContainer}>
            {loadingAula ? null : proximaAula ? (
              <TouchableOpacity
                style={[
                  styles.nextClassCard,
                  {
                    backgroundColor: aulaInfo.urgente ? '#FFF4E5' : colors.card,
                    borderWidth: aulaInfo.urgente ? 2 : altoContraste ? 2 : 0,
                    borderColor: aulaInfo.urgente ? '#FF9500' : colors.border,
                  },
                ]}
                onPress={() => router.push(rotaIndoorParaSala(proximaAula.sala, proximaAula.disciplina))}
                accessibilityRole="button"
                accessibilityLabel={tr('Navegar para próxima aula', 'Navigate to next class')}>
                <View style={styles.nextClassHeader}>
                  <View style={styles.nextClassLabelWrap}>
                    {aulaInfo.urgente && (
                      <Ionicons
                        name={aulaInfo.emCurso ? 'radio' : 'alarm'}
                        size={16}
                        color="#FF9500"
                        style={{ marginRight: 6 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.nextClassLabel,
                        {
                          color: aulaInfo.urgente ? '#C76900' : colors.text,
                          fontSize: fs(14),
                          fontWeight: '700',
                        },
                      ]}>
                      {aulaInfo.tempoTexto || tr('Próxima Aula', 'Next Class')}
                    </Text>
                  </View>
                  <Ionicons name="navigate" size={20} color={aulaInfo.urgente ? '#FF9500' : colors.text} />
                </View>
                <Text style={[styles.nextClassTitle, { color: colors.text, fontSize: fs(20) }]} numberOfLines={1}>
                  {proximaAula.disciplina}
                </Text>
                <Text style={[styles.nextClassDetail, { color: colors.subtext, fontSize: fs(14) }]} numberOfLines={1}>
                  {proximaAula.sala || proximaAula.locationRaw}
                </Text>
                <Text style={[styles.nextClassDetail, { color: colors.subtext, fontSize: fs(14) }]}>
                  {formatarData(proximaAula.data, language)} · {proximaAula.horaInicio} – {proximaAula.horaFim}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.nextClassCard, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}>
                <Text style={[styles.nextClassLabel, { color: colors.text, fontSize: fs(14) }]}>
                  {tr('Sem aulas marcadas', 'No upcoming classes')}
                </Text>
                <Text style={[styles.nextClassDetail, { color: colors.subtext, fontSize: fs(13), marginTop: 6 }]}>
                  {tr('Importa o teu horário no separador Horário.', 'Import your schedule in the Schedule tab.')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Menu */}
        <View style={[styles.menuContainer, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: altoContraste ? 2 : 0 }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/historico')}
            accessibilityRole="button"
            accessibilityLabel={tr('Histórico de Navegação', 'Navigation History')}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>
              {tr('Histórico de Navegação', 'Navigation History')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/horario')}
            accessibilityRole="button"
            accessibilityLabel={tr('Horário Semanal', 'Weekly Schedule')}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>
              {tr('Horário Semanal', 'Weekly Schedule')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/definicoes')}
            accessibilityRole="button"
            accessibilityLabel={tr('Definições', 'Settings')}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>
              {tr('Definições', 'Settings')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Sair / Entrar */}
        {isAnonimo ? (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => router.replace('/')}>
            <Text style={[styles.actionButtonText, { fontSize: fs(16), color: colors.bg }]}>{tr('Iniciar sessão', 'Sign in')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
            <Text style={[styles.actionButtonText, { color: '#FF3B30', fontSize: fs(16) }]}>
              {tr('Terminar sessão', 'Sign out')}
            </Text>
          </TouchableOpacity>
        )}
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
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    borderWidth: 4,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    color: '#8E8E93',
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#8E8E93',
  },
  nextClassContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  nextClassCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nextClassLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nextClassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextClassLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  nextClassTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  nextClassDetail: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#000000',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBadge: {
    fontSize: 14,
    color: '#8E8E93',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C7C7CC',
    marginLeft: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,59,48,0.08)',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
