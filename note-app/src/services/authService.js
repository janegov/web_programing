import axios from 'axios';

const API_URL = 'http://localhost:5162/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});

export const authService = {
    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    register: async (email, password) => {
        try {
            console.log('Registering with:', { email, password });
            const response = await axiosInstance.post('/auth/register', {
                email,
                password,
                confirmPassword: password // Add confirmPassword to match backend model
            });
            return response.data;
        } catch (error) {
            console.error('Registration error details:', error.response?.data);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return token && user ? { token, ...JSON.parse(user) } : null;
    },

    setAuthData: (data) => {
        localStorage.setItem('token', data.token);
        const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify({
            email: data.email,
            id: tokenPayload.sub
        }));
    }
};

export default authService;
