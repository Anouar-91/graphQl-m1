import { Prisma } from "@prisma/client"
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

let schema = buildSchema(`
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
    input editorsInput{
        nameEditors: String
    }
    input editorsUpdate{
        id: Int
        nameEditors: String
    }
    type Mutation {
        insertEditors(value: editorsInput): [editors]
        deleteEditor(id: Int): [editors]
        updateEditor(value: editorsUpdate): editors
    }
`)

let root = {
    getGames: async () => {
        return prisma.games.findMany({
            include: {
                editors: true
            }
        })
    },
    insertEditors: async ({value}) => {
        await prisma.editors.create({
            data:value
        })
        return await prisma.editors.findMany({
            include:{
                games:true
            }
        })
    },
    updateEditor: async ({value }) => {
        console.log(value.id, value.nameEditors)
        const editor = await prisma.editors.update({
            where: {
                idEditors: value.id,
            },
            data: {
                nameEditors: value.nameEditors,
            },
          })
        return editor
    },
    deleteEditor: async ({id}) => {
        const games = await prisma.games.findMany({
            where: {
                idEditors: id,
              },
        })
        games.forEach(async (game)=>{
            await prisma.stock.deleteMany({
                where: {
                    idGames: game.id,
                  },
            })
        })
        const deleteGames = await prisma.games.deleteMany({
            where: {
              idEditors: id,
            },
          })

        const editorsDelete = await prisma.editors.deleteMany({
            where: {
                idEditors: id,
              },
        });
        const editors = await prisma.editors.findMany({})
        return editors;
    }
}

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(3200, () => {
    console.log("API GRAPHQL listening on 3200")
})

