const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
  hora: {
    type: String,
    required: true,
  },
  via: {
    type: String,
  },
  observacao: {
    type: String,
  },
  itinerario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerario',
  },
});

module.exports = mongoose.model('Horario', HorarioSchema);
