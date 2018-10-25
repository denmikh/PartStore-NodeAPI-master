var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var libs = process.cwd() + '/libs/';
var log = require('./log')(module);
var parts = require('./routes/parts');
var app = express();

//////////

var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');

mongoose.connect(config.database);

var auth = require('./routes/auth');

app.use(passport.initialize());

app.get('/', function(req, res) {
    res.send('Page under construction.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/api', auth);
app.use('/api/auth', auth);

app.use('/api/parts', parts);

module.exports = app;
