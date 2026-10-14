import express from "express";
import { schemas, validateBody, validateParams } from "../utils/validator.js";

import userController from "../controllers/user.js";

const router = express.Router();

router.route("/").get(userController.index);

router
  .route("/:userID")
  .get(validateParams(schemas.idSchema, "userID"), userController.getUser)
  .put(
    validateParams(schemas.idSchema, "userID"),
    validateBody(schemas.userSchema),
    userController.replaceUser,
  )
  .patch(validateParams(schemas.idSchema, "userID"), userController.updateUser);

export default router;
