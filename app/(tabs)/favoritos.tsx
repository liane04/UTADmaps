import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppStore, FavoriteItem } from '../../store/useAppStore';
import { getEntradaByName } from '../../constants/polo1Data';
import { rotaIndoorParaSala } from '../../lib/navigation';

function avatarCor(categoria: string): string {
  if (categoria === 'edificio') return '#C8E6C9';
  if (categoria === 'sala') return '#BBDEFB';
  return '#FFE0B2';
}

function avatarLetra(categoria: string): string {
  if (categoria === 'edificio') return 'E';
  if (categoria === 'sala') return 'S';
  return 'V';
}

export default function FavoritosScreen() {
  const router = useRouter();
  const { colors, fs, altoContraste } = useSettings();
  const { tr } = useLanguage();
  const { favorites, removeFavorite } = useAppStore();

  const navegar = (item: FavoriteItem) => {
    if (item.categoria === 'sala' || item.categoria === 'servico') {
      router.push(rotaIndoorParaSala(item.codigo, item.nome));
      return;
    }
    if (item.lat != null && item.lon != null) {
      const entrada = getEntradaByName(item.nome);
      router.push({
        pathname: '/navigacao-outdoor',
        params: {
          destLat: String(entrada?.latitude ?? item.lat),
          destLng: String(entrada?.longitude ?? item.lon),
          destName: item.nome,
        },
      });
      return;
    }
    router.push('/navigacao-outdoor');
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>
          {tr('Favoritos', 'Favourites')}
        </Text>
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={colors.subtext} style={styles.emptyIcon} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontSize: fs(18) }]}>
            {tr('Sem favoritos ainda', 'No favourites yet')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext, fontSize: fs(14) }]}>
            {tr(
              'Adiciona locais favoritos na pesquisa tocando no ícone ♡.',
              'Add favourite places in the search tab by tapping ♡.',
            )}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]}>
        {tr('Favoritos', 'Favourites')}
      </Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderWidth: altoContraste ? 2 : 0, borderColor: colors.border }]}
            onPress={() => navegar(item)}
            accessibilityLabel={tr(`Navegar para ${item.nome}`, `Navigate to ${item.nome}`)}>
            <View style={[styles.avatar, { backgroundColor: altoContraste ? colors.inputBg : avatarCor(item.categoria), borderWidth: altoContraste ? 2 : 0, borderColor: colors.text }]}>
              <Text style={[styles.avatarText, { color: altoContraste ? colors.text : '#000000' }]}>{avatarLetra(item.categoria)}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: fs(16) }]} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={[styles.cardSubtitle, { fontSize: fs(13), color: colors.subtext }]} numberOfLines={1}>
                {item.subtitulo}
              </Text>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                removeFavorite(item.id);
              }}
              style={styles.removeBtn}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              accessibilityLabel={tr('Remover dos favoritos', 'Remove from favourites')}>
              <Ionicons name="heart" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyTitle: {
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#8E8E93',
  },
  removeBtn: {
    padding: 6,
  },
});
