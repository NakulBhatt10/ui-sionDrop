import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000', // Backend server
});

export const loginUser = (formData) => API.post('/login', formData);
export const registerUser = (formData) => API.post('/signup', formData);
