import { db } from "../src/prisma/db.ts";
import "temporal-polyfill/full/global";

const Cart = db.orm.public.Carts;
const CartItems = db.orm.public.CartItems;

const myCart = async (req, res, next) => {
    const { userID } = req.value.params;

    const cart = await Cart.first({ userId: userID});

    if (!cart) {
        return res.status(404).json({
            cart: null,
            items: [],
            message: 'Cart not found cart for the user'
        });
    }

    const cartItems = await CartItems.where({ cartId: cart.cartId }).all();

    return res.status(200).json({
        cart,
        cartItems, 
        message: 'Found the cart for the user'
    })
};

const addItem = async (req, res, next) => {
    const { userID } = req.value.params;
    const { productId, quantity } = req.value.body;

    let cart = await Cart.where({ userId: userID }).first();

    if (!cart) {
        cart = await Cart.create({ userId: userID });
    }

    const cartItem = await CartItems.create({
        cartId: cart.cartId,
        productId,
        quantity
    })

    return res.status(201).json({
        cartItem,
        message: 'Item added to the cart successfully'
    })
}

const updateQuantity = async (req, res, next) => {
    const { cartItemId } = req.value.params;
    const { quantity } = req.value.body;

    const res = await CartItems.where({ cartItemId }).update({ quantity });

    return res.status(200).json({
        message: 'Cart item quantity updated successfully'
    })
}

const removeItem = async (req, res, next) => {
    const { cartItemId } = req.value.params;

    await CartItems.where({ cartItemId }).delete();

    return res.status(200).json({
        message: 'Cart item removed successfully'
    });
} 

