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
const MARKERCLUSTER_VERSION = '1.5.3';
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const MARKERCLUSTER_CSS = [
  `https://unpkg.com/leaflet.markercluster@${MARKERCLUSTER_VERSION}/dist/MarkerCluster.css`,
  `https://unpkg.com/leaflet.markercluster@${MARKERCLUSTER_VERSION}/dist/MarkerCluster.Default.css`,
];

function ensureCss() {
  if (typeof document === 'undefined') return;
  const urls = [LEAFLET_CSS_URL, ...MARKERCLUSTER_CSS];
  urls.forEach((url, i) => {
    const id = `leaflet-css-${i}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  });
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

function makeCategoryIcon(L: any, color: string, symbol: string, accessibleLabel: string) {
  const safeSymbol = symbol ? symbol.replace(/[<>&"]/g, '') : '';
  const html = `<div role="img" aria-label="${accessibleLabel.replace(/"/g, '')}" style="
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${color};
    border: 3px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1;
  ">${safeSymbol}</div>`;
  return L.divIcon({
    className: 'campus-marker',
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function makeUserLocationIcon(L: any) {
  const html = `<div aria-label="Posição atual" style="
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

function makeClusterIconFactory(L: any) {
  return (cluster: any) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 36 : count < 25 ? 42 : 48;
    const fontSize = size > 40 ? 16 : 14;
    const html = `<div aria-label="${count} edifícios agrupados" style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.92);
      border: 3px solid #fff;
      box-shadow: 0 3px 8px rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: ${fontSize}px;
    ">${count}</div>`;
    return L.divIcon({
      className: 'campus-cluster',
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };
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
  const layersRef = useRef<{
    clusterGroup: any | null;
    userMarker: any | null;
    polyline: any | null;
  }>({
    clusterGroup: null,
    userMarker: null,
    polyline: null,
  });
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    ensureCss();
    (async () => {
      const Lmod = await import('leaflet');
      if (cancelled) return;
      // markercluster é side-effect: estende L com markerClusterGroup
      await import('leaflet.markercluster');
      if (cancelled) return;
      setLeaflet(Lmod.default ?? Lmod);
    })();
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
      layersRef.current = { clusterGroup: null, userMarker: null, polyline: null };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaflet]);

  // Sync markers via cluster group
  useEffect(() => {
    const map = mapRef.current;
    const L = leaflet;
    if (!map || !L) return;

    if (layersRef.current.clusterGroup) {
      map.removeLayer(layersRef.current.clusterGroup);
      layersRef.current.clusterGroup = null;
    }

    if (!markers || markers.length === 0) return;

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
      iconCreateFunction: makeClusterIconFactory(L),
    });

    markers.forEach(m => {
      const color = m.color ?? '#2563EB';
      const symbol = m.symbol ?? '·';
      const accessibleLabel = m.title ?? '';
      const icon = makeCategoryIcon(L, color, symbol, accessibleLabel);
      const marker = L.marker([m.coordinate.latitude, m.coordinate.longitude], {
        icon,
        title: m.title,
        keyboard: true,
        alt: m.title ?? '',
      });
      if (m.title) marker.bindTooltip(m.title, { direction: 'top', offset: [0, -14] });
      if (m.onPress) {
        marker.on('click', (ev: any) => {
          if (ev?.originalEvent) {
            L.DomEvent.stopPropagation(ev);
          }
          m.onPress?.();
        });
        marker.on('keypress', (ev: any) => {
          const key = ev?.originalEvent?.key;
          if (key === 'Enter' || key === ' ') {
            m.onPress?.();
          }
        });
      }
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    layersRef.current.clusterGroup = clusterGroup;
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
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }}
      />
    </View>
  );
});

export default CampusMap;
export * from './CampusMap.types';
