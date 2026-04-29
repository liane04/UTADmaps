const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

const DOMINIOS_PERMITIDOS = ['@utad.eu', '@alunos.utad.eu', '@alunos.utad.pt'];

function emailValido(email) {
  return DOMINIOS_PERMITIDOS.some((d) => email.endsWith(d));
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password obrigatórios' });
  }

  if (!emailValido(email)) {
    return res.status(400).json({
      error: 'Apenas emails @utad.eu, @alunos.utad.eu ou @alunos.utad.pt são permitidos',
    });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({
    user: {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata ?? {},
    },
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password obrigatórios' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: 'Credenciais inválidas' });

  res.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata ?? {},
    },
    token: data.session.access_token,
  });
});

module.exports = router;
