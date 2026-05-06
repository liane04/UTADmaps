# UTAD Maps — Fase 1: Especificações de Implementação

## Descrição geral

O UTAD Maps é uma aplicação de navegação para o campus da Universidade de Trás-os-Montes e Alto Douro, desenvolvida com o objetivo de ajudar estudantes e visitantes a localizar edifícios, salas e serviços, tanto em ambiente exterior (outdoor) como no interior dos edifícios (indoor). A aplicação suporta múltiplos idiomas (Português e Inglês), temas visuais (claro, escuro, alto contraste) e funcionalidades de acessibilidade.

---

## Stack tecnológico

| Camada | Tecnologia | Justificação |
|---|---|---|
| Framework principal | **Expo 54 (React Native)** | Permite desenvolver uma única base de código que corre em web, Android e iOS |
| Linguagem | **TypeScript** | Tipagem estática, deteção de erros em tempo de desenvolvimento |
| Navegação/Rotas | **Expo Router 5** | File-based routing, funciona em web e mobile sem configuração adicional |
| Estado global | **Zustand 4** | Gestão de estado leve, sem boilerplate |
| Mapa outdoor (web) | **react-leaflet 5 + Leaflet 1.9** | OpenStreetMap gratuito, sem API key, funciona no browser |
| Mapa outdoor (mobile) | **react-native-maps 1.20** | Integração nativa com Google Maps e Apple Maps |
| Indoor 3D | **Three.js r128** (dentro de WebView) | Renderização 3D de modelos GLB dos edifícios |
| Indoor 2D | Planta gerada com `View` nativos do React Native + pathfinding A* em TypeScript | Navegação por passos com rota calculada |
| Parser iCal | **ical.js** (no backend) | Processa o ficheiro `.ics` do Infraestudante |
| Roteamento outdoor | **OSRM API** (OpenStreetMap) | API pública, sem custos, suporta perfis a pé e de carro |
| Localização GPS | **expo-location** | Permissão de localização e coordenadas GPS reais |
| Persistência local | **@react-native-async-storage/async-storage** | Guarda definições de acessibilidade, horário importado e token JWT entre sessões |
| Backend | **Node.js + Express** | REST API, JavaScript em toda a stack |
| Base de dados | **Supabase (PostgreSQL)** | Cloud gerido, Auth e Row Level Security incluídos |
| Autenticação | **Supabase JWT** | Tokens JWT para rotas protegidas |
| Deploy frontend | **Hetzner + Nginx + Let's Encrypt** | `https://utadmaps.b-host.me` |
| Deploy backend | **Hetzner + Docker + Nginx** | `https://api.utadmaps.b-host.me` |

---

## Arquitetura da solução

```
┌──────────────────────────────────────┐
│     FRONTEND (Expo — Web + Mobile)   │
│  React Native · Expo Router          │
│  Zustand · react-leaflet · Three.js  │
│  LanguageContext · SettingsContext   │
└────────────────┬─────────────────────┘
                 │  REST API (fetch nativo)
                 ▼
┌──────────────────────────────────────┐
│    BACKEND (Node.js + Express)       │
│  /api/buildings  /api/rooms          │
│  /api/search     /api/schedule       │
│  /api/auth       /api/user-favorites │
│  /api/favorites  /api/history        │
└────────────────┬─────────────────────┘
                 │  Supabase SDK
                 ▼
┌──────────────────────────────────────┐
│     SUPABASE (PostgreSQL)            │
│  buildings · floors · rooms          │
│  services · favorites · schedules   │
│  auth (JWT)                          │
└──────────────────────────────────────┘
```

---

## Funcionalidades implementadas

### 1. Mapa outdoor

O ecrã principal exibe um mapa interativo do campus da UTAD centrado no Polo 1 (lat: 41.2745, lon: -7.7417). A implementação usa ficheiros com sufixo de plataforma (`CampusMap.web.tsx` e `CampusMap.native.tsx`) para que o Expo selecione automaticamente a versão correta consoante o ambiente:

