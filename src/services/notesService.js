import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const API_URL = 'http://localhost:5162/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error);
        return Promise.reject(error);
    }
);

export const notesService = {
    getNotes: async (searchTerm = '', fromDate = null, toDate = null) => {
        const params = { search: searchTerm };
        if (fromDate) params.fromDate = fromDate.toISOString();
        if (toDate) params.toDate = toDate.toISOString();

        return axiosInstance.get('/notes', { params });
    },

    getNote: async (id) => {
        return axiosInstance.get(`/notes/${id}`);
    },

    createNote: async (noteData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Get user ID from token
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenPayload.sub;

            console.log('Creating note with data:', {
                ...noteData,
                userId: userId
            });

            const response = await axiosInstance.post('/notes', {
                title: noteData.title.trim(),
                description: noteData.description.trim(),
                userId: userId,
                createdAt: new Date().toISOString()
            });

            return response;
        } catch (error) {
            console.error('Error creating note:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                fullError: error,
                validationErrors: error.response?.data?.errors,
                requestData: error.config?.data
            });
            throw error;
        }
    },

    updateNote: async (id, noteData) => {
        return axiosInstance.put(`/notes/${id}`, noteData);
    },

    deleteNote: async (id) => {
        return axiosInstance.delete(`/notes/${id}`);
    }
};

export default notesService;
