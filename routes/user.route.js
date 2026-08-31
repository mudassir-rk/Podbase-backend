import {Router} from 'express';
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
    getUserChannelProfile,
    getWatchHistory,
    getCurrentUser
} from "../controller/user.controller.js";

import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controller/subscription.controller.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refresh_AccessToken);
router.route("/change-pwd").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatarImage);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/updation").patch(verifyJWT, updateAccountDetails);
router.route("/history").get(verifyJWT, getWatchHistory);

router.route("/c/profile/:username").get(verifyJWT, getUserChannelProfile);

router.route("/c/subscription/:channelId").post(verifyJWT, toggleSubscription);
router.route("/c/subschannel/:channelId").get(verifyJWT, getUserChannelSubscribers);


export { router as userRouter };
