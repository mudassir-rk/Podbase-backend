import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/videoModel.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    //1- Validate videoId 
    //2- Use Like.findOne({ video: videoId ,likedBy: req.user._id }) to check existence
    //3- If found → delete it (unlike)
    //4- If not found → create it (like)

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    // const likedvideo = await Like.findById({video:videoId})
    //it does not works as {video:videoId} bcz it is object and likedvideo(findbyid) finds for by id  
    // const likedVideo = await Like.aggregate([
    //     {
    //         //$match works for --. $match: { videoId: ... } — wrong field name
    //         // Your Like schema (based on our earlier discussion) has fields named video, comment, tweet, and likedBy — not videoId. $match filters based on actual field names in the document, so matching on a field that doesn't exist (videoId) will just return zero results, silently. It should be:
    //         $match:{
    //             video: new mongoose.Types.ObjectId(videoId)
    //         }
    //     },
    //     {    
    //         $lookup:{
    //             from:"videos",
    //             localFeild:"likedBy",
    //             foreignFeild:"_id",
    //             as:"userLiked",
    //         }
    //     },
    //     {
    //         $addFields:{
    //             like:$userliked
    //         }
    //     }
    // ])
    const likedvideo = await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    })
    if(likedvideo){
        await Like.findByIdAndDelete(likedvideo._id)
    }
    else{    
        await Like.create({
            video:videoId,
            likedBy:req.user._id
    })}
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