import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HorarioScreen() {
  const router = useRouter();
  const { colors } = useSettings();
  const { tr } = useLanguage();
  const dias = [
    { pt: 'Seg', en: 'Mon' },
    { pt: 'Ter', en: 'Tue' },
    { pt: 'Qua', en: 'Wed' },
    { pt: 'Qui', en: 'Thu' },
    { pt: 'Sex', en: 'Fri' },
    { pt: 'Sab', en: 'Sat' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>{tr('Horário', 'Schedule')}</Text>

      {/* Days Selector */}
      <View style={styles.daysContainer}>
        {dias.map((day, index) => {
          const label = tr(day.pt, day.en);
          const isActive = day.pt === 'Qui';
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayChip, { backgroundColor: colors.inputBg }, isActive && styles.dayChipActive]}>
              <Text style={[styles.dayText, { color: colors.text }, isActive && styles.dayTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.dateText}>{tr('Quinta-feira, 21 Março 2026', 'Thursday, 21 March 2026')}</Text>

      {/* Timeline */}
      <ScrollView style={styles.timelineContainer} showsVerticalScrollIndicator={false}>
        {/* Programação Web */}
        <View style={styles.timelineRow}>
          <Text style={styles.timeText}>09:00</Text>
          <View style={styles.timelineLine} />
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={[styles.classTitle, { color: colors.text }]}>{tr('Programação Web', 'Web Programming')}</Text>
                  <Text style={styles.classLocation}>{tr('Sala 1.3 - Bloco B', 'Room 1.3 - Block B')}</Text>
                  <Text style={styles.classTime}>09:00 - 11:00</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </View>
            </View>
          </View>
        </View>

        {/* Livre */}
        <View style={styles.timelineRow}>
          <Text style={styles.timeText}>11:00</Text>
          <View style={styles.timelineLine} />
          <View style={styles.cardContainer}>
            <View style={styles.freeCard}>
              <Text style={styles.freeText}>{tr('Livre', 'Free')}</Text>
            </View>
          </View>
        </View>

        {/* 12:00 Label */}
        <View style={styles.timelineRow}>
          <Text style={styles.timeText}>12:00</Text>
          <View style={styles.timelineLine} />
          <View style={styles.cardContainer} />
        </View>

        {/* IPC */}
        <View style={styles.timelineRow}>
          <Text style={styles.timeText}>14:00</Text>
          <View style={styles.timelineLine} />
          <TouchableOpacity 
            style={styles.cardContainer}
            onPress={() => router.push('/navigacao-indoor')}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={[styles.classTitle, { color: colors.text }]}>IPC</Text>
                  <Text style={styles.classLocation}>{tr('Sala 2.1 - Bloco A', 'Room 2.1 - Block A')}</Text>
                  <Text style={styles.classTime}>14:00 - 16:00</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Base de Dados */}
        <View style={styles.timelineRow}>
          <Text style={styles.timeText}>16:00</Text>
          <View style={styles.timelineLine} />
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={[styles.classTitle, { color: colors.text }]}>{tr('Base de Dados', 'Databases')}</Text>
                  <Text style={styles.classLocation}>{tr('Lab 2 - Bloco B', 'Lab 2 - Block B')}</Text>
                  <Text style={styles.classTime}>16:00 - 18:00</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </View>
            </View>
          </View>
        </View>
        
        <View style={{height: 40}} />
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
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
  dateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
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
    borderLeftColor: '#005C7A', // Dark teal accent
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
  freeCard: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  freeText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
