import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  POLO1_CENTER,
  OUTDOOR_ROUTE_END,
} from '../constants/polo1Data';

type Coord = { latitude: number; longitude: number };

type RouteMode = 'foot' | 'driving';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';

async function fetchOsrmRoute(
  start: Coord,
  end: Coord,
  mode: RouteMode,
): Promise<{ coords: Coord[]; distance: number; duration: number } | null> {
  const url = `${OSRM_BASE}/${mode}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;
    const route = data.routes[0];
    const coords: Coord[] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng }),
    );
    return { coords, distance: route.distance, duration: route.duration };
  } catch {
    return null;
  }
}

function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

function formatDuration(s: number): string {
  const min = Math.max(1, Math.round(s / 60));
  return `${min} min`;
}

export default function NavigacaoOutdoorScreen() {
  const router = useRouter();

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Ionicons name="map-outline" size={64} color="#999" />
        <Text style={{ fontSize: 18, color: '#555', marginTop: 16, textAlign: 'center', paddingHorizontal: 32 }}>
          Navegação outdoor não está disponível na versão web.{'\n'}Use a app móvel.
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  const { colors } = useSettings();
  const { tr } = useLanguage();
  const params = useLocalSearchParams<{
    destLat?: string;
    destLng?: string;
    destName?: string;
  }>();

  const mapRef = useRef<MapView | null>(null);

  const destination = useMemo<{ coordinate: Coord; name: string }>(() => {
    if (params.destLat && params.destLng) {
      return {
        coordinate: {
          latitude: parseFloat(params.destLat),
          longitude: parseFloat(params.destLng),
        },
        name: params.destName ?? tr('Destino', 'Destination'),
      };
    }
    return {
      coordinate: OUTDOOR_ROUTE_END.coordinate,
      name: tr(OUTDOOR_ROUTE_END.name.pt, OUTDOOR_ROUTE_END.name.en),
    };
  }, [params.destLat, params.destLng, params.destName, tr]);

  const [mode, setMode] = useState<RouteMode>('foot');
  const [userLocation, setUserLocation] = useState<Coord | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[] | null>(null);
  const [distanceM, setDistanceM] = useState<number | null>(null);
  const [durationS, setDurationS] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapMovedByUser, setIsMapMovedByUser] = useState<boolean>(false);

  const recenterOnUser = () => {
    if (!userLocation || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0025,
        longitudeDelta: 0.0025,
      },
      400,
    );
    setIsMapMovedByUser(false);
  };

  // Request GPS permission + position once on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError(tr('Sem permissão de localização', 'No location permission'));
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch {
        setError(tr('Falha ao obter localização', 'Failed to get location'));
        setLoading(false);
      }
    })();
  }, [tr]);

  // Fetch route from OSRM whenever userLocation, destination or mode changes
  useEffect(() => {
    if (!userLocation) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const result = await fetchOsrmRoute(userLocation, destination.coordinate, mode);
      if (cancelled) return;
      if (result) {
        setRouteCoords(result.coords);
        setDistanceM(result.distance);
        setDurationS(result.duration);
      } else {
        // Fallback: straight line
        setRouteCoords([userLocation, destination.coordinate]);
        setDistanceM(null);
        setDurationS(null);
        setError(tr('Sem rota disponível — a mostrar linha directa', 'No route available — showing straight line'));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userLocation, destination.coordinate, mode, tr]);

  // Fit map to user + destination once route is ready
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.fitToCoordinates(
      routeCoords && routeCoords.length > 1
        ? routeCoords
        : [userLocation, destination.coordinate],
      {
        edgePadding: { top: 120, right: 60, bottom: 260, left: 60 },
        animated: true,
      },
    );
  }, [routeCoords, userLocation, destination.coordinate]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={POLO1_CENTER}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onPanDrag={() => setIsMapMovedByUser(true)}
      >
        <Marker
          coordinate={destination.coordinate}
          title={destination.name}
          pinColor="#007AFF"
        />
        {routeCoords && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
            lineDashPattern={[10, 5] as any}
          />
        )}
      </MapView>

      {/* Recenter button — Google Maps style */}
      {userLocation && isMapMovedByUser && (
        <TouchableOpacity
          style={[styles.recenterButton, { backgroundColor: colors.card }]}
          onPress={recenterOnUser}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* Header Overlay */}
      <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {destination.name}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Panel */}
      <View style={[styles.bottomPanel, { backgroundColor: colors.card }]}>
        <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <View style={styles.infoTextWrap}>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.text} />
                <Text style={[styles.timeDistance, { color: colors.text, marginLeft: 8 }]}>
                  {tr('A calcular rota...', 'Calculating route...')}
                </Text>
              </View>
            ) : distanceM != null && durationS != null ? (
              <Text style={[styles.timeDistance, { color: colors.text }]} numberOfLines={1}>
                {formatDistance(distanceM)} · {formatDuration(durationS)}{' '}
                {mode === 'foot' ? tr('a pé', 'walking') : tr('de carro', 'driving')}
              </Text>
            ) : (
              <Text style={[styles.timeDistance, { color: colors.text }]} numberOfLines={1}>
                {destination.name}
              </Text>
            )}
            <Text style={styles.instruction} numberOfLines={2}>
              {error ?? destination.name}
            </Text>
          </View>

          <View style={[styles.modeToggle, { backgroundColor: colors.inputBg }]}>
            <TouchableOpacity
              style={[
                styles.modePill,
                mode === 'foot' && [styles.modePillActive, { backgroundColor: colors.card }],
              ]}
              onPress={() => setMode('foot')}
            >
              <Text style={[styles.modeText, mode === 'foot' && styles.modeTextActive]}>
                {tr('A pé', 'Walking')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modePill,
                mode === 'driving' && [styles.modePillActive, { backgroundColor: colors.card }],
              ]}
              onPress={() => setMode('driving')}
            >
              <Text style={[styles.modeText, mode === 'driving' && styles.modeTextActive]}>
                {tr('Carro', 'Car')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
        >
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
    flex: 1,
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
  recenterButton: {
    position: 'absolute',
    right: 16,
    bottom: 240,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
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
  infoTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeDistance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 14,
    color: '#8E8E93',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
    padding: 4,
  },
  modePill: {
    paddingHorizontal: 14,
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
