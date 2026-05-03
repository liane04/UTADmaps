-- UTADmaps — seed dos 4 setores principais do Polo I (E, F, G, I)
-- Coordenadas e listas de salas extraídas de constants/polo1Data.ts (equipa Bússola)
-- Códigos das salas seguem nomenclatura Inforestudante (Setor.Piso.Número)
--
-- Seguro de correr múltiplas vezes (idempotente):
--   - buildings → upsert por codigo
--   - floors    → delete dos 4 setores + insert
--   - rooms     → delete dos 4 setores + insert

-- 1. EDIFÍCIOS — sincronizar coordenadas reais
insert into buildings (nome, codigo, lat, lon)
values
  ('Setor F – ECVA (Polo I)', 'ECVA1', 41.2881439, -7.7411733),
  ('Setor E – ECT (Polo I)',  'ECT1',  41.2869343, -7.7405878),
  ('Setor G – Biblioteca',    'BIB',   41.2858222, -7.7405422),
  ('Setor I – Reitoria',      'REI',   41.2862640, -7.7386259)
on conflict (codigo) do update set
  nome = excluded.nome,
  lat  = excluded.lat,
  lon  = excluded.lon;

-- 2. PISOS — limpar e recriar
delete from floors
 where building_id in (select id from buildings where codigo in ('ECVA1','ECT1','BIB','REI'));

insert into floors (building_id, numero)
select b.id, p.piso
from buildings b
join (values
  ('ECVA1', 0), ('ECVA1', 1), ('ECVA1', 2),
  ('ECT1',  1), ('ECT1',  2),
  ('BIB',   0),
  ('REI',   0)
) as p(bcod, piso) on p.bcod = b.codigo;

-- 3. SALAS / SERVIÇOS — limpar e recriar
delete from rooms
 where building_id in (select id from buildings where codigo in ('ECVA1','ECT1','BIB','REI'));

with f as (
  select f.id as floor_id, b.id as building_id, b.codigo as bcod, f.numero as piso
  from floors f
  join buildings b on b.id = f.building_id
)
insert into rooms (building_id, floor_id, nome, codigo, tipo)
select f.building_id, f.floor_id, x.nome, x.codigo, x.tipo
from f
join (values
  -- Setor F (ECVA Polo I) — Piso 0
  ('ECVA1', 0, 'Bar',     'BAR',   'servico'),
  ('ECVA1', 0, 'F0.01',   'F0.01', 'sala'),
  ('ECVA1', 0, 'F0.02',   'F0.02', 'sala'),
  ('ECVA1', 0, 'F0.05',   'F0.05', 'sala'),
  ('ECVA1', 0, 'F0.06',   'F0.06', 'sala'),
  ('ECVA1', 0, 'F0.07',   'F0.07', 'sala'),
  ('ECVA1', 0, 'F0.08',   'F0.08', 'sala'),
  ('ECVA1', 0, 'F0.10',   'F0.10', 'sala'),
  ('ECVA1', 0, 'F0.12',   'F0.12', 'sala'),
  ('ECVA1', 0, 'F0.14',   'F0.14', 'sala'),
  ('ECVA1', 0, 'F0.16',   'F0.16', 'sala'),
  ('ECVA1', 0, 'F0.18',   'F0.18', 'sala'),
  ('ECVA1', 0, 'F0.19',   'F0.19', 'sala'),
  -- Setor F (ECVA Polo I) — Piso 1
  ('ECVA1', 1, 'Secretaria', 'SECRETARIA', 'servico'),
  ('ECVA1', 1, 'F1.17',   'F1.17', 'sala'),
  ('ECVA1', 1, 'F1.18',   'F1.18', 'sala'),
  ('ECVA1', 1, 'F1.19',   'F1.19', 'sala'),
  ('ECVA1', 1, 'F1.20',   'F1.20', 'sala'),
  ('ECVA1', 1, 'F1.21',   'F1.21', 'sala'),
  ('ECVA1', 1, 'F1.22',   'F1.22', 'sala'),
  ('ECVA1', 1, 'F1.24',   'F1.24', 'sala'),
  -- Setor F (ECVA Polo I) — Piso 2
  ('ECVA1', 2, 'F2.01',   'F2.01',  'sala'),
  ('ECVA1', 2, 'F2.02',   'F2.02',  'sala'),
  ('ECVA1', 2, 'F2.06',   'F2.06',  'sala'),
  ('ECVA1', 2, 'F2.10A',  'F2.10A', 'sala'),
  ('ECVA1', 2, 'F2.12',   'F2.12',  'sala'),
  ('ECVA1', 2, 'F2.13',   'F2.13',  'sala'),
  ('ECVA1', 2, 'F2.15',   'F2.15',  'sala'),
  ('ECVA1', 2, 'F2.16',   'F2.16',  'sala'),
  ('ECVA1', 2, 'F2.17',   'F2.17',  'sala'),
  ('ECVA1', 2, 'F2.18',   'F2.18',  'sala'),
  ('ECVA1', 2, 'F2.19',   'F2.19',  'sala'),
  ('ECVA1', 2, 'F2.20A',  'F2.20A', 'sala'),
  ('ECVA1', 2, 'F2.22',   'F2.22',  'sala'),
  -- Setor E (ECT Polo I) — Piso 1
  ('ECT1',  1, 'E1.01',   'E1.01', 'sala'),
  ('ECT1',  1, 'E1.02',   'E1.02', 'sala'),
  ('ECT1',  1, 'E1.06',   'E1.06', 'sala'),
  ('ECT1',  1, 'E1.08',   'E1.08', 'sala'),
  ('ECT1',  1, 'E1.11',   'E1.11', 'sala'),
  ('ECT1',  1, 'E1.12',   'E1.12', 'sala'),
  ('ECT1',  1, 'E1.15',   'E1.15', 'sala'),
  ('ECT1',  1, 'E1.16',   'E1.16', 'sala'),
  -- Setor E (ECT Polo I) — Piso 2
  ('ECT1',  2, 'E2.01',   'E2.01', 'sala'),
  ('ECT1',  2, 'E2.02',   'E2.02', 'sala'),
  ('ECT1',  2, 'E2.04',   'E2.04', 'sala'),
  ('ECT1',  2, 'E2.10',   'E2.10', 'sala'),
  ('ECT1',  2, 'E2.11',   'E2.11', 'sala'),
  ('ECT1',  2, 'E2.13',   'E2.13', 'sala'),
  ('ECT1',  2, 'E2.14',   'E2.14', 'sala'),
  ('ECT1',  2, 'E2.15',   'E2.15', 'sala'),
  -- Setor G (Biblioteca) — Piso 0
  ('BIB',   0, 'G0.01',   'G0.01',  'sala'),
  ('BIB',   0, 'G0.03',   'G0.03',  'sala'),
  ('BIB',   0, 'G0.04B',  'G0.04B', 'sala'),
  ('BIB',   0, 'G0.08',   'G0.08',  'sala'),
  ('BIB',   0, 'G0.12',   'G0.12',  'sala'),
  ('BIB',   0, 'G0.14',   'G0.14',  'sala'),
  -- Setor I (Reitoria) — Piso 0
  ('REI',   0, 'I0.06',   'I0.06',  'sala')
) as x(bcod, piso, nome, codigo, tipo)
  on f.bcod = x.bcod and f.piso = x.piso;
