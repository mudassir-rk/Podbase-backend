import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/videoModel.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
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
    
    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Comment Id required")
    }
    const comment = await Like.findOne({
        comment:commentId,
        commentBy:req.user._id
    })

})

const getLikedVideos = asyncHandler(async (req, res) => {
    

    const likes = await Like.find({likedBy:req.user._id})
    const videoIds = likes.map(like=>like.video)
    
    const videos = await Video.find({_id:{$in:videoIds}}).select("video thumbnail title")

    return res.status(200).json(new ApiResponse(200,likes,videos,"Videos fetched successfully with likes"))
})


export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}