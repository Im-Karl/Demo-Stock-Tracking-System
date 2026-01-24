import axiosClient from '../lib/axiosClient';

export const blogService = {
  getAll: () => axiosClient.get('/blogs'),
  getOne: (slug) => axiosClient.get(`/blogs/${slug}`),
  create: (data) => axiosClient.post('/blogs', data),
  togglePublic: (slug) => axiosClient.put(`/blogs/${slug}/toggle-public`)
};