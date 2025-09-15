const Product = require('../models/product'); // استيراد موديل Product للتعامل مع المنتجات من قاعدة البيانات

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const pageSize = 5; // عدد المنتجات في كل صفحة
    const page = Number(req.query.page) || 1; // الصفحة الحالية (default = 1)

    // فلترة بالاسم (لو فيه keyword)
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword, // regular expression
            $options: 'i', // i = case insensitive (كبيرة/صغيرة مش فارقة)
          },
        }
      : {};

    // نجيب عدد المنتجات الكلي (للحساب)
    const count = await Product.countDocuments({ ...keyword });

    // نجيب المنتجات (مع limit و skip عشان pagination)
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize), // إجمالي عدد الصفحات
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // البحث عن منتج باستخدام ID من الباراميتر

    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // في حالة عدم وجود المنتج
    }

    res.status(200).json(product); // إرسال المنتج لو موجود
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message }); // إرسال خطأ داخلي في حالة فشل العملية
  }
};

// ...

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    // إنشاء منتج جديد بناءً على البيانات المرسلة من الواجهة (body)
    const product = new Product({
      user: req.user._id,
      name: req.body.name,              // اسم المنتج
      price: req.body.price,            // السعر
      description: req.body.description,// الوصف
      image: req.body.image,            // رابط الصورة
      brand: req.body.brand,            // العلامة التجارية
      category: req.body.category,      // التصنيف
      countInStock: req.body.countInStock, // عدد القطع المتاحة
    });

    const createdProduct = await product.save(); // حفظ المنتج في قاعدة البيانات

    res.status(201).json(createdProduct); // إرسال المنتج الجديد كرد بـ status 201 (تم الإنشاء)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message }); // إرسال رد في حالة حدوث خطأ
  }
};

//update product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // ناخد ID من الباراميتر
    const { name, price, description, image, brand, category, countInStock } = req.body; // ناخد البيانات الجديدة من الـ body

    // نبحث عن المنتج
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // لو مش موجود نرجع 404
    }

    // نحدّث القيم
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    // نحفظ التغييرات
    const updatedProduct = await product.save();

    res.json(updatedProduct); // نرجع المنتج المحدث
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


//delete product

exports.deleteProduct = async (req, res) => {
  try {
    // استخراج الـ ID من الباراميتر
    const productId = req.params.id;

    // البحث عن المنتج في قاعدة البيانات
    const product = await Product.findById(productId);

    // لو المنتج مش موجود نرجّع 404
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // حذف المنتج من قاعدة البيانات
    await product.deleteOne();

    // إرسال رسالة نجاح
    res.json({ message: 'Product removed successfully' });

  } catch (error) {
    // لو حصل خطأ داخلي نرجّع 500
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//=============================================================

exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // check لو المستخدم كتب review قبل كده
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // نضيف الريفيو
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // نعيد حساب متوسط التقييم
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};