- **Web:** `react-leaflet` com tiles OpenStreetMap
- **Mobile:** `react-native-maps` com Google Maps / Apple Maps

Os 21 edifícios do campus são representados por marcadores com cor e símbolo diferenciado por tipo (académico, serviço, desporto, etc.). Ao clicar num marcador, surge um cartão inferior (estilo Google Maps) com o nome do edifício, tipo, número de pisos e salas, e dois botões de ação: **Ir** (navegação outdoor) e **Explorar Indoor** (quando disponível).

### 2. Navegação outdoor

A navegação outdoor usa a API pública **OSRM** para calcular rotas reais com base nas vias do OpenStreetMap:

- Perfil **a pé:** servidor dedicado `routing.openstreetmap.de/routed-foot`
- Perfil **de carro:** servidor `router.project-osrm.org`

O utilizador pode alternar entre os dois modos. A rota é desenhada no mapa como uma linha tracejada azul, com indicação de distância (em metros ou quilómetros) e tempo estimado. A localização GPS do utilizador é obtida via `expo-location`. Quando a API OSRM não devolve resultado, a app apresenta uma linha reta como fallback com aviso ao utilizador.

### 3. Navegação indoor 2D

Para o Bloco A, foi implementada uma planta interativa 2D com pathfinding. O algoritmo A* está implementado em TypeScript e opera sobre um grafo de nós (salas, portas, intersecções de corredor, escadas) definido em `assets/data/pavilhoes/bloco-a.json`. A planta é renderizada com componentes `View` do React Native posicionados em percentagem do tamanho do contentor, garantindo que se adapta a qualquer ecrã. A rota calculada é desenhada por cima como segmentos rotacionados com `transform: rotate`. O ecrã exibe:

- Planta do piso com salas destacadas por cor (azul = sala, laranja = serviço, cinzento = corredor)
- Marcadores de início (escadas) e destino
- Faixa central que representa o corredor principal
- Painel inferior com número de nós percorridos e passos estimados

### 4. Navegação indoor 3D

Para edifícios com modelos 3D disponíveis (Setor E — pisos 0, 1 e 2), a visualização é feita com **Three.js r128** dentro de uma `WebView` (`react-native-webview`). Os modelos estão em formato GLB e são carregados como Base64, convertidos em `ArrayBuffer` via `expo-file-system`, e injetados na WebView via `postMessage`.

O motor de navegação 3D implementa:

- **Grid A* com min-heap binário** — divide a planta em células (~0.3 m para modelos pequenos) e calcula o caminho em O(N log N), evitando bloqueios na WebView
- **Sistema de room-blocking** — salas (`sala_*`) estão fechadas por defeito; ao clicar, a sala de destino é desbloqueada e o A* recalcula o grid
- **Colisores explícitos** (`col_*`) — objetos invisíveis adicionados no Blender definem com precisão as paredes e as aberturas das portas
- **String-pull com visibilidade de grelha** — após o A*, o caminho é simplificado eliminando waypoints onde a linha direta está livre
- **Animação do personagem** — boneco com seta direcional que segue o caminho calculado em tempo real, com orientação automática na direção do movimento
- **Gestos:** toque para navegar, arrastar para mover a câmara, pinch para zoom (multiplicativo), suporte mouse e touch

### 5. Pesquisa

O ecrã de pesquisa está ligado ao backend via `GET /api/search` com debounce de 300 ms para evitar pedidos excessivos. Suporta filtros por categoria (Todos / Edifícios / Salas / Serviços) através de chips horizontais. Os resultados são mostrados como cartões com avatar colorido (verde = edifício, azul = sala, laranja = serviço), nome, subtítulo (piso e edifício, quando aplicável) e botão de favorito (coração). Existe ainda uma secção de **Pesquisas recentes** com chips clicáveis que repetem rapidamente uma pesquisa anterior.

