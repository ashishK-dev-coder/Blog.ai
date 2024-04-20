import {Router} from "express";

// import Controllers
import {
  deleteUser,
  google,
    loginUser,
    logout,
    refreshToken,
    updateProfile,
    userProfile,
  } from "../controllers/user.controller.js";

  import {
    loginValidator,
    updateProfileValidator,
  } from "../helpers/validation.js";


const router = Router();

// Route
// router.route("/login").post(loginUser)
router.route("/login").post(loginValidator, loginUser);
router.route("/google").post(google);

// Secure route
import authMiddleware from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.middleware.js";

router.route("/get-profile").get(authMiddleware, userProfile);
router.route("/update-profile/:id").post(
    authMiddleware,
    // updateProfileValidator,
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
    updateProfile
  );
  router.route("/refresh-token").post(authMiddleware, refreshToken);
  router.route("/logout").post(authMiddleware, logout);
  router.route("/delete/:id").delete(authMiddleware, deleteUser);


export default router