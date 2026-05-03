const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/user-favorites — devolve favoritos do utilizador autenticado
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('id, item_id, nome, subtitulo, categoria, lat, lon, codigo, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? []);
});

// POST /api/user-favorites
//   body: { item_id, nome, subtitulo?, categoria?, lat?, lon?, codigo? }
router.post('/', requireAuth, async (req, res) => {
  const { item_id, nome, subtitulo, categoria, lat, lon, codigo } = req.body || {};
  if (!item_id || !nome) {
    return res.status(400).json({ error: 'item_id e nome obrigatórios' });
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .upsert(
      {
        user_id: req.user.id,
        item_id,
        nome,
        subtitulo: subtitulo ?? null,
        categoria: categoria ?? null,
        lat: typeof lat === 'number' ? lat : null,
        lon: typeof lon === 'number' ? lon : null,
        codigo: codigo ?? null,
      },
      { onConflict: 'user_id,item_id' },
    )
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/user-favorites/:itemId  (apaga pelo item_id, não pelo uuid interno)
router.delete('/:itemId', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', req.user.id)
    .eq('item_id', req.params.itemId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
