const joi = require('joi');

exports.search = {
    filter: joi
        .string()
        .allow('')
        .optional(),
};

exports.pagination = {
    limit: joi
        .number()
        .positive()
        .default(20)
        .optional(),

    lastEvaluatedKey: joi
        .any()
        .empty('undefined')
        .optional()
};

exports.photo = {
    photoId: joi
        .string()
        .required(),
};

exports.commentMessage = {
    message: joi
        .string()
        .required()
};

exports.token = {
    accessToken: joi
        .string()
        .required()
};