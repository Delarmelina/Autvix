function select(sqldata) {

    

    let sql = "SELECT " + sqldata.campos.join(',') + " FROM " + sqldata.tabela;
    sql += sqldata.filter ? " WHERE " + sqldata.filter.join(" and ") : "";

    console.log(sql);

    return sql;
}

function insert(sqldata) {

    let sql = "INSERT INTO " + sqldata.tabela + " (";
    sql += sqldata.campos.join(',');
    sql += ") VALUES (" + sqldata.valores.map(valor => {
        if (typeof valor === 'string') {
            return "'" + valor + "'";
        } else {
            return valor;
        }
    }).join(',') + ")";

    console.log(sql);

    return sql;
}

function del(sqldata) {

    let sql = "DELETE FROM " + sqldata.tabela;
    sql += sqldata.conditions ? " WHERE " + sqldata.conditions.join(" and ") : "";

    return sql;
}

function update(sqldata) {

    let sql = "UPDATE " + sqldata.tabela + " SET ";
    sql += sqldata.campos.join(',');
    console.log(sql);
    sql += sqldata.conditions ? " WHERE " + sqldata.conditions.join(" and ") : "";

    return sql;
}

module.exports = {
    select: select,
    insert: insert,
    del: del,
    update: update
}