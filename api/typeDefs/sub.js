import { gql } from 'graphql-tag'

export default gql`
  extend type Query {
    sub(name: String): Sub
    subLatestPost(name: String!): String
  }

  type Sub {
    name: String!
    createdAt: String!
    updatedAt: String!
    postTypes: [String!]!
    rankingType: String!
    baseCost: Int!
  }
`
