import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import {
    addDetails,
    getAllShows,
    getShowById,
    updateShow,
    deleteShow
} from '../controller/shows.controller.js';

const router = Router();

router.route("/").get(getAllShows).post(
    verifyJWT,
    upload.single("coverImage"),
    addDetails
);
router.route("/:showId")
    .get(getShowById)
    .patch(verifyJWT, upload.single("coverImage"), updateShow)
    .delete(verifyJWT, deleteShow);

export { router as showsRouter };