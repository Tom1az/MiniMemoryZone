import express from 'express';
const router = express.Router();
import { validateBody, validateParams, schemas } from '../utils/validator.js';

import orderController from '../controllers/order.js';

router.route('/')
    .get(validateParams(schemas.idSchema, 'userID'), orderController.myOrders)
    .post(validateParams(schemas.idSchema, 'userID'), validateBody(schemas.orderSchema), orderController.newOrder)


router.route('/:orderId')
    .get(validateParams(schemas.idSchema, 'orderId'), orderController.getOrder)

export default router;