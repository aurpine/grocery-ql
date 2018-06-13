
var AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var params = {
  TableName: 'USER_LIST',
  Item: {
    'ID': {N: '1'},
    'EMAIL': {S: 'justinpu@rocketmail.com'},
    'FirstName': {S: 'Justin'},
    'LastName': {S: 'Pu'},
    'Address': {
        'M': {
            'AddressLine1': {S: '1 Hacker Way'},
            'AddressLine2': {NULL: true},
            'City': {S: 'Menlo Park'},
            'Province': {S: 'ON'},
            'PostalCode': {S: '123456'},
            'Country': {S: 'Canada'}
        }
    },
    'Email': {S: 'justinpu@rocketmail.com'},
    'Id': {N: '1'}
  }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});