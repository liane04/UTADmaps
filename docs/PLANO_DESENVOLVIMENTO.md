# 🗺️ UTAD Maps — Plano de Desenvolvimento do Protótipo
**Duração:** 2 semanas | **Equipa:** 5 membros em 3 equipas | **Entrega:** Protótipo Funcional Web (Mobile-Ready)

---

## 👥 Equipas

| Equipa | Membros | Área |
|---|---|---|
| 🧭 **Bússola** | Diogo + Filipe | Mapas, navegação outdoor e indoor |
| 🏗️ **Alicerces** | Bruno + Pedro | Backend, base de dados, arquitectura, iCal |
| 🎨 **Experiência** | Filipe + Liane | Interface, ecrãs, acessibilidade, i18n |

> **Filipe** é a ponte entre Bússola e Experiência — garante que pesquisa → resultado → navegar funciona de ponta a ponta.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Porquê |
|---|---|---|
| App (web + mobile) | **Expo (React Native)** | Escreve-se uma vez, corre em web agora e iOS/Android depois |
| Estilos | **NativeWind** (Tailwind → RN) | Mesma sintaxe Tailwind para componentes nativos |
| Navegação/Rotas | **Expo Router** | File-based routing, funciona em web e mobile |
| Mapa Outdoor (web) | **react-leaflet** | OpenStreetMap, gratuito, sem API key, funciona no browser |
| Mapa Outdoor (mobile) | **react-native-maps** | Google Maps / Apple Maps quando migrarem para nativo |
| Plantas Indoor | **react-native-svg** | SVG interactivo igual nos dois ambientes |
| Estado Global | **Zustand** | Leve, sem boilerplate, fácil para toda a equipa |
| Internacionalização | **i18next** | Standard PT/EN |
| Backend | **Node.js + Express** | JavaScript em toda a stack, familiar para todos |
| Base de Dados + Auth | **Supabase** (PostgreSQL) | Gerido na cloud, Auth e Storage gratuitos |
| iCal Parser | **ical.js** (no servidor) | Processa o `.ics` do Infraestudante no backend |
| Deploy Frontend | **Vercel** | URL público automático via GitHub |
| Deploy Backend | **Railway** | Grátis, deploy via GitHub, Node.js nativo |

### Estratégia web vs mobile para o mapa outdoor

O protótipo usa `react-leaflet` no browser. Ao migrar para mobile, basta criar `MapView.native.tsx` com `react-native-maps`. O Expo resolve automaticamente qual ficheiro usar — o resto da app nunca sabe qual está a correr.

```
components/
  MapView.web.tsx     ← react-leaflet (OpenStreetMap)
  MapView.native.tsx  ← react-native-maps (Google/Apple Maps)
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────┐
│       FRONTEND (Expo Web)       │
│  React Native + react-native-   │
│  web · Expo Router · NativeWind │
│  Zustand · i18next              │
└──────────────┬──────────────────┘
               │  REST API (axios)
               ▼
┌─────────────────────────────────┐
│    BACKEND (Node.js + Express)  │
│  /api/buildings  /api/search    │
│  /api/schedule   /api/favorites │
│  /api/auth       /api/ical      │
└──────────────┬──────────────────┘
               │  Supabase SDK
               ▼
┌─────────────────────────────────┐
│      SUPABASE (PostgreSQL)      │
│  buildings · floors · rooms     │
│  services · favorites           │
│  schedules · auth               │
└─────────────────────────────────┘
```

---

## 🧭 Equipa Bússola — Diogo + Filipe
### Mapas, Navegação Outdoor e Indoor

O coração da app. Tudo o que envolve chegar de A a B — é a feature mais visível e mais técnica do projecto.

**O que a equipa entrega:**
- Mapa do campus com edifícios clicáveis e posição do utilizador
- Rota outdoor entre dois pontos com distância e tempo estimado
- Planta 2D indoor do Bloco A em SVG com destaque da sala
- Navegação passo a passo indoor ("Siga pelo corredor – Passo 2/3")
- Selector de piso e selector de modo (A pé / Carro)

