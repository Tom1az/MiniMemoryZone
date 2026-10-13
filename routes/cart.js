import express from 'express';
const router = express.Router();
import { validateBody, validateParams, schemas } from '../utils/validator.js';

import cartController  from '../controllers/cart.js';

router.route('/')
    .get(cartController.myCart)

router.route('/items')
    .post(validateParams(schemas.idSchema), validateBody(schemas.cartItemSchema), cartController.addItem)

router.route('/items/:cartItemId')
    .patch(validateParams(schemas.idSchema, 'cartItemId'), validateBody(schemas.updateCartItemSchema), cartController.updateQuantity)
    .delete(validateParams(schemas.idSchema, 'cartItemId'), cartController.removeItem)

export default router;