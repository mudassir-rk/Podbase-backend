import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    createAnnouncement,
    getUserAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
} from '../controller/announcements.controller.js';

const router = Router();
router.use(verifyJWT);

router.route("/").post(createAnnouncement);
router.route("/user/:userId").get(getUserAnnouncements);
router.route("/:announcementId").patch(updateAnnouncement).delete(deleteAnnouncement);

export { router as announcementRouter };