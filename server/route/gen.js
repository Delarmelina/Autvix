var express = require('express');
var router = express.Router();

const genOperations = require('../db/genOperations');

// Function to get any table of any database
router.post('/getany', (req, res) => {
    const { database, table } = req.body;

    genOperations.getAnyTable(database, table)
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            res.status(500).json(err);
        }
        );
});

module.exports = router;