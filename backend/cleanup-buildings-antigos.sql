-- UTADmaps — apagar edifícios antigos com nomes informais / coords placeholder
--
-- Estes 7 edifícios vieram do seed inicial (buildings-real.sql) com nomes
-- não-oficiais. 4 deles são duplicados directos dos novos com nome oficial:
--   CP   (Complexo Pedagógico) ≡ ECHS1 (ECHS – Polo I)
--   ENG1 (Engenharias I)       ≡ ECT1  (ECT – Polo I)
--   GEO  (Geociências)         ≡ ECVA1 (ECVA – Polo I)
--   PAV  (Pavilhão Desportivo) ≡ NAV   (Nave de Desportos)
-- Os outros 3 (BLA, BLB, BLC) são placeholders sem correspondência.
--
-- ON DELETE CASCADE no schema apaga rooms/floors associados, mas os
-- 4 setores principais (ECAV1, ECT1, BIB, REI) NÃO são afectados.
--
-- Idempotente — corre só os DELETEs.

delete from buildings where codigo in (
  'BLA',   -- Bloco A (placeholder)
  'BLB',   -- Bloco B (placeholder)
  'BLC',   -- Bloco C (placeholder)
  'CP',    -- Complexo Pedagógico → ECHS1
  'ENG1',  -- Engenharias I → ECT1
  'GEO',   -- Geociências → ECVA1
  'PAV'    -- Pavilhão Desportivo → NAV
);
