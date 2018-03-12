const dynamoDb = require('../services/dynamoDBHelper.js');

class User {
    static get(id) {
        const params = { TableName: User.tableName, Key: { id } };

        return dynamoDb
            .get(params)
            .promise()
            .then(result => result.Item ? new User(result.Item) : null);
    }
    static getList(options) {
        const params = Object.assign({ TableName: User.tableName }, options);

        return dynamoDb
            .scan(params)
            .promise()
            .then(result => {
                return {
                    rows: result.Items ? result.Items.map(i => new User(i)) : [],
                    totalCount: result.Count,
                    lastEvaluatedKey: result.LastEvaluatedKey 
                };
            });
    }

    static getOrCreate(id, data) {
        const params = { TableName: User.tableName, Key: { id } };

        return User
            .get(id)
            .then(user => user
                ? user
                : new User(Object.assign({ id }, data)).save()
            );
    }

    static get tableName() {
        return 'users';
    }

    constructor(userData) {
        this.dataValues = {};

        this.id = userData.id;
        this.email = userData.email;
        this.fullName = userData.fullName;
        this.picture = userData.picture;
        this.createdAt = userData.createdAt || new Date().toISOString();
    }

    get id() {
        return this.dataValues.id;
    }

    set id(value) {
        this.dataValues.id = value;
    }

    get email() {
        return this.dataValues.email;
    }

    set email(value) {
        this.dataValues.email = value;
    }

    get fullName() {
        return this.dataValues.fullName;
    }

    set fullName(value) {
        this.dataValues.fullName = value;
    }

    get picture() {
        return this.dataValues.picture;
    }

    set picture(value) {
        this.dataValues.picture = value;
    }

    get createdAt() {
        return this.dataValues.createdAt;
    }

    set createdAt(value) {
        this.dataValues.createdAt = value;
    }

    save() {
        let params = {
            TableName: User.tableName,
            Item: this.dataValues
        };

        return dynamoDb
            .put(params)
            .promise()
            .then(() => this);
    }

    toJSON() {
        return this.dataValues;
    }
}

module.exports = User;