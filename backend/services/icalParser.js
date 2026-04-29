const ICAL = require('ical.js');

const DIAS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function parseIcal(icsText) {
  const jcal = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcal);
  const eventos = comp.getAllSubcomponents('vevent');

  return eventos.map((vevent) => {
    const event = new ICAL.Event(vevent);
    const inicio = event.startDate;
    const fim = event.endDate;

    // Usa os valores do ical.js directamente — evita problemas de timezone UTC vs. local
    const data = `${inicio.year}-${pad(inicio.month)}-${pad(inicio.day)}`;

    // Eventos de dia inteiro (entregas, etc.) têm isDate=true → hora 00:00
    const horaInicio = inicio.isDate ? '00:00' : `${pad(inicio.hour)}:${pad(inicio.minute)}`;
    const horaFim = fim.isDate ? '00:00' : `${pad(fim.hour)}:${pad(fim.minute)}`;

    // Dia da semana calculado a partir da data (sem depender de JS Date + UTC)
    const diaSemana = DIAS[new Date(`${data}T12:00:00`).getDay()];

    const location = vevent.getFirstPropertyValue('location') ?? '';
    const salaMatch = location.match(/sala\s*([\d.]+)/i);
    const sala = salaMatch ? salaMatch[1] : location.trim();

    return {
      disciplina: event.summary ?? 'Sem título',
      data,        // 'YYYY-MM-DD' — data real do evento
      diaSemana,   // 'segunda' | 'terca' | ... — calculado da data real
      horaInicio,
      horaFim,
      sala,
      locationRaw: location,
    };
  });
}

module.exports = { parseIcal };
