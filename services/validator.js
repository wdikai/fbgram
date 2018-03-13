const joi = require('joi');

class Validator {
    constructor(schema, options = {abortEarly: true, convert: true}) {
        this.schema = schema;
        this.options = options;
    }

    validate(data) {
        return new Promise((resolve, reject) => {
            const result = joi.validate(data, this.schema, this.options);
            if (result.error) {
                const error = new Error(result.error.message);
                error.status = 400;
                return reject(error);
            }

            console.info('~~~~~~~~~~~~~~~~~~~~~~')
            console.info(result.value)
            console.info('~~~~~~~~~~~~~~~~~~~~~~')
            resolve(result.value);
        })
    }
}

module.exports = Validator;