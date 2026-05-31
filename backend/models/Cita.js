const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  folio: { type: String, required: true, unique: true },
  visitante: {
    nombre: { type: String, required: true },
    identificacion: { type: String, required: true }
  },
  fechaHoraEntrada: { type: Date },
  fechaHoraSalida: { type: Date },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cita', citaSchema);
