-- UTADmaps — seed do campus UTAD (Polo I + Polo II)
--
-- Coordenadas obtidas via OpenStreetMap (Overpass API).
-- Nomenclatura segue o mapa oficial UTAD (mapa-campus-simplificado-3D.pdf).
--
-- Os 4 edifícios principais (ECAV-I, ECT-I, Biblioteca, Reitoria) têm
-- salas conhecidas via Inforestudante (códigos F, E, G, I).
--
-- Idempotente — pode correr múltiplas vezes:
--   - buildings → upsert por codigo
--   - floors    → delete dos 4 setores principais + insert
--   - rooms     → delete dos 4 setores principais + insert

-- 1. EDIFÍCIOS — upsert por código
insert into buildings (nome, codigo, lat, lon)
values
  -- Polo I — núcleo académico (com salas conhecidas)
  ('ECAV – Polo I',                               'ECAV1',  41.288144, -7.741173),
  ('ECT – Polo I',                                'ECT1',   41.286934, -7.740588),
  ('Biblioteca Central',                          'BIB',    41.285822, -7.740542),
  ('Reitoria',                                    'REI',    41.286264, -7.738626),

  -- Polo I — outros edifícios
  ('ECVA – Polo I',                               'ECVA1',  41.286109, -7.739345),
  ('ECHS – Polo I',                               'ECHS1',  41.281620, -7.745260),
  ('Edifício de Enologia',                        'ENO',    41.286113, -7.738237),
  ('Complexo Laboratorial',                       'LAB',    41.287550, -7.738097),
  ('Hangar ECT – Polo I',                         'HECT1',  41.286942, -7.741533),
  ('University Center (AAUTAD)',                  'UC',     41.288435, -7.739048),
  ('Edifício de Apoio aos Alunos',                'EAA',    41.288100, -7.739450),
  ('Edifício de Serviços Comuns',                 'ESC',    41.287868, -7.739188),
  ('Kitchen Lab',                                 'KIT',    41.287400, -7.739700),
  ('Herbário / Jardim Botânico',                  'JB',     41.287200, -7.741400),
  ('Hospital Veterinário',                        'HV',     41.289576, -7.739880),
  ('Portaria',                                    'PORT',   41.289683, -7.737329),
  ('Cantina de Prados / Restaurante Panorâmico',  'CAN',    41.289699, -7.736478),

  -- Polo II
  ('ECT – Polo II',                               'ECT2',   41.285771, -7.743627),
  ('ECAV – Polo II',                              'ECAV2',  41.285382, -7.743822),
  ('ECHS – Polo II',                              'ECHS2',  41.285204, -7.744535),
  ('Hangar ECAV – Polo II',                       'HECAV2', 41.284575, -7.744239),
  ('Nave de Desportos',                           'NAV',    41.283125, -7.744929),
  ('ECVA – Polo II / Complexo Desportivo',        'ECVA2',  41.282700, -7.743800),
  ('Escola Superior de Saúde',                    'ESS',    41.282500, -7.743400)
on conflict (codigo) do update set
  nome = excluded.nome,
  lat  = excluded.lat,
  lon  = excluded.lon;

-- 2. PISOS — limpar e recriar para os 4 edifícios principais
delete from floors
 where building_id in (select id from buildings where codigo in ('ECAV1','ECT1','BIB','REI'));

insert into floors (building_id, numero)
select b.id, p.piso
from buildings b
join (values
  ('ECAV1', 0), ('ECAV1', 1), ('ECAV1', 2),
  ('ECT1',  1), ('ECT1',  2),
  ('BIB',   0),
  ('REI',   0)
) as p(bcod, piso) on p.bcod = b.codigo;

-- 3. SALAS / SERVIÇOS — limpar e recriar para os 4 edifícios principais
delete from rooms
 where building_id in (select id from buildings where codigo in ('ECAV1','ECT1','BIB','REI'));

