// GraphQL
const app = require("./app");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const mongoose = require("mongoose");
const { makeExecutableSchema } = require("@graphql-tools/schema");

// Middleware
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const startApolloServer = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.header("Authorization"),
        db: "Put your database here if you have",
      }),
    })
  );
};

mongoose
  .connect("mongodb://127.0.0.1:27017/jwt")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  startApolloServer();
  console.log("Listening on PORT 3000");
});

// 14 ka na
