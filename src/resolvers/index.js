const Model = require('../models');

module.exports = {
  Query: {
    getLinhas: async (_, args, context) => {
      const allLinhas = await context.Linha.find({});
      return allLinhas;
    },
  },

  Mutation: {
    addLinha: async (_, args, context) => {
      const { numero, nome } = args;

      const model = await new Model.Linha({
        numero,
        nome
      }).save();

      return model;
    },
  }
};
