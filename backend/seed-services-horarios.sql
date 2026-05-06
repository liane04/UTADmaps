-- UTADmaps — serviços do campus com horários de funcionamento
--
-- Fontes oficiais (recolhidas em 03/05/2026):
--   SASUTAD: https://comunicacao.sas.utad.pt/viver-a-utad/alimentacao/unidades/*
--   Biblioteca: https://www.sdb.utad.pt/
--   Serviços Académicos: https://www.utad.pt/sa/en/home/hours-of-service/
--
-- Idempotente — pode correr múltiplas vezes.

-- 1) Estender schema com horário e descrição
alter table rooms add column if not exists horario text;
alter table rooms add column if not exists descricao text;

-- 2) Garantir que `codigo` é unique para podermos fazer upsert
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'rooms'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) like '%(codigo)%'
  ) then
    -- Limpar duplicados antes de criar a constraint
    delete from rooms r1
    using rooms r2
    where r1.id < r2.id
      and r1.codigo = r2.codigo
      and r1.codigo is not null;

    alter table rooms add constraint rooms_codigo_unique unique (codigo);
  end if;
end $$;

-- 3) Upsert dos serviços conhecidos (associados a buildings por código)
insert into rooms (building_id, nome, codigo, tipo, horario, descricao)
select b.id, x.nome, x.codigo, 'servico', x.horario, x.descricao
from buildings b
join (values
  -- === Alimentação SASUTAD ===
  ('ECT1',  'Snack-Bar Polo I ECT',     'SNACK-ECT1',  'Seg–Sex 08:00–18:00',
    'Snack-bar SASUTAD no Polo I ECT — refeições rápidas, café, lanches'),
  ('ECAV1', 'Snack-Bar Polo I ECAV',    'SNACK-ECAV1', 'Seg–Sex 08:00–18:00',
    'Snack-bar SASUTAD no Polo I ECAV — refeições rápidas, café, lanches'),
  ('ECVA2', 'Snack-Bar Polo II ECVA',   'SNACK-ECVA2', 'Seg–Sex 08:00–18:00',
    'Snack-bar SASUTAD no Polo II ECVA — refeições rápidas, café, lanches'),
  ('CAN',   'Cantina de Prados',        'CANTINA',     'Almoço Seg–Sex 12:00–14:30',
    'Refeições SASUTAD — almoço diário com menu fixo e vegetariano'),
  ('CAN',   'Restaurante Panorâmico',   'PANORAMICO',  'Almoço Seg–Sex 12:00–15:00',
    'Restaurante SASUTAD com vista panorâmica do campus'),

  -- === Serviços académicos (cada escola tem secretaria própria) ===
  ('ECT1',  'Secretaria ECT – Polo I',  'SEC-ECT1',    'Seg–Sex 09:30–12:30 e 14:00–16:30',
    'Secretaria da Escola de Ciências e Tecnologias — Polo I'),
  ('ECAV1', 'Secretaria ECAV – Polo I', 'SEC-ECAV1',   'Seg–Sex 09:30–12:30 e 14:00–16:30',
    'Secretaria da Escola de Ciências Agrárias e Veterinárias — Polo I'),
  ('ECHS1', 'Secretaria ECHS – Polo I', 'SEC-ECHS1',   'Seg–Sex 09:30–12:30 e 14:00–16:30',
    'Secretaria da Escola de Ciências Humanas e Sociais — Polo I'),
  ('ECVA1', 'Secretaria ECVA – Polo I', 'SEC-ECVA1',   'Seg–Sex 09:30–12:30 e 14:00–16:30',
    'Secretaria da Escola de Ciências da Vida e do Ambiente — Polo I'),
  ('ESS',   'Secretaria ESS',           'SEC-ESS',     'Seg–Sex 09:30–12:30 e 14:00–16:30',
    'Secretaria da Escola Superior de Saúde'),
  ('ESC',   'Serviços Académicos Centrais', 'SERV-ACAD', 'Presencial Seg–Sex 09:15–12:30 e 14:00–16:30 (4ª manhã encerrado); Telefone Seg–Sex 10:00–16:00',
    'Serviços académicos centrais — documentação, matrículas, certidões'),

  -- === Apoio ao estudante ===
  ('EAA',   'SASUTAD – Apoio Social',   'SASUTAD-EAA', 'Seg–Sex 09:15–12:30 (4ª manhã encerrado)',
    'Bolsas de estudo, alojamento e apoio social ao estudante'),
  ('EAA',   'GAPsi – Apoio Psicológico', 'GAPSI',      'Seg–Sex 09:00–17:00 (mediante marcação)',
    'Gabinete de apoio psicológico aos estudantes'),
  ('UC',    'AAUTAD – Associação Académica', 'AAUTAD-SEC', 'Seg–Sex 10:00–18:00',
    'Associação Académica da UTAD — apoio e actividades aos alunos'),

  -- === Documentação ===
  ('BIB',   'Biblioteca Central',       'BIB-SERV',    'Seg–Sex 09:00–19:30 (letivo); 09:00–17:30 (agosto)',
    'Empréstimo de livros, salas de estudo, computadores e acesso a bases de dados'),

  -- === Saúde ===
  ('HV',    'Hospital Veterinário',     'HV-SERV',     'Seg–Sex 09:00–18:00 (urgências 24h)',
    'Consultas veterinárias e cirurgia. Urgências 24h por marcação telefónica'),

  -- === Acesso ===
  ('PORT',  'Portaria UTAD',            'PORT-SERV',   '24 horas',
    'Portaria principal de acesso ao campus')
) as x(bcod, nome, codigo, horario, descricao)
  on b.codigo = x.bcod
on conflict (codigo) do update set
  nome        = excluded.nome,
  building_id = excluded.building_id,
  tipo        = excluded.tipo,
  horario     = excluded.horario,
  descricao   = excluded.descricao;
