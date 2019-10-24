const mongoose = require('mongoose');

const DiaSemanaSchema = new mongoose.Schema({
  dia: [
    {
      type: Number,
      required: true,
    },
  ],
  observacao: {
    type: String,
  },
  itinerarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Itinerario',
    },
  ],
  linha: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LinhaOnibus',
  },
});

module.exports = mongoose.model('DiaSemana', DiaSemanaSchema);
