import express from "express";
import { schemas, validateBody } from "../utils/validator.js";

import authController from "../controllers/auth.js";

const router = express.Router();

router
  .route("/signup")
  .post(validateBody(schemas.userSchema), authController.signUp);

router
  .route("/signin")
  .post(validateBody(schemas.authSignInSchema), authController.signIn);

export default router;
