const FB = require('fb');
const config = require('../config.js')
FB.options({ version: config.FB_VERSION, appId: config.FB_APP_ID, appSecret: config.FB_SECRET });

const PROFILE_FIELDS = ['id', 'email', 'name', 'picture.type(large)'];
const PROFILE_SCOPES = ['email', 'public_profile'];

class FacebookService {
    constructor(accessToken) {
        this.fb = FB.extend();
        this.fb.setAccessToken(accessToken);
    }

    api(...args) {
        return new Promise((resolve, reject) => this.fb.api(...args, (response) => {
            if (!response || response.error) {
                return reject(response ? response.error : new Error("Something was wrong"));
            }

            resolve(response);
        }))
    }

    getUserProfile(userId) {
        return this.api(userId, 'get', { fields: PROFILE_FIELDS, scope: PROFILE_SCOPES });
    }
}

module.exports = FacebookService;