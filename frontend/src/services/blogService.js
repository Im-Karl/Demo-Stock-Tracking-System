import axiosClient from '../lib/axiosClient';

export const blogService = {
  getAll: () => axiosClient.get('/blogs'),
  getOne: (slug) => axiosClient.get(`/blogs/${slug}`),
  create: (data) => axiosClient.post('/blogs', data),
  togglePublic: (slug) => axiosClient.put(`/blogs/${slug}/toggle-public`),

  getMyBlogs: () => axiosClient.get('/blogs/me/manage'),
  
  getBlogById: (id) => axiosClient.get(`/blogs/edit/${id}`),
  toggleLike: (id) => axiosClient.post(`/blogs/${id}/like`),
  getBlogsByAuthor: (authorId) => axiosClient.get(`/blogs/author/${authorId}`),
  
  updateBlog: (id, data) => axiosClient.put(`/blogs/${id}`, data),
  
  moveToTrash: (id) => axiosClient.delete(`/blogs/${id}/trash`),
  restoreBlog: (id) => axiosClient.put(`/blogs/${id}/restore`),
  hardDelete: (id) => axiosClient.delete(`/blogs/${id}/permanent`),
};