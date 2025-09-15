const jwt = require('jsonwebtoken');                // استيراد jwt للتحقق من التوكن
const User = require('../models/user');             // استيراد موديل المستخدم

// Middleware لحماية الروت - يتأكد من أن المستخدم عنده توكن صالح
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')  // التأكد من وجود توكن في الهيدر
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // استخراج التوكن

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // فك التوكن

      req.user = await User.findById(decoded.id).select('-password'); // جلب بيانات المستخدم بدون الباسورد

      next(); // المتابعة لو كل شيء تمام
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' }); // التوكن غير صالح
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' }); // لا يوجد توكن
  }
};

// Middleware للتحقق من صلاحية الأدمن
const adminOnly  = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // المستخدم أدمن → كمل
  } else {
    res.status(403).json({ message: 'Not authorized as admin' }); // مش أدمن → ارفض
  }
};

module.exports = { protect, adminOnly }; // تصدير الـ middleware
