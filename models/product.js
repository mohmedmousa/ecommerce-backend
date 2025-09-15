const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },   // اسم المستخدم اللي كتب الريفيو
    rating: { type: Number, required: true }, // التقييم
    comment: { type: String, required: true },// التعليق
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',                            // ربط الريفيو بالمستخدم
    },
    
  },
  {
    timestamps: true, // يحتفظ بتاريخ إنشاء وتحديث الريفيو
  }
);

// تعريف الـ schema (الهيكل) الخاص بالمنتجات
const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,           // نوع البيانات نص
        required: true,         // هذا الحقل مطلوب
        trim: true              // إزالة الفراغات الزائدة من بداية ونهاية النص
      },
      description: {
        type: String,           // وصف المنتج
        required: true
      },
      price: {
        type: Number,           // سعر المنتج
        required: true
      },
      image: {
        type: String,           // رابط صورة المنتج (مسار أو URL)
        required: true
      },
      brand: {
        type: String,           // اسم العلامة التجارية
        required: true
      },
      category: {
        type: String,           // فئة المنتج (إلكترونيات، ملابس، إلخ)
        required: true
      },
      countInStock: {
        type: Number,           // عدد القطع المتوفرة في المخزون
        required: true,
        default: 0              // القيمة الافتراضية هي 0 لو مش متحددة
      },
      rating: {
        type: Number,           // تقييم المنتج
        required: true,
        default: 0
      },
      numReviews: {
        type: Number,           // عدد المراجعات
        required: true,
        default: 0
      },
      user: {
        type: mongoose.Schema.Types.ObjectId, // الربط بمستخدم (المسؤول عن إنشاء المنتج)
        required: true,
        ref: 'User'             // الإشارة إلى موديل User
      },
      reviews: [reviewSchema],
    },
    {
      timestamps: true // تفعيل خاصية إنشاء تاريخ الإنشاء والتحديث تلقائيًا (createdAt و updatedAt)
    }
  );
  
  module.exports = mongoose.model('Product', productSchema);