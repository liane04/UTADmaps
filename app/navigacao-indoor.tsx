import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import blocoA from '../assets/data/pavilhoes/bloco-a.json';
import { aStar, comprimentoCaminho, type Grafo, type No } from './lib/pathfinding';

type Local = {
  id: string;
  nome: string;
  tipo: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
};

type Piso = {
  numero: number;
  largura: number;
  altura: number;
  locais: Local[];
  grafo: Grafo;
};

export default function NavigacaoIndoorScreen() {
  const router = useRouter();
  const { destino } = useLocalSearchParams<{ destino?: string }>();

  const piso = blocoA.pisos[0] as Piso;
  const PLANTA_W = piso.largura;
  const PLANTA_H = piso.altura;

  // Encontra o local de destino (fallback: Sala 2.1)
  const localDestino = useMemo<Local>(() => {
    const encontrado = piso.locais.find((l) => l.id === destino);
    return encontrado ?? piso.locais.find((l) => l.id === 's1')!;
  }, [destino, piso]);

  // Calcula a rota do nó "escada" até à porta do local
  const { caminho, passos } = useMemo(() => {
    const portaDestino = piso.grafo.nos.find((n) => n.tipo === 'porta' && n.local === localDestino.id);
    if (!portaDestino) return { caminho: [] as No[], passos: 0 };
    const c = aStar(piso.grafo, 'esc', portaDestino.id) ?? [];
    return { caminho: c, passos: Math.round(comprimentoCaminho(c) / 60) };
  }, [piso, localDestino]);

  const corDoLocal = (tipo: string, isTarget: boolean) => {
    if (isTarget) return '#4A4A4A';
    if (tipo === 'servico') return '#FFE0B2';
    if (tipo === 'sala') return '#BBDEFB';
    return '#E5E5EA';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Navegação Indoor</Text>
        <View style={styles.floorPill}>
          <Text style={styles.floorPillText}>Piso {piso.numero}</Text>
        </View>
      </View>

      <Text style={styles.roomTitle}>
        {localDestino.nome} - {blocoA.nome}
      </Text>

      {/* Planta */}
      <View style={styles.mapContainer}>
        <View style={[styles.plantaWrapper, { aspectRatio: PLANTA_W / PLANTA_H }]}>
          {/* Salas/Serviços */}
          {piso.locais.map((local) => {
            const isTarget = local.id === localDestino.id;
            return (
              <View
                key={local.id}
                style={[
                  styles.room,
                  {
                    left: `${(local.x / PLANTA_W) * 100}%`,
                    top: `${(local.y / PLANTA_H) * 100}%`,
                    width: `${(local.largura / PLANTA_W) * 100}%`,
                    height: `${(local.altura / PLANTA_H) * 100}%`,
                    backgroundColor: corDoLocal(local.tipo, isTarget),
                  },
                ]}>
                <Text style={[styles.roomLabel, isTarget && styles.roomLabelTarget]}>{local.nome}</Text>
              </View>
            );
          })}

          {/* Corredor (faixa horizontal cinzenta ao centro, ajuda a leitura visual) */}
          <View
            style={[
              styles.corridorStrip,
              {
                left: '3%',
                right: '3%',
                top: `${(250 / PLANTA_H) * 100}%`,
                height: `${(100 / PLANTA_H) * 100}%`,
              },
            ]}
          />

          {/* Segmentos da rota */}
          {caminho.slice(1).map((no, i) => {
            const prev = caminho[i];
            const dx = no.x - prev.x;
            const dy = no.y - prev.y;
            const length = Math.hypot(dx, dy);
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            const midX = (prev.x + no.x) / 2;
            const midY = (prev.y + no.y) / 2;
            return (
              <View
                key={`seg-${i}`}
                style={{
                  position: 'absolute',
                  left: `${(midX / PLANTA_W) * 100 - (length / PLANTA_W) * 50}%`,
                  top: `${(midY / PLANTA_H) * 100}%`,
                  width: `${(length / PLANTA_W) * 100}%`,
                  height: 4,
                  marginTop: -2,
                  backgroundColor: '#2196F3',
                  transform: [{ rotate: `${angle}deg` }],
                  borderRadius: 2,
                }}
              />
            );
          })}

          {/* Marcador de início */}
          {caminho[0] && (
            <View
              style={[
                styles.markerStart,
                {
                  left: `${(caminho[0].x / PLANTA_W) * 100}%`,
                  top: `${(caminho[0].y / PLANTA_H) * 100}%`,
                },
              ]}>
              <Text style={styles.markerLabel}>Escadas</Text>
            </View>
          )}

          {/* Marcador de destino */}
          {caminho.length > 0 && (
            <View
              style={[
                styles.markerEnd,
                {
                  left: `${(caminho[caminho.length - 1].x / PLANTA_W) * 100}%`,
                  top: `${(caminho[caminho.length - 1].y / PLANTA_H) * 100}%`,
                },
              ]}
            />
          )}
        </View>

        <View style={styles.compassContainer}>
          <Ionicons name="compass-outline" size={36} color="#8E8E93" />
        </View>
      </View>

      {/* Painel inferior */}
      <View style={styles.bottomPanel}>
        <View style={styles.instructionCard}>
          <Ionicons name="navigate" size={32} color="#2196F3" style={styles.instructionIcon} />
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionTitle}>Siga pelo corredor</Text>
            <Text style={styles.instructionSubtitle}>
              Destino: {localDestino.nome} ({caminho.length} nós, ~{passos} passos)
            </Text>
            <Text style={styles.instructionStep}>Rota calculada com A*</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Terminar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  backText: {
    fontSize: 16,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  floorPill: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    width: 80,
    alignItems: 'center',
  },
  floorPillText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  plantaWrapper: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  corridorStrip: {
    position: 'absolute',
    backgroundColor: '#EAEAEF',
    borderRadius: 4,
  },
  room: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  roomLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  roomLabelTarget: {
    color: '#FFFFFF',
  },
  markerStart: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2196F3',
    marginLeft: -6,
    marginTop: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    position: 'absolute',
    top: 14,
    fontSize: 10,
    color: '#2196F3',
    fontWeight: '600',
    width: 60,
    textAlign: 'center',
    marginLeft: -24,
  },
  markerEnd: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F44336',
    marginLeft: -7,
    marginTop: -7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  compassContainer: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomPanel: {
    padding: 16,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  instructionIcon: {
    marginRight: 16,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructionSubtitle: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  instructionStep: {
    fontSize: 12,
    color: '#8E8E93',
  },
  button: {
    backgroundColor: '#2C2C2E',
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
