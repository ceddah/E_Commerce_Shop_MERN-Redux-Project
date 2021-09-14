const Product = require('../Models/product');

// => /api/v1/poducts
exports.getProducts = async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products: products, count: products.length });
};

// => /api/v1/poducts/new
exports.newProduct = async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({ 
        success: true,
        product: product
     })
}

// => /api/v1/product/:id
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