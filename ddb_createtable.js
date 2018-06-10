var AWS = require('aws-sdk');
var YAML = require('yamljs');

AWS.config.update({region: 'us-west-2'});

ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var params = YAML.load("tables/" + process.argv[2] + ".yaml")

ddb.createTable(params, function(err, data) {
    if(err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
})
