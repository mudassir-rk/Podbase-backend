import {Router} from 'express';
import multer from 'multer';
import { getAllVideos } from "../controller/video.controller.js";
import { getLikedVideos,toggleVideoLike } from '../controller/like.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();
router.route("/").get(getAllVideos);
router.route("/likedvideos").get(verifyJWT,getLikedVideos)
router.route("/c/like/:videoId").get(verifyJWT,toggleVideoLike)

export {router as videoRouter};