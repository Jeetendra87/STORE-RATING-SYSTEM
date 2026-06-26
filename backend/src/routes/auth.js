const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateSignup, validatePasswordUpdate } = require('../middleware/validate');

router.post('/signup', validateSignup, authController.signup);
router.post('/login', authController.login);
router.put('/password', authenticate, validatePasswordUpdate, authController.updatePassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
