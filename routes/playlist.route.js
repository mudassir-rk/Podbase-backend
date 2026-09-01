// import { Router } from 'express';
// import { verifyJWT } from '../middleware/auth.js';
// import {
//     createPlaylist,
//     getUserPlaylists,
//     getPlaylistById,
//     addVideoToPlaylist,
//     removeVideoFromPlaylist,
//     deletePlaylist,
//     updatePlaylist
// } from '../controller/playlist.controller.js';

// const router = Router();
// router.use(verifyJWT);

// router.route("/").post(createPlaylist);
// router.route("/user/:userId").get(getUserPlaylists);
// router.route("/:playlistId")
//     .get(getPlaylistById)
//     .patch(updatePlaylist)
//     .delete(deletePlaylist);
// router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
// router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

// export default playlistRouter 
import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from '../controller/playlist.controller.js';

const playlistRouter = Router();

playlistRouter.route("/").post(verifyJWT, createPlaylist);
playlistRouter.route("/user/:userId").get(verifyJWT, getUserPlaylists);
playlistRouter.route("/:playlistId")
    .get(verifyJWT, getPlaylistById)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);
playlistRouter.route("/add/:videoId/:playlistId").patch(verifyJWT, addVideoToPlaylist);
playlistRouter.route("/rem/:videoId/:playlistId").patch(verifyJWT, removeVideoFromPlaylist);

export default playlistRouter;