const Product = require('../Models/product');

// => Get All Products /api/v1/poducts
exports.getProducts = async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products: products, count: products.length });
};

// Add New Product => /admin/api/v1/poducts/new
exports.newProduct = async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({ 
        success: true,
        product: product
     })
}

// Get Single Product Details => /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({ 
            success: false,
            message: 'Product not Found.' 
        })
    }

    res.status(200).json({
        success: true,
        product: product
    });
}

// Update Product => /admin/api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({ 
            success: false,
            message: 'Product not Found.' 
        })
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
}

// Delete Product => /admin/api/v1/product/:id
exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({ 
            success: false,
            message: 'Product not Found.' 
        })
    };

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
}