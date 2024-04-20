import express from "express";

const router = express();

router.use(express.json());

// Controllers
import { mailVerification } from "../controllers/user.controller.js";

// Route Declartion
router.get("/mail-verification", mailVerification); // ejs email message send

export default router;
