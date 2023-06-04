const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

exports.authenticationMiddleware = token => {
  // let token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer"))
    throw new GraphQLError("Provide username and password", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });

  token = token.split(" ")[1];

  const decoded = jwt.verify(token, "Sairoden");

  if (!decoded)
    throw new GraphQLError("Not authorized to access this route", {
      extensions: {
        code: "UNATHORIZED",
        http: { status: 401 },
      },
    });

  return decoded;
};
