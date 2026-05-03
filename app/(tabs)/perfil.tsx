import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppStore } from '../../store/useAppStore';

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

export default function PerfilScreen() {
  const router = useRouter();
  const { colors, fs } = useSettings();
  const { tr, language } = useLanguage();
  const { user, favorites, logout } = useAppStore();

  const [proximaAula, setProximaAula] = useState<Aula | null>(null);
  const [loadingAula, setLoadingAula] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setProximaAula(null);
          return;
        }
        const aulas: Aula[] = JSON.parse(raw);
        const agora = new Date();
        const agoraKey = `${agora.toISOString().slice(0, 10)} ${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
        const futuras = aulas
          .filter(a => chaveAula(a) >= agoraKey)
          .sort((a, b) => chaveAula(a).localeCompare(chaveAula(b)));
        setProximaAula(futuras[0] ?? null);
      } catch {
        setProximaAula(null);
      } finally {
        setLoadingAula(false);
      }
    })();
  }, []);

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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{isAnonimo ? '?' : inicial}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text, fontSize: fs(24) }]}>
            {isAnonimo ? tr('Convidado', 'Guest') : nome}
          </Text>
          <Text style={[styles.email, { fontSize: fs(16) }]}>
            {isAnonimo ? tr('Sem sessão iniciada', 'Not signed in') : user?.email}
          </Text>
        </View>

        {/* Próxima aula (se logado) */}
        {!isAnonimo && (
          <View style={styles.nextClassContainer}>
            {loadingAula ? null : proximaAula ? (
              <TouchableOpacity
                style={[styles.nextClassCard, { backgroundColor: colors.card }]}
                onPress={() => router.push({ pathname: '/navigacao-indoor', params: { destino: proximaAula.sala } })}
                accessibilityLabel={tr('Navegar para próxima aula', 'Navigate to next class')}>
                <View style={styles.nextClassHeader}>
                  <Text style={[styles.nextClassLabel, { color: colors.text, fontSize: fs(14) }]}>
                    {tr('Próxima Aula', 'Next Class')}
                  </Text>
                  <Ionicons name="navigate" size={20} color={colors.text} />
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
              <View style={[styles.nextClassCard, { backgroundColor: colors.card }]}>
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
        <View style={[styles.menuContainer, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/favoritos')}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>
              {tr('Favoritos', 'Favourites')}
            </Text>
            <View style={styles.menuRight}>
              <Text style={[styles.menuBadge, { color: colors.subtext, fontSize: fs(14) }]}>{favorites.length}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/horario')}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>
              {tr('Horário Semanal', 'Weekly Schedule')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/definicoes')}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>
              {tr('Definições', 'Settings')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Sair / Entrar */}
        {isAnonimo ? (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#007AFF' }]} onPress={() => router.replace('/')}>
            <Text style={[styles.actionButtonText, { fontSize: fs(16) }]}>{tr('Iniciar sessão', 'Sign in')}</Text>
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
