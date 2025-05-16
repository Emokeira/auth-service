import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:500/auth'
});

export const signup = (formData) => API.post('signup', formData);
export const login = (formData) => API.post('login', formData);
export const getMe = (token) =>
    API.get('me', { headers: { Authorization: `Bearer ${token}` } });
export const getAdmin = (token) =>
    API.get('admin', { headers: { Authorization: `Bearer ${token}` } });