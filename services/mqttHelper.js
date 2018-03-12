const AWS = require('aws-sdk');
const config = require('../config');

let options = {}, iotData;

options = {
  region: config.IOT_AWS_REGION,
  endpoint: config.IOT_ENDPOINT_HOST,
};

iotData = new AWS.IotData(options);

class Broker {
  static publish(topic, message) {
    const params = {
      topic,
      payload: JSON.stringify(message),
      qos: 0
    };

    return new Promise((resolve, reject) => {
      iotData.publish(params, (err, data) => err ? reject(error): resolve(data));
    });
  }
}

module.exports = Broker;