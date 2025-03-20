import axios from 'axios';

const api  = axios.create({
    baseURL: 'https://stockstream-uo87.onrender.com'
});

export default api;