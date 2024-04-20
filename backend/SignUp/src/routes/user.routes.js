import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { registerValidator } from "../helpers/validation.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profile",
      maxCount: 1,
    },
    {
      name: "document",
      maxCount: 1,
    },
  ]),
  registerValidator,

  registerUser
);

export default router;
