var express = require('express');
var router = express.Router();
const dboperations = require('../dboperations.js');

router.get('/', function (req, res) {
    res.send('Hello World!');
});

router.get('/getNames', function (req, res) {
    dboperations.getNames().then(function (data) {
        res.send(data);
    });
});

router.get('/insertName', function (req, res) {
    dboperations.insertName().then(function (data) {
        res.send(data);
    });
});

module.exports = router;