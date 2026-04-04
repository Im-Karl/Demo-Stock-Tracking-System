const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middleware/auth'); 

router.get('/blog/:blogId', commentController.getCommentsByBlog);
router.post('/blog/:blogId', verifyToken, commentController.addComment);
router.delete('/:commentId', verifyToken, commentController.deleteComment);

module.exports = router;