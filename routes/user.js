import express from 'express';
const router = express.Router();
import { validateBody, validateParams, schemas } from '../utils/validator.js';

import userController from '../controllers/user.js';

router.route('/')
    .get(userController.index)
    .post(validateBody(schemas.userSchema), userController.newUser)

router.route('/:userID')
    .get(validateParams(schemas.idSchema, 'userID'), userController.getUser)
    .put(validateParams(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), userController.replaceUser)
    .patch(validateParams(schemas.idSchema, 'userID'), userController.updateUser)

export default router;