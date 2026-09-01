import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from '../controller/like.controller.js';

const likeRouter = Router();

likeRouter.route("/toggle/v/:videoId").post(verifyJWT, toggleVideoLike);
likeRouter.route("/toggle/c/:commentId").post(verifyJWT, toggleCommentLike);
likeRouter.route("/toggle/t/:tweetId").post(verifyJWT, toggleTweetLike);
likeRouter.route("/videos").get(verifyJWT, getLikedVideos);

export default likeRouter;