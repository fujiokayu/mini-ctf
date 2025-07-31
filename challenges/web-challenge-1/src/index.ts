import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { authDirective } from "./auth.js";
import { resolvers } from "./resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = readFileSync("src/schema.graphql", "utf8");

const { authDirectiveTransformer } = authDirective();

let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = authDirectiveTransformer(schema);

const server = new ApolloServer({
  schema,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    // 簡単な認証（テスト用）
    const authToken = req.headers["x-auth-token"];
    
    if (authToken === "tester") {
      return {
        user: { id: 2, role: "TESTER" }
      };
    }
    
    return {
      user: { id: 2, role: "TESTER" }
    };
  },
});

console.log(`🚀 GraphQL-pocalypse server ready at ${url}`);