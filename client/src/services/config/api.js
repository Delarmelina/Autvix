import axios from 'axios';

// Conexão no IP do servidor
const api = axios.create({
    baseURL: 'http://localhost:3001'
});

export default api;