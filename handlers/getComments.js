const joi = require('joi');

const FacebookService = require('../services/facebookService');
const Comment = require('../models/comment');
const Validator = require('../services/validator');
const config = require('../config');

exports.handler = (event, context, callback) => {
    const body = event.queryStringParameters || {};
    const validator = new Validator({
        photoId: joi
            .string()
            .required(),
        limit: joi
            .string()
            .required(),

        lastEvaluatedKey: joi
            .object()
            .keys()
            .empty('undefined')
            .optional()
    });

    validator
        .validate(body)
        .then((body) => Comment.getComments(body.photoId, true, {
            Limit: body.limit,
            ExclusiveStartKey: body.lastEvaluatedKey
        }))
        .then(({ rows, totalCount, lastEvaluatedKey }) => callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                data: rows,
                pagination: {totalCount, lastEvaluatedKey}
            }),
        }))
        .catch(error => {
            console.error("Error:", error);
            callback(null, {
                statusCode: error.status || 422,
                headers: {
                  "Access-Control-Allow-Origin" : "*", 
                  "Access-Control-Allow-Credentials" : true
                },
                body: JSON.stringify({
                    message: error.message,
                    stack: config.RETURN_STACK ? error.stack : null
                }),
            })
        });
}