**Ecrãs:** `Mapa Principal` · `Navegação Outdoor` · `Navegação Indoor`

**Semana 1:**
- [ ] Criar `MapView.web.tsx` com `react-leaflet`, tiles OpenStreetMap, centrado na UTAD (lat: 41.2745, lon: -7.7417)
- [ ] Criar `MapView.native.tsx` como placeholder para `react-native-maps`
- [ ] Adicionar marcadores para edifícios principais (coordenadas reais)
- [ ] Integrar `expo-location` → ponto azul pulsante com posição do utilizador
- [ ] Componente `<BottomTabBar>` com 5 tabs via Expo Router
- [ ] Criar SVG do Bloco A Piso 2: corredores, Sala 2.1, 2.2, 2.3, Lab 1, Lab 2, WC
- [ ] Componente `<FloorPlanSVG floor={n} highlight="sala-id"/>`: pinta sala destino + traça linha de rota
- [ ] Selector de piso (Piso 1 / Piso 2) que troca o SVG renderizado

**Semana 2:**
- [ ] Bottom sheet ao clicar num edifício: nome + botão "Navegar até aqui"
- [ ] Desenhar rota outdoor: `<Polyline>` entre posição actual e destino
- [ ] Calcular distância (Haversine) e tempo estimado a pé / de carro
- [ ] Painel inferior da rota: distância + tempo + selector A pé / Carro
- [ ] Botão "Terminar" que limpa a rota
- [ ] Buscar edifícios da API: `GET /api/buildings`
- [ ] Componente `<IndoorStepPanel>`: instrução + ícone seta + "Passo X/N" + botões Anterior / Próximo
- [ ] Animação da linha de percurso no SVG (stroke-dashoffset)
- [ ] Pelo menos 3 destinos funcionais: Sala 2.1, Lab 1, WC
- [ ] Coordenar com Experiência: garantir que pesquisa → resultado → navegação funciona end-to-end

---

## 🏗️ Equipa Alicerces — Bruno + Pedro
### Arquitectura, Backend, Supabase e iCal

O que suporta tudo o resto. Ninguém vê directamente, mas sem esta equipa nada funciona.

**O que a equipa entrega:**
- Projecto Expo configurado e funcional para toda a equipa arrancar
- Servidor Express com todas as rotas da API
- Supabase com tabelas populadas com dados reais da UTAD
- Parser iCal que transforma um `.ics` do Infraestudante em horário navegável
- Sistema de autenticação com email `@utad.eu`

**Rotas da API:**
```
GET  /api/buildings              → lista edifícios
GET  /api/buildings/:id/floors   → pisos de um edifício
GET  /api/rooms/search?q=&type=  → pesquisa salas e serviços
GET  /api/services               → cantina, biblioteca, etc.
POST /api/ical/import            → recebe .ics, processa e guarda
GET  /api/schedule/:userId       → horário do utilizador
GET  /api/favorites/:userId      → favoritos
POST /api/favorites              → adicionar favorito
DELETE /api/favorites/:id        → remover favorito
POST /api/auth/login             → login @utad.eu
POST /api/auth/register          → registo
```

**Semana 1:**
- [ ] `npx create-expo-app utadmaps` + configurar Expo Router
- [ ] Instalar dependências: `nativewind`, `zustand`, `i18next`, `react-i18next`, `axios`, `react-leaflet`, `react-native-svg`
- [ ] Criar store Zustand: `useAppStore` (user, language, theme, accessibility)
- [ ] Criar `services/api.ts`: instância Axios apontando ao backend
- [ ] Ficheiros `locales/pt.json` e `locales/en.json` com todas as strings
- [ ] Criar repo GitHub, branches por equipa (`bussola`, `alicerces`, `experiencia`), PR template
- [ ] Criar projecto Node.js: instalar `express`, `cors`, `dotenv`, `@supabase/supabase-js`, `ical.js`
- [ ] Criar projecto Supabase: criar tabelas, configurar Row Level Security
- [ ] Implementar rotas base: `GET /api/buildings`, `GET /api/rooms/search`, `GET /api/services`
- [ ] Popular tabelas: coordenadas reais dos edifícios da UTAD, salas do Bloco A

