var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var Part = require(libs + 'model/part');

// List all parts
router.get('/', function (req, res) {

    Part.find(function (err, parts) {
        if (!err) {
            return res.json(parts);
        } else {
            res.statusCode = 500;

            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

// Get parts
router.get('/:id', function (req, res) {

    Part.findById(req.params.id, function (err, part) {

        if (!part) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                part: part
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});


module.exports = router;
