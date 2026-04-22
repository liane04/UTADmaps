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
