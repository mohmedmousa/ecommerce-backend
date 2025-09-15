const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');   // ✅ استيراد body للتحقق
const validateRequest = require('../middleware/validateMiddleware');

const router = express.Router();

// Register Validation
router.post(
  '/register',
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  validateRequest, // ✅ Middleware يتحقق من الأخطاء
  register
);

// Login Validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').not().isEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

// Profile
router.get('/profile', protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
