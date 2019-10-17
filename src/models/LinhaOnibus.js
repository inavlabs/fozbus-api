const mongoose = require('mongoose');

const LinhaSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  dias: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiaSemana',
    },
  ],
  observacoesHorarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ObservacaoHorario',
    },
  ],
  percursos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Percurso',
    },
  ],
  avisos: [String],
  vias: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Via',
    },
  ],
});

module.exports = mongoose.model('LinhaOnibus', LinhaSchema);
