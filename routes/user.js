import {Router} from 'express';
import { registerUser} from "../controller/user.js";
import multer from 'multer';
import { upload } from "../middleware/multer.js";

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
export default router;