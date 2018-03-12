const v4 = require('aws-signature-v4');
const crypto = require('crypto');
const config = require('../config');
const { responseFormatter, errorFormatter } = require('../services/responseFormatter');
const logger = new (require('../services/logger'))('get mqtt url');

exports.handler = (event, context, callback) => {
    const url = v4.createPresignedURL(
        'GET',
        config.IOT_ENDPOINT_HOST.toLowerCase(),
        '/mqtt',
        'iotdevicegateway',
        crypto.createHash('sha256').update('', 'utf8').digest('hex'),
        {
            'key': config.IOT_ACCESS_KEY,
            'secret': config.IOT_SECRET_KEY,
            'protocol': 'wss',
            'region': config.IOT_AWS_REGION,
        }
    );

    callback(null, responseFormatter({
        statusCode: 200,
        body: { url: url },
    }));
}