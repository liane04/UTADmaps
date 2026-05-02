import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { POLO1_CENTER, POLO1_BUILDINGS } from '../../constants/polo1Data';

export default function MapaScreen() {
  const { colors, fs } = useSettings();
  const { tr, language } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={POLO1_CENTER}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {POLO1_BUILDINGS.map(building => (
          <Marker
            key={building.id}
            coordinate={building.coordinate}
            title={language === 'pt' ? building.name.pt : building.name.en}
            pinColor="#007AFF"
          />
        ))}
      </MapView>

      {/* Floating UI Elements */}
      <SafeAreaView style={styles.uiContainer} pointerEvents="box-none">
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontSize: fs(16) }]}
            placeholder={tr('Pesquisar edifício, sala, serviço...', 'Search building, room, service...')}
            placeholderTextColor="#8E8E93"
            editable={false} // static prototype
          />
        </View>

        {/* Bottom Right Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.card }]}>
            <Ionicons name="locate" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.zoomControls, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.zoomButton}>
              <Ionicons name="add" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={[styles.zoomDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.zoomButton}>
              <Ionicons name="remove" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  uiContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  controlsContainer: {
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 16,
  },
  controlButton: {
    backgroundColor: '#FFFFFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomControls: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },
});