Ao selecionar um resultado do tipo sala, a app navega diretamente para a navegação indoor com a sala como destino; ao selecionar um edifício ou serviço com coordenadas GPS, navega para a navegação outdoor já com as coordenadas do destino.

### 6. Favoritos

A funcionalidade de favoritos está totalmente implementada com ecrã próprio (`app/(tabs)/favoritos.tsx`). Os favoritos são geridos pelo store Zustand (`useAppStore`) e podem ser adicionados/removidos a partir do ecrã de pesquisa ou do próprio ecrã de favoritos. Cada item armazena nome, subtítulo, categoria, coordenadas GPS e código da sala. Ao tocar num favorito, a app inicia a navegação correta automaticamente (indoor para salas, outdoor para edifícios e serviços). O backend tem rotas (`/api/user-favorites`) preparadas para sincronização com a base de dados via JWT.

### 7. Horário semanal e importação iCal

O ecrã de horário (`app/(tabs)/horario.tsx`) está totalmente funcional e suporta importação direta a partir do **Infraestudante** da UTAD. O utilizador apenas cola o **link privado de sincronização do horário** (ou apenas a chave alfanumérica que se encontra no fim desse URL) numa caixa modal — não precisa de descarregar nem fazer upload de qualquer ficheiro. A app envia a chave ao backend (`POST /api/schedule/ical/import-url`), que constrói o URL `https://inforestudante.utad.pt/nonio/util/sincronizaHorarioNonio.do?chave=...`, descarrega o calendário em formato iCal diretamente do Infraestudante, processa-o com **ical.js** e devolve a lista de aulas estruturada (disciplina, data, dia da semana, hora de início e fim, sala). O horário é armazenado localmente em `AsyncStorage` para persistência entre sessões. Para utilizadores autenticados, a chave é também guardada no `user_metadata` do Supabase para auto-importação em qualquer dispositivo.

A interface apresenta:

- Selector de dias da semana (Seg–Sáb) com chip ativo destacado
- Navegação entre semanas com setas (← → ) e label do intervalo de datas
- Linha temporal das aulas do dia ativo, com hora, disciplina, sala e localização
- Estado vazio com instruções para importar
- Toque numa aula → navegação indoor direta para a sala correspondente
- Auto-importação ao abrir a app se o utilizador tiver uma chave guardada no perfil

### 8. Perfil e autenticação

O ecrã de perfil (`app/(tabs)/perfil.tsx`) suporta dois modos: utilizador autenticado e modo convidado. Quando autenticado, exibe avatar com inicial do email, nome e email institucional. O ecrã calcula automaticamente a **próxima aula** com base no horário guardado em `AsyncStorage`, comparando data e hora com o momento atual e mostrando-a num cartão destacado com botão para navegar diretamente para a sala.

O onboarding (`app/index.tsx`) permite login via Supabase Auth com email institucional UTAD — o backend aceita os domínios `@utad.eu`, `@alunos.utad.eu` e `@alunos.utad.pt` — ou continuar em modo convidado ("Saltar e explorar"). O token JWT é guardado no store Zustand e enviado em todos os pedidos protegidos via header `Authorization: Bearer <token>`.

### 9. Acessibilidade

As definições de acessibilidade são geridas pelo `SettingsContext` com persistência via `AsyncStorage`:

- **Alto contraste:** duas paletas (claro e escuro) com rácios de contraste > 21:1, cumprindo WCAG 2.2 nível AAA
- **Tamanho do texto:** três escalas (pequeno 0.85×, normal 1.0×, grande 1.2×) aplicadas através da função `fs(size)`
- **Tema:** claro e escuro com paletas de cores adaptadas
- **Rotas acessíveis:** flag disponível para futura integração com algoritmos que evitam escadas
- **Leitor de ecrã:** toggle de configuração; `accessibilityLabel` definidos nos elementos interativos

### 10. Internacionalização (i18n)

