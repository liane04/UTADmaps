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

    // Eventos de dia inteiro (entregas, prazos, etc.) têm isDate=true → hora 00:00.
    // O iCal do Inforestudante usa DTSTART;VALUE=DATE para "Entrega de trabalhos"
    // e similares, distinguindo-os de aulas que têm DTSTART com hora.
    const diaInteiro = !!(inicio.isDate);
    const horaInicio = diaInteiro ? '00:00' : `${pad(inicio.hour)}:${pad(inicio.minute)}`;
    const horaFim    = (fim && fim.isDate) ? '00:00' : (fim ? `${pad(fim.hour)}:${pad(fim.minute)}` : '00:00');

    // Classifica o evento: aulas têm hora; eventos de dia inteiro são entregas/prazos.
    const tipo = diaInteiro ? 'entrega' : 'aula';

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
      tipo,        // 'aula' | 'entrega' — permite distinguir no UI
    };
  });
}

module.exports = { parseIcal };
