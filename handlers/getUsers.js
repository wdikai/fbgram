const joi = require('joi');

const FacebookService = require('../services/facebookService');
const User = require('../models/user');
const Validator = require('../services/validator');
const config = require('../config');

exports.handler = (event, context, callback) => {
    console.log('Event:', event)
    const body = event.queryStringParameters || {};
    const validator = new Validator({
        filter: joi
            .string()
            .allow('')
            .optional(),

        limit: joi
            .number()
            .positive()
            .default(20)
            .optional(),

        lastEvaluatedKey: joi
            .any()
            .optional()
    });

    validator
        .validate(body)
        .then((body) => {
            let options = {};
            if (body.filter) {
                options.FilterExpression = 'contains (fullName, :filter)';
                options.ExpressionAttributeValues = {':filter': body.filter};
                options.Limit = body.limit,
                options.ExclusiveStartKey = body.lastEvaluatedKey
            }

            return User.getList(options);
        })
        .then(({ rows, totalCount, lastEvaluatedKey }) => callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin" : "*", 
              "Access-Control-Allow-Credentials" : true
            },
            body: JSON.stringify({
                data: rows,
                pagination: {totalCount, lastEvaluatedKey}
            }),
        }))
        .catch(error => {
            console.error("Error:", error);
            callback(null, {
                statusCode: error.status || 422,
                body: JSON.stringify({
                    message: error.message,
                    stack: config.RETURN_STACK ? error.stack : null
                }),
            })
        });
}