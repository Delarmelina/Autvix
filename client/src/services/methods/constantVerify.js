import { VerifyLogin } from './usermethods';

// Verifica se o token do usuário está válido a cada 5 segundos
export default async function VerifyifLogged() {
    try {
        let logged = await VerifyLogin(); // Verifica se o usuário está logado

        // Se o usuário estiver logado
        if (logged === 0) {
            if (window.location.pathname === '/login') {
                window.location.href = '/';
            }
            return true;
        } else {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
            return false; // Se o usuário não estiver logado
        }
    }
    catch (err) {
        localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
            return false; // Se o usuário não estiver logado
        }
}

// Seta o intervalo de cada verificação de login
setInterval(VerifyifLogged, 1000)