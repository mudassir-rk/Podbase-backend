import {Router} from 'express';
import { registerUser} from "../controller/user.js";
import { loginUser } from '../controller/user.js';
import { logout } from '../controller/user.js';
import multer from 'multer';
import { upload } from "../middleware/multer.js";
import { verifyJWT } from '../middleware/auth.js';
const router = Router()
router.route("/register").post(
upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logout)
export default router;