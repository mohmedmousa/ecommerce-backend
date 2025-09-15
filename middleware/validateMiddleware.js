const { validationResult } = require('express-validator');

// Middleware للتحقق من وجود أخطاء في البيانات
const validateRequest = (req, res, next) => {
  const errors = validationResult(req); // يجيب كل الأخطاء من الـ validators
  if (!errors.isEmpty()) {
    // لو في أخطاء يرجعها
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // لو مفيش أخطاء → يكمل
};

module.exports = validateRequest;
