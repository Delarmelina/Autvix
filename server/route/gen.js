// Bibliotecas do express para funcionamento da aplicação
var express = require('express');
var router = express.Router();

// Bibliotecas e configurações para funcionamento do SQL server
var config = require('../config/dbconfig.js');
const sql = require('mssql');
const knexfile = require('../config/knexfile')
const knex = require('knex')(knexfile)

// Function to get any table of any database
router.post('/getany', async function (req, res) {
    let result = await knex(req.body.table);
    return res.status(200).json(result)
});

router.post('/getCode', async function (req, res) {
    const { code } = req.body;

    let pool = await sql.connect(config);
    let result = (await pool.request().query(code));
    return res.status(200).json(result.recordset)
});

module.exports = router;