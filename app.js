const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolver = require("./graphql/resolvers/index");
const isAuth = require('./middleware/isAuth');
const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kkmzvgj.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("app started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
