import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/videoModel.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    // const likedvideo = await Like.findById({video:videoId})
    //it does not works as {video:videoId} bcz it is object and likedvideo(findbyid) finds for by id  
    const likedVideo = await Like.aggregate([
        {
            $match:{
                videoId: new mongoose.Types.ObjectId(Video._id)
            }
        },
        {    
            $lookup:{
                from:"videos",
                localFeild:"likedBy",
                foreignFeild:"_id",
                as:"userLiked",
            }
        },
        {
            $addFields:{
                like:$userliked
            }
        }
    ])
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}