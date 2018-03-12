const joi = require('joi');

const FacebookService = require('../services/facebookService');
const User = require('../models/user');
const Comment = require('../models/comment');
const Validator = require('../services/validator');
const Broker = require('../services/mqttHelper');
const config = require('../config');

exports.handler = (event, context, callback) => {
    let newComment;
    const body = JSON.parse(event.body) || {};
    const { principalId } = event.requestContext.authorizer || {};

    const validator = new Validator({
        photoId: joi
            .string()
            .required(),
        message: joi
            .string()
            .required()
    });

    validator
        .validate(body)
        .then((body) =>{ 
            newComment = new Comment(Object.assign({userId: principalId}, body));
            return newComment.save();
        })
        .then(comment => User
            .get(comment.userId)
            .then(user => comment.user = user)
            .then(() => Broker.publish(`/photos/${comment.photoId}/comments`, comment))
        )
        .then((comment) => callback(null, {
            statusCode: 201,
            headers: {
              "Access-Control-Allow-Origin" : "*", 
              "Access-Control-Allow-Credentials" : true
            },
            body: JSON.stringify({ data: newComment }),
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