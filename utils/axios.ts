import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:5000', // your backend
    baseURL: 'https://liveteamgames.up.railway.app', // your backend
    withCredentials: true,            // ✅ allows cookies to be sent & received
});

export default api;
