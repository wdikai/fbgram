const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const User = require('./user.js');
const dynamoDb = require('../services/dynamoDBHelper.js');

const config = require('../config')

const now = () => Date.now();

class Session {
    static get(token) {
        let session;
        const params = { TableName: Session.tableName, Key: { token } };
        return Session
            .verifyToken(token)
            .then(() => dynamoDb
                .get(params)
                .promise()
            )
            .then(result => {
                if (!result) {
                    const error = new Error('Invalid token');
                    error.status = 401;

                    throw error;
                }

                session = new Session(result.Item);
                return User.get(result.Item.userId);
            })
            .then(user => {
                if (!user) {
                    const error = new Error('Invalid token');
                    error.status = 401;

                    throw error;
                }

                session.user = user;
                return session;
            });
    }

    static get tableName() {
        return 'sessions';
    }

    static createByUse(user) {
        const session = new Session(Session.generateCredentials(user));
        session.user = user;

        return session.save();
    }

    static generateCredentials(user) {
        const tokenParams = { id: user.id, key: uuid.v4() };
        const tokenExpireAt = now() + config.JWT_LIFE_TIME;
        const token = Session.getToken(tokenParams, tokenExpireAt);

        return {
            userId: user.id,
            token,
            tokenExpireAt,
        };
    }

    static getToken(data, expireAt) {
        return jwt.sign({ exp: expireAt, data }, config.JWT_SECRET_KEY);
    }

    static verifyToken(token, options = {}) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.JWT_SECRET_KEY, options, (error, data) => {
                if (error) {
                    return reject(error);
                }

                resolve(data);
            });
        })
    }

    static destroy(token) {
        const params = { TableName: Session.tableName, Key: { token } };

        return dynamoDb
            .delete(params)
            .promise();
    }

    constructor({ userId, token, tokenExpireAt }) {
        this.dataValues = {};

        this.userId = userId;
        this.token = token;
        this.tokenExpireAt = tokenExpireAt;
    }

    get userId() {
        this.dataValues.userId;
    }

    set userId(value) {
        this.dataValues.userId = value;
    }

    get token() {
        this.dataValues.token;
    }

    set token(value) {
        this.dataValues.token = value;
    }

    get tokenExpireAt() {
        this.dataValues.tokenExpireAt;
    }

    set tokenExpireAt(value) {
        this.dataValues.tokenExpireAt = value;
    }

    save() {
        let params = {
            TableName: Session.tableName,
            Item: this.dataValues
        };

        return dynamoDb
            .put(params)
            .promise()
            .then(() => this);
    }

    toJSON() {
        return {
            credentials: {
                token: this.dataValues.token,
                tokenExpireAt: new Date(this.dataValues.tokenExpireAt).toISOString()
            },
            profile: this.user
        };
    }
}

module.exports = Session;