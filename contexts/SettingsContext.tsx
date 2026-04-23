import { createContext, useContext, useState, ReactNode } from 'react';

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

interface SettingsContextType {
  tema: Tema;
  setTema: (t: Tema) => void;
  colors: Colors;
  tamanhoTexto: TamanhoTexto;
  setTamanhoTexto: (t: TamanhoTexto) => void;
  fontScale: number;
  fs: (size: number) => number;
}

const SettingsContext = createContext<SettingsContextType>({
  tema: 'claro',
  setTema: () => {},
  colors: lightColors,
  tamanhoTexto: 'normal',
  setTamanhoTexto: () => {},
  fontScale: 1,
  fs: (s) => s,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>('claro');
  const [tamanhoTexto, setTamanhoTexto] = useState<TamanhoTexto>('normal');
  const colors = tema === 'escuro' ? darkColors : lightColors;
  const fontScale = FONT_SCALES[tamanhoTexto];
  const fs = (size: number) => Math.round(size * fontScale);

  return (
    <SettingsContext.Provider value={{ tema, setTema, colors, tamanhoTexto, setTamanhoTexto, fontScale, fs }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
