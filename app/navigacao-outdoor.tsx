import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  OUTDOOR_ROUTE,
  OUTDOOR_ROUTE_START,
  OUTDOOR_ROUTE_END,
} from '../constants/polo1Data';

const ROUTE_REGION = {
  latitude: 41.297,
  longitude: -7.7398,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

export default function NavigacaoOutdoorScreen() {
  const router = useRouter();
  const { colors } = useSettings();
  const { tr } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={ROUTE_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker
          coordinate={OUTDOOR_ROUTE_START.coordinate}
          title={tr(OUTDOOR_ROUTE_START.name.pt, OUTDOOR_ROUTE_START.name.en)}
          pinColor="#34C759"
        />
        <Marker
          coordinate={OUTDOOR_ROUTE_END.coordinate}
          title={tr(OUTDOOR_ROUTE_END.name.pt, OUTDOOR_ROUTE_END.name.en)}
          pinColor="#007AFF"
        />
        <Polyline
          coordinates={OUTDOOR_ROUTE}
          strokeColor="#007AFF"
          strokeWidth={4}
          lineDashPattern={[10, 5] as any}
        />
      </MapView>

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
    color: '#4A4A4A',
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
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#4A4A5A',
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
