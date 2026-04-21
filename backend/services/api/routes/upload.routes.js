const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), uploadController.uploadImage);

module.exports = router;
