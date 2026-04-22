const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/favorites/:userId
router.get('/:userId', requireAuth, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('*, rooms(nome, tipo, buildings(nome))')
    .eq('user_id', req.params.userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/favorites
router.post('/', requireAuth, async (req, res) => {
  const { room_id } = req.body;
  if (!room_id) return res.status(400).json({ error: 'room_id obrigatório' });

  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: req.user.id, room_id })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/favorites/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
