import express from 'express';
const router = express.Router();

import userController from '../controllers/user.js'; // Use ES6 import syntax for userController

router.route('/').get(userController.index);

export default router;