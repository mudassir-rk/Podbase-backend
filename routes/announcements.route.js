import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    createAnnouncement,
    getUserAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
} from '../controller/announcements.controller.js';

const announcementRouter = Router();
// router.use(verifyJWT);

announcementRouter.route("/").post(createAnnouncement);
announcementRouter.route("/user/:userId").get(getUserAnnouncements);
announcementRouter.route("/:announcementId").patch(updateAnnouncement).delete(deleteAnnouncement);

export default announcementRouter 