O `LanguageContext` implementa suporte bilingue PT/EN sem dependências externas. Todas as strings da interface estão traduzidas e acessíveis via `t.chave` (para strings de chave fixa) ou `tr(textoPortugues, textoIngles)` (para strings inline). A língua é selecionável no ecrã de Definições e aplica-se imediatamente em toda a app.

### 11. Backend e base de dados

O servidor Node.js + Express expõe as seguintes rotas REST:

| Rota | Método | Descrição |
|---|---|---|
| `/health` | GET | Endpoint de health check |
| `/api/buildings` | GET | Lista de edifícios com coordenadas |
| `/api/buildings/:id/floors` | GET | Pisos de um edifício |
| `/api/rooms` | GET | Pesquisa de salas |
| `/api/search` | GET | Pesquisa unificada (edifícios, salas, serviços) |
| `/api/schedule/:userId` | GET | Horário do utilizador |
| `/api/schedule/ical/import-url` | POST | Importa horário do Infraestudante via chave |
| `/api/favorites` | GET/POST/DELETE | Favoritos (versão legada — só salas) |
| `/api/user-favorites` | GET/POST/DELETE | Favoritos alargados (edifícios + salas + serviços) |
| `/api/history` | GET/POST | Histórico de navegação do utilizador |
| `/api/auth/login` | POST | Autenticação com email institucional UTAD |
| `/api/auth/register` | POST | Registo de nova conta |

A base de dados PostgreSQL (Supabase) contém os 21 edifícios do Polo 1 do campus com coordenadas reais, pisos, salas e serviços. As tabelas principais são `buildings`, `floors`, `rooms`, `services`, `user_favorites`, `schedules` e `navigation_history`. A autenticação usa tokens JWT gerados pelo Supabase Auth, validados em middleware Express antes das rotas protegidas. A política de Row Level Security (RLS) do Supabase garante que cada utilizador apenas acede aos seus próprios dados.

---

## Estrutura de ficheiros relevante

```
utadmaps/
├── app/
│   ├── index.tsx                  ← Onboarding / login
│   ├── (tabs)/
│   │   ├── index.tsx              ← Mapa principal
│   │   ├── pesquisa.tsx           ← Pesquisa com filtros e API
│   │   ├── horario.tsx            ← Horário semanal
│   │   ├── favoritos.tsx          ← Lista de favoritos
│   │   └── perfil.tsx             ← Perfil do utilizador
│   ├── navigacao-outdoor.tsx      ← Mapa + rota OSRM + GPS
│   ├── navigacao-indoor.tsx       ← Planta 2D + A* (Bloco A)
│   ├── indoor-3d.tsx              ← Visualizador 3D Three.js (Setor E)
│   └── definicoes.tsx             ← Acessibilidade, idioma, tema
├── components/
│   ├── CampusMap.web.tsx          ← react-leaflet (OpenStreetMap)
│   └── CampusMap.native.tsx       ← react-native-maps
├── contexts/
│   ├── SettingsContext.tsx        ← Tema, contraste, texto, persistência
│   └── LanguageContext.tsx        ← PT/EN i18n
├── store/
│   └── useAppStore.ts             ← Zustand (utilizador, token, favoritos)
├── services/
│   └── api.ts                     ← Cliente REST → api.utadmaps.b-host.me
├── assets/
│   ├── data/pavilhoes/bloco-a.json ← Grafo A* indoor 2D
│   └── models/sectorE/            ← Modelos GLB pisos 0, 1, 2
└── backend/
    ├── index.js                   ← Servidor Express
    ├── routes/                    ← buildings, rooms, search, auth,
    │                                favorites, userFavorites, schedule, history
    ├── middleware/auth.js         ← Validação JWT
    ├── services/icalParser.js     ← Parser iCal para horários (ical.js)
    └── supabase.js                ← Cliente Supabase
```

---

## Acesso à aplicação

- **Frontend (web):** https://utadmaps.b-host.me
- **Backend (API):** https://api.utadmaps.b-host.me
- **Repositório:** https://github.com/liane04/UTADmaps
