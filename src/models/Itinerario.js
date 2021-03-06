const mongoose = require('mongoose');

const ItinerarioSchema = new mongoose.Schema({
  origem: {
    type: String,
    required: true,
  },
  destino: {
    type: String,
    required: true,
  },
  horarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Horario',
    },
  ],
  dia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiaSemana',
  },
});

module.exports = mongoose.model('Itinerario', ItinerarioSchema);
