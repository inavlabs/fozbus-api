const mongoose = require('mongoose');

const ObservacaoHorarioSchema = new mongoose.Schema(
  {
    cor: {
      type: String,
      required: true
    },
    descricao: {
      type: String,
      required: true
    },
    linha: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LinhaOnibus'
    }
  }
);

module.exports = mongoose.model('ObservacaoHorario', ObservacaoHorarioSchema);