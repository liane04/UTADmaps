import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tema = 'claro' | 'escuro';
export type TamanhoTexto = 'pequeno' | 'normal' | 'grande';

const FONT_SCALES: Record<TamanhoTexto, number> = {
  pequeno: 0.85,
  normal: 1.0,
  grande: 1.2,
};

export interface Colors {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  divider: string;
  inputBg: string;
  primary: string;
  tabBar: string;
  tabBarBorder: string;
}

const lightColors: Colors = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  subtext: '#8E8E93',
  border: '#E5E5EA',
  divider: '#C7C7CC',
  inputBg: '#E5E5EA',
  primary: '#2C2C2E',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E5EA',
};

const darkColors: Colors = {
  bg: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  subtext: '#8E8E93',
  border: '#38383A',
  divider: '#38383A',
  inputBg: '#2C2C2E',
  primary: '#FFFFFF',
  tabBar: '#1C1C1E',
  tabBarBorder: '#38383A',
};

// Cores para Alto Contraste
const highContrastLight: Colors = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  subtext: '#000000',
  border: '#000000',
  divider: '#000000',
  inputBg: '#FFFFFF',
  primary: '#000000',
  tabBar: '#FFFFFF',
  tabBarBorder: '#000000',
};

const highContrastDark: Colors = {
  bg: '#000000',
  card: '#000000',
  text: '#FFFFFF',
  subtext: '#FFFFFF',
  border: '#FFFFFF',
  divider: '#FFFFFF',
  inputBg: '#000000',
  primary: '#FFFFFF',
  tabBar: '#000000',
  tabBarBorder: '#FFFFFF',
};

interface SettingsContextType {
  tema: Tema;
  setTema: (t: Tema) => void;
  colors: Colors;
  tamanhoTexto: TamanhoTexto;
  setTamanhoTexto: (t: TamanhoTexto) => void;
  fontScale: number;
  fs: (size: number) => number;
  altoContraste: boolean;
  setAltoContraste: (v: boolean) => void;
  rotasAcessiveis: boolean;
  setRotasAcessiveis: (v: boolean) => void;
  leitorEcra: boolean;
  setLeitorEcra: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  tema: 'claro',
  setTema: () => {},
  colors: lightColors,
  tamanhoTexto: 'normal',
  setTamanhoTexto: () => {},
  fontScale: 1,
  fs: (s) => s,
  altoContraste: false,
  setAltoContraste: () => {},
  rotasAcessiveis: true,
  setRotasAcessiveis: () => {},
  leitorEcra: false,
  setLeitorEcra: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [tema, setTemaState] = useState<Tema>('claro');
  const [tamanhoTexto, setTamanhoTextoState] = useState<TamanhoTexto>('normal');
  const [altoContraste, setAltoContrasteState] = useState<boolean>(false);
  const [rotasAcessiveis, setRotasAcessiveisState] = useState<boolean>(true);
  const [leitorEcra, setLeitorEcraState] = useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTema = await AsyncStorage.getItem('settings_tema');
        const storedTamanho = await AsyncStorage.getItem('settings_tamanhoTexto');
        const storedContraste = await AsyncStorage.getItem('settings_altoContraste');
        const storedRotas = await AsyncStorage.getItem('settings_rotasAcessiveis');
        const storedLeitor = await AsyncStorage.getItem('settings_leitorEcra');

        if (storedTema) setTemaState(storedTema as Tema);
        if (storedTamanho) setTamanhoTextoState(storedTamanho as TamanhoTexto);
        if (storedContraste !== null) setAltoContrasteState(storedContraste === 'true');
        if (storedRotas !== null) setRotasAcessiveisState(storedRotas === 'true');
        if (storedLeitor !== null) setLeitorEcraState(storedLeitor === 'true');
      } catch (e) {
        console.error('Error loading settings', e);
      }
    };
    loadSettings();
  }, []);

  const setTema = async (t: Tema) => {
    setTemaState(t);
    await AsyncStorage.setItem('settings_tema', t);
  };

  const setTamanhoTexto = async (t: TamanhoTexto) => {
    setTamanhoTextoState(t);
    await AsyncStorage.setItem('settings_tamanhoTexto', t);
  };

  const setAltoContraste = async (v: boolean) => {
    setAltoContrasteState(v);
    await AsyncStorage.setItem('settings_altoContraste', v.toString());
  };

  const setRotasAcessiveis = async (v: boolean) => {
    setRotasAcessiveisState(v);
    await AsyncStorage.setItem('settings_rotasAcessiveis', v.toString());
  };

  const setLeitorEcra = async (v: boolean) => {
    setLeitorEcraState(v);
    await AsyncStorage.setItem('settings_leitorEcra', v.toString());
  };

  let colors = tema === 'escuro' ? darkColors : lightColors;
  if (altoContraste) {
    colors = tema === 'escuro' ? highContrastDark : highContrastLight;
  }

  const fontScale = FONT_SCALES[tamanhoTexto];
  const fs = (size: number) => Math.round(size * fontScale);

  return (
    <SettingsContext.Provider value={{
      tema, setTema,
      colors,
      tamanhoTexto, setTamanhoTexto,
      fontScale, fs,
      altoContraste, setAltoContraste,
      rotasAcessiveis, setRotasAcessiveis,
      leitorEcra, setLeitorEcra
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
