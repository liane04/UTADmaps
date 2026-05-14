/**
 * Calculador de rácios de contraste WCAG 2.x
 *
 * Implementa a fórmula oficial:
 *   contrast = (L1 + 0.05) / (L2 + 0.05)
 * onde L é a luminância relativa sRGB.
 *
 * Uso:
 *   node contrast.js                 → executa o relatório completo da paleta UTAD Maps
 *   node contrast.js "#000" "#FFF"   → calcula rácio entre 2 cores
 */

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function luminance(rgb) {
  const a = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function ratio(fg, bg) {
  const L1 = luminance(hexToRgb(fg));
  const L2 = luminance(hexToRgb(bg));
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

function check(r, large = false) {
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;
  return {
    aa: r >= aa,
    aaa: r >= aaa,
  };
}

// ──────────────────────────────────────────────────────────
// Execução
// ──────────────────────────────────────────────────────────

if (process.argv.length === 4) {
  const [fg, bg] = [process.argv[2], process.argv[3]];
  const r = ratio(fg, bg);
  const { aa, aaa } = check(r);
  console.log(`${fg} sobre ${bg} = ${r.toFixed(2)}:1`);
  console.log(`  WCAG 2.x AA  (4.5:1): ${aa ? '✅ Passa' : '❌ Falha'}`);
  console.log(`  WCAG 2.x AAA (7:1):   ${aaa ? '✅ Passa' : '❌ Falha'}`);
  process.exit(0);
}

const palette = {
  'Modo Claro': [
    { label: 'Texto principal sobre bg', fg: '#000000', bg: '#F2F2F7' },
    { label: 'Texto principal sobre card', fg: '#000000', bg: '#FFFFFF' },
    { label: 'Subtexto sobre bg', fg: '#6C6C72', bg: '#F2F2F7' },
    { label: 'Subtexto sobre card', fg: '#6C6C72', bg: '#FFFFFF' },
    { label: 'Texto branco em botão primary', fg: '#FFFFFF', bg: '#0066CC' },
    { label: 'Avatar Edifício verde', fg: '#000000', bg: '#C8E6C9' },
    { label: 'Avatar Sala azul', fg: '#000000', bg: '#BBDEFB' },
    { label: 'Avatar Serviço laranja', fg: '#000000', bg: '#FFE0B2' },
    { label: 'Texto erro sobre card', fg: '#FF3B30', bg: '#FFFFFF' },
  ],
  'Modo Escuro': [
    { label: 'Texto principal sobre bg', fg: '#FFFFFF', bg: '#000000' },
    { label: 'Texto principal sobre card', fg: '#FFFFFF', bg: '#1C1C1E' },
    { label: 'Subtexto sobre bg', fg: '#A8A8AE', bg: '#000000' },
    { label: 'Subtexto sobre card', fg: '#A8A8AE', bg: '#1C1C1E' },
    { label: 'Texto branco em botão primary dark', fg: '#FFFFFF', bg: '#0A84FF' },
  ],
  'Alto Contraste Claro': [
    { label: 'Texto sobre branco', fg: '#000000', bg: '#FFFFFF' },
  ],
  'Alto Contraste Escuro': [
    { label: 'Texto sobre preto', fg: '#FFFFFF', bg: '#000000' },
  ],
  'Banner aula urgente': [
    { label: 'Texto sobre fundo amarelado', fg: '#000000', bg: '#FFF4E5' },
    { label: 'Border laranja sobre fundo amarelado', fg: '#FF9500', bg: '#FFF4E5' },
  ],
};

let pass = 0;
let total = 0;
for (const [section, rows] of Object.entries(palette)) {
  console.log(`\n=== ${section} ===`);
  console.log('Combinação                                  | FG      | BG      | Rácio    | AA  | AAA');
  console.log('--------------------------------------------|---------|---------|----------|-----|-----');
  for (const { label, fg, bg } of rows) {
    const r = ratio(fg, bg);
    const c = check(r);
    if (c.aa) pass++;
    total++;
    console.log(
      `${label.padEnd(43)} | ${fg} | ${bg} | ${r.toFixed(2).padStart(7)}:1 | ${c.aa ? '✅' : '❌'}  | ${c.aaa ? '✅' : '❌'}`,
    );
  }
}

console.log(`\n=== RESUMO ===`);
console.log(`Combinações testadas: ${total}`);
console.log(`Cumprem WCAG 2.x AA:  ${pass}/${total} (${((pass / total) * 100).toFixed(0)}%)`);
