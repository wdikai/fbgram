const FacebookService = require('../services/facebookService');
const User = require('../models/user');
const Validator = require('../services/validator');
const config = require('../config');
const { responseFormatter, errorFormatter } = require('../services/responseFormatter');
const logger = new (require('../services/logger'))('get users');

const { search, pagination } = reqiore('../rules/user');

exports.handler = (event, context, callback) => {
    console.log('Event:', event)
    const body = event.queryStringParameters || {};
    const validator = new Validator(Object.assign({}, search, pagination));

    validator
        .validate(body)
        .then((body) => {
            let options = {};
            if (body.filter) {
                options.FilterExpression = 'contains (fullName, :filter)';
                options.ExpressionAttributeValues = { ':filter': body.filter };
                options.Limit = body.limit;
                options.ExclusiveStartKey = body.lastEvaluatedKey
            }

            return User.getList(options);
        })
        .then(({ rows, totalCount, lastEvaluatedKey }) => {
            logger.info('totalCount =', totalCount, '; lastEvaluatedKey:', lastEvaluatedKey);
            callback(null, responseFormatter({
                status: 200,
                body: {
                    data: rows,
                    pagination: { totalCount, lastEvaluatedKey }
                }
            }));
        })
        .catch(error => {
            logger.info(error);
            callback(null, errorFormatter(error));
        });
}