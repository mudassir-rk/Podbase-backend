// import {Router} from 'express';
// import { upload } from "../middleware/multer.js";
// import { verifyJWT } from '../middleware/auth.js';

// import { 
//     getLikedVideos,
//     toggleVideoLike,
// } from '../controller/like.controller.js';
// import {
//     deleteVideo,
//     getAllVideos,
//     publishAVideo,
//     updateVideo 
// } from '../controller/video.controller.js';
// import {
//     createPlaylist,
//     getUserPlaylists,
//     getPlaylistById,
//     addVideoToPlaylist,
//     removeVideoFromPlaylist,
//     deletePlaylist,
//     updatePlaylist
// } from "../controller/playlist.controller.js";

// import { addDetails } from '../controller/shows.controller.js';

// const router = Router();

// router.route("/").get(getAllVideos);
// router.route("/likedvideos").get(verifyJWT, getLikedVideos);
// router.route("/c/like/:videoId").post(verifyJWT, toggleVideoLike);

// router.route("/plusVideo").post(
//     verifyJWT,
//     upload.fields([
//         { name: "video", maxCount: 1 },
//         { name: "thumbnail", maxCount: 1 }
//     ]),
//     publishAVideo
// );

// router.route("/c/update/:videoId").patch(
//     verifyJWT,
//     upload.fields([
//         { name: "thumbnail", maxCount: 1 },
//         { name: "video", maxCount: 1 },
//     ]),
//     updateVideo
// );

// router.route("/delVideo/:videoId").delete(verifyJWT, deleteVideo);


// router.route("/c/pl/:playlistId").get(verifyJWT, getPlaylistById);
// router.route("/playlist").post(verifyJWT, createPlaylist);
// router.route("/shows").post(verifyJWT,addDetails);
// router.route("/c/vidInPlaylist/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist)



// export default videoRouter
import { Router } from 'express';
import { upload } from "../middleware/multer.js";
import { verifyJWT } from '../middleware/auth.js';

import { 
    getLikedVideos,
    toggleVideoLike,
} from '../controller/like.controller.js';
import {
    deleteVideo,
    getAllVideos,
    publishAVideo,
    updateVideo 
} from '../controller/video.controller.js';
// import {
//     createPlaylist,
//     getUserPlaylists,
//     getPlaylistById,
//     addVideoToPlaylist,
//     removeVideoFromPlaylist,
//     deletePlaylist,
//     updatePlaylist
// } from "../controller/playlist.controller.js";

import { addDetails } from '../controller/shows.controller.js';

const videoRouter = Router();

videoRouter.route("/").get(getAllVideos);
videoRouter.route("/likedvideos").get(verifyJWT, getLikedVideos);
videoRouter.route("/c/like/:videoId").post(verifyJWT, toggleVideoLike);

videoRouter.route("/plusVideo").post(
    verifyJWT,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishAVideo
);

videoRouter.route("/c/update/:videoId").patch(
    verifyJWT,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]),
    updateVideo
);

videoRouter.route("/delVideo/:videoId").delete(verifyJWT, deleteVideo);

// videoRouter.route("/c/pl/:playlistId").get(verifyJWT, getPlaylistById);
// videoRouter.route("/playlist").post(verifyJWT, createPlaylist);
// videoRouter.route("/shows").post(verifyJWT, addDetails);

// videoRouter.route("/c/vidInPlaylist/:playlistId/:videoId").patch(verifyJWT, addVideoToPlaylist);

export default videoRouter;