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

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productCount,
        resPerPage,
        filteredProductsCount,
        products
    })
});

// Add New Product => /admin/api/v1/poducts/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user._id;
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

//Create new product Review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString() 
    );

    if(isReviewed) {
        product.reviews.forEach(review => {
            // If user already left review, find it and replace it with new review
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        sucess: true
    });
});

//Get Product Reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
     
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

//Delete Product Review => /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
     
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});