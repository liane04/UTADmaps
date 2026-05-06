import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import CampusMap, { CampusMapHandle } from '../components/CampusMap';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  POLO1_CENTER,
  OUTDOOR_ROUTE_END,
  getIndoorIdByName,
} from '../constants/polo1Data';

type Coord = { latitude: number; longitude: number };

type RouteMode = 'foot' | 'driving';

type Step = {
  type: string;
  modifier?: string;
  location: Coord;
  distance: number;     // metros desta perna
  street?: string;
};

// router.project-osrm.org só tem perfil 'driving' — sempre devolve tempos de carro.
// Para 'foot' usamos o servidor da OpenStreetMap (FOSSGIS) que tem perfis dedicados.
const OSRM_BASES: Record<RouteMode, string> = {
  foot: 'https://routing.openstreetmap.de/routed-foot/route/v1',
  driving: 'https://router.project-osrm.org/route/v1',
};

async function fetchOsrmRoute(
  start: Coord,
  end: Coord,
  mode: RouteMode,
): Promise<{ coords: Coord[]; distance: number; duration: number; steps: Step[] } | null> {
  const url = `${OSRM_BASES[mode]}/${mode}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&steps=true`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) return null;
    const route = data.routes[0];
    const coords: Coord[] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng }),
    );
    const steps: Step[] = [];
    for (const leg of route.legs ?? []) {
      for (const step of leg.steps ?? []) {
        const m = step.maneuver ?? {};
        const loc = m.location ?? [0, 0];
        steps.push({
          type: m.type ?? 'continue',
          modifier: m.modifier,
          location: { latitude: loc[1], longitude: loc[0] },
          distance: step.distance ?? 0,
          street: step.name || undefined,
        });
      }
    }
    return { coords, distance: route.distance, duration: route.duration, steps };
  } catch {
    return null;
  }
}

function formatDistance(m: number): string {
  if (m < 50) return `${Math.round(m / 5) * 5} m`;
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
}

function formatDuration(s: number): string {
  const min = Math.max(1, Math.round(s / 60));
  return `${min} min`;
}

// Distância Haversine em metros entre dois pontos GPS
function haversine(a: Coord, b: Coord): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

// Localiza uma manobra OSRM em PT/EN
function instrucaoStep(s: Step, language: 'pt' | 'en'): string {
  const dirPT: Record<string, string> = {
    left: 'à esquerda',
    right: 'à direita',
    'sharp left': 'fortemente à esquerda',
    'sharp right': 'fortemente à direita',
    'slight left': 'ligeiramente à esquerda',
    'slight right': 'ligeiramente à direita',
    straight: 'em frente',
    uturn: 'em sentido contrário',
  };
  const dirEN: Record<string, string> = {
    left: 'left',
    right: 'right',
    'sharp left': 'sharp left',
    'sharp right': 'sharp right',
    'slight left': 'slight left',
    'slight right': 'slight right',
    straight: 'straight',
    uturn: 'around',
  };
  const dir = language === 'pt' ? dirPT : dirEN;
  const street = s.street ? (language === 'pt' ? ` em ${s.street}` : ` on ${s.street}`) : '';

  switch (s.type) {
    case 'depart':
      return language === 'pt' ? 'Inicie o percurso' : 'Start your route';
    case 'arrive':
      return language === 'pt' ? 'Chegou ao destino' : 'You have arrived';
    case 'turn':
    case 'end of road':
    case 'fork':
    case 'merge':
    case 'on ramp':
    case 'off ramp': {
      const m = s.modifier ?? 'straight';
      if (m === 'straight') {
        return language === 'pt' ? `Continue em frente${street}` : `Continue straight${street}`;
      }
      return language === 'pt'
        ? `Vire ${dir[m] ?? m}${street}`
        : `Turn ${dir[m] ?? m}${street}`;
    }
    case 'roundabout':
    case 'rotary':
    case 'roundabout turn':
      return language === 'pt' ? 'Entre na rotunda' : 'Enter the roundabout';
    case 'continue':
    case 'new name':
      return language === 'pt' ? `Continue em frente${street}` : `Continue straight${street}`;
    default:
      return language === 'pt' ? 'Continue' : 'Continue';
  }
}

