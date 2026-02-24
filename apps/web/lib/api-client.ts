import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Request interceptor: add auth token
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor: handle 401, refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (typeof window !== 'undefined') {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    try {
                        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/refresh`, { refreshToken });
                        localStorage.setItem('access_token', data.accessToken);
                        localStorage.setItem('refresh_token', data.refreshToken);
                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                        return axios(originalRequest);
                    } catch (err) {
                        localStorage.clear();
                        window.location.href = '/login';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
