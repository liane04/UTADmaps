const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/history — devolve as últimas 50 entradas de navegação do utilizador
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('navigation_history')
    .select('id, destino_id, destino_nome, destino_categoria, navegacao_tipo, lat, lon, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? []);
});

// POST /api/history
//   body: { destino_id?, destino_nome, destino_categoria?, navegacao_tipo, lat?, lon? }
router.post('/', requireAuth, async (req, res) => {
  const {
    destino_id,
    destino_nome,
    destino_categoria,
    navegacao_tipo,
    lat,
    lon,
  } = req.body || {};

  if (!destino_nome || !navegacao_tipo) {
    return res.status(400).json({ error: 'destino_nome e navegacao_tipo são obrigatórios' });
  }
  if (navegacao_tipo !== 'indoor' && navegacao_tipo !== 'outdoor') {
    return res.status(400).json({ error: 'navegacao_tipo inválido' });
  }

  const { data, error } = await supabase
    .from('navigation_history')
    .insert({
      user_id: req.user.id,
      destino_id: destino_id ?? null,
      destino_nome,
      destino_categoria: destino_categoria ?? null,
      navegacao_tipo,
      lat: typeof lat === 'number' ? lat : null,
      lon: typeof lon === 'number' ? lon : null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/history — limpa todo o histórico do utilizador
router.delete('/', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('navigation_history')
    .delete()
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
