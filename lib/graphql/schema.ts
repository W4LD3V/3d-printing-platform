import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String!
    role: String!
    orders: [Order!]!
  }

  type Plastic {
    id: ID!
    name: String!
    description: String
    pricePerGram: Float!
    active: Boolean!
  }

  type Color {
    id: ID!
    name: String!
    hex: String!
    available: Boolean!
  }

  type Order {
    id: ID!
    modelUrl: String!
    notes: String
    status: String!
    userHidden: Boolean!
    user: User!
    material: Plastic!
    color: Color!
    createdAt: String!
    updatedAt: String!
  }

  input OrderInput {
    modelUrl: String!
    notes: String
    materialId: String!
    colorId: String!
  }

  input PlasticInput {
    name: String
    description: String
    pricePerGram: Float
    active: Boolean
  }

  input ColorInput {
    name: String
    hex: String
    available: Boolean
  }

  type Query {
    me: User
    plastics: [Plastic!]!
    colors: [Color!]!
    myOrders: [Order!]!
    orders: [Order!]!
  }

  type Mutation {
    createOrder(input: OrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    deleteOrder(id: ID!): Boolean!
    addPlastic(input: PlasticInput!): Plastic!
    updatePlastic(id: ID!, input: PlasticInput!): Plastic!
    deletePlastic(id: ID!): Boolean!
    addColor(input: ColorInput!): Color!
    updateColor(id: ID!, input: ColorInput!): Color!
    deleteColor(id: ID!): Boolean!
  }
`;
