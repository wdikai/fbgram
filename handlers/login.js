const FacebookService = require('../services/facebookService');
const User = require('../models/user');
const Session = require('../models/session');
const Validator = require('../services/validator');
const config = require('../config');
const { responseFormatter, errorFormatter } = require('../services/responseFormatter');
const logger = new (require('../services/logger'))('login');
const { token } = require('../rules/user');

exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body) || {};
    const validator = new Validator(token);

    validator
        .validate(body)
        .then(data => new FacebookService(data.accessToken))
        .then(fb => fb.getUserProfile('me'))
        .then(fbUser => User.getOrCreate(fbUser.id, {
            email: fbUser.email,
            fullName: fbUser.name,
            picture: fbUser.picture && fbUser.picture.data && fbUser.picture.data.url
        }))
        .then(user => Session.createByUse(user))
        .then((session) => {
            logger.info(session);
            callback(null, responseFormatter({
                status: 201,
                body: session
            }));
        })
        .catch(error => {
            logger.error(error);
            logger.info(body);
            callback(null, errorFormatter(error));
        });
}