**Semana 2:**
- [ ] Integrar tema escuro e alto contraste via NativeWind
- [ ] Rever e mergear Pull Requests de todas as equipas
- [ ] Testar no browser (expo web) e no Expo Go (dispositivo físico)
- [ ] Deploy frontend no Vercel
- [ ] `POST /api/ical/import`: recebe `.ics`, parseia com `ical.js`, faz match sala ↔ DB, guarda em `schedules`
- [ ] `GET /api/schedule/:userId`: devolve aulas ordenadas por dia + hora com localização
- [ ] Rotas de favoritos (`GET`, `POST`, `DELETE`) e histórico
- [ ] Auth via Supabase: login + registo + middleware JWT para rotas protegidas
- [ ] Deploy backend no Railway

---

## 🎨 Equipa Experiência — Filipe + Liane
### Interface, Ecrãs, Acessibilidade e i18n

Tudo o que torna a app agradável de usar. Guardiões da qualidade visual e conformidade WCAG 2.2.

**O que a equipa entrega:**
- Fluxo de onboarding com selector de idioma e login opcional
- Ecrã de pesquisa com filtros e resultados da API
- Horário semanal com importação de iCal e botão "Navegar"
- Perfil com próxima aula, favoritos e histórico
- Definições de acessibilidade completas
- Suporte multilingue PT/EN em toda a app

**Ecrãs:** `Onboarding` · `Pesquisa` · `Horário` · `Favoritos` · `Perfil` · `Definições`

**Semana 1:**
- [ ] **Onboarding:** toggle PT/EN, campo email `@utad.eu` opcional, botão "Continuar" → `POST /api/auth/login`, link "Saltar e explorar"
- [ ] **Pesquisa:** barra de pesquisa com X, chips de filtro (Todos / Edifícios / Salas / Serviços), lista de resultados com distância, chips de "Pesquisas recentes"
- [ ] Chamar `GET /api/rooms/search?q=&type=` com debounce de 300ms
- [ ] **Perfil:** avatar com inicial, nome + email, card "Próxima Aula" (da API), links para sub-ecrãs
- [ ] Componente reutilizável `<ListItem>` (ícone + título + subtítulo + seta)

**Semana 2:**
- [ ] **Horário:** grelha semanal (Seg–Sáb), aulas por dia, botão "Navegar" por aula, botão "Importar Horário" → `.ics` → `POST /api/ical/import`
- [ ] **Favoritos:** lista com ícone coração, remover, estado vazio ("Ainda não tens favoritos")
- [ ] **Definições:** slider tamanho texto, toggles (Alto Contraste, Rotas Acessíveis, Leitor de Ecrã), selector idioma, selector tema
- [ ] Clicar num resultado de pesquisa → inicia Navegação Outdoor ou Indoor conforme o tipo
- [ ] Coordenar com Bússola: fluxo pesquisa → resultado → navegar funcionar end-to-end
- [ ] Revisão WCAG 2.2: `accessibilityLabel` em todos os interactivos, contraste ≥ 4.5:1, foco visível

---

## 📅 Calendário de 2 Semanas

### Semana 1 — "Fundações"

| Dia | O que acontece |
|---|---|
| **Dia 1** | Alicerces cria repo GitHub + Expo + Express + Supabase. Bússola e Experiência clonam e arrancam. |
| **Dia 2–3** | Cada equipa trabalha nas tarefas de Semana 1 em paralelo. Standup diário de 15 min. |
| **Dia 4** | 1.ª integração real: mapa frontend chama `GET /api/buildings` e carrega edifícios da DB. |
| **Dia 5–6** | Continuar desenvolvimento. Bússola e Experiência alinham o fluxo pesquisa → navegar. |
| **Dia 7** | **Checkpoint interno:** cada equipa faz demo do que tem. Ajustar prioridades para Semana 2. |

### Semana 2 — "Integração & Polimento"

