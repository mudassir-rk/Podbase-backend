
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
playlistRouter.route("/user").get(verifyJWT, getUserPlaylists);
playlistRouter.route("/:playlistId")
    .get(verifyJWT, getPlaylistById)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);
playlistRouter.route("/add/:videoId/:playlistId").patch(verifyJWT, addVideoToPlaylist);
playlistRouter.route("/rem/:videoId/:playlistId").patch(verifyJWT, removeVideoFromPlaylist);

export default playlistRouter;