import express from 'express';
const router = express.Router();
import { validateBody, validateParams, schemas } from '../utils/validator.js';

import adminController from '../controllers/admin.js';

router.route('/products')
    .post(validateBody(schemas.productSchema), adminController.newProduct)

router.route('/products/:productID')
    .patch(validateParams(schemas.idSchema, 'productID'), validateBody(schemas.productSchema), adminController.updateProduct)
    .delete(validateParams(schemas.idSchema, 'productID'), adminController.deleteProduct)

router.route('/orders/:orderID/status')
    .patch(adminController.getOrderStatus)

router.route('/users')
    .get(adminController.getAllUsers)

export default router;