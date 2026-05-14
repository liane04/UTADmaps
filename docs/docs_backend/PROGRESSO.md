# UTADmaps — Progresso do Backend

## Sessão 1 — 22 Abril 2026

### O que foi feito

#### Backend Node.js + Express
- Estrutura completa criada em `backend/`
- Rotas: `/api/buildings`, `/api/rooms/search`, `/api/schedule`, `/api/favorites`, `/api/auth`
- Middleware JWT via Supabase
- Parser iCal em `services/icalParser.js`
- `Dockerfile` + `docker-compose.yml`

#### Supabase
- Projeto criado: `vebqypqepyvsoockcfrd.supabase.co`
- Tabelas criadas: `buildings`, `floors`, `rooms`, `favorites`, `schedules`
- Row Level Security configurado
- 21 edifícios reais da UTAD inseridos na tabela `buildings`

#### Servidor Hetzner
- Node.js 22 + Docker instalados
- Repositório clonado em `/var/www/utadmaps/`
- Container Docker `utadmaps-api` a correr na porta 3001
- Nginx configurado como reverse proxy para `api.utadmaps.b-host.me` e `utadmaps.b-host.me`
- SSL Let's Encrypt ativo (renovação automática)

#### Frontend
- Build do Expo web gerado e a servir em `https://utadmaps.b-host.me`
- `services/api.ts` criado com todas as chamadas à API

#### CI/CD
- GitHub Actions configurado (`.github/workflows/deploy.yml`)
- Deploy automático a cada push para `main` — testado e funcional (29s)
- Script `/var/www/utadmaps/deploy.sh` no servidor

#### Documentação
- `docs/docs_backend/BACKEND.md` — stack, rotas, servidor, deploy
- `docs/docs_backend/EDIFICIOS_CAMPUS.md` — 28 edifícios extraídos dos mapas oficiais UTAD
- `backend/buildings-real.sql` — SQL com edifícios reais

---

## Sessão 2 — 29 Abril 2026

### O que foi feito

#### Deploy corrigido
- Deploy automático (GitHub Actions) estava a falhar porque o servidor tinha branches divergentes (`git pull` falhava com exit 128)
- Corrigido manualmente via SSH: `git fetch origin && git reset --hard origin/main`
- `deploy.sh` no servidor actualizado: substituído `git pull` por `git fetch origin && git reset --hard origin/main`
- Build do frontend correu com sucesso; Docker compose path corrigido para `cd backend && docker compose ...`

#### Importação de Horário via Infraestudante (iCal)
- **Backend:** nova rota `POST /api/schedule/ical/import-url` em `backend/routes/schedule.js`
  - Sem autenticação (adequado ao protótipo)
  - Aceita `{ chave: "..." }` no body
  - Faz fetch do URL `https://inforestudante.utad.pt/nonio/util/sincronizaHorarioNonio.do?chave=...&locale=PT`
  - Valida que a resposta contém `BEGIN:VCALENDAR`
  - Parseia com `ical.js` via `parseIcal()` existente
  - Deduplica eventos recorrentes por `diaSemana|horaInicio|disciplina`
  - Retorna `{ aulas: [...] }` com a lista de aulas únicas semanais
  - Timeout de 12 segundos no fetch ao Infraestudante

