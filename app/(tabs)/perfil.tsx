import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PerfilScreen() {
  const router = useRouter();
  const { colors, fs } = useSettings();
  const { tr } = useLanguage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>
          <Text style={[styles.name, { color: colors.text, fontSize: fs(24) }]}>Filipe Neves</Text>
          <Text style={[styles.email, { fontSize: fs(16) }]}>filipe@utad.eu</Text>
        </View>

        {/* Next Class Card */}
        <View style={styles.nextClassContainer}>
          <TouchableOpacity 
            style={[styles.nextClassCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/navigacao-indoor')}>
            <View style={styles.nextClassHeader}>
              <Text style={[styles.nextClassLabel, { color: colors.text, fontSize: fs(14) }]}>{tr('Próxima Aula', 'Next Class')}</Text>
              <Ionicons name="navigate" size={20} color={colors.text} />
            </View>
            <Text style={[styles.nextClassTitle, { color: colors.text, fontSize: fs(20) }]}>IPC</Text>
            <Text style={[styles.nextClassDetail, { color: colors.subtext, fontSize: fs(14) }]}>{tr('Sala 2.1, Bloco A', 'Room 2.1, Block A')}</Text>
            <Text style={[styles.nextClassDetail, { color: colors.subtext, fontSize: fs(14) }]}>{tr('Hoje, 14:00 - 16:00', 'Today, 14:00 - 16:00')}</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>{tr('Favoritos', 'Favourites')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>{tr('Histórico de Navegação', 'Navigation History')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>{tr('Horário Semanal', 'Weekly Schedule')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/definicoes')}>
            <Text style={[styles.menuText, { color: colors.text, fontSize: fs(16) }]}>{tr('Definições', 'Settings')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>
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
    marginBottom: 32,
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C7C7CC',
    marginLeft: 16,
  },
});
