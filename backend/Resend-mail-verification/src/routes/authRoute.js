import express from "express";

const router = express();

router.use(express.json());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Controllers
import {
  mailVerification,
} from "../controllers/user.controller.js";
import bodyParser from "body-parser";

// Route Declartion
router.get("/mail-verification", mailVerification); // ejs email message send

export default router;
