-- UTADmaps — seed do campus UTAD (Polo I + Polo II)
--
-- Coordenadas obtidas via OpenStreetMap (Overpass API).
-- Nomenclatura segue o mapa oficial UTAD (mapa-campus-simplificado-3D.pdf).
--
-- IMPORTANTE: o ECT-Polo I é UM único edifício com SETORES INTERNOS (E, F, G, I).
-- Todas as salas listadas em docs/docs_backend/SALAS.txt pertencem a este
-- edifício, não a edifícios separados como antes se assumia incorrectamente.
--
-- Idempotente — pode correr múltiplas vezes:
--   - buildings → upsert por codigo
--   - floors    → delete dos 4 setores principais + insert
--   - rooms     → delete dos 4 setores principais + insert

-- 1. EDIFICIOS — upsert por código (com nome_completo em ASCII para pesquisa)
-- Nota: usamos hífen simples '-' em vez de en-dash '–' para evitar problemas
-- de encoding no Supabase SQL Editor. nome_completo é ASCII puro para que
-- a pesquisa funcione independentemente de acentos.
alter table buildings add column if not exists nome_completo text;

insert into buildings (nome, codigo, lat, lon)
values
  -- Polo I — núcleo académico
  ('ECAV - Polo I',                               'ECAV1',  41.288144, -7.741173),
  ('ECT - Polo I',                                'ECT1',   41.286934, -7.740588),
  ('Biblioteca Central',                          'BIB',    41.285822, -7.740542),
  ('Reitoria',                                    'REI',    41.286264, -7.738626),

  -- Polo I — outros edifícios
  ('ECVA - Polo I',                               'ECVA1',  41.286109, -7.739345),
  ('ECHS - Polo I',                               'ECHS1',  41.281620, -7.745260),
  ('Edificio de Enologia',                        'ENO',    41.286113, -7.738237),
  ('Complexo Laboratorial',                       'LAB',    41.287550, -7.738097),
  ('Hangar ECT - Polo I',                         'HECT1',  41.286942, -7.741533),
  ('University Center (AAUTAD)',                  'UC',     41.288435, -7.739048),
  ('Edificio de Apoio aos Alunos',                'EAA',    41.288100, -7.739450),
  ('Edificio de Servicos Comuns',                 'ESC',    41.287868, -7.739188),
  ('Kitchen Lab',                                 'KIT',    41.287400, -7.739700),
  ('Herbario / Jardim Botanico',                  'JB',     41.287200, -7.741400),
  ('Hospital Veterinario',                        'HV',     41.289576, -7.739880),
  ('Portaria',                                    'PORT',   41.289683, -7.737329),
  ('Cantina de Prados / Restaurante Panoramico',  'CAN',    41.289699, -7.736478),

  -- Polo II
  ('ECT - Polo II',                               'ECT2',   41.285771, -7.743627),
  ('ECAV - Polo II',                              'ECAV2',  41.285382, -7.743822),
  ('ECHS - Polo II',                              'ECHS2',  41.285204, -7.744535),
  ('Hangar ECAV - Polo II',                       'HECAV2', 41.284575, -7.744239),
  ('Nave de Desportos',                           'NAV',    41.283125, -7.744929),
  ('ECVA - Polo II / Complexo Desportivo',        'ECVA2',  41.282700, -7.743800),
  ('Escola Superior de Saude',                    'ESS',    41.282500, -7.743400)
on conflict (codigo) do update set
  nome = excluded.nome,
  lat  = excluded.lat,
  lon  = excluded.lon;

