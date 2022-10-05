import axios from 'axios';

// Conexão no IP do servidor
const api = axios.create({
    baseURL: 'http://172.27.30.229:3001'
});

export default api;