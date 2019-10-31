const INITIAL_WEEKDAY = 0;
const FINAL_WEEKDAY = 7;

module.exports = {
  Query: {
    getLinhas: async (_, args, context) => {
      const list = await context.models.LinhaOnibus.find({})
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

      const model = await new context.models.LinhaOnibus({
        numero,
        nome,
      }).save();

      return model;
    },

    addObservacaoHorario: async (_, args, context) => {
      const { idLinha, cor, descricao } = args;

      const linha = await context.models.LinhaOnibus.findById(
        idLinha,
      );
      if (linha) {
        const observacaoHorario = await new context.models.ObservacaoHorario(
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

      const linha = await context.models.LinhaOnibus.findById(
        idLinha,
      );
      if (linha) {
        const percurso = await new context.models.Percurso({
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

      const linha = await context.models.LinhaOnibus.findById(
        idLinha,
      );
      if (linha) {
        linha.avisos.push(aviso);
        await linha.save();

        return aviso;
      }
    },
    addVia: async (_, args, context) => {
      const { idLinha, nome, descricao } = args;

      const linha = await context.models.LinhaOnibus.findById(
        idLinha,
      );
      if (linha) {
        const via = await new context.models.Via({
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
      const {
        idLinha,
        dia,
        origem,
        destino,
        horarios,
        observacao,
      } = args;
      const linha = await context.models.LinhaOnibus.findById(
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
        const newItinerario = new context.models.Itinerario({
          origem,
          destino,
          horarios: [],
        });

        let horariosItinerarioArray = horarios.map(horario => {
          return {
            ...horario,
            itinerario: newItinerario,
          };
        });

        let horariosObjectArray = await context.models.Horario.create(
          horariosItinerarioArray,
        );

        newItinerario.horarios = horariosObjectArray;
        await newItinerario.save();

        const diasDaSemana = [...new Set(dia)];
        if (
          diasDaSemana.filter(
            u => u < INITIAL_WEEKDAY || u > FINAL_WEEKDAY,
          ).length
        ) {
          throw new Error('Dias da semana is out of range.');
        }

        const diaSemana = await new context.models.DiaSemana({
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

    updateItinerario: async (_, args, context) => {
      const { idItinerario, origem, destino, horarios } = args;

      const itinerario = await context.models.Itinerario.findById(
        idItinerario,
      );
      if (!itinerario) {
        throw new Error('No itinerário');
      }
      if (origem) {
        itinerario.origem = origem;
      }
      if (destino) {
        itinerario.destino = destino;
      }

      await context.models.Horario.deleteMany({
        _id: { $in: itinerario.horarios },
      });

      let horariosItinerarioArray = horarios.map(horario => {
        return {
          ...horario,
          itinerario: itinerario._id,
        };
      });

      let horariosObjectArray = await context.models.Horario.create(
        horariosItinerarioArray,
      );

      itinerario.horarios = horariosObjectArray;

      await itinerario.save();
      return itinerario;
    },
  },
};
