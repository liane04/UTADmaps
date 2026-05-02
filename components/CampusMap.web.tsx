import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet } from 'react-native';
import {
  CampusMapHandle,
  CampusMapProps,
  CampusMapPadding,
} from './CampusMap.types';

const LEAFLET_VERSION = '1.9.4';
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;

function ensureLeafletCss() {
  if (typeof document === 'undefined') return;
  const id = 'leaflet-css';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = LEAFLET_CSS_URL;
  document.head.appendChild(link);
}

function normalizePadding(p: CampusMapPadding | undefined): [number, number] {
  if (p == null) return [60, 60];
  if (typeof p === 'number') return [p, p];
  const x = Math.max(p.left, p.right);
  const y = Math.max(p.top, p.bottom);
  return [x, y];
}

function deltaToZoom(latitudeDelta: number): number {
  if (latitudeDelta <= 0) return 16;
  const zoom = Math.log2(360 / latitudeDelta);
  return Math.max(2, Math.min(19, Math.round(zoom)));
}

function makeColoredDivIcon(L: any, color: string) {
  const html = `<div style="
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${color};
    border: 3px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  "></div>`;
  return L.divIcon({
    className: 'campus-marker',
    html,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function makeUserLocationIcon(L: any) {
  const html = `<div style="
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1A73E8;
    border: 3px solid #fff;
    box-shadow: 0 0 0 6px rgba(26,115,232,0.25);
  "></div>`;
  return L.divIcon({
    className: 'campus-user-location',
    html,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export const CampusMap = forwardRef<CampusMapHandle, CampusMapProps>(function CampusMap(
  {
    initialRegion,
    markers,
    route,
    userLocation,
    onPress,
    onPanDrag,
    style,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<{ markers: any[]; userMarker: any | null; polyline: any | null }>({
    markers: [],
    userMarker: null,
    polyline: null,
  });
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    ensureLeafletCss();
    import('leaflet').then(mod => {
      if (cancelled) return;
      setLeaflet(mod.default ?? mod);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize map once Leaflet is ready and container is mounted
  useEffect(() => {
    if (!leaflet || !containerRef.current || mapRef.current) return;
    const L = leaflet;
    const map = L.map(containerRef.current, {
      center: [initialRegion.latitude, initialRegion.longitude],
      zoom: deltaToZoom(initialRegion.latitudeDelta),
      zoomControl: false,
      attributionControl: true,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    mapRef.current = map;

    if (onPress) {
      map.on('click', () => onPress());
    }
    if (onPanDrag) {
      map.on('dragstart', () => onPanDrag());
    }

    return () => {
      map.remove();
      mapRef.current = null;
      layersRef.current = { markers: [], userMarker: null, polyline: null };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaflet]);

  // Sync markers
  useEffect(() => {
    const map = mapRef.current;
    const L = leaflet;
    if (!map || !L) return;
    layersRef.current.markers.forEach(m => map.removeLayer(m));
    layersRef.current.markers = [];
    (markers ?? []).forEach(m => {
      const icon = makeColoredDivIcon(L, m.color ?? '#007AFF');
      const marker = L.marker([m.coordinate.latitude, m.coordinate.longitude], {
        icon,
        title: m.title,
      }).addTo(map);
      if (m.title) marker.bindTooltip(m.title);
      if (m.onPress) {
        marker.on('click', (ev: any) => {
          if (ev?.originalEvent) {
            L.DomEvent.stopPropagation(ev);
          }
          m.onPress?.();
        });
      }
      layersRef.current.markers.push(marker);
    });
  }, [markers, leaflet]);

  // Sync user location
  useEffect(() => {
    const map = mapRef.current;
    const L = leaflet;
    if (!map || !L) return;
    if (layersRef.current.userMarker) {
      map.removeLayer(layersRef.current.userMarker);
      layersRef.current.userMarker = null;
    }
    if (userLocation) {
      const marker = L.marker([userLocation.latitude, userLocation.longitude], {
        icon: makeUserLocationIcon(L),
        interactive: false,
        keyboard: false,
      }).addTo(map);
      layersRef.current.userMarker = marker;
    }
  }, [userLocation, leaflet]);

  // Sync polyline
  useEffect(() => {
    const map = mapRef.current;
    const L = leaflet;
    if (!map || !L) return;
    if (layersRef.current.polyline) {
      map.removeLayer(layersRef.current.polyline);
      layersRef.current.polyline = null;
    }
    if (route && route.coordinates.length > 1) {
      const latlngs = route.coordinates.map(c => [c.latitude, c.longitude]);
      const polyline = L.polyline(latlngs, {
        color: route.color ?? '#007AFF',
        weight: route.width ?? 4,
        opacity: 0.9,
        dashArray: route.dashed ? '10 6' : undefined,
      }).addTo(map);
      layersRef.current.polyline = polyline;
    }
  }, [route, leaflet]);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region, durationMs = 400) => {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo(
        [region.latitude, region.longitude],
        deltaToZoom(region.latitudeDelta),
        { duration: durationMs / 1000 },
      );
    },
    fitToCoordinates: (coords, opts) => {
      const map = mapRef.current;
      const L = leaflet;
      if (!map || !L || coords.length === 0) return;
      const bounds = L.latLngBounds(
        coords.map(c => [c.latitude, c.longitude] as [number, number]),
      );
      const padding = normalizePadding(opts?.padding);
      map.fitBounds(bounds, {
        padding,
        animate: opts?.animated !== false,
      });
    },
  }));

  return (
    <View style={[StyleSheet.absoluteFillObject, style]}>
      {/* Leaflet needs a real <div> with definite height to render */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }}
      />
    </View>
  );
});

export default CampusMap;
export * from './CampusMap.types';
