var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
// 123
var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');

var config = require('./config');
var log = require('./log')(module);
var oauth2 = require('./auth/oauth2');

var api = require('./routes/api');
var users = require('./routes/users');
var parts = require('./routes/parts');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://partstore-typescript-app.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/parts', parts);
app.use('/api/oauth/token', oauth2.token);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});


module.exports = app;
