import express from 'express';
const router = express.Router();
import { validateBody, validateParams, schemas } from '../utils/validator.js';

import productController  from '../controllers/user.js';

router.route('/')
    .get(productController.index)

router.route('/:productId')
    .get(validateParams(schemas.productIdSchema), productController.getProduct)

export default router;