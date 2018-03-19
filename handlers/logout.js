const Session = require('../models/session');
const config = require('../config');

const { responseFormatter, errorFormatter } = require('../services/responseFormatter');
const logger = new (require('../services/logger'))('post comment');

exports.handler = (event, context, callback) => {
    const body = event.queryStringParameters || {};
    Session
        .destroy(body.token)
        .then(() => callback(null, responseFormatter({ status: 204})))
        .catch(error => {
            logger.error(error);
            callback(null, errorFormatter(error));
        });
}