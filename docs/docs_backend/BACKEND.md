# UTADmaps — Backend

## Stack
- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Base de dados:** Supabase (PostgreSQL)
- **Deploy:** Docker + Nginx + Let's Encrypt no servidor Hetzner

## URLs de Produção
```
Frontend:  https://utadmaps.b-host.me
Backend:   https://api.utadmaps.b-host.me
```

## Rotas da API![alt text]

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/health` | Não | Estado do servidor |
| GET | `/api/buildings` | Não | Lista todos os edifícios |
| GET | `/api/buildings/:id/floors` | Não | Pisos de um edifício |
| GET | `/api/rooms/search?q=&type=` | Não | Pesquisa salas e serviços |
| POST | `/api/auth/register` | Não | Registo (só @utad.eu / @alunos.utad.pt) |
| POST | `/api/auth/login` | Não | Login — devolve `{ user, token }` |
| GET | `/api/schedule/:userId` | JWT | Horário do utilizador |
| POST | `/api/schedule/ical/import-url` | Não* | Importar via chave Infraestudante |
| POST | `/api/schedule/ical/import` | JWT | Importar ficheiro .ics |
| GET | `/api/favorites/:userId` | JWT | Favoritos do utilizador |
| POST | `/api/favorites` | JWT | Adicionar favorito |
| DELETE | `/api/favorites/:id` | JWT | Remover favorito |

> \* `/api/schedule/ical/import-url` não requer auth, mas se enviares `Authorization: Bearer <token>` guarda a chave no `user_metadata` do Supabase para sincronização entre dispositivos.

### Contas de demonstração (Supabase Auth)
| Email | Password |
|---|---|
| `al82239@alunos.utad.pt` | `123456` |
| `al79012@alunos.utad.pt` | `123456` |
| `al81311@alunos.utad.pt` | `123456` |
| `al82626@alunos.utad.pt` | `123456` |
| `al80990@alunos.utad.pt` | `123456` |

## Estrutura de Pastas
```
backend/
├── index.js                  ← servidor Express
├── supabase.js               ← cliente Supabase
├── Dockerfile
├── docker-compose.yml
├── supabase-schema.sql       ← schema da DB
├── .env.example              ← template (nunca commitar .env)
├── routes/
│   ├── buildings.js
│   ├── rooms.js
│   ├── schedule.js
│   ├── favorites.js
│   └── auth.js
├── middleware/
│   └── auth.js               ← verificação JWT Supabase
└── services/
    └── icalParser.js         ← parser .ics do Infraestudante
```

## Tabelas no Supabase
- `buildings` — edifícios com coordenadas GPS reais (já populado)
- `floors` — pisos por edifício
- `rooms` — salas e serviços (por popular com dados reais da UTAD)
- `favorites` — favoritos por utilizador
- `schedules` — horário importado via iCal

---

## Configuração do Servidor (Hetzner)

### Servidor
- **Provider:** Hetzner Cloud
- **Plano:** CPX32 | x86 | 160 GB
- **IP:** `116.203.39.51`
- **OS:** Ubuntu
- **Localização:** Nuremberg, eu-central
- **Acesso SSH:** `ssh -i $env:USERPROFILE\.ssh\id_monteiros bruno@116.203.39.51`

### Subdomínios DNS (Cloudflare — domínio b-host.me)
| Subdomínio | Tipo | IP | Proxy |
|---|---|---|---|
| `api.utadmaps.b-host.me` | A | 116.203.39.51 | DNS only |
| `utadmaps.b-host.me` | A | 116.203.39.51 | DNS only |

### Frontend (estático)
- Pasta no servidor: `/var/www/utadmaps/dist/`
- Nginx config: `/etc/nginx/sites-available/utadmaps-frontend`
- Build: `npx expo export --platform web` (corre automaticamente no deploy)
- SSL: Let's Encrypt via Certbot (auto-renovação activa)

### Backend (Docker)
- Container: `utadmaps-api`
- Porta interna: `3000`
- Porta exposta no host: `3001` (3000 ocupada pelo Chatwoot)
- Pasta no servidor: `/var/www/utadmaps/backend/`
- Nginx config: `/etc/nginx/sites-available/utadmaps-api`
- Restart policy: `unless-stopped`

### Outros serviços no servidor
- **Chatwoot** — porta 3000 → `chat.monteiros.pt`
- **n8n** — porta 5678 → `n8n.monteiros.pt`

---

## Deploy Automático (GitHub Actions)

A cada `git push` para `main` o GitHub Actions faz deploy automático:

```
git push → GitHub Actions (.github/workflows/deploy.yml) → SSH → /var/www/utadmaps/deploy.sh
```

O script `deploy.sh` executa:
1. `git pull`
2. `npm install --legacy-peer-deps`
3. `npx expo export --platform web` (rebuild do frontend)
4. `docker compose down && docker compose up -d --build` (restart do backend)

### Secrets no GitHub (Settings → Secrets → Actions)
| Secret | Valor |
|---|---|
| `SSH_PRIVATE_KEY` | Chave privada em `~/.ssh/github_actions` no servidor |
| `SSH_HOST` | `116.203.39.51` |
| `SSH_USER` | `bruno` |

---

## Variáveis de Ambiente (.env)
```
PORT=3000
SUPABASE_URL=https://vebqypqepyvsoockcfrd.supabase.co
SUPABASE_SERVICE_KEY=<service_role key do Supabase>
JWT_SECRET=utadmaps-secret-2026
```
> O ficheiro `.env` não está no git — tem de ser criado manualmente no servidor em `/var/www/utadmaps/backend/.env`.
