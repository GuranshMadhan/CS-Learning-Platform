import axios from 'axios';

// 1. Map the backend
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Automatically add the Token to every request if we have one
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // TODO: Save token here later
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;