const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET /api/rooms/search?q=&type=
router.get('/search', async (req, res) => {
  const { q = '', type } = req.query;

  let query = supabase
    .from('rooms')
    .select('*, buildings(nome, lat, lon)')
    .order('nome');

  if (q) {
    query = query.or(`nome.ilike.%${q}%,codigo.ilike.%${q}%`);
  }

  if (type && type !== 'todos') {
    query = query.eq('tipo', type);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
