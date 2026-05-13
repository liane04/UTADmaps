// Hook simples que pega a posição GPS uma vez ao montar (silencioso).
// Útil para decisões "está dentro do polo?" antes de navegar.
//
// Não pede permissão se o utilizador já a negou — falha silenciosamente.
// Para casos que precisem de tracking contínuo (navegação outdoor),
// usar `Location.watchPositionAsync` directamente.

import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coord } from './geo';

export function useUserLocation() {
  const [location, setLocation] = useState<Coord | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest, // rápido, baixo consumo
        });
        if (cancelled) return;
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch {
        // silencioso
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return location;
}
