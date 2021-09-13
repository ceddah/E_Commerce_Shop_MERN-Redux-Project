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