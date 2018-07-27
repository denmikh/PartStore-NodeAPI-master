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

// Create parts
router.post('/', function (req, res) {
    console.log('req.body: ', req.body)
    var part = new Part({
        name: req.body.name,
        origArticle: req.body.origArticle,
        description: req.body.description,
        fullDescription: req.body.fullDescription,
        applicability: req.body.applicability,
        price: req.body.price,
        image: req.body.image
    });
    console.log('part: ', part)
    part.save(function (err) {
        if (!err) {
            log.info('New part created with id: %s', part.id);
            return res.json({
                status: 'OK',
                part: part
            });
        } else {
            if (err.name === 'ValidationError') {
                res.statusCode = 400;
                res.json({
                    error: 'Validation error'
                });
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                res.json({
                    error: 'Server error'
                });
            }
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

// Update parts
router.put('/:id', function (req, res) {
    var partId = req.params.id;

    Part.findById(artipartIdcleId, function (err, part) {
        if (!part) {
            res.statusCode = 404;
            log.error('part with id: %s Not Found', part);
            return res.json({
                error: 'Not found'
            });
        }

        part.title = req.body.title;
        part.description = req.body.description;
        part.author = req.body.author;
        part.images = req.body.images;

        part.save(function (err) {
            if (!err) {
                log.info('part with id: %s updated', part.id);
                return res.json({
                    status: 'OK',
                    part: part
                });
            } else {
                if (err.name === 'ValidationError') {
                    res.statusCode = 400;
                    return res.json({
                        error: 'Validation error'
                    });
                } else {
                    res.statusCode = 500;

                    return res.json({
                        error: 'Server error'
                    });
                }
                log.error('Internal error (%d): %s', res.statusCode, err.message);
            }
        });
    });
});

module.exports = router;
