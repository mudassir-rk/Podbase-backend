import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import {userRouter} from "../routes/user.route.js";
 import {videoRouter} from "../routes/video.route.js";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: '50kb'}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50kb' }));// url me '+' or '&20'
app.use(express.static('public'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
export {app};

