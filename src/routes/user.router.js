import { Router } from "express";
import {loginUser, registerUser, logout, updatePassword} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import verifyToken from '../middlewares/auth.middleware.js'
const router = Router();
router.route("/register").post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
  );
router.route('/login').post(loginUser)
router.route('/logout').post(verifyToken, logout)
router.route('/updatePassword').post(verifyToken, updatePassword)
export default router 