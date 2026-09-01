
import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from '../controller/comment.controller.js';

const commentRouter = Router();

commentRouter.route("/:videoId")
.get(verifyJWT, getVideoComments)
.post(verifyJWT, addComment);

commentRouter.route("/c/:commentId").patch(verifyJWT, updateComment).delete(verifyJWT, deleteComment);

export default commentRouter;