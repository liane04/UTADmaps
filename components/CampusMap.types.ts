export type Coord = { latitude: number; longitude: number };

export type Region = Coord & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type CampusMarker = {
  id: string;
  coordinate: Coord;
  title?: string;
  color?: string;
  /** Letra/símbolo curto (1 char) desenhado dentro do marker para distinção sem depender só de cor (acessibilidade WCAG 2.2). */
  symbol?: string;
  onPress?: () => void;
};

export type CampusRoute = {
  coordinates: Coord[];
  color?: string;
  width?: number;
  dashed?: boolean;
};

export type CampusMapPadding =
  | number
  | { top: number; right: number; bottom: number; left: number };

export interface CampusMapHandle {
  animateToRegion: (region: Region, durationMs?: number) => void;
  fitToCoordinates: (
    coords: Coord[],
    opts?: { padding?: CampusMapPadding; animated?: boolean },
  ) => void;
}

export interface CampusMapProps {
  initialRegion: Region;
  markers?: CampusMarker[];
  route?: CampusRoute;
  showsUserLocation?: boolean;
  userLocation?: Coord | null;
  onPress?: () => void;
  onPanDrag?: () => void;
  style?: any;
}
