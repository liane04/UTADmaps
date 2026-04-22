import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MapaScreen() {
  const { colors, tema } = useSettings();
  const { tr } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Map Placeholder */}
      <View style={[styles.mapBackground, { backgroundColor: tema === 'escuro' ? '#1C2530' : '#F0F4F8' }]}>
        {/* Roads */}
        <View style={[styles.road, { top: 200, left: 0, width: '100%', height: 20 }]} />
        <View style={[styles.road, { top: 0, left: 150, width: 20, height: '100%' }]} />
        <View style={[styles.road, { top: 400, left: 0, width: '100%', height: 20 }]} />
        <View style={[styles.road, { top: 0, left: 300, width: 20, height: '100%' }]} />

        {/* Buildings */}
        <View style={[styles.building, styles.biblioteca, { top: 240, left: 20, width: 110, height: 180 }]}>
          <Text style={styles.buildingLabel}>{tr('Biblioteca', 'Library')}</Text>
        </View>
        
        <View style={[styles.building, styles.blocoA, { top: 240, left: 180, width: 100, height: 70 }]}>
          <Text style={styles.buildingLabel}>{tr('Bloco A', 'Block A')}</Text>
        </View>

        <View style={[styles.building, styles.blocoB, { top: 240, left: 330, width: 100, height: 70 }]}>
          <Text style={styles.buildingLabel}>{tr('Bloco B', 'Block B')}</Text>
        </View>

        <View style={[styles.building, styles.cantina, { top: 440, left: 20, width: 140, height: 50 }]}>
          <Text style={styles.buildingLabel}>{tr('Cantina', 'Canteen')}</Text>
        </View>

        <View style={[styles.building, styles.reitoria, { top: 520, left: 180, width: 100, height: 60 }]}>
          <Text style={styles.buildingLabel}>{tr('Reitoria', 'Rectory')}</Text>
        </View>
      </View>

      {/* Floating UI Elements */}
      <SafeAreaView style={styles.uiContainer} pointerEvents="box-none">
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buildingLabel: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  biblioteca: {
    backgroundColor: '#BCCEE0',
  },
  blocoA: {
    backgroundColor: '#B4D2D4',
  },
  blocoB: {
    backgroundColor: '#BCD8C1',
  },
  cantina: {
    backgroundColor: '#CCD8CA',
  },
  reitoria: {
    backgroundColor: '#D1D1D6',
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
