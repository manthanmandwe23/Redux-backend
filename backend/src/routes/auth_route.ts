import { Router } from "express";
import { upload } from "../middlewares/multer_middleware.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth_controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/getcurruser").get(verifyJWT, getCurrentUser);
export default router;


// Since you are using Multer

// If your route uses:

// upload.fields([
//   { name: "avatar", maxCount: 1 }
// ])

// then you can tell TypeScript that req.files is the object form:

// const avatarLocalPath = (req.files as { [fieldname: string]: Express.Multer.File[] })
//   ?.avatar?.[0]?.path;

// Then:

// const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
// But there is an easier way