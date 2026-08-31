import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    getChannelStats,
    getChannelVideos
} from '../controller/dashboard.controller.js';

const router = Router();
router.use(verifyJWT);

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export { router as dashboardRouter };