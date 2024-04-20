import { Router } from "express";

const router = Router();

// Import Controllers
import {
  sendOtp,
  verifyOtp,
} from "../controllers/user.controller.js";

// Import Validators
import {
  sendOtpValidator, verifyOtpValidator,
  } from "../helpers/validation.js";

// Send-Otp
router.post("/send-email-otp", sendOtpValidator, sendOtp);
router.post("/verify-email-otp", verifyOtpValidator, verifyOtp);

export default router