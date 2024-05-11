const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolver = require("./graphql/resolvers/index");
const isAuth = require("./middleware/isAuth");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

function main() {
  mongoose.set("strictQuery", false);
  mongoose.connect(
    `mongodb+srv://akibrahiim2019:eVPogwuAVJzcLKpY@cluster0.kkmzvgj.mongodb.net/test?retryWrites=true&w=majority`
  );

  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("Connection to MongoDB successfully");
  });

  db.on("error", (error) => {
    console.log(`Error connection to MongoDB: ${error}`);
  });
}
app.listen(3000, async () => {
  main();
  console.log(`Server listening on port 3000`);
});
