// src/services/authService.js
import axiosClient from '../lib/axiosClient';

export const authService = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  
  // User Profile
  getProfile: () => axiosClient.get('/user/profile'),
  updateProfile: (data) => axiosClient.put('/user/profile', data),
  changePassword: (data) => axiosClient.put('/user/change-password', data)
};