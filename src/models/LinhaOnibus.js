const mongoose = require('mongoose');

const LinhaSchema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    observacoesHorarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ObservacaoHorario'
      }
    ],
    percursos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Percurso'
      }
    ],
    avisos: [String]
  }
);

module.exports = mongoose.model('LinhaOnibus', LinhaSchema);