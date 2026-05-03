-- UTADmaps — tabela de favoritos por utilizador
--
-- Tabela mais flexível que `favorites` original (que só suportava room_id).
-- Permite favoritar edifícios, salas ou serviços com um id genérico.
-- Idempotente.

create table if not exists user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_id text not null,
  nome text not null,
  subtitulo text,
  categoria text,
  lat double precision,
  lon double precision,
  codigo text,
  created_at timestamptz default now(),
  unique(user_id, item_id)
);

-- Migração: adicionar colunas se a tabela já existia sem elas
alter table user_favorites add column if not exists lat double precision;
alter table user_favorites add column if not exists lon double precision;
alter table user_favorites add column if not exists codigo text;

alter table user_favorites enable row level security;

drop policy if exists "user_favorites_own" on user_favorites;
create policy "user_favorites_own"
  on user_favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
