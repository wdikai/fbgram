const FacebookService = require('../services/facebookService');
const Comment = require('../models/comment');
const Validator = require('../services/validator');
const config = require('../config');
const { responseFormatter, errorFormatter } = require('../services/responseFormatter');
const logger = new (require('../services/logger'))('get comments');

const {photo, pagination} = require('../rules/user.js');

exports.handler = (event, context, callback) => {
    const body = event.queryStringParameters || {};
    const validator = new Validator(Object.assign({}, photo, pagination));

    validator
        .validate(body)
        .then((body) => Comment.getComments(body.photoId, true, {
            Limit: body.limit,
            ExclusiveStartKey: body.lastEvaluatedKey && JSON.parse(body.lastEvaluatedKey)
        }))
        .then(({ rows, totalCount, lastEvaluatedKey }) => {
            logger.info('totalCount =', totalCount, '; lastEvaluatedKey:', lastEvaluatedKey);
            callback(null, responseFormatter({
                status: 200,
                body: {
                    data: rows,
                    pagination: { totalCount, lastEvaluatedKey }
                },
            }));
        })
        .catch(error => {
            logger.error(error);
            logger.info(body);
            callback(null, errorFormatter(error));
        });
}