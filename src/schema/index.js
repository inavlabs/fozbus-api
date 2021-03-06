const { gql } = require('apollo-server');

const typeDefs = gql`
  input HorarioInput {
    hora: String!
    via: String
    observacao: String
  }

  type Horario {
    hora: String!
    via: String
    observacao: String
    itinerario: ID!
  }

  type Itinerario {
    id: ID!
    origem: String!
    destino: String!
    horarios: [Horario]!
    dia: ID
  }

  type DiaSemana {
    dia: [Int!]!
    itinerarios: [Itinerario]!
    observacao: String
    linha: ID
  }

  type Via {
    nome: String!
    descricao: String!
  }

  type ObservacaoHorario {
    cor: String!
    descricao: String!
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
    vias: [Via]
    observacoesHorarios: [ObservacaoHorario]!
    percursos: [Percurso]!
    avisos: [String]
  }

  type Query {
    getLinhas: [LinhaOnibus]!
  }

  type Mutation {
    addLinha(numero: Int!, nome: String!): LinhaOnibus!
    addObservacaoHorario(
      idLinha: ID!
      cor: String!
      descricao: String!
    ): ObservacaoHorario!
    addPercurso(
      idLinha: ID!
      titulo: String!
      ida: String!
      volta: String!
    ): Percurso!
    addAviso(idLinha: ID!, aviso: String!): String!
    addVia(idLinha: ID!, nome: String!, descricao: String!): Via
    addDiaHorarios(
      idLinha: ID!
      dia: [Int!]!
      origem: String!
      destino: String!
      horarios: [HorarioInput]!
      observacao: String
    ): DiaSemana
    updateItinerario(
      idItinerario: ID!
      origem: String
      destino: String
      horarios: [HorarioInput]!
    ): Itinerario
  }
`;

module.exports = typeDefs;
