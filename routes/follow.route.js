// import { Router } from 'express';
// import { verifyJWT } from '../middleware/auth.js';
// import {
//     toggleSubscription,
//     getUserChannelSubscribers,
//     getSubscribedChannels
// } from '../controller/subscription.controller.js';

// const router = Router();
// router.use(verifyJWT);

// router.route("/c/:channelId").post(toggleSubscription);
// router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);
// router.route("/u/:subscriberId/channels").get(getSubscribedChannels);

// export default subscriptionRouter ;
import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    toggleFollow,
    getUserCreatorFollowers,
    getFollowedCreators
    
} from '../controller/follow.controller.js';

const followRouter = Router();

followRouter.route("/c/follow/:creatorId").post(verifyJWT, toggleFollow);
followRouter.route("/c/creatorfol/:creatorId").get(verifyJWT, getUserCreatorFollowers);
followRouter.route("/u/folcreator/:followerId").get(verifyJWT, getFollowedCreators);

export default followRouter;