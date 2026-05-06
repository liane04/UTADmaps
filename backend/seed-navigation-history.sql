-- UTADmaps — histórico de navegação por utilizador
--
-- Idempotente.

create table if not exists navigation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  destino_id text,                              -- ex: 'b-<uuid>' (edifício), 'r-<uuid>' (sala)
  destino_nome text not null,
  destino_categoria text,                       -- 'edificio' | 'sala' | 'servico'
  navegacao_tipo text not null,                 -- 'indoor' | 'outdoor'
  lat double precision,
  lon double precision,
  created_at timestamptz default now()
);

-- Index para listar rapidamente os mais recentes do utilizador
create index if not exists navigation_history_user_created_idx
  on navigation_history (user_id, created_at desc);

alter table navigation_history enable row level security;

drop policy if exists "navigation_history_own" on navigation_history;
create policy "navigation_history_own"
  on navigation_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
