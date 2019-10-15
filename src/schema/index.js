const { gql } = require('apollo-server');

const typeDefs = gql`
  type Horario {
    hora: String!
    via: String
    observacao: String
  }

  type Itinerario {
    nome: String!
    horarios: [Horario]!
  }

  type DiaSemana {
    dia: String!
    itinerario: [Itinerario]!
    observacao: String
  }

  type Via {
    nome: String!
    descricao: String!
  }

  type ObservacaoHorario {
    cor: String!
    descricao: String!
    linha: ID
  }

  type Percurso {
    titulo: String!
    ida: String!
    volta: String!
  }

  type LinhaOnibus {
    id: ID!
    numero: Int!
    nome: String!
    dias: [DiaSemana]!
    vias: [Via]!
    observacoesHorarios: [ObservacaoHorario]!
    percursos: [Percurso]!
    avisos: [String]
  }

  type Query {
    getLinhas: [LinhaOnibus]!
  }

  type Mutation {
    addLinha(numero: Int!, nome: String!): LinhaOnibus
    addObservacaoHorario(idLinha: ID!, cor: String!, descricao: String!): ObservacaoHorario
    addPercurso(idLinha: ID!, titulo: String!, ida: String!, volta: String!): Percurso
  }
`;

module.exports = typeDefs;