-- nome_completo em ASCII (sem acentos) para pesquisa robusta:
-- "Escola de Ciencias" bate em "Ciências", "Ciencia", etc.
update buildings set nome_completo = 'Escola de Ciencias e Tecnologias - Polo I'            where codigo = 'ECT1';
update buildings set nome_completo = 'Escola de Ciencias e Tecnologias - Polo II'           where codigo = 'ECT2';
update buildings set nome_completo = 'Escola de Ciencias Agrarias e Veterinarias - Polo I'  where codigo = 'ECAV1';
update buildings set nome_completo = 'Escola de Ciencias Agrarias e Veterinarias - Polo II' where codigo = 'ECAV2';
update buildings set nome_completo = 'Escola de Ciencias da Vida e do Ambiente - Polo I'    where codigo = 'ECVA1';
update buildings set nome_completo = 'Escola de Ciencias da Vida e do Ambiente - Polo II'   where codigo = 'ECVA2';
update buildings set nome_completo = 'Escola de Ciencias Humanas e Sociais - Polo I'        where codigo = 'ECHS1';
update buildings set nome_completo = 'Escola de Ciencias Humanas e Sociais - Polo II'       where codigo = 'ECHS2';
update buildings set nome_completo = 'Escola Superior de Saude'                              where codigo = 'ESS';
update buildings set nome_completo = 'Hangar da ECT - Polo I'                                where codigo = 'HECT1';
update buildings set nome_completo = 'Hangar da ECAV - Polo II'                              where codigo = 'HECAV2';
update buildings set nome_completo = 'Edificio de Enologia (ECAV)'                           where codigo = 'ENO';
update buildings set nome_completo = 'Herbario e Jardim Botanico'                            where codigo = 'JB';
update buildings set nome_completo = 'Associacao Academica da UTAD'                          where codigo = 'UC';
update buildings set nome_completo = 'Centro de Servicos Comuns Academicos'                  where codigo = 'ESC';
update buildings set nome_completo = 'SASUTAD - Apoio Social ao Aluno'                       where codigo = 'EAA';

-- 2. PISOS — limpar e recriar para o ECT-Polo I
delete from floors
 where building_id in (select id from buildings where codigo in ('ECT1','ECAV1','BIB','REI'));

insert into floors (building_id, numero)
select b.id, p.piso
from buildings b
join (values
  ('ECT1', 0), ('ECT1', 1), ('ECT1', 2)
) as p(bcod, piso) on p.bcod = b.codigo;

-- 3. SALAS / SERVIÇOS no ECT-Polo I — extraídas de docs/docs_backend/SALAS.txt
-- Todas as salas (setores E, F, G, I) pertencem ao mesmo edifício ECT1.
delete from rooms
 where building_id in (select id from buildings where codigo in ('ECT1','ECAV1','BIB','REI'));

