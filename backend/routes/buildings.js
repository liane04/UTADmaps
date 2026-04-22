const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET /api/buildings
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .order('nome');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/buildings/:id/floors
router.get('/:id/floors', async (req, res) => {
  const { data, error } = await supabase
    .from('floors')
    .select('*, rooms(*)')
    .eq('building_id', req.params.id)
    .order('numero');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
