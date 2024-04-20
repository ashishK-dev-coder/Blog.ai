import { Router } from "express";
import { forgetPassword } from "../controllers/user.controller.js";


const router = Router();

import {
  passwordResetValidator,
  } from "../helpers/validation.js";

// Route
router.post("/forget-password", passwordResetValidator, forgetPassword);

export default router