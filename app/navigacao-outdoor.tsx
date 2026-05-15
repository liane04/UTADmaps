import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import CampusMap, { CampusMapHandle } from '../components/CampusMap';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';
import {
  POLO1_CENTER,
  POLO1_BUILDINGS,
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
  timeoutMs = 15000,
): Promise<{ coords: Coord[]; distance: number; duration: number; steps: Step[] } | null> {
  const url = `${OSRM_BASES[mode]}/${mode}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&steps=true`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
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
  } finally {
    clearTimeout(timer);
  }
}

// Limite acima do qual nem tentamos chamar o OSRM — o servidor público é muito
// lento para rotas longas e faz mais sentido informar o utilizador.
const MAX_ROUTE_DISTANCE_M = 30000; // 30 km

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
  const { colors, fs } = useSettings();
  const { tr, language } = useLanguage();
  const { token } = useAppStore();
  const params = useLocalSearchParams<{
    destLat?: string;
    destLng?: string;
    destName?: string;
    /** Sala alvo dentro do indoor (ex: 'F0.01'). Propagada ao botão "Entrar no edifício". */
    indoorDestino?: string;
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
  // Origem da rota: 'gps' = posição atual; ou id de um building em POLO1_BUILDINGS
  const [origemId, setOrigemId] = useState<string>('gps');
  const [origemPickerOpen, setOrigemPickerOpen] = useState(false);
  // Pesquisa de origem dentro do modal
  const [origemSearch, setOrigemSearch] = useState('');
  const [routeCoords, setRouteCoords] = useState<Coord[] | null>(null);
  const [distanceM, setDistanceM] = useState<number | null>(null);
  const [durationS, setDurationS] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapMovedByUser, setIsMapMovedByUser] = useState<boolean>(false);
  // Fase da navegação: 'planning' = configurar rota; 'navigating' = a seguir indicações
  const [navStarted, setNavStarted] = useState<boolean>(false);

  const indoorId = useMemo(() => getIndoorIdByName(destination.name), [destination.name]);

  // Coord efectiva de origem da rota: GPS quando origemId === 'gps', senão o
  // edifício selecionado. Usado para o request OSRM e marker no mapa.
  const origemCoord = useMemo<Coord | null>(() => {
    if (origemId === 'gps') return userLocation;
    const b = POLO1_BUILDINGS.find((x) => x.id === origemId);
    if (!b) return userLocation;
    return b.entrada ?? b.coordinate;
  }, [origemId, userLocation]);

  const origemNome = useMemo(() => {
    if (origemId === 'gps') return tr('A minha localização', 'My location');
    const b = POLO1_BUILDINGS.find((x) => x.id === origemId);
    return b ? (tr(b.name.pt, b.name.en)) : tr('A minha localização', 'My location');
  }, [origemId, tr]);

  // Regista a navegação no histórico (uma vez por destino, se autenticado).
  // Falha silenciosamente — não bloqueia a navegação.
  const historyLoggedRef = useRef<string>('');
  useEffect(() => {
    if (!token) return;
    const key = `${destination.coordinate.latitude},${destination.coordinate.longitude}|${destination.name}`;
    if (historyLoggedRef.current === key) return;
    historyLoggedRef.current = key;
    api
      .addHistory({
        destino_nome: destination.name,
        destino_categoria: 'edificio',
        navegacao_tipo: 'outdoor',
        lat: destination.coordinate.latitude,
        lon: destination.coordinate.longitude,
      })
      .catch(() => {
        // ignora — histórico não é crítico
      });
  }, [token, destination.coordinate.latitude, destination.coordinate.longitude, destination.name]);

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

  const mapMarkers = useMemo(() => {
    const arr = [
      {
        id: 'destination',
        coordinate: destination.coordinate,
        title: destination.name,
        color: '#FF3B30',
        symbol: 'D',
      },
    ];
    // Se a origem é um edifício (não GPS), mostra marker verde aí
    if (origemId !== 'gps') {
      const b = POLO1_BUILDINGS.find((x) => x.id === origemId);
      if (b) {
        arr.push({
          id: 'origin',
          coordinate: b.entrada ?? b.coordinate,
          title: tr(b.name.pt, b.name.en),
          color: '#34C759',
          symbol: 'O',
        });
      }
    }
    return arr;
  }, [destination.coordinate, destination.name, origemId, tr]);

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

  // Fetch route from OSRM quando origem/destino/modo muda
  const routeFetchedRef = useRef<string>('');
  useEffect(() => {
    if (!origemCoord) return;
    const key = `${origemCoord.latitude},${origemCoord.longitude}|${destination.coordinate.latitude},${destination.coordinate.longitude},${mode}`;
    if (routeFetchedRef.current === key) return;
    routeFetchedRef.current = key;

    // Verifica primeiro se a origem está demasiado longe — evita timeout do OSRM
    const distLinhaReta = haversine(origemCoord, destination.coordinate);
    if (distLinhaReta > MAX_ROUTE_DISTANCE_M) {
      setRouteCoords([origemCoord, destination.coordinate]);
      setDistanceM(distLinhaReta);
      setDurationS(null);
      setSteps([]);
      setError(
        tr(
          `Estás a ${formatDistance(distLinhaReta)} do destino. Aproxima-te do campus para ver a rota detalhada.`,
          `You are ${formatDistance(distLinhaReta)} from the destination. Get closer to the campus to see the detailed route.`,
        ),
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const result = await fetchOsrmRoute(origemCoord, destination.coordinate, mode);
      if (cancelled) return;
      if (result) {
        setRouteCoords(result.coords);
        setDistanceM(result.distance);
        setDurationS(result.duration);
        setSteps(result.steps);
        setStepIdx(0);
      } else {
        setRouteCoords([origemCoord, destination.coordinate]);
        setDistanceM(distLinhaReta);
        setDurationS(null);
        setSteps([]);
        setError(
          tr(
            'Servidor de rotas não respondeu — a mostrar linha directa',
            'Routing server did not respond — showing straight line',
          ),
        );
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [origemCoord, destination.coordinate, mode, tr]);

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

  // Filtra POLO1_BUILDINGS pela pesquisa do utilizador (case + accent insensitive).
  const buildingsFiltrados = useMemo(() => {
    const q = origemSearch
      .toLocaleLowerCase('pt-PT')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
    if (!q) return POLO1_BUILDINGS;
    return POLO1_BUILDINGS.filter((b) => {
      const haystack = `${b.name.pt} ${b.name.en}`
        .toLocaleLowerCase('pt-PT')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
      return haystack.includes(q);
    });
  }, [origemSearch]);

  // Quando muda o destino (params), reinicia a fase para PLANNING.
  // Garante que voltar a navegar para uma nova sala não fica preso em modo navigating.
  useEffect(() => {
    setNavStarted(false);
  }, [destination.coordinate.latitude, destination.coordinate.longitude]);

  // Fit map à rota assim que estiver pronta (apenas em PLANNING).
  // Em NAVIGATING o mapa segue o utilizador (recenterOnUser) e não deve dar fit total.
  useEffect(() => {
    if (navStarted) return;
    if (!mapRef.current || !origemCoord) return;
    mapRef.current.fitToCoordinates(
      routeCoords && routeCoords.length > 1
        ? routeCoords
        : [origemCoord, destination.coordinate],
      {
        padding: { top: 200, right: 60, bottom: 280, left: 60 },
        animated: true,
      },
    );
  }, [routeCoords, origemCoord, destination.coordinate, navStarted]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <CampusMap
        ref={mapRef}
        initialRegion={POLO1_CENTER}
        markers={mapMarkers}
        route={
          routeCoords
            ? { coordinates: routeCoords, color: '#007AFF', width: 4, dashed: true }
            : undefined
        }
        showsUserLocation
        userLocation={userLocation}
        onPanDrag={() => setIsMapMovedByUser(true)}
      />

      {/* Recenter button — Google Maps style. Em NAVIGATING fica mais perto da rota. */}
      {userLocation && isMapMovedByUser && (
        <TouchableOpacity
          style={[
            styles.recenterButton,
            { backgroundColor: colors.card, bottom: navStarted ? 140 : 240 },
          ]}
          onPress={recenterOnUser}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={tr('Recentrar mapa na minha localização', 'Re-center map on my location')}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* ─────────────────────────────────────────────────────────────
          HEADER — varia consoante a fase
            • PLANNING (!navStarted): selector completo De → Para
            • NAVIGATING: card grande estilo Google Maps com a manobra atual
         ───────────────────────────────────────────────────────────── */}
      {!navStarted ? (
        <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
              style={styles.backIconBtn}
              accessibilityRole="button"
              accessibilityLabel={tr('Voltar', 'Back')}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text, fontSize: fs(16) }]} numberOfLines={1}>
              {tr('Pré-visualização da rota', 'Route preview')}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Linhas De / Para */}
          <View style={styles.routeFromTo}>
            <TouchableOpacity
              style={styles.routeRow}
              onPress={() => setOrigemPickerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={tr(`De: ${origemNome}. Tocar para mudar.`, `From: ${origemNome}. Tap to change.`)}>
              <View style={[styles.routeBullet, { backgroundColor: '#34C759' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.routeLabel, { color: colors.subtext, fontSize: fs(11) }]}>
                  {tr('De', 'From')}
                </Text>
                <Text style={[styles.routeValue, { color: colors.text, fontSize: fs(14) }]} numberOfLines={1}>
                  {origemNome}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={colors.subtext} />
            </TouchableOpacity>
            <View style={[styles.routeDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.routeRow}>
              <View style={[styles.routeBullet, { backgroundColor: '#FF3B30' }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.routeLabel, { color: colors.subtext, fontSize: fs(11) }]}>
                  {tr('Para', 'To')}
                </Text>
                <Text style={[styles.routeValue, { color: colors.text, fontSize: fs(14) }]} numberOfLines={1}>
                  {destination.name}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        // ─── NAVIGATING — card grande no topo com instrução actual ───
        <SafeAreaView edges={['top']} style={[styles.navHeader, { backgroundColor: colors.primary }]}>
          <View style={styles.navHeaderRow}>
            <TouchableOpacity
              onPress={() => setNavStarted(false)}
              style={styles.navHeaderBack}
              accessibilityRole="button"
              accessibilityLabel={tr('Voltar à pré-visualização', 'Back to preview')}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
              <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.navHeaderIconWrap}>
              <Ionicons
                name={stepActual ? iconeStep(stepActual) : 'navigate'}
                size={32}
                color="#FFFFFF"
              />
            </View>
            <View
              style={styles.navHeaderTextWrap}
              accessible
              accessibilityLiveRegion="polite"
              accessibilityLabel={
                stepActual
                  ? `${distanciaProximaManobra != null && stepIdx < steps.length - 1
                      ? `${tr('Em', 'In')} ${formatDistance(distanciaProximaManobra)}, `
                      : ''}${instrucaoStep(stepActual, language)}`
                  : tr('A calcular rota', 'Calculating route')
              }>
              {distanciaProximaManobra != null && stepIdx < steps.length - 1 && (
                <Text style={[styles.navHeaderDistance, { fontSize: fs(13) }]}>
                  {tr('Em', 'In')} {formatDistance(distanciaProximaManobra)}
                </Text>
              )}
              <Text style={[styles.navHeaderInstruction, { fontSize: fs(18) }]} numberOfLines={2}>
                {stepActual
                  ? instrucaoStep(stepActual, language)
                  : tr('A calcular rota...', 'Calculating route...')}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      )}

      {/* Modal selector de origem — com pesquisa */}
      <Modal
        visible={origemPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setOrigemPickerOpen(false);
          setOrigemSearch('');
        }}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setOrigemPickerOpen(false);
            setOrigemSearch('');
          }}
          accessibilityRole="button"
          accessibilityLabel={tr('Fechar seletor de ponto de partida', 'Close starting point picker')} />
        <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
          <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.modalTitle, { color: colors.text, fontSize: fs(18) }]}>
            {tr('Ponto de partida', 'Starting point')}
          </Text>

          {/* Barra de pesquisa */}
          <View style={[styles.searchBar, { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.subtext} />
            <TextInput
              style={[styles.searchInput, { color: colors.text, fontSize: fs(15) }]}
              value={origemSearch}
              onChangeText={setOrigemSearch}
              placeholder={tr('Pesquisar edifício...', 'Search building...')}
              placeholderTextColor={colors.subtext}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel={tr('Pesquisar edifício de partida', 'Search starting building')}
              accessibilityHint={tr(
                'Escreve parte do nome de um edifício para filtrar a lista abaixo',
                'Type part of a building name to filter the list below',
              )}
            />
            {origemSearch.length > 0 && (
              <TouchableOpacity
                onPress={() => setOrigemSearch('')}
                accessibilityRole="button"
                accessibilityLabel={tr('Limpar pesquisa', 'Clear search')}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name="close-circle" size={18} color={colors.subtext} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={{ maxHeight: 360 }} keyboardShouldPersistTaps="handled">
            {/* "A minha localização" — só se a pesquisa não filtrar */}
            {origemSearch.trim() === '' && (
              <>
                <TouchableOpacity
                  style={styles.modalRow}
                  onPress={() => {
                    setOrigemId('gps');
                    setOrigemPickerOpen(false);
                    setOrigemSearch('');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={tr('Usar a minha localização como ponto de partida', 'Use my location as starting point')}
                  accessibilityState={{ selected: origemId === 'gps' }}>
                  <Ionicons name="locate" size={20} color={colors.text} />
                  <Text style={[styles.modalRowText, { color: colors.text, fontSize: fs(15) }]}>
                    {tr('A minha localização', 'My location')}
                  </Text>
                  {origemId === 'gps' && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>
                <View style={[styles.modalDivider, { backgroundColor: colors.divider }]} />
              </>
            )}

            {buildingsFiltrados.length === 0 ? (
              <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                <Text style={{ color: colors.subtext, fontSize: fs(14) }}>
                  {tr('Sem resultados.', 'No results.')}
                </Text>
              </View>
            ) : (
              buildingsFiltrados.map((b) => (
                <View key={b.id}>
                  <TouchableOpacity
                    style={styles.modalRow}
                    onPress={() => {
                      setOrigemId(b.id);
                      setOrigemPickerOpen(false);
                      setOrigemSearch('');
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={tr(`Usar ${b.name.pt} como ponto de partida`, `Use ${b.name.en} as starting point`)}
                    accessibilityState={{ selected: origemId === b.id }}>
                    <Ionicons name="business-outline" size={20} color={colors.text} />
                    <Text style={[styles.modalRowText, { color: colors.text, fontSize: fs(15) }]} numberOfLines={1}>
                      {tr(b.name.pt, b.name.en)}
                    </Text>
                    {origemId === b.id && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                  <View style={[styles.modalDivider, { backgroundColor: colors.divider }]} />
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM PANEL — varia consoante a fase
            • PLANNING: distância + tempo + a pé/carro + [Começar Navegação]
            • NAVIGATING: card minimalista com tempo/distância restante + [Terminar]
         ───────────────────────────────────────────────────────────── */}
      {!navStarted ? (
        // ─── PLANNING ─────────────────────────────────────────────
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

          {/* Botão Começar — só se tivermos rota com passos */}
          <TouchableOpacity
            style={[
              styles.startButton,
              {
                backgroundColor: steps.length > 0 ? colors.primary : colors.inputBg,
                opacity: steps.length > 0 ? 1 : 0.5,
              },
            ]}
            onPress={() => {
              if (steps.length > 0) {
                setStepIdx(0);
                setNavStarted(true);
                // recentra no utilizador para começar a navegar
                setTimeout(() => recenterOnUser(), 200);
              }
            }}
            disabled={steps.length === 0}
            accessibilityRole="button"
            accessibilityLabel={tr('Começar Navegação', 'Start Navigation')}
            accessibilityHint={tr(
              'Inicia a navegação passo a passo com indicações de direção',
              'Starts step-by-step navigation with turn-by-turn directions',
            )}
            accessibilityState={{ disabled: steps.length === 0 }}>
            <Ionicons
              name="navigate"
              size={20}
              color={steps.length > 0 ? '#FFFFFF' : colors.subtext}
            />
            <Text
              style={[
                styles.startButtonText,
                { color: steps.length > 0 ? '#FFFFFF' : colors.subtext, fontSize: fs(16) },
              ]}>
              {tr('Começar Navegação', 'Start Navigation')}
            </Text>
          </TouchableOpacity>

          {/* Botão de transição outdoor → indoor (só se o destino tiver indoor) */}
          {indoorId && (
            <TouchableOpacity
              style={[styles.indoorButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border, marginTop: 8, marginBottom: 0 }]}
              onPress={() =>
                router.replace({
                  pathname: '/indoor-3d',
                  params: {
                    buildingId: indoorId,
                    buildingName: destination.name,
                    floors: JSON.stringify([0, 1, 2]),
                    ...(params.indoorDestino ? { destino: params.indoorDestino } : {}),
                  },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={tr('Entrar no edifício', 'Enter the building')}
              accessibilityHint={tr(
                'Abre directamente o mapa interior do edifício de destino',
                'Opens directly the indoor floor plan of the destination',
              )}>
              <Ionicons name="enter-outline" size={18} color={colors.text} />
              <Text style={[styles.indoorButtonText, { color: colors.text, fontSize: fs(14) }]}>
                {tr('Entrar no edifício', 'Enter the building')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        // ─── NAVIGATING — card minimalista ─────────────────────────
        <View style={[styles.navBottomPanel, { backgroundColor: colors.card }]}>
          <View style={styles.navBottomRow}>
            <View style={styles.navBottomInfo}>
              <Text style={[styles.navBottomTime, { color: colors.text, fontSize: fs(22) }]}>
                {durationS != null ? formatDuration(durationS) : '—'}
              </Text>
              <Text style={[styles.navBottomMeta, { color: colors.subtext, fontSize: fs(13) }]}>
                {distanceM != null ? formatDistance(distanceM) : ''}
                {' · '}
                {mode === 'foot' ? tr('a pé', 'walking') : tr('de carro', 'driving')}
                {steps.length > 0 ? ` · ${tr('Passo', 'Step')} ${stepIdx + 1}/${steps.length}` : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.terminateButton, { backgroundColor: '#FF3B30' }]}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
              accessibilityRole="button"
              accessibilityLabel={tr('Terminar navegação', 'End navigation')}>
              <Ionicons name="close" size={18} color="#FFFFFF" />
              <Text style={[styles.terminateButtonText, { fontSize: fs(15) }]}>
                {tr('Terminar', 'End')}
              </Text>
            </TouchableOpacity>
          </View>
          {indoorId && (
            <TouchableOpacity
              style={[styles.indoorButton, { backgroundColor: colors.primary, marginTop: 12, marginBottom: 0 }]}
              onPress={() =>
                router.replace({
                  pathname: '/indoor-3d',
                  params: {
                    buildingId: indoorId,
                    buildingName: destination.name,
                    floors: JSON.stringify([0, 1, 2]),
                    ...(params.indoorDestino ? { destino: params.indoorDestino } : {}),
                  },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={tr('Entrar no edifício', 'Enter the building')}>
              <Ionicons name="enter-outline" size={18} color="#FFFFFF" />
              <Text style={[styles.indoorButtonText, { color: '#FFFFFF', fontSize: fs(14) }]}>
                {tr('Entrar no edifício', 'Enter the building')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
    minHeight: 44,
  },
  backIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeFromTo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
    minHeight: 44,
  },
  routeBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLabel: {
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  routeValue: {
    fontWeight: '600',
  },
  routeDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 24,
  },
  // Modal selector de origem
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontWeight: '700',
    marginVertical: 12,
    marginLeft: 8,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 12,
    minHeight: 48,
  },
  modalRowText: {
    flex: 1,
    fontWeight: '500',
  },
  modalDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 40,
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

  // ───── Pesquisa de origem no modal ─────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    marginHorizontal: 4,
    gap: 8,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },

  // ───── Botão "Começar Navegação" (PLANNING) ─────
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 28,
    paddingVertical: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  startButtonText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ───── NAVIGATING — header card grande (estilo Google Maps) ─────
  navHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 6,
    gap: 8,
  },
  navHeaderBack: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHeaderIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHeaderTextWrap: {
    flex: 1,
    paddingHorizontal: 8,
  },
  navHeaderDistance: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  navHeaderInstruction: {
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 22,
  },

  // ───── NAVIGATING — bottom panel minimalista ─────
  navBottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  navBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  navBottomInfo: {
    flex: 1,
  },
  navBottomTime: {
    fontWeight: '700',
    marginBottom: 2,
  },
  navBottomMeta: {
    fontWeight: '500',
  },
  terminateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    minHeight: 44,
  },
  terminateButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
