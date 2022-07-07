var config = require('./config/dbconfig.js');
const sql = require('mssql');

async function getNames(){
    try{
        let pool = await sql.connect(config);
        let names = await pool.request().query("SELECT * FROM Names");
        return names.recordset;
    }
    catch(err){
        console.log(err);
    }
}

async function insertName(){
    try{
        let pool = await sql.connect(config);
        let names = await pool.request().query("INSERT INTO Names VALUES(32, 'John')");
        return names.recordset;
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    getNames : getNames,
    insertName : insertName
}