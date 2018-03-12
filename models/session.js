const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const User = require('./user.js');
const dynamoDb = require('../services/dynamoDBHelper.js');

const config = require('../config')

const now = () => Date.now();

class Session {
    static get(token) {
        const session = new Session();
        const params = { TableName: Session.tableName, Key: { token } };
        return Session
            .verifyToken(token)
            .then(() => dynamoDb
                .get(params)
                .promise()
            )
            .then(result => {
                const {userId, token, tokenExpireAt, refreshToken, refreshTokenExpireAt} = result.Item;

                if(!result) {
                    const error = new Error('Invalid token');
                    error.status = 401;

                    throw error;
                }

                session.userId = userId;
                session.token = token;
                session.tokenExpireAt = tokenExpireAt;
                session.refreshToken = refreshToken;
                session.refreshTokenExpireAt = refreshTokenExpireAt;

                return User.get(userId);
            })
            .then(user => {
                if(!user) {
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

    constructor(user) {
        let credentials;
        this.user = user;
        this.dataValues = {};

        if (user) {
            this.userId = user.id;
            credentials = Session.generateCredentials(user);
        }

        if (credentials) {
            this.token = credentials.token;
            this.tokenExpireAt = credentials.tokenExpireAt;
            this.refreshToken = credentials.refreshToken;
            this.refreshTokenExpireAt = credentials.refreshTokenExpireAt;
        }
    }
    
    get userId () {
        this.dataValues.userId;
    }
    
    set userId (value) {
        this.dataValues.userId = value;
    }
    
    get token () {
        this.dataValues.token;
    }
    
    set token (value) {
        this.dataValues.token = value;
    }

    get tokenExpireAt () {
        this.dataValues.tokenExpireAt;
    }
    
    set tokenExpireAt (value) {
        this.dataValues.tokenExpireAt = value;
    }

    get refreshToken () {
        this.dataValues.refreshToken;
    }
    
    set refreshToken (value) {
        this.dataValues.refreshToken = value;
    }

    get refreshTokenExpireAt () {
        this.dataValues.refreshTokenExpireAt;
    }
    
    set refreshTokenExpireAt (value) {
        this.dataValues.refreshTokenExpireAt = value;
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
            token: this.dataValues.token,
            tokenExpireAt: new Date(this.dataValues.tokenExpireAt).toISOString(),
            refreshToken: this.dataValues.refreshToken,
            refreshTokenExpireAt: new Date(this.dataValues.refreshTokenExpireAt).toISOString()
        };
    }

    static generateCredentials(user) {
        const tokenParams = { id: user.id, key: uuid.v4() };
        const refreshParams = Object.assign({ isRefreshToken: true }, tokenParams);

        const tokenExpireAt = now() + config.JWT_LIFE_TIME;
        const refreshTokenExpireAt = now() + config.JWT_REFRESH_LIFE_TIME;

        const token = Session.getToken(tokenParams, tokenExpireAt);
        const refreshToken = Session.getToken(refreshParams, refreshTokenExpireAt);

        return {
            token,
            tokenExpireAt,
            refreshToken,
            refreshTokenExpireAt
        };
    }

    static getToken(data, expireAt) {
        return jwt.sign({ exp: expireAt, data }, config.JWT_SECRET_KEY);
    }

    static verifyToken(token, options = {}) {
        return new Promise((resolve, reject) => { 
            jwt.verify(token, config.JWT_SECRET_KEY, options, (error, data) => {
                if(error) {
                    return reject(error);
                }

                resolve(data);
            }); 
        })
    }
}

module.exports = Session;