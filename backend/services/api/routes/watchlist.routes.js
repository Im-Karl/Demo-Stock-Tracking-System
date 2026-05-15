const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlist.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken); // Tất cả các route này đều yêu cầu đăng nhập

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:symbol', watchlistController.removeFromWatchlist);
router.patch('/:symbol/toggle', watchlistController.toggleAlert);

module.exports = router;
