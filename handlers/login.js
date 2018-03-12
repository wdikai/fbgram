const joi = require('joi');

const FacebookService = require('../services/facebookService');
const User = require('../models/user');
const Session = require('../models/session');
const Validator = require('../services/validator');
const config = require('../config');

exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body) || {};
    const validator = new Validator({
        accessToken: joi
            .string()
            .required()
    });

    validator
        .validate(body)
        .then(data => new FacebookService(data.accessToken))
        .then(fb => fb.getUserProfile('me'))
        .then(fbUser => User.getOrCreate(fbUser.id, {
            email: fbUser.email,
            fullName: fbUser.name,
            picture: fbUser.picture && fbUser.picture.data && fbUser.picture.data.url
        }))
        .then(user => new Session(user).save())
        .then(session => ({
            credentials: session,
            profile: session.user
        }))
        .then((session) => callback(null, {
            statusCode: 201,
            headers: {
              "Access-Control-Allow-Origin" : "*", 
              "Access-Control-Allow-Credentials" : true
            },
            body: JSON.stringify(session),
        }))
        .catch(error => callback(null, {
            statusCode: error.status || 422,
            body: JSON.stringify({
                message: error.message,
                stack: config.RETURN_STACK ? error.stack : null
            }),
        }));
}