const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  handleValidationErrors,
];

const validateUserCreate = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner'),
  handleValidationErrors,
];

const validateStoreCreate = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('ownerId')
    .isInt()
    .withMessage('Owner ID must be a valid integer'),
  handleValidationErrors,
];

const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  handleValidationErrors,
];

const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateUserCreate,
  validateStoreCreate,
  validatePasswordUpdate,
  validateRating,
};
