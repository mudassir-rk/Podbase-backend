import {Router} from 'express';
import multer from 'multer';
import { getAllVideos } from "../controller/video.controller.js";

const router = Router();

router.route("/").get(getAllVideos);

export {router as videoRouter};