const express = require('express');                      // استيراد express
const router = express.Router();                         // إنشاء router جديد
const {
  addOrderItems,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require('../controllers/orderController');           // استيراد دوال الكنترولر
const { protect, adminOnly } = require('../middleware/authMiddleware'); // Middleware للحماية

router.post('/', protect, addOrderItems);                // POST /api/orders → إنشاء أوردر (للمستخدم المسجل)
router.get('/myorders', protect, getMyOrders);           // GET /api/orders/myorders → عرض أوردرات المستخدم
router.get('/', protect, adminOnly, getAllOrders);       // GET /api/orders → عرض كل الأوردرات (أدمن فقط)
router.put('/:id/pay', protect, updateOrderToPaid);          // تحديث حالة الدفع
router.put('/:id/deliver', protect, adminOnly, updateOrderToDelivered); // تحديث حالة التوصيل
module.exports = router;                                 // تصدير الراوتر
