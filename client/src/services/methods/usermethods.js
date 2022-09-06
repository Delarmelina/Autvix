import api from "../config/api";

// Requisita o login no banco de dados
export async function login(email, password) {

    // Requisita o login no banco de dados
    let res = await api.post("auth/login", {
        email: email,
        password: password
    });

    // Verifica se o login foi bem sucedido
    if (res.status === 200) {
        let token = res.data.token;                             // Pega o token de autenticação do usuário
        api.defaults.headers.common["authorization"] = token    // Adiciona o token ao header da requisição
        localStorage.setItem("token", token);                   // Adiciona o token ao localStorage
        VerifyLogin();                                          // Verifica se o usuário está logado

        return 0;   // Login bem sucedido
    } else if (res.status === 201) {
        return 1;   // Email não cadastrado
    } else if (res.status === 202) {
        return 2;   // Senha incorreta
    }
}

// Verifica se o token do usuário está válido
export async function VerifyLogin() {
    api.defaults.headers.common["authorization"] = localStorage.getItem("token");;

    // Requisita do banco de dados a autenticação do token do usuario
    let res = await api.post("/auth/validate", { Headers: { "authorization": localStorage.getItem("token") } });

    localStorage.setItem("user", JSON.stringify(res.data.user));    // Adiciona o usuário ao localStorage
    
    if (res.status === 200) {
        return 0;   // Usuário logado
    } else if (res.status === 201) {
        return 1;   // Usuário não logado
    }
}


