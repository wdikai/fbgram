const FacebookService = require('../services/facebookService');
const User = require('../models/user');
const Comment = require('../models/comment');
const Validator = require('../services/validator');
const Broker = require('../services/mqttHelper');
const config = require('../config');
const { responseFormatter, errorFormatter } = require('../services/responseFormatter');

const {photo, commentMessage} = reqiore('../rules/user.js');

const logger = new (require('../services/logger'))('post comment');

exports.handler = (event, context, callback) => {
    let newComment;
    const body = JSON.parse(event.body) || {};
    const { principalId } = event.requestContext.authorizer || {};

    const validator = new Validator(Object.assign({}, photo, commentMessage));

    validator
        .validate(body)
        .then((body) => {
            newComment = new Comment(Object.assign({ userId: principalId }, body));
            return newComment.save();
        })
        .then(comment => User
            .get(comment.userId)
            .then(user => comment.user = user)
            .then(() => Broker.publish(`/photos/${comment.photoId}/comments`, comment))
        )
        .then(() => {
            logger.info('newComment', newComment);
            callback(null, responseFormatter({ status: 201, body: { data: newComment } }));
        })
        .catch(error => {
            logger.info(error);
            callback(null, errorFormatter(error));
        });
}