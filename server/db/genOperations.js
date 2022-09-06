var config = require('../config/dbconfig.js');
const sql = require('mssql');
const SQLF = require('../library/SQLFunctions.js');

async function getAnyTable(table) {

    try {
        let pool = await sql.connect(config);
        console.log(pool);
        let names = await pool.request().query(SQLF.select({
            tabela: table,
            campos: ['*']
        }));
        console.log(names.recordset);
        return names.recordset;
    } catch (err) { }

}

module.exports = { getAnyTable : getAnyTable };