var express = require('express');
var express_graphql = require('express-graphql');
var { graphql, buildSchema } = require('graphql');
var AWS = require('aws-sdk');

const port = process.env.PORT || 8080;

AWS.config.update({region: 'us-west-2'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

function DynamotoJSON(obj) {
  // TODO
  return 1;
}

async function putItem(table, item) {
  return await ddb.putItem({TableName: table, Item: item}, function(err, data) {
      if(err) {
          console.log("Error", err);
          return false;
      } else {
          console.log("Success", data);
          return true;
      }
  });
}
async function getItem(table, key) {
  return await ddb.getItem({TableName: table, Key: key}, function(err, data) {
      if(err) {
          throw new Error(err);
      } else {
          console.log("Success", data.Item);
          return DynamotoJSON(data.Item);
      }
  });
}
async function deleteItem(table, key) {
  return await ddb.deleteItem({TableName: table, Key: key}, function(err, data) {
      if(err) {
          console.log("Error", err);
          return false;
      } else {
          console.log("Success", data);
          return true;
      }
  });
}

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    userById(id: ID!): User!
    itemById(id: ID!): Item
  }

  type Mutation {
    addUser(newUserInfo: NewUserInfo!): User
  }

  input NewUserInfo {
    firstName: String!
    lastName: String!
    address: AddressInput!
    email: String!
    phone: Int
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    address: Address!
    email: String!
    phone: Int
    carts: [Cart!]
  }

  type Cart {
    items: [CartItem!]!
  }

  type CartItem {
    id: ID!
    quantity: Int!
  }

  type Item {
    id: ID!
    name: String!
    price: Float!
  }

  type Address {
    addressLine1: String!
    addressLine2: String
    city: String!
    province: String!
    postalCode: String!
    country: String!
  }

  input AddressInput {
    addressLine1: String!
    addressLine2: String
    city: String!
    province: String!
    postalCode: String!
    country: String!
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  user: (id) => {
    return 1;
  },
};

// Run the GraphQL query '{ hello }' and print out the response
// graphql(schema, '{ hello }', root).then((response) => {
//   console.log(response);
// });

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(port, () => console.log('Express GraphQL Server Now Running On localhost:'+ port + '/graphql'));

