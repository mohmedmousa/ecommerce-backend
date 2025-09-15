const Order = require('../models/orderModel');   // استيراد موديل الأوردر

// @desc   Create new order
// @route  POST /api/orders
// @access Private (user)
const addOrderItems = async (req, res) => {
  // استخراج البيانات من body
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // لو مفيش عناصر في الأوردر → رجّع خطأ
  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else {
    // إنشاء order جديد مربوط بالمستخدم الحالي (من protect middleware)
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // حفظ الأوردر في قاعدة البيانات
    const createdOrder = await order.save();

    // رجّع الأوردر الجديد كـ response
    res.status(201).json(createdOrder);
  }
};

// @desc   Get logged in user orders
// @route  GET /api/orders/myorders
// @access Private (user)
const getMyOrders = async (req, res) => {
  // البحث عن كل الأوردرز الخاصة بالمستخدم الحالي
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc   Get all orders (Admin)
// @route  GET /api/orders
// @access Private/Admin
const getAllOrders = async (req, res) => {
  // البحث عن كل الأوردرز مع ضم بيانات المستخدم (name و email)
  const orders = await Order.find({}).populate('user', 'id name email');
  res.json(orders);
};

// @desc   Update order to Paid
// @route  PUT /api/orders/:id/pay
// @access Private (user)
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc   Update order to Delivered
// @route  PUT /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = {
  addOrderItems,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
};

