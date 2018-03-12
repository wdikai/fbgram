const Session = require('../models/session');

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
        .then((session) => callback(null, generatePolicy(session.user.id, 'Allow', methodArn, session)))
        .catch((error) => callback('Unauthorized'));
}