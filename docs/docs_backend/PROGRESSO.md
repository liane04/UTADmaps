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

## O que falta fazer

### Prioritário
- [ ] Popular tabela `rooms` com salas reais (levantamento no campus)
- [ ] Ligar frontend à API — substituir dados hardcoded por chamadas reais

### Importante
- [ ] Afinar coordenadas GPS dos edifícios (confirmar no campus)
- [ ] Corrigir CORS para aceitar só `utadmaps.b-host.me`
- [ ] Popular tabela `floors` com pisos reais por edifício

### Nice to have
- [ ] Rota `GET /api/services` para serviços (cantina, biblioteca...)
- [ ] Histórico de navegação

---

## Como retomar numa nova sessão

1. Ler `docs/docs_backend/BACKEND.md` para contexto completo
2. URLs em produção: `https://utadmaps.b-host.me` (frontend) e `https://api.utadmaps.b-host.me` (backend)
3. SSH no servidor: `ssh -i $env:USERPROFILE\.ssh\id_monteiros bruno@116.203.39.51`
4. Deploy: basta `git push` para `main` (rebuild automático via GitHub Actions)
5. Contas demo: `al82239@alunos.utad.pt` (e outros al*) com password `123456`