// Ícone Ionicons consoante o tipo de manobra
function iconeStep(s: Step): keyof typeof Ionicons.glyphMap {
  if (s.type === 'depart') return 'flag-outline';
  if (s.type === 'arrive') return 'flag';
  if (s.type === 'roundabout' || s.type === 'rotary') return 'sync-outline';
  const m = s.modifier ?? '';
  if (m.includes('left')) return 'arrow-back';
  if (m.includes('right')) return 'arrow-forward';
  if (m === 'uturn') return 'return-up-back';
  return 'arrow-up';
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

  const mapRef = useRef<CampusMapHandle | null>(null);

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
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapMovedByUser, setIsMapMovedByUser] = useState<boolean>(false);

  const indoorId = useMemo(() => getIndoorIdByName(destination.name), [destination.name]);

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

  const destinationMarker = useMemo(
    () => [
      {
        id: 'destination',
        coordinate: destination.coordinate,
        title: destination.name,
        color: '#007AFF',
      },
    ],
    [destination.coordinate, destination.name],
  );

  // Request GPS permission + watch position
  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError(tr('Sem permissão de localização', 'No location permission'));
          setLoading(false);
          return;
        }
        // Posição inicial (rápida)
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        // Atualizações contínuas para auto-avançar passos da rota
        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 5,
            timeInterval: 3000,
          },
          (l) =>
            setUserLocation({
              latitude: l.coords.latitude,
              longitude: l.coords.longitude,
            }),
        );
      } catch {
        setError(tr('Falha ao obter localização', 'Failed to get location'));
        setLoading(false);
      }
    })();
    return () => {
      sub?.remove();
    };
  }, [tr]);

  // Fetch route from OSRM apenas quando o destino/modo muda (ou GPS inicial chega)
  // — não a cada movimento do utilizador
  const routeFetchedRef = useRef<string>('');
  useEffect(() => {
    if (!userLocation) return;
    const key = `${destination.coordinate.latitude},${destination.coordinate.longitude},${mode}`;
    if (routeFetchedRef.current === key) return;
    routeFetchedRef.current = key;
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
        setSteps(result.steps);
        setStepIdx(0);
      } else {
        setRouteCoords([userLocation, destination.coordinate]);
        setDistanceM(null);
        setDurationS(null);
        setSteps([]);
        setError(tr('Sem rota disponível — a mostrar linha directa', 'No route available — showing straight line'));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userLocation, destination.coordinate, mode, tr]);

  // Auto-avançar passo quando o utilizador passa próximo do waypoint da manobra
  useEffect(() => {
    if (!userLocation || steps.length === 0) return;
    const next = steps[stepIdx + 1];
    if (!next) return;
    const dist = haversine(userLocation, next.location);
    if (dist < 25) setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  }, [userLocation, steps, stepIdx]);

  // Distância até à próxima manobra (para mostrar "em X m")
  const distanciaProximaManobra = useMemo(() => {
    if (!userLocation || steps.length === 0) return null;
    const next = steps[stepIdx + 1] ?? steps[stepIdx];
    if (!next) return null;
    return Math.round(haversine(userLocation, next.location));
  }, [userLocation, steps, stepIdx]);

  const stepActual = steps[stepIdx];

  // Fit map to user + destination once route is ready
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.fitToCoordinates(
      routeCoords && routeCoords.length > 1
        ? routeCoords
        : [userLocation, destination.coordinate],
      {
        padding: { top: 120, right: 60, bottom: 260, left: 60 },
        animated: true,
      },
    );
  }, [routeCoords, userLocation, destination.coordinate]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <CampusMap
        ref={mapRef}
        initialRegion={POLO1_CENTER}
        markers={destinationMarker}
        route={
          routeCoords
            ? { coordinates: routeCoords, color: '#007AFF', width: 4, dashed: true }
            : undefined
        }
        showsUserLocation
        userLocation={userLocation}
        onPanDrag={() => setIsMapMovedByUser(true)}
      />

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

        {/* Instrução turn-by-turn em destaque */}
        {stepActual && !loading && (
          <View style={[styles.stepCard, { backgroundColor: colors.inputBg }]}>
            <View style={[styles.stepIconWrap, { backgroundColor: colors.card }]}>
              <Ionicons name={iconeStep(stepActual)} size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.stepInstruction, { color: colors.text }]} numberOfLines={2}>
                {instrucaoStep(stepActual, language)}
              </Text>
              <View style={styles.stepMeta}>
                {distanciaProximaManobra != null && stepIdx < steps.length - 1 && (
                  <Text style={[styles.stepDistance, { color: colors.subtext }]}>
                    {tr('em', 'in')} {formatDistance(distanciaProximaManobra)}
                  </Text>
                )}
                <Text style={[styles.stepCount, { color: colors.subtext }]}>
                  {tr('Passo', 'Step')} {stepIdx + 1}/{steps.length}
                </Text>
              </View>
            </View>
            {/* Botões prev/next manuais (fallback) */}
            <View style={styles.stepNav}>
              <TouchableOpacity
                onPress={() => setStepIdx((i) => Math.max(0, i - 1))}
                disabled={stepIdx === 0}
                style={[styles.stepNavBtn, { opacity: stepIdx === 0 ? 0.3 : 1 }]}
                accessibilityRole="button"
                accessibilityLabel={tr('Passo anterior', 'Previous step')}>
                <Ionicons name="chevron-back" size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
                disabled={stepIdx >= steps.length - 1}
                style={[styles.stepNavBtn, { opacity: stepIdx >= steps.length - 1 ? 0.3 : 1 }]}
                accessibilityRole="button"
                accessibilityLabel={tr('Próximo passo', 'Next step')}>
                <Ionicons name="chevron-forward" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}

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
            {error && (
              <Text style={[styles.instruction, { color: '#FF3B30' }]} numberOfLines={2}>
                {error}
              </Text>
            )}
          </View>

          <View style={[styles.modeToggle, { backgroundColor: colors.inputBg }]}>
            <TouchableOpacity
              style={[
                styles.modePill,
                mode === 'foot' && [styles.modePillActive, { backgroundColor: colors.card }],
              ]}
              onPress={() => setMode('foot')}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'foot' }}
              accessibilityLabel={tr('A pé', 'Walking')}>
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
              accessibilityRole="button"
              accessibilityState={{ selected: mode === 'driving' }}
              accessibilityLabel={tr('Carro', 'Car')}>
              <Text style={[styles.modeText, mode === 'driving' && styles.modeTextActive]}>
                {tr('Carro', 'Car')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão de transição outdoor → indoor (só se o destino tiver indoor) */}
        {indoorId && (
          <TouchableOpacity
            style={[styles.indoorButton, { backgroundColor: colors.primary }]}
            onPress={() =>
              router.replace({
                pathname: '/indoor-3d',
                params: {
                  buildingId: indoorId,
                  buildingName: destination.name,
                  floors: JSON.stringify([0, 1, 2]),
                },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={tr('Entrar no edifício', 'Enter the building')}>
            <Ionicons name="enter-outline" size={20} color={colors.bg} />
            <Text style={[styles.indoorButtonText, { color: colors.bg }]}>
              {tr('Entrar no edifício', 'Enter the building')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: indoorId ? colors.inputBg : colors.primary }]}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          accessibilityRole="button"
          accessibilityLabel={tr('Terminar', 'Finish')}>
          <Text style={[styles.buttonText, { color: indoorId ? colors.text : colors.bg }]}>
            {tr('Terminar', 'Finish')}
          </Text>
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
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Indicações turn-by-turn
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    gap: 12,
  },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInstruction: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepDistance: {
    fontSize: 12,
    fontWeight: '500',
  },
  stepCount: {
    fontSize: 12,
  },
  stepNav: {
    flexDirection: 'row',
    gap: 4,
  },
  stepNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Botão de transição indoor
  indoorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    paddingVertical: 14,
    marginBottom: 8,
    minHeight: 48,
  },
  indoorButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
