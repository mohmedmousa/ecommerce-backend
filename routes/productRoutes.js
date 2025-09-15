const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct, 
  deleteProduct,
  createProductReview
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateMiddleware');

const router = express.Router();

// Get Products
router.get('/', getProducts);

// Get Single Product
router.get('/:id', getProductById);

// Create Product (Admin Only)
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').not().isEmpty().withMessage('Product name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('image').not().isEmpty().withMessage('Image is required'),
    body('brand').not().isEmpty().withMessage('Brand is required'),
    body('category').not().isEmpty().withMessage('Category is required'),
  ],
  validateRequest,
  createProduct
);

// Update Product (Admin Only)
router.put(
  '/:id',
  protect,
  adminOnly,
  [
    body('name').optional().not().isEmpty().withMessage('Product name cannot be empty'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  updateProduct
);

// Delete Product (Admin Only)
router.delete('/:id', protect, adminOnly, deleteProduct);

// Add Review
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
