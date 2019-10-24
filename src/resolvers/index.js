module.exports = {
  Query: {
    getLinhas: async (_, args, context) => {
      const list = await context.LinhaOnibus.find({})
        .populate('observacoesHorarios')
        .populate('percursos')
        .populate('vias')
        .populate({
          path: 'dias',
          populate: {
            path: 'itinerarios',
            populate: {
              path: 'horarios',
            },
          },
        });

      return list;
    },
  },

  Mutation: {
    addLinha: async (_, args, context) => {
      const { numero, nome } = args;

      const model = await new context.LinhaOnibus({
        numero,
        nome,
      }).save();

      return model;
    },

    addObservacaoHorario: async (_, args, context) => {
      const { idLinha, cor, descricao } = args;

      const linha = await context.LinhaOnibus.findById(idLinha);
      if (linha) {
        const observacaoHorario = await new context.ObservacaoHorario(
          {
            cor,
            descricao,
            linha: idLinha,
          },
        ).save();

        linha.observacoesHorarios.push(observacaoHorario);
        await linha.save();

        return observacaoHorario;
      }
    },

    addPercurso: async (_, args, context) => {
      const { idLinha, titulo, ida, volta } = args;

      const linha = await context.LinhaOnibus.findById(idLinha);
      if (linha) {
        const percurso = await new context.Percurso({
          titulo,
          ida,
          volta,
        }).save();

        linha.percursos.push(percurso);
        await linha.save();

        return percurso;
      }
    },

    addAviso: async (_, args, context) => {
      const { idLinha, aviso } = args;

      const linha = await context.LinhaOnibus.findById(idLinha);
      if (linha) {
        linha.avisos.push(aviso);
        await linha.save();

        return aviso;
      }
    },
    addVia: async (_, args, context) => {
      const { idLinha, nome, descricao } = args;

      const linha = await context.LinhaOnibus.findById(idLinha);
      if (linha) {
        const via = await new context.Via({
          nome,
          descricao,
          linha: idLinha,
        }).save();

        linha.vias.push(via);
        await linha.save();

        return via;
      }
    },
    addDiaHorarios: async (_, args, context) => {
      const { idLinha, dia, itinerario, horarios, observacao } = args;
      const linha = await context.LinhaOnibus.findById(
        idLinha,
      ).populate({
        path: 'dias',
        populate: {
          path: 'itinerarios',
          populate: {
            path: 'horarios',
          },
        },
      });

      if (linha) {
        const newItinerario = new context.Itinerario({
          nome: itinerario,
          horarios: [],
        });

        for (let index = 0; index < horarios.length; index++) {
          let horario = await new context.Horario({
            ...horarios[index],
            itinerario: newItinerario,
          }).save();
          newItinerario.horarios.push(horario);
        }

        await newItinerario.save();

        const diasDaSemana = [...new Set(dia)];
        if (diasDaSemana.filter(u => u < 0 || u > 7).length) {
          throw new Error('Dias da semana is out of range.');
        }

        const diaSemana = await new context.DiaSemana({
          dia: diasDaSemana,
          observacao,
          linha: idLinha,
        }).save();

        diaSemana.itinerarios.push(newItinerario);
        await diaSemana.save();

        linha.dias.push(diaSemana);
        await linha.save();

        return diaSemana;
      }
    },
  },
};
