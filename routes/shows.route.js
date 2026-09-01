import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import {
    addDetails,
    getShowById,
    updateShow,
    deleteShow,
} from '../controller/shows.controller.js';

const showsRouter = Router();

showsRouter.route("/").post(
    verifyJWT,
    upload.single("coverImage"),
    addDetails
);
showsRouter.route("/:showId")
    .get(getShowById)
    .patch(verifyJWT, upload.single("coverImage"), updateShow)
    .delete(verifyJWT, deleteShow);

export default showsRouter;