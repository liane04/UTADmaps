import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CampusMap from '../../components/CampusMap';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  POLO1_CENTER,
  POLO1_BUILDINGS,
  Building,
  TIPO_COR,
  TIPO_SIMBOLO,
  TIPO_LABEL_PT,
  TIPO_LABEL_EN,
} from '../../constants/polo1Data';

export default function MapaScreen() {
  const router = useRouter();
  const { colors, fs } = useSettings();
  const { tr, language } = useLanguage();

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const totalRooms = (b: Building) =>
    b.floors.reduce((sum, floor) => sum + floor.rooms.length, 0);

  const markers = useMemo(
    () =>
      POLO1_BUILDINGS.map(b => ({
        id: b.id,
        coordinate: b.coordinate,
        title: language === 'pt' ? b.name.pt : b.name.en,
        color: TIPO_COR[b.tipo],
        symbol: TIPO_SIMBOLO[b.tipo],
        onPress: () => setSelectedBuilding(b),
      })),
    [language],
  );

  const handleGo = () => {
    if (!selectedBuilding) return;
    const dest = {
      destLat: selectedBuilding.coordinate.latitude.toString(),
      destLng: selectedBuilding.coordinate.longitude.toString(),
      destName: language === 'pt' ? selectedBuilding.name.pt : selectedBuilding.name.en,
    };
    setSelectedBuilding(null);
    router.push({ pathname: '/navigacao-outdoor', params: dest });
  };

  const handleIndoor = () => {
    if (!selectedBuilding) return;
    router.push({
      pathname: '/indoor-3d',
      params: {
        buildingId: selectedBuilding.id,
        buildingName: language === 'pt' ? selectedBuilding.name.pt : selectedBuilding.name.en,
        floors: JSON.stringify(selectedBuilding.floors.map(f => f.level)),
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <CampusMap
        initialRegion={POLO1_CENTER}
        markers={markers}
        onPress={() => setSelectedBuilding(null)}
      />

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

        {/* Bottom Right Controls — hidden when card is open */}
        {!selectedBuilding && (
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
        )}
      </SafeAreaView>

      {/* Location info card (Google-Maps style mini-tab) */}
      {selectedBuilding && (
        <SafeAreaView edges={['bottom']} style={styles.cardContainer} pointerEvents="box-none">
          <View style={[styles.placeCard, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTextWrap}>
                <Text
                  style={[styles.placeName, { color: colors.text, fontSize: fs(18) }]}
                  numberOfLines={2}
                >
                  {language === 'pt' ? selectedBuilding.name.pt : selectedBuilding.name.en}
                </Text>
                <Text style={[styles.placeDescription, { fontSize: fs(13) }]}>
                  {(language === 'pt' ? TIPO_LABEL_PT : TIPO_LABEL_EN)[selectedBuilding.tipo]}
                  {selectedBuilding.floors.length > 0
                    ? ` · ${selectedBuilding.floors.length} ${tr('pisos', 'floors')} · ${totalRooms(selectedBuilding)} ${tr('salas', 'rooms')}`
                    : ''}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedBuilding(null)}
                style={styles.closeBtn}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.actionRow}>
              {selectedBuilding.hasIndoor && (
                <TouchableOpacity
                  style={[styles.indoorButton, { borderColor: colors.border }]}
                  onPress={handleIndoor}
                  activeOpacity={0.85}
                >
                  <Ionicons name="layers-outline" size={18} color={colors.text} />
                  <Text style={[styles.indoorButtonText, { color: colors.text, fontSize: fs(14) }]}>
                    {tr('Explorar Indoor', 'Explore Indoor')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.goButton, { flex: selectedBuilding.hasIndoor ? 1 : undefined }]}
                onPress={handleGo}
                activeOpacity={0.85}
              >
                <Ionicons name="navigate" size={18} color="#FFFFFF" />
                <Text style={[styles.goButtonText, { fontSize: fs(16) }]}>{tr('Ir', 'Go')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
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
  cardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  closeBtn: {
    padding: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  indoorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  indoorButtonText: {
    fontWeight: '600',
  },
  goButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    paddingHorizontal: 24,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
