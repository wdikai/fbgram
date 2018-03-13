const uuid = require('uuid');

const dynamoDb = require('../services/dynamoDBHelper.js');
const User = require('./user');

class Comment {

    static getComments(photoId, withUser = false, options) {
        let params = Object.assign({
            TableName: Comment.tableName,
            IndexName: 'photoIdIndex',
            ScanIndexForward: false,
            ExpressionAttributeValues: { ':photoId': photoId },
            KeyConditionExpression: 'photoId = :photoId',
        }, options);

        const userIds = new Set(); //{};
        return dynamoDb
            .query(params)
            .promise()
            .then(result => ({
                rows: result.Items ? result.Items.map(i => new Comment(i)) : [],
                totalCount: result.Count,
                lastEvaluatedKey: JSON.stringify(result.LastEvaluatedKey)
            }))
            .then(result => {
                if (withUser && result.rows.length) {
                    result.rows
                        .filter(c => c.userId)
                        .forEach(c => userIds.add(c.userId));

                    return User
                        .getList({
                            ExpressionAttributeValues: { ':userIds': Array.from(userIds).join(', ') },
                            FilterExpression: `id IN (:userIds)`
                        })
                        .then(({ rows }) => {
                            result.rows.forEach(c => {
                                const user = rows.find(u => u.id === c.userId);
                                c.user = user;
                                return c;
                            })

                            return result;
                        });
                }

                return result;
            })
    }

    static get tableName() {
        return 'comments';
    }

    constructor(commentData) {
        this.dataValues = {};

        this.id = commentData.id || uuid.v4();
        this.photoId = commentData.photoId;
        this.userId = commentData.userId;
        this.message = commentData.message;
        this.createdAt = commentData.createdAt || new Date().toISOString();
    }

    get id() {
        return this.dataValues.id;
    }

    set id(value) {
        this.dataValues.id = value;
    }

    get photoId() {
        return this.dataValues.photoId;
    }

    set photoId(value) {
        this.dataValues.photoId = value;
    }

    get userId() {
        return this.dataValues.userId;
    }

    set userId(value) {
        this.dataValues.userId = value;
    }

    get message() {
        return this.dataValues.message;
    }

    set message(value) {
        this.dataValues.message = value;
    }

    get createdAt() {
        return this.dataValues.createdAt;
    }

    set createdAt(value) {
        this.dataValues.createdAt = value;
    }

    save() {
        let params = {
            TableName: Comment.tableName,
            Item: this.dataValues
        };

        console.log(params);

        return dynamoDb
            .put(params)
            .promise()
            .then(() => this);
    }

    toJSON() {
        return Object.assign({ sender: this.user }, this.dataValues);
    }
}

module.exports = Comment;