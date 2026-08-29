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
    const videolike = await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    })
    if(videolike){
        await Like.findByIdAndDelete(videolike._id)
    }
    else{    
        await Like.create({
            video:videoId,
            likedBy:req.user._id
        })
    }
    return res.status(200).json(new ApiResponse(200,videolike,"toggle like on video succesfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Comment Id required")
    }
    const comment = await Like.findOne({
        comment:commentId,
        commentBy:req.user._id
    })
    // if -->yes(present) delete it
    // else--> create one
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    // const likedVideo = await Video.find({
    // })
    
    // means show all those document of Video in which there is Id of that video in like model 
    // const likedVideo = await Like.findById(
    //     {
    //         likedBy:req.user._id
    //     }
    // ).select("video")
    // const video = await Video.findById(likedVideo).select("video thumbnail")
//
// OPTION--1
//     const video = await Like.aggregate([{
//         $match:{
//             likedBy: new mongoose.Types.ObjectId(req.user._id),
//         }
//     },
//     {
//         $lookup:{
//             from:"videos",
//             localField:"video",
//             foreignField:"_id",
//             as:"allLikedVideos",
//             pipeline:[{
//                 $project:{
//                     video :1,
//                     thumbnail :1,
//                     title :1,
//                     description:1,
//                     owner:1,
//             }}]
//         }
//     },
// ])

//OPTION--2,

    const likes = await Like.find({likedBy:req.user._id})
    const videoIds = likes.map(like=>like.video)
    //(parameter) => expression
    //in simple-->
    //likes.map(function(like) {
    // return like.video
    // })
    const videos = await Video.find({_id:{$in:videoIds}}).select("video thumbnail title")
    //$in at a time only one video fetched

    return res.status(200).json(new ApiResponse(200,likes,videos,"Videos fetched successfully with likes"))
})


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}