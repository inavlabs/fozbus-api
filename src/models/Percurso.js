const mongoose = require('mongoose');

const PercursoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true
    },
    ida: {
      type: String,
      required: true
    },
    volta: {
        type: String,
        required: true
    },
    linha: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LinhaOnibus'
    }
  }
);

module.exports = mongoose.model('Percurso', PercursoSchema);