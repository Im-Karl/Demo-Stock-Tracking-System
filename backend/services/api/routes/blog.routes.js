const express = require('express');
const router = express.Router();
const controller = require('../controllers/blog.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/', controller.getAllBlogs);
router.get('/author/:authorId', controller.getBlogsByAuthor);
router.get('/:slug', controller.getBlogBySlug);
router.post('/', verifyToken, controller.createBlog);
router.put('/:slug/toggle-public', verifyToken, controller.togglePublic);

router.get('/edit/:id', verifyToken, controller.getBlogById);
router.get('/me/manage', verifyToken, controller.getMyBlogs);
router.put('/:id', verifyToken, controller.updateBlog);
router.delete('/:id/trash', verifyToken, controller.moveToTrash);
router.put('/:id/restore', verifyToken, controller.restoreBlog);
router.delete('/:id/permanent', verifyToken, controller.hardDeleteBlog);
router.post('/:id/like', verifyToken, controller.toggleLike);
module.exports = router;
