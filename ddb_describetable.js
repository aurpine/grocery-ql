var AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var params = {
    TableName: process.argv[2]
};

ddb.describeTable(params, function(err, data) {
    if(err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Table.KeySchema);
    }
});
