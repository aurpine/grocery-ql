var express = require('express');
var express_graphql = require('express-graphql');
var { graphql, buildSchema } = require('graphql');
var AWS = require('aws-sdk');

const port = process.env.PORT || 8080;

AWS.config.update({region: 'us-west-2'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

async function putItem(table, item) {
  return await ddb.putItem({TableName: table, Item: item}, (err, data) => {
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
  return await ddb.getItem({TableName: table, Key: key}).on('success', (data) => {
      if(err) {
        console.log("HELLO");
          throw new Error(err);
      } else {
          console.log("Success", data.Item);
          return parse(data.Item);
      }
  });
}
async function deleteItem(table, key) {
  return await ddb.deleteItem({TableName: table, Key: key}, (err, data) => {
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
    userById(id: ID!): User
    itemById(id: ID!): Item
    addOne(n: Int!): Int!
    getRun(cart: Int!): Path
  }

  type Path {
    stores: [Stop]
  }

  type Stop {
    shop: String
    address: Address!
    items: [Cart]
  }

  type Mutation {
    addUser(addUserInput: AddUserInput!): AddUserPayload!
    addItem(addItemInput: AddItemInput!): AddItemPayload!
    addCart(userID: ID!, addCartInput: AddCartInput): AddCartPayload!
  }

  input AddUserInput {
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

  type AddUserPayload {
    user: User
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

  type AddItemPayload {
    item: Item
  }

  input AddItemInput {
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
    country: Country!
  }

  input AddressInput {
    addressLine1: String!
    addressLine2: String
    city: String!
    province: String!
    postalCode: String!
    country: Country!
  }

  enum Country {
    Canada
  }

  input AddCartInput {
    cartItems: [CartItemInput!]!
  }

  input CartItemInput {
    id: ID!
    quantity: Int!
  }

  type AddCartPayload {
    userID: ID!
    cart: Cart!
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  userById: async (userId) => {
    let d = await getItem('USER_LIST', {ID: {N: userId.id}, EMAIL: {S: 'justinpu@rocketmail.com'}});
    return {
      id: () => userId.id,
      firstName: () => d.FirstName,
      lastName: () => d.LastName,
      address: (addressFields) => {
        let address = d.Address;
        return {
          addressLine1: () => address.AddressLine1,
          addressLine2: () => address.AddressLine2,
          city: () => address.City,
          province: () => address.Province,
          postalCode: () => address.PostalCode,
          country: () => address.Country
        };
      },
      email: () => d.Email,
      phone: () => d.Phone,
      carts: (cartsFields) => {
        let carts = d.Carts;
        // TODO
      }
    };
  },
  addUser: (input) => {
    console.log(input);
    return {
      user: () => {
        return {
          firstName: () => { return input.addUserInput.firstName},
          lastName: () => { return input.addUserInput.lastName}
        };
      }
    };
  },
};

function parse(obj) {
  if(obj.hasOwnProperty('S')) {
    return obj.S;
  } else if(obj.hasOwnProperty('N')) {
    return parseFloat(obj.N);
  } else if(obj.hasOwnProperty('SS')) {
    return map(obj.SS.substr(1, obj.SS.length-1).split(', '), i => i.substr(1, i.length-1));
  } else if(obj.hasOwnProperty('NS')) {
    return map(obj.NS.substr(1, obj.NS.length-1).split(', '), i => parseInt(i.substr(1, i.length-1)));
  } else if(obj.hasOwnProperty('M')) {
    for(var key in obj.M) {
      obj.M[key] = parse(obj.M[key]);
    }
    return obj.M;
  } else if(obj.hasOwnProperty('L')) {
    return obj.L;
  } else if(obj.hasOwnProperty('NULL')) {
    return null;
  } else if(obj.hasOwnProperty('BOOL')) {
    return obj.BOOL;
  } else {
    for(var key in obj) {
      obj[key] = parse(obj[key]);
    }
    return obj;
  }
}

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

