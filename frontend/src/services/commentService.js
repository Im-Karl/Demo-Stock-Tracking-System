import axios from 'axios';

const API_URL = 'http://localhost:3000/api/comments';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const commentService = {
  getCommentsByBlog: (blogId) => axios.get(`${API_URL}/blog/${blogId}`),

  addComment: (blogId, content, parentComment = null) =>
    axios.post(`${API_URL}/blog/${blogId}`, { content, parentComment }, getAuthHeaders()),

  deleteComment: (commentId) => axios.delete(`${API_URL}/${commentId}`, getAuthHeaders()),
};