| Dia | O que acontece |
|---|---|
| **Dia 8–9** | Completar tarefas de Semana 2. iCal funcional (Alicerces). Horário UI (Experiência). Indoor completo (Bússola). |
| **Dia 10** | Integração ponta a ponta: onboarding → login → mapa → pesquisa → navegar indoor. |
| **Dia 11** | Testes em dispositivos móveis reais via Expo Go. Correcção de bugs críticos. |
| **Dia 12** | Acessibilidade: alto contraste, tamanhos de fonte, labels. Teste com leitor de ecrã. |
| **Dia 13** | Polimento visual: estados de loading, erro e vazio. Animações suaves. |
| **Dia 14** | **Entrega:** deploy final, URL partilhado, preparar demonstração. |

---

## 🔗 Fluxo Completo da App

```
Onboarding (Experiência)
      ↓
Mapa Principal (Bússola) ←────────────────────────┐
      ↓                                            │
  Edifício clicado                       Resultado de pesquisa
      ↓                                            │
Navegação Outdoor (Bússola)     Pesquisa (Experiência)
      ↓
Chegou ao edifício
      ↓
Navegação Indoor (Bússola) ←── "Navegar" no Horário (Experiência)
      ↓
Sala encontrada ✓
```

---

## ✅ Critérios de Aceitação

- [ ] App abre no browser (Expo Web) e no Expo Go (mobile)
- [ ] Idioma muda em toda a app a partir do onboarding
- [ ] Mapa carrega edifícios da API (dados reais da UTAD no Supabase)
- [ ] Pesquisar "Sala 2.1" → resultado → iniciar navegação
- [ ] Navegação outdoor: rota com distância e tempo estimado
- [ ] Navegação indoor: planta SVG passo a passo
- [ ] Importar `.ics` → horário semanal com aulas reais
- [ ] Clicar "Navegar" numa aula → abre indoor para a sala correcta
- [ ] Guardar e remover favoritos (persistidos na DB)
- [ ] Alto contraste activo muda a UI visivelmente

---

## ⚠️ Se o tempo apertar — por prioridade

1. **Obrigatório:** Mapa funcional (API) + Pesquisa + Navegação Indoor básica
2. **Importante:** Backend real com dados da UTAD + Onboarding com login
3. **Importante:** Horário com iCal real + botão Navegar
4. **Nice to have:** Favoritos na DB, Geolocalização GPS real
5. **Opcional:** Animações, tema escuro, deploy mobile nas stores

---

## 📁 Estrutura de Pastas

```
utadmaps/
├── frontend/                     ← Expo app (Bússola + Experiência)
│   ├── app/
│   │   ├── index.tsx             ← Onboarding
│   │   ├── (tabs)/
│   │   │   ├── map.tsx           ← Mapa
│   │   │   ├── search.tsx        ← Pesquisa
│   │   │   ├── schedule.tsx      ← Horário
│   │   │   ├── favorites.tsx     ← Favoritos
│   │   │   └── profile.tsx       ← Perfil
│   │   ├── navigate/
│   │   │   ├── outdoor.tsx       ← Nav Outdoor
│   │   │   └── indoor.tsx        ← Nav Indoor
│   │   └── settings.tsx          ← Definições
│   ├── components/
│   │   ├── MapView.web.tsx       ← react-leaflet
│   │   ├── MapView.native.tsx    ← react-native-maps (placeholder)
│   │   ├── FloorPlanSVG.tsx      ← Planta indoor
│   │   ├── IndoorStepPanel.tsx   ← Passos indoor
│   │   └── ListItem.tsx          ← Reutilizável
│   ├── hooks/                    ← useSearch, useSchedule, useLocation
│   ├── services/api.ts           ← Axios → backend
│   ├── store/                    ← Zustand
│   └── locales/                  ← pt.json · en.json
│
└── backend/                      ← Node.js + Express (Alicerces)
    ├── routes/
    │   ├── buildings.js
    │   ├── rooms.js
    │   ├── schedule.js
    │   ├── favorites.js
    │   └── auth.js
    ├── middleware/auth.js
    ├── services/icalParser.js
    ├── supabase.js
    └── index.js
```

---

*Plano actualizado em 16 de Abril de 2026 · UTAD Maps · IPC*
