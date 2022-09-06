import api from "../config/api";

// Requisita qualquer tabela do banco de dados
export async function GetTable(database, table) {

    // Requisita o login no banco de dados
    let res = await api.post("gen/getany", {
        database: database,
        table: table
    });

    return res.data;
}