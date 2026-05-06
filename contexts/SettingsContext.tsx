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
  // Antes: '#8E8E93' (rácio 3.7:1 — falha WCAG AA).
  // '#6C6C72' dá ~4.6:1 sobre #F2F2F7, passa AA para texto normal.
  subtext: '#6C6C72',
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
  subtext: '#A8A8AE',  // mais claro para passar AA sobre #1C1C1E
  border: '#38383A',
  divider: '#38383A',
  inputBg: '#2C2C2E',
  primary: '#FFFFFF',
  tabBar: '#1C1C1E',
  tabBarBorder: '#38383A',
};

// Alto contraste — preto/branco puros para utilizadores com baixa visão.
// Rácios > 21:1 (máximo possível). Cumpre WCAG AAA (1.4.6).
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
  highContrast: boolean;
  setHighContrast: (b: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  tema: 'claro',
  setTema: () => {},
  colors: lightColors,
  tamanhoTexto: 'normal',
  setTamanhoTexto: () => {},
  fontScale: 1,
  fs: (s) => s,
  highContrast: false,
  setHighContrast: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>('claro');
  const [tamanhoTexto, setTamanhoTexto] = useState<TamanhoTexto>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  let colors: Colors;
  if (highContrast) {
    colors = tema === 'escuro' ? highContrastDark : highContrastLight;
  } else {
    colors = tema === 'escuro' ? darkColors : lightColors;
  }
  const fontScale = FONT_SCALES[tamanhoTexto];
  const fs = (size: number) => Math.round(size * fontScale);

  return (
    <SettingsContext.Provider
      value={{
        tema,
        setTema,
        colors,
        tamanhoTexto,
        setTamanhoTexto,
        fontScale,
        fs,
        highContrast,
        setHighContrast,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
