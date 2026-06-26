const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateUserCreate, validateStoreCreate } = require('../middleware/validate');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', validateUserCreate, adminController.createUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.get('/stores', adminController.getStores);
router.post('/stores', validateStoreCreate, adminController.createStore);

module.exports = router;
