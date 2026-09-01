// import { Router } from 'express';
// import { verifyJWT } from '../middleware/auth.js';
// import {
//     getChannelStats,
//     getChannelVideos
// } from '../controller/dashboard.controller.js';

// const router = Router();
// router.use(verifyJWT);

// router.route("/stats").get(getChannelStats);
// router.route("/videos").get(getChannelVideos);

// export default  dashboardRouter 
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