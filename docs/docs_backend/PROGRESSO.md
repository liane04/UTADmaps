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

## O que falta fazer

### Prioritário
- [ ] Popular tabela `rooms` com salas reais (levantamento no campus)
- [ ] Ligar frontend à API — substituir dados hardcoded por chamadas reais
- [ ] Testar auth completo (registo + login @utad.eu)

### Importante
- [ ] Afinar coordenadas GPS dos edifícios (confirmar no campus)
- [ ] Testar iCal com ficheiro .ics real do Infraestudante
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
4. Deploy: basta `git push` para `main`
