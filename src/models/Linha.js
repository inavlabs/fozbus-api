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

  }
);

module.exports = mongoose.model('Linha', LinhaSchema);