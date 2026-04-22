const ICAL = require('ical.js');

const DIAS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

function parseIcal(icsText) {
  const jcal = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcal);
  const eventos = comp.getAllSubcomponents('vevent');

  return eventos.map((vevent) => {
    const event = new ICAL.Event(vevent);
    const inicio = event.startDate.toJSDate();
    const fim = event.endDate.toJSDate();

    // Extrai código da sala do campo LOCATION (ex: "Sala 2.1 - Bloco A" → "2.1")
    const location = vevent.getFirstPropertyValue('location') ?? '';
    const salaMatch = location.match(/sala\s*([\d.]+)/i);
    const sala = salaMatch ? salaMatch[1] : location.trim();

    return {
      disciplina: event.summary ?? 'Sem título',
      diaSemana: DIAS[inicio.getDay()],
      horaInicio: inicio.toTimeString().slice(0, 5),
      horaFim: fim.toTimeString().slice(0, 5),
      sala,
      locationRaw: location,
    };
  });
}

module.exports = { parseIcal };
