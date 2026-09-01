import { Router } from 'express';
import { upload } from "../middleware/multer.js";
import { verifyJWT } from '../middleware/auth.js';

import {
    registerUser,
    logout,
    loginUser,
    refresh_AccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateAvatarImage,
    updateCoverImage,
    getUserProfile,
    getWatchHistory,
    getCurrentUser
} from "../controller/user.controller.js";


const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logout);
userRouter.route("/refresh-token").post(refresh_AccessToken);
userRouter.route("/change-pwd").post(verifyJWT, changeCurrentPassword);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatarImage);
userRouter.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
userRouter.route("/updation").patch(verifyJWT, updateAccountDetails);
userRouter.route("/history").get(verifyJWT, getWatchHistory);

userRouter.route("/c/profile/:username").get(verifyJWT, getUserProfile);


export default userRouter;
