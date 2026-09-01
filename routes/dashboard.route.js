import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    getCreatorStats,
    getCreatorVideos
} from '../controller/dashboard.controller.js';

const dashboardRouter = Router();

dashboardRouter.route("/stats").get(verifyJWT, getCreatorStats);
dashboardRouter.route("/videos").get(verifyJWT, getCreatorVideos);

export default dashboardRouter;