with f as (
  select f.id as floor_id, b.id as building_id, b.codigo as bcod, f.numero as piso
  from floors f
  join buildings b on b.id = f.building_id
)
insert into rooms (building_id, floor_id, nome, codigo, tipo)
select f.building_id, f.floor_id, x.nome, x.codigo, x.tipo
from f
join (values
  -- ECT-Polo I — Piso 0 (BAR + setor F + setor G + setor I)
  ('ECT1', 0, 'Bar',     'BAR',    'servico'),
  ('ECT1', 0, 'F0.01',   'F0.01',  'sala'),
  ('ECT1', 0, 'F0.02',   'F0.02',  'sala'),
  ('ECT1', 0, 'F0.05',   'F0.05',  'sala'),
  ('ECT1', 0, 'F0.06',   'F0.06',  'sala'),
  ('ECT1', 0, 'F0.07',   'F0.07',  'sala'),
  ('ECT1', 0, 'F0.08',   'F0.08',  'sala'),
  ('ECT1', 0, 'F0.10',   'F0.10',  'sala'),
  ('ECT1', 0, 'F0.12',   'F0.12',  'sala'),
  ('ECT1', 0, 'F0.14',   'F0.14',  'sala'),
  ('ECT1', 0, 'F0.16',   'F0.16',  'sala'),
  ('ECT1', 0, 'F0.18',   'F0.18',  'sala'),
  ('ECT1', 0, 'F0.19',   'F0.19',  'sala'),
  ('ECT1', 0, 'G0.01',   'G0.01',  'sala'),
  ('ECT1', 0, 'G0.03',   'G0.03',  'sala'),
  ('ECT1', 0, 'G0.04B',  'G0.04B', 'sala'),
  ('ECT1', 0, 'G0.08',   'G0.08',  'sala'),
  ('ECT1', 0, 'G0.12',   'G0.12',  'sala'),
  ('ECT1', 0, 'G0.14',   'G0.14',  'sala'),
  ('ECT1', 0, 'I0.06',   'I0.06',  'sala'),

  -- ECT-Polo I — Piso 1 (setor E + setor F)
  ('ECT1', 1, 'E1.01',   'E1.01',      'sala'),
  ('ECT1', 1, 'E1.02',   'E1.02',      'sala'),
  ('ECT1', 1, 'E1.06',   'E1.06',      'sala'),
  ('ECT1', 1, 'E1.08',   'E1.08',      'sala'),
  ('ECT1', 1, 'E1.11',   'E1.11',      'sala'),
  ('ECT1', 1, 'E1.12',   'E1.12',      'sala'),
  ('ECT1', 1, 'E1.15',   'E1.15',      'sala'),
  ('ECT1', 1, 'E1.16',   'E1.16',      'sala'),
  ('ECT1', 1, 'Secretaria', 'SECRETARIA', 'servico'),
  ('ECT1', 1, 'F1.17',   'F1.17',      'sala'),
  ('ECT1', 1, 'F1.18',   'F1.18',      'sala'),
  ('ECT1', 1, 'F1.19',   'F1.19',      'sala'),
  ('ECT1', 1, 'F1.20',   'F1.20',      'sala'),
  ('ECT1', 1, 'F1.21',   'F1.21',      'sala'),
  ('ECT1', 1, 'F1.22',   'F1.22',      'sala'),
  ('ECT1', 1, 'F1.24',   'F1.24',      'sala'),

  -- ECT-Polo I — Piso 2 (setor F + setor E)
  ('ECT1', 2, 'F2.01',   'F2.01',  'sala'),
  ('ECT1', 2, 'F2.02',   'F2.02',  'sala'),
  ('ECT1', 2, 'F2.06',   'F2.06',  'sala'),
  ('ECT1', 2, 'F2.10A',  'F2.10A', 'sala'),
  ('ECT1', 2, 'F2.12',   'F2.12',  'sala'),
  ('ECT1', 2, 'F2.13',   'F2.13',  'sala'),
  ('ECT1', 2, 'F2.15',   'F2.15',  'sala'),
  ('ECT1', 2, 'F2.16',   'F2.16',  'sala'),
  ('ECT1', 2, 'F2.17',   'F2.17',  'sala'),
  ('ECT1', 2, 'F2.18',   'F2.18',  'sala'),
  ('ECT1', 2, 'F2.19',   'F2.19',  'sala'),
  ('ECT1', 2, 'F2.20A',  'F2.20A', 'sala'),
  ('ECT1', 2, 'F2.22',   'F2.22',  'sala'),
  ('ECT1', 2, 'E2.01',   'E2.01',  'sala'),
  ('ECT1', 2, 'E2.02',   'E2.02',  'sala'),
  ('ECT1', 2, 'E2.04',   'E2.04',  'sala'),
  ('ECT1', 2, 'E2.10',   'E2.10',  'sala'),
  ('ECT1', 2, 'E2.11',   'E2.11',  'sala'),
  ('ECT1', 2, 'E2.13',   'E2.13',  'sala'),
  ('ECT1', 2, 'E2.14',   'E2.14',  'sala'),
  ('ECT1', 2, 'E2.15',   'E2.15',  'sala')
) as x(bcod, piso, nome, codigo, tipo)
  on f.bcod = x.bcod and f.piso = x.piso;
