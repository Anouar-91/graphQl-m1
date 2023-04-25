"use strict";

var _client = require("@prisma/client");
var _express = _interopRequireDefault(require("express"));
var _expressGraphql = require("express-graphql");
var _graphql = require("graphql");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const prisma = new _client.PrismaClient();
const app = (0, _express.default)();
let schema = (0, _graphql.buildSchema)(`
    type editors {
        idEditors: ID!
        nameEditors: String!
        games: [games]
    }
    
    type games {
        idGames: ID!
        nameGames: String!
        idEditors: Int
        editors: editors    
        stock: [stock]
    }
    type stores {
        idStores: ID!
        nameStores: String!
        stock: [stock]
    }
    
    type stock {
        idStock : ID!
        idGames: Int
        idStores: Int
        units: Int
        prices: Float
        stores: stores
        games: games
    }
    
    type Query {
        getGames: [games]
    }
    type editorsInput{
        nameEditors: String
    }
    type Mutation {
        insertEditors(value: editorsInput): [editors]
    }
`);
let root = {
  getGames: async () => {
    return prisma.games.findMany({
      include: {
        editors: true
      }
    });
  },
  insertEditors: async ({
    value
  }) => {
    await prisma.editors.create({
      data: value
    });
    return await prisma.editors.findMany({
      include: {
        games: true
      }
    });
  }
};
app.use("/graphql", (0, _expressGraphql.graphqlHTTP)({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(3200, () => {
  console.log("API GRAPHQL listening on 3200");
});