// src/services/authService.js
import axiosClient from '../lib/axiosClient';

export const loginApi = (data) => axiosClient.post('/auth/login', data);
export const registerApi = (data) => axiosClient.post('/auth/register', data);