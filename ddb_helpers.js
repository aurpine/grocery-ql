var AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

function DynamotoJSON(obj) {
    // TODO
    return 1;
}


module.exports = {
    putItem: function(table, item) {
        return await ddb.putItem({TableName: table, Item: convert(item)}, function(err, data) {
            if(err) {
                console.log("Error", err);
                return false;
            } else {
                console.log("Success", data);
                return true;
            }
        });
    },
    getItem: function(table, key) {
        return await ddb.getItem({TableName: table, Key: key}, function(err, data) {
            if(err) {
                throw "Error: " + err;
            } else {
                console.log("Success", data.Item);
                return DynamotoJSON(data.Item);
            }
        });
    },
    deleteItem: function(table, key) {
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
};