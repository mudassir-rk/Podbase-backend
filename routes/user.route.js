import {Router} from 'express';
import multer from 'multer';
import { upload } from "../middleware/multer.js";
import { verifyJWT } from '../middleware/auth.js';

import { registerUser} from "../controller/user.controller.js";
import { loginUser } from '../controller/user.controller.js';
import { logout } from '../controller/user.controller.js';

import { 
    refresh_AccessToken ,
    changeCurrentPassword,
    updateAccountDetails,
    updateAvatarImage,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getCurrentUser
} from '../controller/user.controller.js';

import  {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controller/playlist.controller.js"

import  {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controller/subscription.controller.js"
import { Video } from '../models/videoModel.js';

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
router.route("/refresh-token").post(refresh_AccessToken)
router.route("/change-pwd").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateAvatarImage)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
router.route("/watchHistory").post(getWatchHistory)
router.route("/updation").post(updateAccountDetails)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
router.route("/playlist").post(createPlaylist)
router.route("/c/:platlistId").get(verifyJWT,getPlaylistById)

router.route("/c/subscription/:channelId").get(verifyJWT,toggleSubscription)
// router.route("/plusVideo").post(
//   verifyJWT,
//   upload.fields([
//     {
//         name: "video",
//         maxCount: 1   
//     },
//     {
//         name:"thumbnail",
//         maxcount:1
//     }
// ]),
//   publishAVideo
// )
// router.route("/c/up/:videoId").patch(
//     verifyJWT,
//     upload.fields([

//     {   name: "thumbnail",
//         maxCount: 1 
//     },
//     {   name:"video",
//         maxCount:1
//     },
// ]),
//     updateVideo
// )
// router.route("/delVideo/:videoId").delete(deleteVideo)
// router.route("/thumbnail").get(getAllVideos)

// GET /api/v1/products?company=apple&name=iphone&featured=true


export { router as userRouter };


