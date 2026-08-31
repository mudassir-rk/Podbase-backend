import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import playlistRouter from "./routes/playlist.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import showsRouter from "./routes/shows.route.js"
import announcementsRouter from "./routes/announcements.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import healthcheckRouter from "./routes/healthcheck.route.js"

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: '50kb'}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50kb' }));// url me '+' or '&20'
app.use(express.static('public'));

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/shows", showsRouter)
app.use("/api/v1/announcements", announcementsRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)

export {app};



