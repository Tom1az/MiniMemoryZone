import express from 'express'; 
const router = express.Router();

import userController from '../controllers/user.js'; 

router.route('/')
    .get(userController.index)
    .post(userController.newUser)

router.route('/:userID')
    .get(userController.getUser)
    .put(userController.replaceUser)
    .patch(userController.updateUser)

export default router;