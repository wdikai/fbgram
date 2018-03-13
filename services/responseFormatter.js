const config = require('../config');

exports.responseFormatter = (response) => ({
    statusCode: response.status || 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Typ, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
        "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(response.body)
})

exports.errorFormatter = (error) => exports.responseFormatter({
    status: error.status || 422,
    body: {
        message: error.message,
        stack: config.RETURN_STACK ? error.stack : null
    }
})