- **Frontend:** `app/(tabs)/horario.tsx` completamente redesenhado
  - Tabs de dia agora interactivos (antes fixo em Qui) — selecção do dia real
  - Dia activo por defeito = dia de hoje (calculado com `new Date().getDay()`)
  - Botão de importação (ícone nuvem) no header
  - Modal bottom-sheet: aceita URL completo ou só a chave alfanumérica (`extrairChave()`)
  - Importação: `POST /api/schedule/ical/import-url` via `fetch` nativo
  - Horário guardado em `AsyncStorage` (chave `utadmaps_schedule`) — persiste entre sessões
  - Carregamento automático do AsyncStorage ao montar o ecrã
  - Estado vazio com botão "Importar Horário" quando não há horário guardado
  - Estado "Sem aulas neste dia" com checkmark quando o dia está livre
  - Botão "Limpar horário guardado" dentro do modal
  - Cada aula clicável → `navigacao-indoor`
  - Toda a estética original mantida (mesmas cores, borderLeftColor #005C7A, fontes, cards)

---

---

## Sessão 3 — 29 Abril 2026 (continuação)

### O que foi feito

#### Autenticação real (login com conta UTAD)
- **Backend `backend/routes/auth.js`** corrigido:
  - Validação de email alargada para aceitar `@alunos.utad.pt` (além de `@utad.eu` e `@alunos.utad.eu`)
  - Resposta do login corrigida: devolve `token` (access_token) directamente em vez do objeto session completo
- **Frontend `app/index.tsx`** completamente reescrito:
  - Campo de password com toggle mostrar/ocultar
  - Botão "Entrar" chama `POST /api/auth/login` e guarda JWT no Zustand (`setAuth`)
  - Auto-importa o horário ao fazer login se a conta tiver `user_metadata.ical_chave` guardada
  - "Saltar e explorar" mantém acesso anónimo
- **5 contas de demonstração** criadas via SQL directo no Supabase (`auth.users` + `auth.identities`):
  - `al82239@alunos.utad.pt` / `123456`
  - `al79012@alunos.utad.pt` / `123456`
  - `al81311@alunos.utad.pt` / `123456`
  - `al82626@alunos.utad.pt` / `123456`
  - `al80990@alunos.utad.pt` / `123456`

#### Horário associado à conta
- **Backend `backend/routes/schedule.js`** — rota `POST /api/schedule/ical/import-url`:
  - Se request incluir `Authorization: Bearer <token>`, guarda a chave iCal no `user_metadata` do Supabase
  - Chave disponível em qualquer dispositivo após login
- **Frontend `app/(tabs)/horario.tsx`** atualizado:
  - Passa token JWT no header da importação (para guardar chave na conta)
  - Ao montar, se não houver horário local mas a conta tiver `ical_chave`, faz auto-importação
- **`backend/services/icalParser.js`** reescrito:
  - Adicionado campo `data` (data real `YYYY-MM-DD`) usando valores directos do ical.js (sem conversão UTC)
  - Corrigido problema de mostrar eventos de todo o semestre — agora filtragem por data real
  - Chave de deduplicação mudada de `diaSemana|horaInicio|disciplina` para `data|horaInicio|disciplina`
- **`store/useAppStore.ts`** atualizado:
  - Interface `FavoriteItem` (`id, nome, subtitulo, categoria`)
  - Estado `favorites[]` com `addFavorite`, `removeFavorite`, `isFavorite`
  - `logout` limpa favoritos

#### Favoritos reais
- **`app/(tabs)/favoritos.tsx`** reescrito:
  - Lista de favoritos do Zustand (persistidos em AsyncStorage)
  - Botão remover (ícone ♡ vermelho preenchido)
  - Estado vazio com instrução para adicionar pela pesquisa
- **`app/(tabs)/pesquisa.tsx`** atualizado:
  - Ícone ♡ em cada resultado de pesquisa
  - Toggle: adiciona/remove dos favoritos no Zustand

#### Correção do build web (`import.meta`)
- Erro `Cannot use 'import.meta' outside a module` impedia o site de carregar
- Causa: pacote(s) no `node_modules` com `import.meta` que o Metro não envolve como ES module
- **Solução 1:** downgrade `zustand` de `^5.0.12` para `^4.5.7` (v5 usa `import.meta` internamente)
- **Solução 2:** `babel.config.js` criado na raiz com plugin inline que substitui qualquer `import.meta` por `{ env: { MODE: 'production' } }` antes de gerar o bundle
- Build forçado com `npx expo export --platform web --clear` para limpar cache do Metro

#### Deploy corrigido
- `deploy.sh` no servidor atualizado para incluir `--clear` no export e reconstruir correctamente o frontend

---

## Sessão 4 — 3 Maio 2026

### Resumo
Mapa real com clustering, pesquisa ligada à API, favoritos no backend e perfil dinâmico. Várias correções de dados e bugs herdados.

### O que foi feito

#### 1. Mapa real com `react-native-maps` + Leaflet (split por plataforma)
A equipa Bússola (Filipe) tinha integrado `react-native-maps` no frontend (commits `mapa` e `mapa2`). O deploy automático falhou porque `react-native-maps` **não compila no Expo Web** — importa internals do React Native que não existem em browser.

- **`components/CampusMap.types.ts`** — tipos partilhados (`Coord`, `Region`, `CampusMarker`, `CampusRoute`, `CampusMapHandle`, `CampusMapProps`)
- **`components/CampusMap.web.tsx`** — implementação Leaflet (`leaflet@1.9.4` + `leaflet.markercluster@1.5.3`), CSS via CDN, lazy-loaded. Forward ref expõe `animateToRegion()` e `fitToCoordinates()`
- **`components/CampusMap.native.tsx`** — re-exporta `react-native-maps` com a mesma API
- **Refatorados** `app/(tabs)/index.tsx` e `app/navigacao-outdoor.tsx` para usar o wrapper

Metro escolhe `.web.tsx` no build web e `.native.tsx` em iOS/Android — `react-native-maps` deixa de entrar no bundle web. Build OK: `entry.js` 1.55 MB + `leaflet-src.js` 149 kB + `leaflet.markercluster` 34 kB (chunks separados via `import()` dinâmico).

#### 2. 24 edifícios com coordenadas reais (OpenStreetMap)
A versão da Bússola tinha apenas 4 setores (E, F, G, I), com nomes “Setor X (ESCOLA)” que **não correspondem ao mapa oficial UTAD**. Pesquisei o mapa em `mapa-campus-simplificado-3D.pdf` e fiz queries Overpass API ao OSM para obter coords reais.

**Correção crítica:** o que estava rotulado como "Setor F (ECVA)" é na verdade **ECAV – Polo I** (Escolas confundíveis: ECVA = Vida e Ambiente vs. ECAV = Agrárias e Veterinárias). As coordenadas estavam certas — só os nomes trocados.

`constants/polo1Data.ts` reescrito com 24 edifícios (Polo I + Polo II) + nomes oficiais + coordenadas OSM.

#### 3. Categorização por tipo (acessibilidade WCAG 2.2)
Para evitar 24 markers azuis sobrepostos:

- Adicionado campo `tipo` ao `Building`: `'escola' | 'servico' | 'lab' | 'desporto' | 'outro'`
- Cores distintas + letra dentro do marker (E/S/L/D/·) — não depende só de cor (acessibilidade)
- Markers 28×28px (alvo de toque ≥24px AAA), bordo branco, `aria-label`, suporte a Enter/Space
- Cluster automático no Leaflet web (markers próximos agrupam-se em "12" e expandem ao zoom in)

#### 4. Bug "A pé = de carro" corrigido
O OSRM público (`router.project-osrm.org`) **só tem perfil de carro** — devolve sempre tempos de carro independentemente do `mode` na URL. Solução: endpoints separados em `app/navigacao-outdoor.tsx`:

```ts
const OSRM_BASES = {
  foot: 'https://routing.openstreetmap.de/routed-foot/route/v1',
  driving: 'https://router.project-osrm.org/route/v1',
};
```

Agora os tempos a pé são realistas.

#### 5. Pesquisa ligada à API (`/api/search` nova)
Antes: `app/(tabs)/pesquisa.tsx` filtrava 30 `LOCAIS` hardcoded em `app/data/locais.ts`. Ao clicar num resultado, abria `/navigacao-outdoor` **sem coords** (caía sempre no destino default).

- **Backend:** nova rota `GET /api/search?q=&type=` em `backend/routes/search.js` que faz UNION de buildings + rooms e devolve formato unificado `{id, categoria, nome, codigo, edificio, piso, lat, lon}`. Filtros: `todos | edificio | sala | servico`
- **Frontend:** `services/api.ts` ganha `api.search(q, type)`. `pesquisa.tsx` substitui `LOCAIS` por `useEffect` + debounce 300ms. Estado `loading`/`erro`. Subtítulo composto no frontend para PT/EN sem mexer na DB
- **Navegação:** ao clicar num resultado outdoor → passa `?destLat=&destLng=&destName=` (rota OSRM real)

#### 6. Seed dos dados (`seed-polo1.sql`)
- `UPSERT` por `codigo` dos 24 edifícios com coords OSM (idempotente, não destrói os outros que já existam)
- 8 `floors` para os 4 edifícios principais (ECAV1, ECT1, BIB, REI)
- **57 salas** extraídas do `polo1Data.ts` (códigos F/E/G/I do Inforestudante)
- BAR e SECRETARIA com `tipo='servico'`, restantes `'sala'`

#### 7. Serviços UTAD com horários (pesquisa online)
Recolhidos do site oficial SASUTAD + Biblioteca:
- Cantina de Prados: Almoço Seg-Sex 12:00–14:30
- Restaurante Panorâmico: Almoço Seg-Sex 12:00–15:00
- Snack-Bar Polo I ECT/ECAV, Polo II ECVA: Seg-Sex 08:00–18:00
- Biblioteca Central: Seg-Sex 09:00–19:30 (letivo); 09:00–17:30 (agosto)
- Serviços Académicos: Seg-Sex 09:15–12:30 / 14:00–16:30 (4ª de manhã fechado)

> **Pendente:** integrar na DB (alterar schema `rooms` com colunas `horario`/`descricao`).

#### 8. Favoritos ligados ao backend (suporta edifícios + salas + serviços)
A tabela `favorites` existente só suporta `room_id` (FK rígida). Criada tabela nova `user_favorites` mais flexível.

- **`backend/seed-user-favorites.sql`** — cria `user_favorites (id, user_id, item_id text, nome, subtitulo, categoria, lat, lon, codigo, created_at)` com unique `(user_id, item_id)` e RLS por utilizador
- **`backend/routes/userFavorites.js`** — `GET /api/user-favorites` (autenticado), `POST` (upsert), `DELETE /:itemId` (apaga pelo item_id, não pelo uuid interno)
- **`store/useAppStore.ts`** — `addFavorite/removeFavorite` agora `async` com optimistic updates e rollback em erro. `syncFavoritesFromAPI()` executado automaticamente após `setAuth` (login). Cache local AsyncStorage mantido para offline
- **`app/(tabs)/favoritos.tsx`** — cards agora **clicáveis**: salas → indoor (`?destino=codigo`); resto → outdoor (`?destLat=&destLng=&destName=`). ♡ separado do toque do card

#### 9. Perfil dinâmico
`app/(tabs)/perfil.tsx` reescrito do zero (era 100% hardcoded "Filipe Neves").

- Avatar com inicial do `user.email`
- Nome derivado do email (`al82239@alunos.utad.pt` → "Al82239"); "Convidado" se anónimo
- **Próxima Aula** calculada do AsyncStorage `utadmaps_schedule_v2` — ordena por `data + horaInicio`, agarra o próximo futuro. Toque → indoor para a sala. Mostra "Hoje" / "Amanhã" / "DD MMM"
- Menu **Favoritos** com badge do contador → tab favoritos
- Menu **Horário Semanal** → tab horário
- Menu **Definições** → ecrã definições
- Botão **Terminar sessão** com confirmação (logout + replace para login). Modo anónimo mostra "Iniciar sessão"

### Ficheiros novos
```
backend/
  routes/search.js              ← rota unificada
  routes/userFavorites.js       ← favoritos por utilizador
  seed-polo1.sql                ← seed dos 24 edifícios + 57 salas
  seed-user-favorites.sql       ← tabela user_favorites
components/
  CampusMap.types.ts
  CampusMap.web.tsx             ← Leaflet + cluster
  CampusMap.native.tsx          ← re-export react-native-maps
```

### Ficheiros refatorados
```
constants/polo1Data.ts          ← 24 edifícios + tipo + cores
backend/index.js                ← +2 rotas registadas
services/api.ts                 ← +api.search, +api.getUserFavorites/add/remove
store/useAppStore.ts            ← favoritos async com sync
types/index.ts                  ← +SearchResult, +SearchCategoria
app/(tabs)/index.tsx            ← markers tipados + cor por categoria
app/(tabs)/pesquisa.tsx         ← API + debounce + navegação outdoor com coords
app/(tabs)/favoritos.tsx        ← cards clicáveis
app/(tabs)/perfil.tsx           ← user real + próxima aula + logout
app/navigacao-outdoor.tsx       ← OSRM endpoints separados foot/driving
```

### Dependências adicionadas
- `leaflet@1.9.4`
- `react-leaflet@5.0.0` (não usado activamente — usamos `leaflet` puro no `useEffect`)
- `leaflet.markercluster@1.5.3`
- `@types/leaflet`, `@types/leaflet.markercluster`

(`react-native-maps` e `expo-location` já tinham sido adicionados pela Bússola no commit `mapa2`.)

### Sequência de deploy

Os SQLs são **idempotentes** — pode-se correr múltiplas vezes sem efeitos colaterais.

1. Painel Supabase → SQL Editor → correr **antes do push**:
   - `backend/seed-polo1.sql` (24 edifícios + 8 pisos + 57 salas)
   - `backend/seed-user-favorites.sql` (tabela user_favorites + RLS)
2. `git push` para `main` → GitHub Actions faz deploy automático (frontend + backend)
3. Testar em https://utadmaps.b-host.me:
   - Mapa mostra 24 edifícios com cores+letras por tipo, com clustering
   - Pesquisa "Cantina" ou "F0.01" → resultado clicável → navegação outdoor real
   - Filtros: Edifícios / Salas / Serviços filtram correctamente
   - Modo "A pé" agora dá tempo realista
   - Login com `al82239@alunos.utad.pt` / `123456` → perfil mostra email + próxima aula
   - Favoritos persistem entre sessões e dispositivos via Supabase

---

## Sessão 5 — 8 Maio 2026

Sessão grande pós-merge da branch `indoor` (3D do Pedro/Diogo). Foco em UX,
acessibilidade, navegação real e correcção de dados. Resumo por tema:

### Mapa real ligado à API

- **24 edifícios oficiais** com coordenadas reais OSM (Overpass API), nomenclatura
  do mapa oficial UTAD `mapa-campus-simplificado-3D.pdf`. Substituídos os 21
  placeholders iniciais. Cleanup em [`backend/cleanup-buildings-antigos.sql`](../../backend/cleanup-buildings-antigos.sql)
  apaga `BLA/BLB/BLC/CP/ENG1/GEO/PAV` (duplicates ou nomes informais).
- **Tipo do edifício** (`escola | servico | lab | desporto | outro`) com cores
  WCAG-friendly + letra dentro do marker (não depende só de cor).
- **Cluster Leaflet** no web (junta markers próximos com badge "12").

### Pesquisa unificada

- Nova rota `GET /api/search?q=&type=` em [`backend/routes/search.js`](../../backend/routes/search.js)
  unifica buildings + rooms num formato único. Filtros: `todos | edificio | sala | servico`.
- Frontend [`pesquisa.tsx`](../../app/(tabs)/pesquisa.tsx) ligado à API real (era hardcoded).
  Debounce 300ms, ordem por proximidade GPS quando disponível, mostra distância
  no card.
- **Pesquisa por nome completo da escola** — nova coluna `nome_completo` em
  `buildings`; pesquisar "escola de ciências e tecnologias" devolve `ECT-Polo I`
  e `ECT-Polo II`. Idem para outras escolas.
- Bar de pesquisa do mapa principal **clicável** — abre o tab Pesquisa em vez
  de tentar pesquisar inline (estilo Google Maps).

### Salas reorganizadas conforme `docs/docs_backend/SALAS.txt`

- Descoberta importante: o **ECT-Polo I é UM único edifício** com setores
  internos (E, F, G, I) — não 4 edifícios separados como o seed inicial assumia.
- [`backend/seed-polo1.sql`](../../backend/seed-polo1.sql) refeito: as **57 salas
  reais** (de SALAS.txt) ficam todas no building `ECT1`. Pisos 0/1/2 com BAR,
  Secretaria e salas E*/F*/G*/I*.
- `polo1Data.ts` espelha a mesma estrutura — `sectorE` (id usado pelo indoor 3D)
  contém todas as 57 salas.
- Coordenadas de **entrada principal** (`entrada?: Coord`) para os 4 edifícios
  principais (ECT1, ECAV1, BIB, REI) — navegação outdoor termina na porta, não
  no centro do edifício. Estimativas de offset 10–15m face ao caminho central.

### Navegação outdoor — tempo real

- **OSRM com perfis separados**: `routing.openstreetmap.de/routed-foot` (a pé)
  e `router.project-osrm.org` (carro). Antes ambos davam tempos de carro.
- **Indicações turn-by-turn** em PT/EN, com:
  - Card destacado no painel inferior (ícone direccional + instrução + "em 50m")
  - Auto-avanço por GPS (`watchPositionAsync`, threshold 25m do waypoint)
  - Botões `‹ ›` para avançar/recuar manualmente
- **Selector "De → Para"** no header — escolher origem entre GPS ou qualquer
  edifício de `POLO1_BUILDINGS`. Útil para simular trajetos sem estar no campus.
  Marker verde `O` (origem) + vermelho `D` (destino).
- **Timeout de 15s** no fetch OSRM via `AbortController` — não fica pendurado.
- **Guard de distância**: se origem está a >30km do destino, não chama OSRM e
  mostra "Aproxima-te do campus para ver a rota detalhada".
- **Botão "Entrar no edifício"** (transição outdoor→indoor) aparece só quando
  o destino tem indoor disponível (`getIndoorIdByName`). Navega para `/indoor-3d`.

### Acessibilidade WCAG

- **Alto Contraste real** — [`SettingsContext.tsx`](../../contexts/SettingsContext.tsx)
  com paletas `highContrastLight`/`highContrastDark` (preto/branco puros, rácio
  >21:1, cumpre WCAG AAA 1.4.6). Toggle ligado ao contexto, propaga para toda
  a app.
- **Tamanho de texto** com 5 níveis (até 200%, cumpre WCAG 1.4.4): pequeno
  85%, normal 100%, grande 125%, extra 150%, máximo 200%. Pills com `flex: 1`
  e tamanhos do "A" proporcionais.
- **Subtext mais escuro** (`#6C6C72` claro / `#A8A8AE` escuro) — passa AA.
- **Persistência das definições** via AsyncStorage (`settings_tema`,
  `settings_altoContraste`, etc.).
- **Target size 44×44** nas pills + outros botões.
- **`accessibilityRole/Label/State`** em switches, botões e cards.
- Helper `aStar(grafo, origem, destino, evitarEscadas?)` em [`pathfinding.ts`](../../app/lib/pathfinding.ts)
  aceita flag `rotasAcessiveis` (filtra nós de tipo escada) — pronto para ligar
  ao toggle quando o grafo indoor tiver alternativas (rampa/elevador).

### Histórico de navegação

- **Backend:**
  - Tabela `navigation_history` em [`seed-navigation-history.sql`](../../backend/seed-navigation-history.sql)
    com RLS por utilizador, índice `(user_id, created_at desc)`.
  - Rotas em [`routes/history.js`](../../backend/routes/history.js): `GET /api/history`
    (últimas 50), `POST` (nova entrada), `DELETE` (limpar).
- **Frontend:**
  - Ecrã standalone [`app/historico.tsx`](../../app/historico.tsx) com lista,
    pull-to-refresh, formato relativo ("Há 5 min"), filtragem por tipo
    (Indoor/Outdoor), navegação directa para repetir a viagem.
  - **Logging automático** em `navigacao-outdoor.tsx` e `navigacao-indoor.tsx`
    via `api.addHistory()` quando o destino é definido (1 vez por destino, com
    `historyLoggedRef`).
  - Botão "Histórico de Navegação" no perfil → `/historico`.

### Favoritos por utilizador (sync com backend)

- Tabela `user_favorites` ([`seed-user-favorites.sql`](../../backend/seed-user-favorites.sql))
  flexível com `item_id text + lat/lon/codigo` — suporta edifícios, salas e
  serviços (não só salas como a `favorites` legacy).
- Rotas [`routes/userFavorites.js`](../../backend/routes/userFavorites.js):
  `GET/POST/DELETE /api/user-favorites`.
- `useAppStore` com optimistic updates + rollback. Auto-sync após login.
- Cards de favoritos clicáveis: salas → indoor; resto → outdoor com coords reais.

### Perfil dinâmico

- [`perfil.tsx`](../../app/(tabs)/perfil.tsx) refeito: avatar com inicial do
  email, próxima aula calculada do horário guardado em AsyncStorage.
- **Banner urgente** quando faltam ≤30 min para a próxima aula — fundo
  laranja `#FFF4E5`, ícone `alarm`, texto destaque ("Começa em 15 min").
  Auto-update a cada 30s via `setInterval`.
- Mensagens contextuais: "A decorrer agora" (durante aula), "Daqui a 2 h",
  "Hoje, 14:00 – 16:00", "Sem aulas marcadas".

### Tutorial onboarding

- Novo ecrã [`app/onboarding.tsx`](../../app/onboarding.tsx) com 3 slides:
  1. 🗺️ "Encontra qualquer sala" (pesquisa)
  2. 🟠 "Horário sempre à mão" (Inforestudante)
  3. 🟢 "Inclusivo por design" (acessibilidade)
- Persistido em `AsyncStorage` (`utadmaps_onboarding_seen`) — aparece **só uma
  vez**. Disparado após login E após "Saltar e explorar".
- Scroll horizontal paginado, dots indicadores, botão "Saltar"/"Começar".

### Suporte e Ajuda / FAQ

- Ecrã [`app/suporte.tsx`](../../app/suporte.tsx) com 6 perguntas frequentes
  expansíveis (Inforestudante, favoritos, GPS, alto contraste, modo anónimo).
- Botão "Reportar erro" abre `mailto:utadmaps@alunos.utad.pt` com template
  pré-preenchido.
- Secção "Sobre" com versão, plataforma, disciplina.
- Ligado a partir de Definições → "Suporte e Ajuda".

### Serviços com horários (SASUTAD + biblioteca)

- Schema estendido: `rooms` ganha colunas `horario text`, `descricao text`
  ([`seed-services-horarios.sql`](../../backend/seed-services-horarios.sql)).
- **17 serviços** populados com dados oficiais recolhidos online:
  - Cantina de Prados (Almoço Seg-Sex 12:00–14:30)
  - Restaurante Panorâmico (12:00–15:00)
  - Snack-Bars Polo I ECT/ECAV, Polo II ECVA (08:00–18:00)
  - Biblioteca Central (Seg-Sex 09:00–19:30 letivo)
  - Serviços Académicos (09:15–12:30 / 14:00–16:30)
  - 5 secretarias (ECT, ECAV, ECHS, ECVA, ESS)
  - SASUTAD-Apoio Social, GAPsi-Apoio Psicológico
  - AAUTAD, Hospital Veterinário, Portaria
- API `/api/rooms/search` e `/api/search` devolvem automaticamente os campos
  novos (não exigiu alterações nas rotas).

### Outros fixes

- **Botão "Saltar e explorar" não aparecia em mobile** — `app/index.tsx` agora
  com `KeyboardAvoidingView` + `ScrollView` (`keyboardShouldPersistTaps="handled"`).
- **Modal Importar Horário** com `KeyboardAvoidingView` (teclado já não tapa
  o input).
- **Header do horário centrado** + data por extenso ("Quinta-feira, 12 Mai")
  + parsing dos títulos iCal (`"Aula - CG (PL1) - F2.01"` → "CG · PL1" + sala
  separada) + blocos "Livre" entre aulas com gap ≥ 60 min.
- **Selector de pontos de partida** na navegação outdoor — modal com lista
  dos edifícios POLO1.

### Ficheiros novos

```
app/
  historico.tsx                 ← histórico de navegação
  onboarding.tsx                ← tutorial 3 slides
  suporte.tsx                   ← FAQ + reportar erro
backend/
  routes/history.js             ← /api/history
  seed-services-horarios.sql    ← 17 serviços com horários
  seed-navigation-history.sql   ← tabela history
  cleanup-buildings-antigos.sql ← apagar 7 placeholders
lib/
  geo.ts                        ← haversine + formatDistance
constants/
  polo1Data.ts                  ← getEntradaByName, getIndoorIdByName, tipo
```

### Para retomar / aplicar

Os SQLs são todos idempotentes — corre na ordem no Supabase SQL Editor
("Run without RLS"):

1. `backend/seed-polo1.sql` (24 edifícios + 57 salas no ECT-Polo I)
2. `backend/seed-services-horarios.sql` (17 serviços)
3. `backend/seed-user-favorites.sql` (tabela favorites)
4. `backend/seed-navigation-history.sql` (tabela history)
5. `backend/cleanup-buildings-antigos.sql` (apagar 7 placeholders)

Depois `git push` para o backend ficar com as rotas novas (`/api/search`,
`/api/user-favorites`, `/api/history`).

Sobre o `@react-native-async-storage/async-storage` — usar versão **2.2.0**
(SDK 54). A 3.x quebra Expo Go com "Native module is null". Reinstalar com:

```powershell
npm install --legacy-peer-deps @react-native-async-storage/async-storage@2.2.0
```

---

## O que falta fazer

### Prioritário
- [ ] **Validar coordenadas reais das entradas** dos 4 edifícios principais
  (estimativas actuais — alguém ir ao campus para refinar)
- [ ] **Levantar plantas indoor** dos outros edifícios (só ECT-Polo I tem 3D
  por agora)
- [ ] **Confirmar nomes oficiais das salas** — `SALAS.txt` foi base para o seed

### Importante
- [ ] Logging automático no histórico **também** em `indoor-3d.tsx` (3D do
  colega ainda não chama `api.addHistory`)
- [ ] Restringir CORS no backend a `utadmaps.b-host.me`
- [ ] Migrar tabela `favorites` legacy → `user_favorites` (e remover rota
  antiga)
- [ ] Notificações push antes da próxima aula (Firebase / Expo Notifications)

### Nice to have
- [ ] Tabela `bug_reports` para receber reports do "Reportar erro" (hoje
  abre `mailto:`)
- [ ] Sugestões de favoritos baseadas no histórico
- [ ] Swipe-to-remove favoritos (precisa `react-native-gesture-handler`)
- [ ] Pesquisa por gabinete de professor / departamento (sem dados ainda)
- [ ] Pontos de referência exteriores (entradas, paragens de bus) no mapa
- [ ] Histórico de pesquisa (separado do histórico de navegação)

### Acessibilidade — extras
- [ ] Focus visible no web (react-native-web suprime outline do browser)
- [ ] Auditoria com leitor de ecrã real (VoiceOver iOS / TalkBack Android)
- [ ] Verificar contraste do tabbar em alto contraste

### Para entrega
- [ ] Vídeo curto da app (screen recording iPhone)
- [ ] Atualizar `RelatórioIPC_desafio2_fase3.pdf` com screenshots reais
  (substituir wireframes finais pela UI implementada)

---

## Como retomar numa nova sessão

1. Ler `docs/docs_backend/BACKEND.md` para contexto completo
2. URLs em produção: `https://utadmaps.b-host.me` (frontend) e `https://api.utadmaps.b-host.me` (backend)
3. SSH no servidor: `ssh -i $env:USERPROFILE\.ssh\id_monteiros bruno@116.203.39.51`
4. Deploy: basta `git push` para `main` (rebuild automático via GitHub Actions)
5. Contas demo: `al82239@alunos.utad.pt` (e outros `al*`) com password `123456`
6. Antes de qualquer push que mexa em DB, correr os SQLs novos no Supabase SQL Editor
