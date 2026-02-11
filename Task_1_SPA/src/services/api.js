import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

const mapId = (data) => {
    if (!data) return data;
    if (Array.isArray(data)) {
        return data.map(item => ({ ...item, id: item._id }));
    }
    return { ...data, id: data._id };
};

export const eventService = {
    getAll: () => api.get('/events').then(res => mapId(res.data)),
    getById: (id) => api.get(`/events/${id}`).then(res => mapId(res.data)),
    create: (data) => api.post('/events', data).then(res => mapId(res.data)),
    update: (id, data) => api.put(`/events/${id}`, data).then(res => mapId(res.data)),
    delete: (id) => api.delete(`/events/${id}`).then(res => res.data),
};

export const workshopService = {
    getAll: () => api.get('/workshops').then(res => mapId(res.data)),
    getById: (id) => api.get(`/workshops/${id}`).then(res => mapId(res.data)),
    create: (data) => api.post('/workshops', data).then(res => mapId(res.data)),
    update: (id, data) => api.put(`/workshops/${id}`, data).then(res => mapId(res.data)),
    delete: (id) => api.delete(`/workshops/${id}`).then(res => res.data),
};

export const productService = {
    getAll: () => api.get('/products').then(res => mapId(res.data)),
    getById: (id) => api.get(`/products/${id}`).then(res => mapId(res.data)),
    create: (data) => api.post('/products', data).then(res => mapId(res.data)),
    update: (id, data) => api.put(`/products/${id}`, data).then(res => mapId(res.data)),
    delete: (id) => api.delete(`/products/${id}`).then(res => res.data),
};

// Unified service for fetching all items (mimicking the old json structure if needed)
export const itemService = {
    getAllItems: async () => {
        try {
            const [events, workshops, products] = await Promise.all([
                eventService.getAll(),
                workshopService.getAll(),
                productService.getAll()
            ]);

            return {
                events,
                workshops,
                products,
                all: [...events, ...workshops, ...products]
            };
        } catch (error) {
            console.error('Error fetching all items:', error);
        }
    },
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

// Auth Service
export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('urban_harvest_token', response.data.token);
        }
        return response.data;
    },
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        if (response.data.token) {
            localStorage.setItem('urban_harvest_token', response.data.token);
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('urban_harvest_token');
    },
    getCurrentUser: () => {
        // This is a placeholder; real implementation would decode token or call /me endpoint
        return JSON.parse(localStorage.getItem('urban_harvest_user') || 'null');
    }
};

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('urban_harvest_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Weather Service
export const weatherService = {
    getWeather: async (city) => {
        try {
            const response = await api.get(`/external/weather?city=${encodeURIComponent(city)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    }
};

export default api;

