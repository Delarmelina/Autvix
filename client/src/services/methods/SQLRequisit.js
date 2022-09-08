import api from "../config/api";

// Requisita qualquer tabela do banco de dados
export async function GetTable(table) {

    // Requisita o login no banco de dados
    let res = await api.post("gen/getany", {
        table: table
    });

    return res.data;
}

// Requisita qualquer codigo direto do banco de dados
export async function GetCode(code) {

    // Requisita o login no banco de dados
    let res = await api.post("gen/getCode", {
        code: code
    });

    return res.data;
}

// Insere uma nova linha em qualquer tabela do banco de dados
export async function NewRowOnTable(table, data) {
    
    // Recebe o nome da tabela e a data para preenchimento
    let res = await api.post("gen/newRowOnTable", {
        table: table,
        data: data
    })

    return res.data;
}