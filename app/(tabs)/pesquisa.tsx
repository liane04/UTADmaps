import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { SearchResult, SearchCategoria } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppStore } from '../../store/useAppStore';

type FiltroCategoria = 'todos' | SearchCategoria;

const RECENTES_PT = ['Biblioteca', 'ECT', 'Reitoria', 'Cantina'];
const RECENTES_EN = ['Library', 'ECT', 'Rectory', 'Canteen'];

function avatarLetra(categoria: SearchCategoria): string {
  if (categoria === 'edificio') return 'E';
  if (categoria === 'sala') return 'S';
  return 'V';
}

function avatarCor(categoria: SearchCategoria): string {
  if (categoria === 'edificio') return '#C8E6C9';
  if (categoria === 'sala') return '#BBDEFB';
  return '#FFE0B2';
}

function subtituloDe(item: SearchResult, language: 'pt' | 'en'): string {
  const pisoLabel = language === 'pt' ? 'Piso' : 'Floor';
  if (item.categoria === 'edificio') {
    return language === 'pt' ? 'Edifício' : 'Building';
  }
  if (item.piso) {
    return `${pisoLabel} ${item.piso}${item.edificio ? ` – ${item.edificio}` : ''}`;
  }
  return item.edificio || '';
}

export default function PesquisaScreen() {
  const router = useRouter();
  const { colors, fs, altoContraste } = useSettings();
  const { tr, language } = useLanguage();
  const { isFavorite, addFavorite, removeFavorite } = useAppStore();
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState<FiltroCategoria>('todos');
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const FILTROS: { key: FiltroCategoria; label: string }[] = [
    { key: 'todos', label: tr('Todos', 'All') },
    { key: 'edificio', label: tr('Edifícios', 'Buildings') },
    { key: 'sala', label: tr('Salas', 'Rooms') },
    { key: 'servico', label: tr('Serviços', 'Services') },
  ];

  // Pesquisa com debounce 300ms
  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      setLoading(true);
      setErro(null);
      try {
        const data = await api.search(query, categoria);
        if (!cancelled) setResultados(data);
      } catch (e) {
        if (!cancelled) {
          setResultados([]);
          setErro(tr('Erro a contactar o servidor', 'Server error'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, categoria, tr]);

  const aoSelecionar = (local: SearchResult) => {
    if (local.categoria === 'sala') {
      router.push({
        pathname: '/navigacao-indoor',
        params: {
          destino: local.codigo ?? local.id,
          destinoNome: local.nome,
        },
      });
      return;
    }
    if (local.lat != null && local.lon != null) {
      router.push({
        pathname: '/navigacao-outdoor',
        params: {
          destLat: String(local.lat),
          destLng: String(local.lon),
          destName: local.nome,
        },
      });
      return;
    }
    router.push('/navigacao-outdoor');
  };

  const toggleFavorito = (local: SearchResult) => {
    if (isFavorite(local.id)) {
      removeFavorite(local.id);
    } else {
      addFavorite({
        id: local.id,
        nome: local.nome,
        subtitulo: subtituloDe(local, language),
        categoria: local.categoria,
        lat: local.lat,
        lon: local.lon,
        codigo: local.codigo,
      });
    }
  };

  const aoTocarRecente = (termo: string) => {
    setQuery(termo);
    setCategoria('todos');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>UTAD Campus</Text>

      <View style={[styles.searchContainer, { backgroundColor: colors.inputBg, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder={tr('Pesquisar edifício, sala, serviço...', 'Search building, room, service...')}
          placeholderTextColor={colors.subtext}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close" size={20} color={colors.subtext} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {FILTROS.map((f) => {
            const ativo = categoria === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip, 
                  { backgroundColor: ativo ? colors.primary : colors.inputBg,
                    borderWidth: altoContraste ? 2 : 0, 
                    borderColor: colors.text }
                ]}
                onPress={() => setCategoria(f.key)}>
                <Text style={[
                  styles.filterText, 
                  { color: ativo ? colors.bg : colors.text, fontWeight: ativo ? 'bold' : 'normal' }
                ]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {loading && resultados.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="small" color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>{tr('A pesquisar...', 'Searching...')}</Text>
          </View>
        ) : erro ? (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline-outline" size={40} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>{erro}</Text>
          </View>
        ) : resultados.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              {query
                ? `${tr('Sem resultados para', 'No results for')} "${query}"`
                : tr('Sem resultados', 'No results')}
            </Text>
          </View>
        ) : (
          resultados.map((local) => {
            const fav = isFavorite(local.id);
            const subtitulo = subtituloDe(local, language);
            return (
              <TouchableOpacity
                key={local.id}
                style={[styles.resultCard, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}
                onPress={() => aoSelecionar(local)}>
                <View style={[styles.avatar, { backgroundColor: altoContraste ? colors.inputBg : avatarCor(local.categoria), borderWidth: altoContraste ? 2 : 0, borderColor: colors.text }]}>
                  <Text style={[styles.avatarText, { color: altoContraste ? colors.text : '#000000' }]}>{avatarLetra(local.categoria)}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultTitle, { color: colors.text, fontSize: fs(16) }]} numberOfLines={1}>
                    {local.nome}
                  </Text>
                  <Text style={[styles.resultSubtitle, { fontSize: fs(14), color: colors.subtext }]} numberOfLines={1}>
                    {subtitulo}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorito(local)}
                  style={styles.favBtn}
                  accessibilityLabel={fav ? tr('Remover dos favoritos', 'Remove from favourites') : tr('Adicionar aos favoritos', 'Add to favourites')}>
                  <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#FF3B30' : colors.subtext} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}

        {query.length === 0 && resultados.length > 0 && (
          <>
            <Text style={[styles.recentTitle, { color: colors.text, fontSize: fs(18) }]}>{tr('Pesquisas recentes', 'Recent searches')}</Text>
            <View style={styles.recentContainer}>
              {(language === 'pt' ? RECENTES_PT : RECENTES_EN).map((termo) => (
                <TouchableOpacity key={termo} onPress={() => aoTocarRecente(termo)}>
                  <Text style={[styles.recentItem, { color: colors.text }]}>{termo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  filterChipActive: {
    backgroundColor: '#4A4A4A',
  },
  filterText: {
    fontSize: 14,
    color: '#000000',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsContent: {
    paddingBottom: 24,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  favBtn: {
    padding: 4,
    marginLeft: 8,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  recentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  recentItem: {
    fontSize: 16,
    color: '#000000',
    textDecorationLine: 'underline',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
