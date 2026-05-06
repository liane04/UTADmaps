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
    escuro: 'Escuro',
    sobre: 'SOBRE',
    suporteAjuda: 'Suporte e Ajuda',
    // Histórico
    historico: 'Histórico',
    historicoNavegacao: 'Histórico de Navegação',
    historicoVazio: 'Sem navegações ainda',
    historicoVazioSub: 'As tuas navegações aparecem aqui depois de iniciares uma rota.',
    limpar: 'Limpar',
    limparHistorico: 'Limpar histórico',
    iniciarSessao: 'Iniciar sessão',
    iniciarSessaoHistorico: 'Inicia sessão para ver o histórico',
    historicoNaConta: 'O histórico de navegação é guardado na tua conta UTAD.',
    interior: 'Interior',
    exterior: 'Exterior',
    tentarNovo: 'Tentar de novo',
    erroCarregar: 'Erro a carregar',
    // Suporte
    perguntasFrequentes: 'PERGUNTAS FREQUENTES',
    contacto: 'CONTACTO',
    reportarErro: 'Reportar erro',
    versao: 'Versão',
    plataforma: 'Plataforma',
    disciplina: 'Disciplina',
    // Perfil
    proximaAula: 'Próxima Aula',
    semAulas: 'Sem aulas marcadas',
    importarHorarioHint: 'Importa o teu horário no separador Horário.',
    convidado: 'Convidado',
    semSessao: 'Sem sessão iniciada',
    terminarSessao: 'Terminar sessão',
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
    escuro: 'Dark',
    sobre: 'ABOUT',
    suporteAjuda: 'Support & Help',
    // History
    historico: 'History',
    historicoNavegacao: 'Navigation History',
    historicoVazio: 'No navigations yet',
    historicoVazioSub: 'Your navigations appear here after you start a route.',
    limpar: 'Clear',
    limparHistorico: 'Clear history',
    iniciarSessao: 'Sign in',
    iniciarSessaoHistorico: 'Sign in to see your history',
    historicoNaConta: 'Navigation history is stored on your UTAD account.',
    interior: 'Indoor',
    exterior: 'Outdoor',
    tentarNovo: 'Retry',
    erroCarregar: 'Loading error',
    // Support
    perguntasFrequentes: 'FREQUENTLY ASKED QUESTIONS',
    contacto: 'CONTACT',
    reportarErro: 'Report a bug',
    versao: 'Version',
    plataforma: 'Platform',
    disciplina: 'Course',
    // Profile
    proximaAula: 'Next Class',
    semAulas: 'No upcoming classes',
    importarHorarioHint: 'Import your schedule in the Schedule tab.',
    convidado: 'Guest',
    semSessao: 'Not signed in',
    terminarSessao: 'Sign out',
  },
} as const;

type Translations = Record<keyof typeof translations.pt, string>;

interface LanguageContextType {
  language: Language;
  t: Translations;
  tr: (pt: string, en: string) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  t: translations.pt,
  tr: (pt) => pt,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');
  const tr = (pt: string, en: string) => (language === 'pt' ? pt : en);

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], tr, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
