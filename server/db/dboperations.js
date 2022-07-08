var config = require('../config/dbconfig.js');
const sql = require('mssql');
const SQLF = require('../library/SQLFunctions.js');

async function getUsers(keyobj, OneUser) {
    OneUser = OneUser || null;
    keyobj = keyobj || null;

    let obj = {
        tabela: 'users',
        campos: ['*'],
    }

    keyobj ? obj.filter = [keyobj + " = '" + OneUser + "'"] : null;

    try {
        let pool = await sql.connect(config);
        let names = await pool.request().query(SQLF.select(obj));
        return names.recordset;
    } catch (err) { }
}

async function insertUser(user) {
    try {
        let pool = await sql.connect(config);

        let result = await pool.request().query(SQLF.select({
            campos: ['max(id) as id'],
            tabela: 'users'
        }));
        user.id = result.recordset[0].id + 1;

        let text = SQLF.insert({
            tabela: 'users',
            campos: ['id', 'name', 'email', 'password'],
            valores: [user.id, user.name, user.email, user.password]
        })

        console.log(text);

        let result2 = await pool.request().query(text);

        return result2;
    } catch (err) { }
}

async function deleteUser(id) {
    try {
        let pool = await sql.connect(config);

        let result = await pool.request().query(SQLF.del({
            tabela: 'users',
            conditions: ['id = ' + id]
        }));

        return result;
    } catch (err) { }
}

async function updateUser(user) {

    campos = {
        id: user.idn,
        name: user.name,
        email: user.email
    }

    try {
        let pool = await sql.connect(config);

        let sqltext = SQLF.update({
            tabela: 'users',
            campos: Object.keys(campos).map(key => {
                if (typeof campos[key] === 'string') {
                    return key + " = '" + campos[key] + "'";
                } else {
                    return key + " = " + campos[key];
                }
            }),
            conditions: ['id = ' + user.ido]
        })

        let result = await pool.request().query(sqltext);

        return result;
    } catch (err) { }
}

module.exports = {
    getUsers: getUsers,
    insertUser: insertUser,
    deleteUser: deleteUser,
    updateUser: updateUser
}