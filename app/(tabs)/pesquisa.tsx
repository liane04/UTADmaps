import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LOCAIS, type Categoria, type Local } from '../data/locais';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

type FiltroCategoria = 'todos' | Categoria;

const RECENTES_PT = ['Biblioteca', 'Cantina', 'Secretaria'];
const RECENTES_EN = ['Library', 'Canteen', 'Secretariat'];

function avatarLetra(categoria: Categoria): string {
  if (categoria === 'edificio') return 'E';
  if (categoria === 'sala') return 'S';
  return 'V';
}

function avatarCor(categoria: Categoria): string {
  if (categoria === 'edificio') return '#C8E6C9';
  if (categoria === 'sala') return '#BBDEFB';
  return '#FFE0B2';
}

export default function PesquisaScreen() {
  const router = useRouter();
  const { colors, fs } = useSettings();
  const { tr, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState<FiltroCategoria>('todos');

  const FILTROS: { key: FiltroCategoria; label: string }[] = [
    { key: 'todos', label: tr('Todos', 'All') },
    { key: 'edificio', label: tr('Edifícios', 'Buildings') },
    { key: 'sala', label: tr('Salas', 'Rooms') },
    { key: 'servico', label: tr('Serviços', 'Services') },
  ];

  const resultados = useMemo<Local[]>(() => {
    const q = query.trim().toLowerCase();
    return LOCAIS.filter((l) => {
      if (categoria !== 'todos' && l.categoria !== categoria) return false;
      if (!q) return true;
      return (
        l.nome.toLowerCase().includes(q) ||
        l.nomeEn.toLowerCase().includes(q) ||
        l.subtitulo.toLowerCase().includes(q) ||
        l.subtituloEn.toLowerCase().includes(q) ||
        l.edificio.toLowerCase().includes(q)
      );
    }).sort((a, b) => a.distancia - b.distancia);
  }, [query, categoria]);

  const aoSelecionar = (local: Local) => {
    if (local.categoria === 'sala') {
      router.push({ pathname: '/navigacao-indoor', params: { destino: local.id } });
    } else {
      router.push('/navigacao-outdoor');
    }
  };

  const aoTocarRecente = (termo: string) => {
    setQuery(termo);
    setCategoria('todos');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>UTAD Campus</Text>

      <View style={[styles.searchContainer, { backgroundColor: colors.inputBg }]}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder={tr('Pesquisar edifício, sala, serviço...', 'Search building, room, service...')}
          placeholderTextColor="#8E8E93"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close" size={20} color="#8E8E93" />
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
                style={[styles.filterChip, ativo && styles.filterChipActive]}
                onPress={() => setCategoria(f.key)}>
                <Text style={[styles.filterText, ativo && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {resultados.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color="#8E8E93" />
            <Text style={styles.emptyText}>{tr('Sem resultados para', 'No results for')} "{query}"</Text>
          </View>
        ) : (
          resultados.map((local) => (
            <TouchableOpacity key={local.id} style={[styles.resultCard, { backgroundColor: colors.card }]} onPress={() => aoSelecionar(local)}>
              <View style={[styles.avatar, { backgroundColor: avatarCor(local.categoria) }]}>
                <Text style={styles.avatarText}>{avatarLetra(local.categoria)}</Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultTitle, { color: colors.text, fontSize: fs(16) }]}>{language === 'pt' ? local.nome : local.nomeEn}</Text>
                <Text style={[styles.resultSubtitle, { fontSize: fs(14) }]}>{language === 'pt' ? local.subtitulo : local.subtituloEn}</Text>
              </View>
              <Text style={[styles.resultDistance, { color: colors.text, fontSize: fs(14) }]}>{local.distancia}m</Text>
            </TouchableOpacity>
          ))
        )}

        {query.length === 0 && (
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
  resultDistance: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
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
