const typeDefs = `#graphql
  type Query {
    login(username: String!, password: String!): User 
    dashboard: Dashboard
  }

  type User {
    username: String
    password: String
    token: String
  }

  type Dashboard {
    msg: String
    secret: String
  }
`;

module.exports = typeDefs;
