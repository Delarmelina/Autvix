// Bibliotecas do express para funcionamento da aplicação
var express = require('express');
var router = express.Router();

// Bibliotecas e configurações para funcionamento do SQL server
var config = require('../config/dbconfig.js');
const sql = require('mssql');
const knexfile = require('../config/knexfile')
const knex = require('knex')(knexfile)

// Função para obter qualquer tabela completa do banco de dados
router.post('/getany', async function (req, res) {
    let result = await knex(req.body.table);
    return res.status(200).json(result)
});

// Função para obter um resultado de qualquer codigo SQL
router.post('/getCode', async function (req, res) {
    const { code } = req.body;

    console.log(code)

    let pool = await sql.connect(config);
    let result = (await pool.request().query(code));
    return res.status(200).json(result.recordset)
});

// Função para inserir um dado em qualquer tabela do banco de dados
router.post('/newRowOnTable', async function (req, res,) {

    // Aquisição do objeto e da tabela a ser inserida
    const data = req.body.data;
    const table = req.body.table;

    try {
        // Adiciona o novo dado na tabela recebida
        await knex(table).insert(data);

        // Retorna que o dado foi inserido corretamente
        return res.status(200).json("Dado inserido corretamente!");

    } catch (err) { return res.status(400).json("Erro ao inserir dado : " + err.message) }

});

module.exports = router;