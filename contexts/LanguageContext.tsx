import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

const translations = {
  pt: {
    // Welcome
    welcome: 'Bem-vindo ao\nUTAD Maps',
    welcomeSubtitle: 'Navegue pelo campus com facilidade',
    emailLabel: 'Email Institucional Login',
    optional: '(opcional)',
    emailPlaceholder: 'Email @utad.eu',
    continuar: 'Continuar',
    saltarExplorar: 'Saltar e explorar',
    // Tabs
    mapa: 'Mapa',
    pesquisa: 'Pesquisa',
    horario: 'Horário',
    favoritos: 'Favoritos',
    perfil: 'Perfil',
    // Definições
    definicoes: 'Definições',
    voltar: 'Voltar',
    acessibilidade: 'ACESSIBILIDADE',
    tamanhoTexto: 'Tamanho do Texto',
    altoContraste: 'Alto Contraste',
    rotasAcessiveis: 'Rotas Acessíveis',
    evitarEscadas: 'Evitar escadas',
    leitorEcra: 'Leitor de Ecrã',
    personalizacao: 'PERSONALIZAÇÃO',
    idioma: 'Idioma',
    tema: 'Tema',
    claro: 'Claro',
    sobre: 'SOBRE',
    suporteAjuda: 'Suporte e Ajuda',
  },
  en: {
    // Welcome
    welcome: 'Welcome to\nUTAD Maps',
    welcomeSubtitle: 'Navigate the campus with ease',
    emailLabel: 'Institutional Email Login',
    optional: '(optional)',
    emailPlaceholder: 'Email @utad.eu',
    continuar: 'Continue',
    saltarExplorar: 'Skip and explore',
    // Tabs
    mapa: 'Map',
    pesquisa: 'Search',
    horario: 'Schedule',
    favoritos: 'Favourites',
    perfil: 'Profile',
    // Definições
    definicoes: 'Settings',
    voltar: 'Back',
    acessibilidade: 'ACCESSIBILITY',
    tamanhoTexto: 'Text Size',
    altoContraste: 'High Contrast',
    rotasAcessiveis: 'Accessible Routes',
    evitarEscadas: 'Avoid stairs',
    leitorEcra: 'Screen Reader',
    personalizacao: 'PERSONALISATION',
    idioma: 'Language',
    tema: 'Theme',
    claro: 'Light',
    sobre: 'ABOUT',
    suporteAjuda: 'Support & Help',
  },
} as const;

type Translations = Record<keyof typeof translations.pt, string>;

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  t: translations.pt,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
