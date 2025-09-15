const mongoose = require('mongoose');  // استيراد mongoose للتعامل مع MongoDB

// تعريف Schema للـ order item (كل عنصر داخل الأوردر)
const orderItemSchema = mongoose.Schema(
  {
    name: { type: String, required: true },            // اسم المنتج
    qty: { type: Number, required: true },             // الكمية
    image: { type: String, required: true },           // صورة المنتج
    price: { type: Number, required: true },           // سعر المنتج
    product: {                                         // ربط المنتج بالـ Product Model
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  { _id: false } // مش محتاجين ID منفصل لكل orderItem
);

// تعريف Schema الأساسي للـ Order
const orderSchema = mongoose.Schema(
  {
    user: {                                            // المستخدم اللي عمل الأوردر
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [orderItemSchema],                     // مصفوفة من العناصر
    shippingAddress: {                                 // عنوان الشحن
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },   // وسيلة الدفع
    paymentResult: {                                   // نتيجة الدفع (لما نربط PayPal أو Stripe)
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },    // مجموع أسعار المنتجات
    shippingPrice: { type: Number, required: true, default: 0.0 }, // مصاريف الشحن
    totalPrice: { type: Number, required: true, default: 0.0 },    // السعر الكلي
    isPaid: { type: Boolean, required: true, default: false },     // حالة الدفع
    paidAt: { type: Date },                                        // تاريخ الدفع
    isDelivered: { type: Boolean, required: true, default: false },// حالة التوصيل
    deliveredAt: { type: Date },                                   // تاريخ التوصيل
  },
  {
    timestamps: true,   // يضيف createdAt و updatedAt تلقائي
  }
);

const Order = mongoose.model('Order', orderSchema); // إنشاء موديل Order

module.exports = Order; // تصدير الموديل
