"use strict";

var _express = _interopRequireDefault(require("express"));
var _expressGraphql = require("express-graphql");
var _graphql = require("graphql");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const app = (0, _express.default)();
let eleveId = 5;
let eleve = [{
  idEleve: 1,
  nom: "Bissor",
  prenom: "Melvin"
}, {
  idEleve: 2,
  nom: "Ouaki",
  prenom: "Valentin"
}, {
  idEleve: 3,
  nom: "Achache",
  prenom: "Dan"
}, {
  idEleve: 4,
  nom: "Uzan",
  prenom: "Nath"
}];
let schema = (0, _graphql.buildSchema)(`
    type Eleve {
        idEleve : Int!
        nom : String!
        prenom : String!
    }

    type Query{
        getEleve : [Eleve]!
    }

    type Mutation{
        insertEleve (nom : String!, prenom :String!) : [Eleve]
        deleteEleve (idEleve : Int! ) : [Eleve]
        updateEleve (idEleve : Int! , nom : String, prenom : String) : [Eleve]
    }
`);
let root = {
  hello: () => {
    return "Hello les Dev !";
  },
  getEleve: () => {
    return eleve;
  },
  insertEleve: ({
    nom,
    prenom
  }) => {
    let e = {
      "idEleve": eleveId,
      "nom": nom,
      "prenom": prenom
    };
    eleveId++;
    eleve.push(e);
    return eleve;
  },
  deleteEleve: ({
    idEleve
  }) => {
    eleve = eleve.filter((value, index) => {
      return value.idEleve != idEleve;
    });
    return eleve;
  },
  updateEleve: ({
    idEleve,
    nom,
    prenom
  }) => {
    // for( let i in eleve){
    //     console.log(i)
    //     if (i.idEleve == idEleve){
    //         if (nom != null){
    //             i.nom = nom
    //         }
    //         if(prenom != null){
    //             i.prenom = prenom
    //         }
    //     }
    // }

    let a = eleve.find((value, index) => {
      return value.idEleve == idEleve;
    });
    if (nom != null) {
      a.nom = nom;
    }
    if (prenom != null) {
      a.prenom = prenom;
    }
    return eleve;
  }
};
app.use("/graphql", (0, _expressGraphql.graphqlHTTP)({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(3200, () => {
  console.log("coucou");
});