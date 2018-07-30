var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');

var test = require('tape');
var request = require('superagent');
var baseUrl = 'http://54.210.190.194:1337/api';

var userCredentials = {
    username: config.get('default:user:username'),
    password: config.get('default:user:password')
};
var clientCredentials = {
    client_id: config.get('default:client:clientId'),
    client_secret: config.get('default:client:clientSecret')
};
var accessToken;
var refreshToken;

var partExample = {
    title: 'New part', author: 'John Doe', description: 'Lorem ipsum dolar sit amet', images: [
        { kind: 'thumbnail', url: 'http://habrahabr.ru/images/write-topic.png' },
        { kind: 'detail', url: 'http://habrahabr.ru/images/write-topic.png' }
    ]
};
var partUpdated = { title: 'Updated part', author: 'Jane Doe', description: 'This is now updated' };
var partId;

function getTokensFromBody(body) {
    if (!('access_token' in body) || !('refresh_token' in body)) {
        return false;
    }

    accessToken = body['access_token'];
    refreshToken = body['refresh_token'];

    return true;
}

test('Unauthorized request', function (t) {
    request
        .get(baseUrl + '/')
        .end(function (err, res) {
            t.equal(res.status, 401, 'response status shoud be 401');
            t.end();
        });
});

test('Get token from username-password', function (t) {
    request
        .post(baseUrl + '/oauth/token')
        .send({ grant_type: 'password' })
        .send(userCredentials)
        .send(clientCredentials)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            t.true(getTokensFromBody(res.body), 'tokens shoud be in response body');
            t.end();
        });
});

test('Get token from refresh token', function (t) {
    request
        .post(baseUrl + '/oauth/token')
        .send({ grant_type: 'refresh_token', refresh_token: refreshToken })
        .send(clientCredentials)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            t.true(getTokensFromBody(res.body), 'tokens shoud be in response body');
            t.end();
        });
});

test('Authorized request', function (t) {
    request
        .get(baseUrl + '/')
        .set('Authorization', 'Bearer ' + accessToken)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            t.end();
        });
});

test('Create part', function (t) {
    request
        .post(baseUrl + '/parts')
        .send(partExample)
        .set('Authorization', 'Bearer ' + accessToken)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            if ('part' in res.body) {
                t.equal(res.body['part']['title'], partsExample['title'], 'created part title shoud be correct');
                partsId = res.body['part']['_id'];
            }
            t.end();
        });
});

test('Check created part', function (t) {
    request
        .get(baseUrl + '/parts/' + partsId)
        .set('Authorization', 'Bearer ' + accessToken)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            if ('part' in res.body) {
                t.equal(res.body['part']['title'], partsExample['title'], 'created part title shoud be correct');
                t.equal(res.body['part']['images'].length, partsExample['images'].length, 'created part images count shoud be correct');
            }
            t.end();
        });
});

test('Update part', function (t) {
    request
        .put(baseUrl + '/parts/' + partsId)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(partUpdated)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            if ('part' in res.body) {
                t.equal(res.body['part']['title'], partsUpdated['title'], 'updated parts title shoud be correct');
            }
            t.end();
        });
});

test('Test parts list', function (t) {
    request
        .get(baseUrl + '/parts')
        .set('Authorization', 'Bearer ' + accessToken)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            var partFound = false;
            for (var i = 0; i < res.body.length; i++) {
                var part = res.body[i];
                if (part['_id'] === partId) {
                    partFound = true;
                    t.equal(part['title'], partUpdated['title'], 'updated part title shoud be correct');
                }
            }
            t.true(partFound, 'created/updated part shoud be in a list');
            t.end();
        });
});

test('Test users/info', function (t) {
    request
        .get(baseUrl + '/users/info')
        .set('Authorization', 'Bearer ' + accessToken)
        .end(function (err, res) {
            t.equal(res.status, 200, 'response status shoud be 200');
            t.equal(res.body['name'], userCredentials['username'], 'username shoud be correct');
            t.end();
        });
});
