const Product = require('../Models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')

// => Get All Products /api/v1/poducts
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)
    const products = await apiFeatures.query;
    res.status(200).json({ 
        success: true,
        products: products,
        productCount: productCount,
        count: products.length 
    });
});

// Add New Product => /admin/api/v1/poducts/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({ 
        success: true,
        product: product
     })
});

// Get Single Product Details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product: product
    });
});

// Update Product => /admin/api/v1/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product: product
    });
});

// Delete Product => /admin/api/v1/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    };

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
});