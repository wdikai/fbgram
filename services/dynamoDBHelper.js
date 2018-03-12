const AWS = require('aws-sdk');

let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:1559',
  };
}

module.exports = new AWS.DynamoDB.DocumentClient(options);