import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:5000', // your backend
    baseURL: 'https://liveteamgames.up.railway.app', // your backend
    withCredentials: true,            // ✅ allows cookies to be sent & received
});

// ✅ Helper to get token from cookie if not in localStorage
api.interceptors.request.use((config) => {
    let token: string | null = null;

    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");

        if (!token) {
            // Extract from cookies if not in localStorage
            const match = document.cookie
                .split("; ")
                .find((row) => row.startsWith("uid="));

            if (match) {
                token = match.split("=")[1];
            }
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ✅ Optional: response interceptor (auto logout on 401)
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             console.warn("Unauthorized — redirecting to login");
//             // window.location.href = "/login"; // uncomment if desired
//         }
//         return Promise.reject(error);
//     }
// );
export default api;
