const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password obrigatórios' });
  }

  if (!email.endsWith('@utad.eu') && !email.endsWith('@alunos.utad.eu')) {
    return res.status(400).json({ error: 'Apenas emails @utad.eu ou @alunos.utad.eu são permitidos' });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ user: data.user });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password obrigatórios' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: 'Credenciais inválidas' });
  res.json({ user: data.user, session: data.session });
});

module.exports = router;
