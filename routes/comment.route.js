// import { Router } from 'express';
// import { verifyJWT } from '../middleware/auth.js';
// import {
//     getVideoComments,
//     addComment,
//     updateComment,
//     deleteComment
// } from '../controller/comment.controller.js';

// const router = Router();
// router.use(verifyJWT);

// router.route("/:videoId").get(getVideoComments).post(addComment);
// router.route("/c/:commentId").patch(updateComment).delete(deleteComment);

// export default  commentRouter ;
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