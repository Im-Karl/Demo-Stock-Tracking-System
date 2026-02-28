const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/profile', verifyToken, controller.getProfile);
router.put('/profile', verifyToken, controller.updateProfile);
router.put('/change-password', verifyToken, controller.changePassword);
router.get('/:id', verifyToken, controller.getUserById);
router.post('/:id/follow', verifyToken, controller.toggleFollow)

module.exports = router;