# UTADmaps — Backend

## Stack
- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Base de dados:** Supabase (PostgreSQL)
- **Deploy:** Docker + Nginx + Let's Encrypt no servidor Hetzner

## URL de Produção
```
https://api.utadmaps.b-host.me
```

## Rotas da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/health` | Não | Estado do servidor |
| GET | `/api/buildings` | Não | Lista todos os edifícios |
| GET | `/api/buildings/:id/floors` | Não | Pisos de um edifício |
| GET | `/api/rooms/search?q=&type=` | Não | Pesquisa salas e serviços |
| POST | `/api/auth/register` | Não | Registo (só @utad.eu) |
| POST | `/api/auth/login` | Não | Login |
| GET | `/api/schedule/:userId` | JWT | Horário do utilizador |
| POST | `/api/schedule/ical/import` | JWT | Importar ficheiro .ics |
| GET | `/api/favorites/:userId` | JWT | Favoritos do utilizador |
| POST | `/api/favorites` | JWT | Adicionar favorito |
| DELETE | `/api/favorites/:id` | JWT | Remover favorito |

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
- `buildings` — edifícios com coordenadas GPS reais
- `floors` — pisos por edifício
- `rooms` — salas e serviços
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

### Subdomínio DNS
- **Registo:** `api.utadmaps` tipo `A` no Cloudflare (domínio `b-host.me`)
- **DNS only** (sem proxy Cloudflare)
- **Resultado:** `api.utadmaps.b-host.me → 116.203.39.51`

### Docker
- Container: `utadmaps-api`
- Porta interna: `3000`
- Porta exposta no host: `3001` (3000 ocupada pelo Chatwoot)
- Pasta no servidor: `/var/www/utadmaps/backend/`
- Restart policy: `unless-stopped`

### Nginx
- Config: `/etc/nginx/sites-available/utadmaps-api`
- Proxy: `localhost:3001 → api.utadmaps.b-host.me`
- SSL: Let's Encrypt via Certbot (auto-renovação activa)

### Outros serviços no servidor
- **Chatwoot** — porta 3000
- **n8n** — porta 5678

---

## Como fazer deploy de atualizações

```bash
# No servidor
cd /var/www/utadmaps
git pull
cd backend
docker compose down && docker compose up -d --build
```

## Variáveis de Ambiente (.env)
```
PORT=3000
SUPABASE_URL=https://vebqypqepyvsoockcfrd.supabase.co
SUPABASE_SERVICE_KEY=<service_role key do Supabase>
JWT_SECRET=utadmaps-secret-2026
```
> O ficheiro `.env` não está no git — tem de ser criado manualmente no servidor.
