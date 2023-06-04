const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const { authenticationMiddleware } = require("../../middleware/auth");

const Query = {
  login(parent, args, ctx, info) {
    try {
      if (!args.username || !args.password)
        throw new GraphQLError("Provide username and password", {
          extensions: {
            code: "INVALID_INPUT",
            http: { status: 400 },
          },
        });

      const id = new Date().getDate();
      const user = { id, username: args.username };

      const token = jwt.sign(user, "Sairoden", { expiresIn: "30d" });
      user.token = token;

      return user;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  dashboard(parent, args, { token }, info) {
    try {
      const { username } = authenticationMiddleware(token);

      const luckyNumber = Math.floor(Math.random() * 100);

      return {
        msg: `Hello, ${username}`,
        secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

module.exports = Query;
