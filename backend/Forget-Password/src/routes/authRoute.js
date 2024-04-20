import express from "express";

const router = express();

router.use(express.json());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Controllers
import {
  resetPassword,
  resetSuccess,
  updatePassword,
} from "../controllers/user.controller.js";
import bodyParser from "body-parser";

// Route Declartion
router.get("/reset-password", resetPassword); // ejs email message sent
router.post("/reset-password", updatePassword);
router.get("/reset-success", resetSuccess);

export default router;
