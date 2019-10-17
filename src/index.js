const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const Model = require('./models');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: {
    LinhaOnibus: Model.LinhaOnibus,
    ObservacaoHorario: Model.ObservacaoHorario,
    Percurso: Model.Percurso,
    DiaSemana: Model.DiaSemana,
    Horario: Model.Horario,
    Itinerario: Model.Itinerario,
    Via: Model.Via,
  },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
