import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LOCAIS, type Categoria, type Local } from '../data/locais';

type FiltroCategoria = 'todos' | Categoria;

const FILTROS: { key: FiltroCategoria; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'edificio', label: 'Edifícios' },
  { key: 'sala', label: 'Salas' },
  { key: 'servico', label: 'Serviços' },
];

const RECENTES = ['Biblioteca', 'Cantina', 'Secretaria'];

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
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState<FiltroCategoria>('todos');

  const resultados = useMemo<Local[]>(() => {
    const q = query.trim().toLowerCase();
    return LOCAIS.filter((l) => {
      if (categoria !== 'todos' && l.categoria !== categoria) return false;
      if (!q) return true;
      return (
        l.nome.toLowerCase().includes(q) ||
        l.subtitulo.toLowerCase().includes(q) ||
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>UTAD Campus</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Pesquisar edifício, sala, serviço..."
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
            <Text style={styles.emptyText}>Sem resultados para "{query}"</Text>
          </View>
        ) : (
          resultados.map((local) => (
            <TouchableOpacity key={local.id} style={styles.resultCard} onPress={() => aoSelecionar(local)}>
              <View style={[styles.avatar, { backgroundColor: avatarCor(local.categoria) }]}>
                <Text style={styles.avatarText}>{avatarLetra(local.categoria)}</Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{local.nome}</Text>
                <Text style={styles.resultSubtitle}>{local.subtitulo}</Text>
              </View>
              <Text style={styles.resultDistance}>{local.distancia}m</Text>
            </TouchableOpacity>
          ))
        )}

        {query.length === 0 && (
          <>
            <Text style={styles.recentTitle}>Pesquisas recentes</Text>
            <View style={styles.recentContainer}>
              {RECENTES.map((termo) => (
                <TouchableOpacity key={termo} onPress={() => aoTocarRecente(termo)}>
                  <Text style={styles.recentItem}>{termo}</Text>
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
