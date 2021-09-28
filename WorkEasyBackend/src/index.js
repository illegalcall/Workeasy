import { ApolloServer, gql } from "apollo-server";
import pkg from "mongodb";
const { MongoClient } = pkg;
import dotenv from "dotenv";
dotenv.config();
import { readFileSync } from "fs";
import Mutation from "./resolvers/Mutation.js";
import Query from "./resolvers/Query.js";
import TaskList from "./resolvers/TaskList.js";
import ToDo from "./resolvers/ToDo.js";
import User from "./resolvers/User.js";
import { getUserFromToken } from "./Controllers/Auth.js";

const { DB_URI, DB_NAME } = process.env;
const { JWT_SECRET } = process.env;

const start = async () => {
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(DB_NAME);

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs: readFileSync("src/schema.graphql").toString("utf-8"),
    resolvers: {
      Query,
      Mutation,
      TaskList,
      ToDo,
      User,
    },
    context: async ({ req }) => {
      const user = await getUserFromToken(
        req.headers.authorization,
        db,
        JWT_SECRET
      );
      return {
        db,
        user,
      };
    },
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
