const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRating } = require('../middleware/validate');

router.use(authenticate, authorize('user'));

router.get('/', storeController.getStores);
router.post('/:storeId/rating', validateRating, storeController.submitRating);

module.exports = router;
