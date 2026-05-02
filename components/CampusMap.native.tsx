import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, MapPressEvent } from 'react-native-maps';
import {
  CampusMapHandle,
  CampusMapProps,
  CampusMapPadding,
} from './CampusMap.types';

function normalizePadding(p: CampusMapPadding | undefined) {
  if (p == null) return { top: 80, right: 60, bottom: 80, left: 60 };
  if (typeof p === 'number') return { top: p, right: p, bottom: p, left: p };
  return p;
}

export const CampusMap = forwardRef<CampusMapHandle, CampusMapProps>(function CampusMap(
  {
    initialRegion,
    markers,
    route,
    showsUserLocation,
    onPress,
    onPanDrag,
    style,
  },
  ref,
) {
  const mapRef = useRef<MapView | null>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region, durationMs = 400) => {
      mapRef.current?.animateToRegion(region, durationMs);
    },
    fitToCoordinates: (coords, opts) => {
      const padding = normalizePadding(opts?.padding);
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: padding,
        animated: opts?.animated !== false,
      });
    },
  }));

  return (
    <MapView
      ref={mapRef}
      style={style ?? StyleSheet.absoluteFillObject}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      showsUserLocation={!!showsUserLocation}
      showsMyLocationButton={false}
      showsCompass={false}
      showsScale={false}
      rotateEnabled={false}
      pitchEnabled={false}
      onPress={(_e: MapPressEvent) => onPress?.()}
      onPanDrag={() => onPanDrag?.()}
    >
      {markers?.map(m => (
        <Marker
          key={m.id}
          coordinate={m.coordinate}
          title={m.title}
          pinColor={m.color ?? '#007AFF'}
          onPress={(e) => {
            e.stopPropagation();
            m.onPress?.();
          }}
        />
      ))}
      {route && route.coordinates.length > 1 && (
        <Polyline
          coordinates={route.coordinates}
          strokeColor={route.color ?? '#007AFF'}
          strokeWidth={route.width ?? 4}
          lineDashPattern={route.dashed ? ([10, 5] as any) : undefined}
        />
      )}
    </MapView>
  );
});

export default CampusMap;
export * from './CampusMap.types';
