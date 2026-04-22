-- UTADmaps — Schema completo

-- Edifícios
create table buildings (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  codigo text unique not null,
  lat double precision not null,
  lon double precision not null,
  created_at timestamptz default now()
);

-- Pisos
create table floors (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade not null,
  numero integer not null,
  unique(building_id, numero)
);

-- Salas e serviços
create table rooms (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade not null,
  floor_id uuid references floors(id) on delete cascade,
  nome text not null,
  codigo text,
  tipo text not null check (tipo in ('sala', 'servico', 'laboratorio', 'outro')),
  capacidade integer,
  created_at timestamptz default now()
);

-- Favoritos
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  room_id uuid references rooms(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, room_id)
);

-- Horários importados via iCal
create table schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  disciplina text not null,
  dia_semana text not null,
  hora_inicio text not null,
  hora_fim text not null,
  room_id uuid references rooms(id) on delete set null,
  sala_raw text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table buildings enable row level security;
alter table floors enable row level security;
alter table rooms enable row level security;
alter table favorites enable row level security;
alter table schedules enable row level security;

-- Edifícios, pisos e salas são públicos (leitura)
create policy "buildings_public_read" on buildings for select using (true);
create policy "floors_public_read" on floors for select using (true);
create policy "rooms_public_read" on rooms for select using (true);

-- Favoritos: cada utilizador só vê e edita os seus
create policy "favorites_own" on favorites for all using (auth.uid() = user_id);

-- Horários: cada utilizador só vê e edita os seus
create policy "schedules_own" on schedules for all using (auth.uid() = user_id);

-- Dados reais dos edifícios da UTAD
insert into buildings (nome, codigo, lat, lon) values
  ('Biblioteca',           'BIB',  41.27410, -7.74120),
  ('Bloco A',              'BLA',  41.27380, -7.74050),
  ('Bloco B',              'BLB',  41.27350, -7.74000),
  ('Bloco C',              'BLC',  41.27320, -7.73980),
  ('Cantina',              'CAN',  41.27450, -7.74200),
  ('Reitoria',             'REI',  41.27500, -7.74300),
  ('Engenharias I',        'ENG1', 41.27280, -7.74150),
  ('Geociências',          'GEO',  41.27260, -7.74100),
  ('Pavilhão Desportivo',  'PAV',  41.27200, -7.74050),
  ('Complexo Pedagógico',  'CP',   41.27220, -7.74200);
