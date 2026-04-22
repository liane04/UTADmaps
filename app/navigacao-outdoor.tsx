import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function NavigacaoOutdoorScreen() {
  const router = useRouter();
  const { colors, tema } = useSettings();
  const { tr } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Map Background Placeholder */}
      <View style={[styles.mapBackground, { backgroundColor: tema === 'escuro' ? '#1C2530' : '#F0F4F8' }]}>
        {/* Fake roads */}
        <View style={[styles.road, { top: 0, left: 100, width: 40, height: '100%', transform: [{ rotate: '20deg' }] }]} />
        <View style={[styles.road, { top: 300, left: 0, width: '100%', height: 40, transform: [{ rotate: '-10deg' }] }]} />
        
        {/* Fake buildings */}
        <View style={[styles.building, { top: 100, left: 50, width: 120, height: 40, transform: [{ rotate: '20deg' }] }]}>
          <Text style={styles.buildingText}>{tr('Bloco A', 'Block A')}</Text>
        </View>
        <View style={[styles.building, { top: 150, left: 40, width: 140, height: 50, transform: [{ rotate: '20deg' }] }]}>
          <Text style={styles.buildingText}>{tr('Bloco A', 'Block A')}</Text>
        </View>
        <View style={[styles.building, { top: 220, left: 200, width: 100, height: 40, transform: [{ rotate: '20deg' }] }]}>
          <Text style={styles.buildingText}>{tr('Cantina', 'Canteen')}</Text>
        </View>
        <View style={[styles.building, { top: 350, left: 120, width: 90, height: 60, transform: [{ rotate: '20deg' }] }]}>
          <Text style={styles.buildingText}>{tr('Eng. Civil', 'Civil Eng.')}</Text>
        </View>
        <View style={[styles.building, { top: 280, left: 260, width: 80, height: 60, transform: [{ rotate: '20deg' }] }]}>
          <Text style={styles.buildingText}>{tr('Reitoria', 'Rectory')}</Text>
        </View>

        {/* Target Building (Biblioteca) */}
        <View style={[styles.building, styles.targetBuilding, { top: 400, left: 250, width: 120, height: 100, transform: [{ rotate: '20deg' }] }]}>
          <Text style={styles.buildingText}>{tr('Biblioteca', 'Library')}</Text>
        </View>

        {/* Route Line (Simplified using absolutely positioned views) */}
        {/* Segment 1 */}
        <View style={[styles.routeLine, { top: 260, left: 60, width: 180, transform: [{ rotate: '60deg' }] }]} />
        {/* Segment 2 */}
        <View style={[styles.routeLine, { top: 460, left: 160, width: 100, transform: [{ rotate: '-20deg' }] }]} />
        
        {/* Start Dot */}
        <View style={[styles.routeDot, { top: 260, left: 70 }]} />
        {/* Arrow Head */}
        <Ionicons name="caret-forward" size={24} color="#007AFF" style={{ position: 'absolute', top: 430, left: 240, transform: [{ rotate: '-20deg' }] }} />
        {/* Target Dot */}
        <View style={[styles.routeDot, styles.targetDot, { top: 435, left: 255 }]} />
      </View>

      {/* Header Overlay */}
      <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{tr('Navegação Outdoor', 'Outdoor Navigation')}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Panel */}
      <View style={[styles.bottomPanel, { backgroundColor: colors.card }]}>
        <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <View>
            <Text style={[styles.timeDistance, { color: colors.text }]}>{tr('450m - 6 min a pé', '450m - 6 min walking')}</Text>
            <Text style={styles.instruction}>{tr('Siga em frente e vire à direita', 'Go straight and turn right')}</Text>
          </View>

          <View style={[styles.modeToggle, { backgroundColor: colors.inputBg }]}>
            <View style={[styles.modePill, styles.modePillActive, { backgroundColor: colors.card }]}>
              <Text style={[styles.modeText, styles.modeTextActive]}>{tr('A pé', 'Walking')}</Text>
            </View>
            <View style={styles.modePill}>
              <Text style={styles.modeText}>{tr('Carro', 'Car')}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}>
          <Text style={[styles.buttonText, { color: colors.bg }]}>{tr('Terminar', 'Finish')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F4F8',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  building: {
    position: 'absolute',
    backgroundColor: '#E5E5EA',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  targetBuilding: {
    backgroundColor: '#C5D0D6', // Slightly darker blue-gray
    borderWidth: 2,
    borderColor: '#A0B0B8',
  },
  buildingText: {
    fontSize: 12,
    color: '#000000',
  },
  routeLine: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#007AFF', // Blue route line
    borderRadius: 2,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#007AFF', // Fake dash using solid line for now
  },
  routeDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  targetDot: {
    backgroundColor: '#8E8E93',
    borderColor: '#FFFFFF',
    borderWidth: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timeDistance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A', // Dark gray
    marginBottom: 4,
  },
  instruction: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
    padding: 4,
  },
  modePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  modeTextActive: {
    color: '#007AFF', // Blue text for active mode
  },
  button: {
    backgroundColor: '#4A4A5A', // Dark gray/blue button matching mockup
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
