import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api, NavigationHistoryEntry } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppStore } from '../store/useAppStore';
import { getEntradaByName } from '../constants/polo1Data';

const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatRelativo(iso: string, language: 'pt' | 'en'): string {
  const data = new Date(iso);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return language === 'pt' ? 'Agora mesmo' : 'Just now';
  if (diffMin < 60) return language === 'pt' ? `Há ${diffMin} min` : `${diffMin} min ago`;
  if (diffH < 24) return language === 'pt' ? `Há ${diffH} h` : `${diffH} h ago`;
  if (diffD < 7) return language === 'pt' ? `Há ${diffD} dia${diffD > 1 ? 's' : ''}` : `${diffD} day${diffD > 1 ? 's' : ''} ago`;
  const meses = language === 'pt' ? MESES_PT : MESES_EN;
  return `${data.getDate()} ${meses[data.getMonth()]}`;
}

function avatarCor(categoria: string | null): string {
  if (categoria === 'edificio') return '#C8E6C9';
  if (categoria === 'sala') return '#BBDEFB';
  if (categoria === 'servico') return '#FFE0B2';
  return '#E5E5EA';
}

function avatarLetra(categoria: string | null, navTipo: string): string {
  if (categoria === 'edificio') return 'E';
  if (categoria === 'sala') return 'S';
  if (categoria === 'servico') return 'V';
  return navTipo === 'indoor' ? 'I' : 'O';
}

export default function HistoricoScreen() {
  const router = useRouter();
  const { colors, fs, altoContraste } = useSettings();
  const { tr, language } = useLanguage();
  const { token } = useAppStore();

  const [entries, setEntries] = useState<NavigationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(
    async (modoRefresh = false) => {
      if (modoRefresh) setRefreshing(true);
      else setLoading(true);
      setErro(null);
      try {
        const data = await api.getHistory();
        setEntries(data);
      } catch (e: any) {
        setEntries([]);
        if (token) {
          setErro(tr('Erro a carregar histórico', 'Error loading history'));
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, tr],
  );

  useEffect(() => {
    if (token) carregar();
    else {
      setLoading(false);
      setEntries([]);
    }
  }, [token, carregar]);

  const limparHistorico = () => {
    const confirmar = async () => {
      try {
        await api.clearHistory();
        setEntries([]);
      } catch {
        // ignora
      }
    };
    if (typeof window !== 'undefined' && typeof (window as any).confirm === 'function') {
      if ((window as any).confirm(tr('Limpar todo o histórico?', 'Clear all history?'))) confirmar();
    } else {
      Alert.alert(
        tr('Limpar histórico', 'Clear history'),
        tr('Tens a certeza? Esta acção não pode ser anulada.', 'Are you sure? This cannot be undone.'),
        [
          { text: tr('Cancelar', 'Cancel'), style: 'cancel' },
          { text: tr('Limpar', 'Clear'), style: 'destructive', onPress: confirmar },
        ],
      );
    }
  };

  const navegarPara = (entry: NavigationHistoryEntry) => {
    if (entry.navegacao_tipo === 'indoor') {
      router.push({
        pathname: '/navigacao-indoor',
        params: {
          ...(entry.destino_id ? { destino: entry.destino_id } : {}),
          destinoNome: entry.destino_nome,
        },
      });
      return;
    }
    if (entry.lat != null && entry.lon != null) {
      const entrada = getEntradaByName(entry.destino_nome);
      router.push({
        pathname: '/navigacao-outdoor',
        params: {
          destLat: String(entrada?.latitude ?? entry.lat),
          destLng: String(entrada?.longitude ?? entry.lon),
          destName: entry.destino_nome,
        },
      });
      return;
    }
    router.push('/navigacao-outdoor');
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
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/perfil'))}
          accessibilityRole="button"
          accessibilityLabel={tr('Voltar', 'Back')}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text, fontSize: fs(16) }]}>
            {tr('Voltar', 'Back')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>
          {tr('Histórico', 'History')}
        </Text>
        {entries.length > 0 ? (
          <TouchableOpacity
            onPress={limparHistorico}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel={tr('Limpar histórico', 'Clear history')}>
            <Text style={[styles.clearText, { color: colors.text, fontSize: fs(14) }]}>
              {tr('Limpar', 'Clear')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {!token ? (
        <View style={styles.emptyState}>
          <Ionicons name="lock-closed-outline" size={56} color={colors.subtext} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontSize: fs(18) }]}>
            {tr('Inicia sessão para ver o histórico', 'Sign in to see your history')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext, fontSize: fs(14) }]}>
            {tr(
              'O histórico de navegação é guardado na tua conta UTAD.',
              'Navigation history is stored on your UTAD account.',
            )}
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/')}
            accessibilityRole="button">
            <Text style={[styles.primaryButtonText, { color: colors.bg, fontSize: fs(16) }]}>
              {tr('Iniciar sessão', 'Sign in')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : erro ? (
        <View style={styles.emptyState}>
          <Ionicons name="cloud-offline-outline" size={56} color={colors.subtext} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontSize: fs(18) }]}>{erro}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => carregar()}
            accessibilityRole="button">
            <Text style={[styles.primaryButtonText, { color: colors.bg, fontSize: fs(16) }]}>
              {tr('Tentar de novo', 'Retry')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={56} color={colors.subtext} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontSize: fs(18) }]}>
            {tr('Sem navegações ainda', 'No navigations yet')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext, fontSize: fs(14) }]}>
            {tr(
              'As tuas navegações aparecem aqui depois de iniciares uma rota.',
              'Your navigations appear here after you start a route.',
            )}
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => carregar(true)} tintColor={colors.text} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[cardStyle, styles.entryRow]}
              onPress={() => navegarPara(item)}
              accessibilityRole="button"
              accessibilityLabel={tr(
                `Navegar para ${item.destino_nome}`,
                `Navigate to ${item.destino_nome}`,
              )}>
              <View style={[styles.avatar, { backgroundColor: avatarCor(item.destino_categoria) }]}>
                <Text style={styles.avatarText}>
                  {avatarLetra(item.destino_categoria, item.navegacao_tipo)}
                </Text>
              </View>
              <View style={styles.entryInfo}>
                <Text
                  style={[styles.entryTitle, { color: colors.text, fontSize: fs(16) }]}
                  numberOfLines={1}>
                  {item.destino_nome}
                </Text>
                <Text
                  style={[styles.entrySubtitle, { color: colors.subtext, fontSize: fs(13) }]}
                  numberOfLines={1}>
                  {formatRelativo(item.created_at, language)}
                  {' · '}
                  {item.navegacao_tipo === 'indoor'
                    ? tr('Interior', 'Indoor')
                    : tr('Exterior', 'Outdoor')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
            </TouchableOpacity>
          )}
        />
      )}
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
    minHeight: 44,
  },
  backText: {
    marginLeft: 4,
  },
  headerTitle: {
    fontWeight: '600',
  },
  clearBtn: {
    width: 80,
    alignItems: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
  },
  clearText: {
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  card: {
    borderRadius: 12,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  entrySubtitle: {},
});
