import express from 'express';
const router = express.Router();
import { validateBody, validateParams, schemas } from '../utils/validator.js';

import cartController  from '../controllers/cart.js';

router.route('/')
    .get(cartController.myCart)

router.route('/items')
    .post(validateParams(schemas.productIdSchema), validateBody(schemas.cartItemSchema), cartController.addItem)

router.route('/items/:cartItemId')
    .patch(validateParams(schemas.cartItemIdSchema, 'cartItemId'), validateBody(schemas.updateCartItemSchema), cartController.updateQuantity)
    .delete(validateParams(schemas.cartItemIdSchema, 'cartItemId'), cartController.removeItem)

export default router;