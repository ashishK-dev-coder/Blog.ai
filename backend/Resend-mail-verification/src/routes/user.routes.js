import { Router } from "express";
import { sendMailVerification } from "../controllers/user.controller.js";


const router = Router();

import {
    sendMailVerificationValidator,
  } from "../helpers/validation.js";

// Route
router.post(
    "/resend-mail-verification",
    sendMailVerificationValidator,
    sendMailVerification
  );

export default router