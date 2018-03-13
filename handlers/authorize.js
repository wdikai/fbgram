const Session = require('../models/session');
const logger = new (require('../services/logger'))('autorizer');

function generatePolicy(principalId, effect, resource, context) {
    return {
        principalId,
        context,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }]
        }
    };
}

exports.handler = (event, context, callback) => {
    const {
        methodArn,
        authorizationToken
    } = event;


    return Session
        .get(authorizationToken)
        .then((session) => {
            const response = generatePolicy(session.user.id, 'Allow', methodArn, session);
            logger.info(session.user, 'methodArn', methodArn, 'token =', authorizationToken);
            logger.info(response);
            callback(null, response)
        })
        .catch((error) => {
            logger.error(error);
            callback('Unauthorized');
        });
}