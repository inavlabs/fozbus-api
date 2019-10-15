module.exports = {
  Query: {
    getLinhas: async (_, args, context) => {
      const list = await context.LinhaOnibus
        .find({})
        .populate('observacoesHorarios');
      return list;
    },
  },

  Mutation: {
    addLinha: async (_, args, context) => {
      const { numero, nome } = args;

      const model = await new context.LinhaOnibus({
        numero,
        nome
      }).save();

      return model;
    },

    addObservacaoHorario: async (_, args, context) => {
      const { idLinha, cor, descricao } = args;

      const linha = await context.LinhaOnibus.findById(idLinha);
      if (linha) {
        const observacaoHorario = await new context.ObservacaoHorario({
          cor, 
          descricao,
          linha: idLinha
        }).save();

        linha.observacoesHorarios.push(observacaoHorario);
        linha.save();

        return observacaoHorario;
      }

    }
  }
};
