import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>
          <Text style={styles.name}>Filipe Neves</Text>
          <Text style={styles.email}>filipe@utad.eu</Text>
        </View>

        {/* Next Class Card */}
        <View style={styles.nextClassContainer}>
          <TouchableOpacity 
            style={styles.nextClassCard}
            onPress={() => router.push('/navigacao-indoor')}>
            <View style={styles.nextClassHeader}>
              <Text style={styles.nextClassLabel}>Próxima Aula</Text>
              <Ionicons name="navigate" size={20} color="#000000" />
            </View>
            <Text style={styles.nextClassTitle}>IPC</Text>
            <Text style={styles.nextClassDetail}>Sala 2.1, Bloco A</Text>
            <Text style={styles.nextClassDetail}>Hoje, 14:00 - 16:00</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Favoritos</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Histórico de Navegação</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Horário Semanal</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/definicoes')}>
            <Text style={styles.menuText}>Definições</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C7C7CC',
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
