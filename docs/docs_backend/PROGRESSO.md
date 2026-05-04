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

## O que falta fazer

### Prioritário
- [ ] Levantar **salas reais no campus** (códigos F/E/G/I podem ter erros — vieram de levantamento por confirmar)
- [ ] Validar coordenadas GPS dos edifícios estimados (alguns Polo II são aproximações)
- [ ] Adicionar `horario` e `descricao` a `rooms` + popular com SASUTAD/Biblioteca

### Importante
- [ ] Restringir CORS no backend a `utadmaps.b-host.me`
- [ ] Histórico de navegação por utilizador (tabela `navigation_history`)
- [ ] Recentes na pesquisa via API (atualmente strings hardcoded em `pesquisa.tsx`)

### Nice to have
- [ ] Distância real (cálculo Haversine entre user e local) na lista de pesquisa
- [ ] Pop-up no mapa com horário e botão "Navegar"
- [ ] Migrar `favorites` legado para `user_favorites` e remover rota antiga

---

## Como retomar numa nova sessão

1. Ler `docs/docs_backend/BACKEND.md` para contexto completo
2. URLs em produção: `https://utadmaps.b-host.me` (frontend) e `https://api.utadmaps.b-host.me` (backend)
3. SSH no servidor: `ssh -i $env:USERPROFILE\.ssh\id_monteiros bruno@116.203.39.51`
4. Deploy: basta `git push` para `main` (rebuild automático via GitHub Actions)
5. Contas demo: `al82239@alunos.utad.pt` (e outros `al*`) com password `123456`
6. Antes de qualquer push que mexa em DB, correr os SQLs novos no Supabase SQL Editor
