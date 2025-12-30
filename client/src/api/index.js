import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// This automatically attaches the JWT token to every request if it exists
API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const fetchCampaigns = () => API.get('/api/campaigns');
export const fetchCampaignById = (id) => API.get(`/api/campaigns/${id}`);
export const createCampaign = (data) => API.post('/api/campaigns', data);
export const login = (data) => API.post('/api/users/login', data);
export const register = (data) => API.post('/api/users', data);
