const express = require('express');
const router = express.Router();
const controller = require('../controllers/blog.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/', controller.getAllBlogs);
router.get('/:slug', controller.getBlogBySlug);
router.post('/', verifyToken, controller.createBlog);
router.put('/:slug/toggle-public', verifyToken, controller.togglePublic);
module.exports = router;