import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from '../controller/subscription.controller.js';

const router = Router();
router.use(verifyJWT);

router.route("/c/:channelId").post(toggleSubscription);
router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);
router.route("/u/:subscriberId/channels").get(getSubscribedChannels);

export { router as subscriptionRouter };