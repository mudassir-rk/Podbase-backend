import {Router} from 'express';
import multer from 'multer';
import { upload } from "../middleware/multer.js"

import { 
    getLikedVideos,
    toggleVideoLike,

} from '../controller/like.controller.js';
import {
    deleteVideo,
    getAllVideos,
    publishAVideo,
    updateVideo 
} from '../controller/video.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();
router.route("/").get(getAllVideos);
router.route("/likedvideos").get(verifyJWT,getLikedVideos)
router.route("/c/like/:videoId").get(verifyJWT,toggleVideoLike)

router.route("/plusVideo").post(
  verifyJWT,
upload.fields([
    {
        name: "video",
        maxCount: 1   
    },
    {
        name:"thumbnail",
        maxcount:1
    }
]),
  publishAVideo
)
router.route("/c/up/:videoId").patch(
    verifyJWT,
    upload.fields([

    {   name: "thumbnail",
        maxCount: 1 
    },
    {   name:"video",
        maxCount:1
    },
]),
    updateVideo
)
router.route("/delVideo/:videoId").delete(deleteVideo)

export {router as videoRouter};