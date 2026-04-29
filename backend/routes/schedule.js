const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');
const multer = require('multer');
const { parseIcal } = require('../services/icalParser');

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/schedule/:userId
router.get('/:userId', requireAuth, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { data, error } = await supabase
    .from('schedules')
    .select('*, rooms(nome, tipo, buildings(nome))')
    .eq('user_id', req.params.userId)
    .order('dia_semana')
    .order('hora_inicio');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/schedule/ical/import-url — importa directamente via URL privada do Infraestudante (sem auth)
router.post('/ical/import-url', async (req, res) => {
  const { chave } = req.body;
  if (!chave || typeof chave !== 'string' || !chave.trim()) {
    return res.status(400).json({ error: 'Campo "chave" obrigatório' });
  }

  const url = `https://inforestudante.utad.pt/nonio/util/sincronizaHorarioNonio.do?chave=${encodeURIComponent(chave.trim())}&locale=PT`;

  let icsText;
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    icsText = await resp.text();
    if (!icsText.includes('BEGIN:VCALENDAR')) {
      throw new Error('Resposta não é um calendário iCal válido');
    }
  } catch (e) {
    return res.status(502).json({
      error: 'Não foi possível obter o horário do Infraestudante. Verifica se a chave é válida.',
    });
  }

  let aulas;
  try {
    aulas = parseIcal(icsText);
  } catch (e) {
    return res.status(400).json({ error: 'Formato iCal inválido' });
  }

  // Deduplica eventos recorrentes — mesma disciplina + dia + hora de início
  const seen = new Set();
  const unicos = aulas.filter((a) => {
    const key = `${a.diaSemana}|${a.horaInicio}|${a.disciplina}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  res.json({ aulas: unicos });
});

// POST /api/ical/import
router.post('/ical/import', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Ficheiro .ics obrigatório' });
  }

  const icsText = req.file.buffer.toString('utf-8');
  let aulas;

  try {
    aulas = parseIcal(icsText);
  } catch (e) {
    return res.status(400).json({ error: 'Ficheiro .ics inválido' });
  }

  // Remove horário anterior do utilizador
  await supabase.from('schedules').delete().eq('user_id', req.user.id);

  // Faz match de cada aula com uma sala na DB pelo código/nome
  const rows = [];
  for (const aula of aulas) {
    const { data: rooms } = await supabase
      .from('rooms')
      .select('id')
      .ilike('codigo', `%${aula.sala}%`)
      .limit(1);

    rows.push({
      user_id: req.user.id,
      disciplina: aula.disciplina,
      dia_semana: aula.diaSemana,
      hora_inicio: aula.horaInicio,
      hora_fim: aula.horaFim,
      room_id: rooms?.[0]?.id ?? null,
      sala_raw: aula.sala,
    });
  }

  const { error } = await supabase.from('schedules').insert(rows);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ imported: rows.length });
});

module.exports = router;
