import api from "../config/api";

export async function NewUser(user) {

    try {
        let res = await api.post("auth/newuser", {
            user: user
        });

        if (res.status === 200) {
            return 0;
        }

    } catch (err) {
        if (err.status === 400) {
            return 1;
        } else if (err.status === 422) {
            return 2;
        }
    }
}

// Requisita o login no banco de dados
export async function login(email, password) {

    try {
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
        }
    } catch (err) {
        if (err.response.status === 400) {
            return 1;   // Email não encontrado
        } else if (err.response.status === 401) {
            return 2;   // Senha incorreta
        }
    }

}

// Verifica se o token do usuário está válido
export async function VerifyLogin() {

    try {
        api.defaults.headers.common["authorization"] = localStorage.getItem("token");
        // Requisita do banco de dados a autenticação do token do usuario
        let res = await api.post("/auth/validate",
            { Headers: { "authorization": localStorage.getItem("token") } });

        if (res.status === 200) {
            return 0;   // Usuário logado
        }
    } catch (err) {
        if (err.response.status === 401) {
            return 1;   // Usuário não logado
        }
    }
}


