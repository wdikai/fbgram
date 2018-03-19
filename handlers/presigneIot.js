const v4 = require('aws-signature-v4');
const crypto = require('crypto');
const config = require('../config');
const { responseFormatter, errorFormatter } = require('../services/responseFormatter');
const SigV4Utils = require('../services/sigv4');
const logger = new (require('../services/logger'))('get mqtt url');

exports.handler = (event, context, callback) => {
    const url = SigV4Utils.getSignedUrl({
        protocol: config.IOT_PROTOCOL,
        host: config.IOT_ENDPOINT_HOST.toLowerCase(),
        region: config.IOT_AWS_REGION, 
        credentials: {
            accessKeyId: config.IOT_ACCESS_KEY,
            secretAccessKey: config.IOT_SECRET_KEY,
        }
    });
    logger.info({ url });
    callback(null, responseFormatter({
        statusCode: 200,
        body: { url },
    }));
}