import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from '../controller/like.controller.js';

const router = Router();
router.use(verifyJWT); // all like routes require auth

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export { router as likeRouter };