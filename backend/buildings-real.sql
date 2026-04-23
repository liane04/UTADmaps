-- Limpa edifícios placeholder e insere edifícios reais da UTAD
-- Coordenadas aproximadas — confirmar no campus com GPS

delete from buildings;

insert into buildings (nome, codigo, lat, lon) values
  ('Portaria',                          'PORT',   41.27580, -7.74050),
  ('Cantina de Prados',                 'CAN',    41.27190, -7.74380),
  ('Hospital Veterinário',              'HV',     41.27620, -7.74120),
  ('University Center – AAUTAD',        'UC',     41.27450, -7.74180),
  ('Edifício de Apoio aos Alunos',      'EAA',    41.27420, -7.74150),
  ('Edifício de Serviços Comuns',       'ESC',    41.27400, -7.74130),
  ('Complexo Laboratorial',             'LAB',    41.27380, -7.74060),
  ('ECAV – Polo I',                     'ECAV1',  41.27500, -7.73980),
  ('ECHS – Polo I (Complexo Pedagógico)','ECHS1', 41.27560, -7.74200),
  ('Nave de Desportos',                 'NAV',    41.27150, -7.74420),
  ('ECHS – Polo II',                    'ECHS2',  41.27050, -7.74550),
  ('ECAV – Polo II',                    'ECAV2',  41.27080, -7.74500),
  ('ECT – Polo II',                     'ECT2',   41.27020, -7.74480),
  ('Herbário / Jardim Botânico',        'JB',     41.27300, -7.74350),
  ('ECT – Polo I (Engenharias I)',      'ECT1',   41.27310, -7.74280),
  ('Biblioteca Central',                'BIB',    41.27350, -7.74220),
  ('ECVA – Polo I (Geociências)',        'ECVA1',  41.27370, -7.74180),
  ('Reitoria',                          'REI',    41.27390, -7.74200),
  ('Enologia',                          'ENO',    41.27360, -7.74160),
  ('ECVA – Polo II',                    'ECVA2',  41.27600, -7.74350),
  ('Escola Superior de Saúde',          'ESS',    41.27580, -7.74300);
