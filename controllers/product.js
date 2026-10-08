import { db } from '../prisma/db.js';

const Products = db.orm.public.Products;

const index = async (req, res, next) => {
    try {
        const products = await Products.all();

        return res.status(200).json({
            products,
            message: 'You requested the list of products'
        });
    } catch (err) {
        next(err);
    }
};

const getProduct = async (req, res, next) => {
    const { productId } = req.value.params;

    const product = await Products.first({ productId });

    return res.status(200).json({
        product,
        message: 'Found a product'
    })
};

export default {
    index, 
    getProduct
}