with f as (
  select f.id as floor_id, b.id as building_id, b.codigo as bcod, f.numero as piso
  from floors f
  join buildings b on b.id = f.building_id
)
insert into rooms (building_id, floor_id, nome, codigo, tipo)
select f.building_id, f.floor_id, x.nome, x.codigo, x.tipo
from f
join (values
  -- ECAV – Polo I — Piso 0
  ('ECAV1', 0, 'Bar',         'BAR',        'servico'),
  ('ECAV1', 0, 'F0.01',       'F0.01',      'sala'),
  ('ECAV1', 0, 'F0.02',       'F0.02',      'sala'),
  ('ECAV1', 0, 'F0.05',       'F0.05',      'sala'),
  ('ECAV1', 0, 'F0.06',       'F0.06',      'sala'),
  ('ECAV1', 0, 'F0.07',       'F0.07',      'sala'),
  ('ECAV1', 0, 'F0.08',       'F0.08',      'sala'),
  ('ECAV1', 0, 'F0.10',       'F0.10',      'sala'),
  ('ECAV1', 0, 'F0.12',       'F0.12',      'sala'),
  ('ECAV1', 0, 'F0.14',       'F0.14',      'sala'),
  ('ECAV1', 0, 'F0.16',       'F0.16',      'sala'),
  ('ECAV1', 0, 'F0.18',       'F0.18',      'sala'),
  ('ECAV1', 0, 'F0.19',       'F0.19',      'sala'),
  -- ECAV – Polo I — Piso 1
  ('ECAV1', 1, 'Secretaria',  'SECRETARIA', 'servico'),
  ('ECAV1', 1, 'F1.17',       'F1.17',      'sala'),
  ('ECAV1', 1, 'F1.18',       'F1.18',      'sala'),
  ('ECAV1', 1, 'F1.19',       'F1.19',      'sala'),
  ('ECAV1', 1, 'F1.20',       'F1.20',      'sala'),
  ('ECAV1', 1, 'F1.21',       'F1.21',      'sala'),
  ('ECAV1', 1, 'F1.22',       'F1.22',      'sala'),
  ('ECAV1', 1, 'F1.24',       'F1.24',      'sala'),
  -- ECAV – Polo I — Piso 2
  ('ECAV1', 2, 'F2.01',       'F2.01',      'sala'),
  ('ECAV1', 2, 'F2.02',       'F2.02',      'sala'),
  ('ECAV1', 2, 'F2.06',       'F2.06',      'sala'),
  ('ECAV1', 2, 'F2.10A',      'F2.10A',     'sala'),
  ('ECAV1', 2, 'F2.12',       'F2.12',      'sala'),
  ('ECAV1', 2, 'F2.13',       'F2.13',      'sala'),
  ('ECAV1', 2, 'F2.15',       'F2.15',      'sala'),
  ('ECAV1', 2, 'F2.16',       'F2.16',      'sala'),
  ('ECAV1', 2, 'F2.17',       'F2.17',      'sala'),
  ('ECAV1', 2, 'F2.18',       'F2.18',      'sala'),
  ('ECAV1', 2, 'F2.19',       'F2.19',      'sala'),
  ('ECAV1', 2, 'F2.20A',      'F2.20A',     'sala'),
  ('ECAV1', 2, 'F2.22',       'F2.22',      'sala'),
  -- ECT – Polo I — Piso 1
  ('ECT1',  1, 'E1.01',       'E1.01',      'sala'),
  ('ECT1',  1, 'E1.02',       'E1.02',      'sala'),
  ('ECT1',  1, 'E1.06',       'E1.06',      'sala'),
  ('ECT1',  1, 'E1.08',       'E1.08',      'sala'),
  ('ECT1',  1, 'E1.11',       'E1.11',      'sala'),
  ('ECT1',  1, 'E1.12',       'E1.12',      'sala'),
  ('ECT1',  1, 'E1.15',       'E1.15',      'sala'),
  ('ECT1',  1, 'E1.16',       'E1.16',      'sala'),
  -- ECT – Polo I — Piso 2
  ('ECT1',  2, 'E2.01',       'E2.01',      'sala'),
  ('ECT1',  2, 'E2.02',       'E2.02',      'sala'),
  ('ECT1',  2, 'E2.04',       'E2.04',      'sala'),
  ('ECT1',  2, 'E2.10',       'E2.10',      'sala'),
  ('ECT1',  2, 'E2.11',       'E2.11',      'sala'),
  ('ECT1',  2, 'E2.13',       'E2.13',      'sala'),
  ('ECT1',  2, 'E2.14',       'E2.14',      'sala'),
  ('ECT1',  2, 'E2.15',       'E2.15',      'sala'),
  -- Biblioteca Central — Piso 0
  ('BIB',   0, 'G0.01',       'G0.01',      'sala'),
  ('BIB',   0, 'G0.03',       'G0.03',      'sala'),
  ('BIB',   0, 'G0.04B',      'G0.04B',     'sala'),
  ('BIB',   0, 'G0.08',       'G0.08',      'sala'),
  ('BIB',   0, 'G0.12',       'G0.12',      'sala'),
  ('BIB',   0, 'G0.14',       'G0.14',      'sala'),
  -- Reitoria — Piso 0
  ('REI',   0, 'I0.06',       'I0.06',      'sala')
) as x(bcod, piso, nome, codigo, tipo)
  on f.bcod = x.bcod and f.piso = x.piso;
