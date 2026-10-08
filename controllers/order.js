import { create } from "node:domain";
import { db } from "../src/prisma/db.ts";

const Orders = db.orm.public.Orders;

const myOrders = async (req, res, next) => {
    const { userId } = req.value.params;

    const orders = await Orders.where({ userId }).all();

    return res.status(200).json({
        orders,
        message: 'Found the orders for the user'
    })
}

const newOrder = async (req, res, next) => {
    const { userId } = req.value.params;
    const { orderDetails } = req.value.body;
    const cart = await db.orm.public.Carts.first({ userId });

    if (!cart) {
        return res.status(404).json({
            order: null,
            message: 'Cart not found for the user'
        });
    }

    const CartItems = await db.orm.public.CartItems.where({ cartId: cart.cartId }).all();

    if (CartItems.length === 0) {
        return res.status(400).json({
            order: null,
            message: 'Cart is empty, cannot create an order'
        });
    } else if (CartItems.some(item => item.quantity <= 0)) {
        return res.status(400).json({
            order: null,
            message: 'Cart contains items with quantity less than or equal to 0, cannot create an order'
        });
    }

    const createOrder = await db.transaction(async (tx) => {
        const order = await tx.orm.public.Orders.create({
            status: 'pending',
            userId,
            createdAt: new Date().toISOString(),
            orderDetails,
            totalProduct: CartItems.reduce((sum, items) => sum + item.quantity, 0),
        })

        for (const item in CartItems) {
            const product = await tx.orm.public.Products.first({ productId: item.productId});
            
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            await tx.orm.public.OrderItems.create({
                orderId: order.orderId,
                quantity: item.quantity,
                price: product.price,
                productId: item.productId
            })
        }
    })

    return res.status(201).json({
        createOrder,
        message: 'Order created successfully'
    })
}

const getOrder = async (req, res, next) => {
    const { orderId } = req.value.params;

    const order = await Orders.first({ orderId });

    if (!order) {
        return res.status(404).json({
            order: null,
            message: 'Order not found'
        });
    }

    return res.status(200).json({
        order,
        message: 'Found the order'
    })
}