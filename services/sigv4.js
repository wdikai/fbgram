const AWS = require('aws-sdk');

/**
 * utilities to do sigv4
 * @class SigV4Utils
 */
class SigV4Utils {

    static getSignatureKey(key, date, region, service) {
        const kDate = AWS.util.crypto.hmac('AWS4' + key, date, 'buffer');
        const kRegion = AWS.util.crypto.hmac(kDate, region, 'buffer');
        const kService = AWS.util.crypto.hmac(kRegion, service, 'buffer');
        const kCredentials = AWS.util.crypto.hmac(kService, 'aws4_request', 'buffer');
        return kCredentials;
    };

    static getSignedUrl({
        protocol = 'wss',
        method = 'GET',
        uri = '/mqtt',
        service = 'iotdevicegateway',
        algorithm = 'AWS4-HMAC-SHA256',
        host,
        region,
        credentials
    } = {}) {
        let canonicalHeaders, payloadHash, canonicalRequest, stringToSign, signingKey, signature;
        const datetime = AWS.util.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, '');
        const date = datetime.substr(0, 8);

        const credentialScope = date + '/' + region + '/' + service + '/' + 'aws4_request';
        let canonicalQuerystring = 'X-Amz-Algorithm=' + algorithm;
        canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(credentials.accessKeyId + '/' + credentialScope);
        canonicalQuerystring += '&X-Amz-Date=' + datetime;
        canonicalQuerystring += '&X-Amz-SignedHeaders=host';

        canonicalHeaders = 'host:' + host + '\n';
        payloadHash = AWS.util.crypto.sha256('', 'hex')
        canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

        stringToSign = algorithm + '\n' + datetime + '\n' + credentialScope + '\n' + AWS.util.crypto.sha256(canonicalRequest, 'hex');
        signingKey = SigV4Utils.getSignatureKey(credentials.secretAccessKey, date, region, service);
        signature = AWS.util.crypto.hmac(signingKey, stringToSign, 'hex');

        canonicalQuerystring += '&X-Amz-Signature=' + signature;
        if (credentials.sessionToken) {
            canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(credentials.sessionToken);
        }

        return protocol + '://' + host + uri + '?' + canonicalQuerystring;
    }
}

module.exports = SigV4Utils