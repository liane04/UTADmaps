const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

/**
 * Normaliza string para pesquisa: remove acentos e converte para forma "limpa".
 * "Ciências" → "Ciencias", "Saúde" → "Saude". Mantém case-insensitive ao ilike.
 */
function semAcentos(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// GET /api/search?q=&type=
// Pesquisa unificada: edifícios + salas + serviços
// Resposta uniforme:
//   [{ id, categoria, nome, codigo, edificio, piso, lat, lon }]
//
// type ∈ { 'todos' | 'edificio' | 'sala' | 'servico' }
router.get('/', async (req, res) => {
  try {
    const { q = '', type = 'todos' } = req.query;
    const qTrim = String(q || '').trim();
    const qNorm = semAcentos(qTrim);
    const results = [];

    // ---- Edifícios ----
    if (type === 'todos' || type === 'edificio') {
      let bq = supabase
        .from('buildings')
        .select('id, nome, nome_completo, codigo, lat, lon');
      if (qTrim) {
        // Procura em nome (sigla, ex: "ECT") + nome_completo ASCII (ex:
        // "Escola de Ciencias e Tecnologias") + codigo. nome_completo
        // está sem acentos na DB para que "ciencia" bata em "Ciências".
        bq = bq.or(
          `nome.ilike.%${qTrim}%,nome_completo.ilike.%${qNorm}%,codigo.ilike.%${qTrim}%`,
        );
      }
      const { data: buildings, error: bErr } = await bq.order('nome');
      if (bErr) return res.status(500).json({ error: bErr.message });
      for (const b of buildings ?? []) {
        results.push({
          id: `b-${b.id}`,
          categoria: 'edificio',
          nome: b.nome,
          codigo: b.codigo ?? null,
          edificio: b.nome,
          piso: '',
          lat: b.lat,
          lon: b.lon,
        });
      }
    }

    // ---- Salas e Serviços ----
    if (type === 'todos' || type === 'sala' || type === 'servico') {
      let rq = supabase
        .from('rooms')
        .select('id, nome, codigo, tipo, buildings(nome, lat, lon), floors(numero)');
      if (qTrim) {
        rq = rq.or(`nome.ilike.%${qTrim}%,codigo.ilike.%${qTrim}%`);
      }
      const { data: rooms, error: rErr } = await rq.order('nome');
      if (rErr) return res.status(500).json({ error: rErr.message });
      for (const r of rooms ?? []) {
        const cat = r.tipo === 'servico' ? 'servico' : 'sala';
        if (type === 'sala' && cat !== 'sala') continue;
        if (type === 'servico' && cat !== 'servico') continue;
        results.push({
          id: `r-${r.id}`,
          categoria: cat,
          nome: r.nome,
          codigo: r.codigo ?? null,
          edificio: r.buildings?.nome ?? '',
          piso: r.floors?.numero != null ? String(r.floors.numero) : '',
          lat: r.buildings?.lat ?? null,
          lon: r.buildings?.lon ?? null,
        });
      }
    }

    res.json(results);
  } catch (err) {
    console.error('search error', err);
    res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;
