const mongoose = require('mongoose');

const ViaSchema = new mongoose.Schema(
  {
    nome: {
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

module.exports = mongoose.model('Via', ViaSchema);