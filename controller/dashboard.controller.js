import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models.user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {userId} = req.params
    // const {vidoId} = req.params
    // const {likeId} = req.params
    //const {subscriptionId} = req.params
    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count: "totalVideos"
        }
    ])
    
    const subscriberStats = await User.aggregate([
        {
            $match:{
                 _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localfield: "_id",
                foreignfield:"channel",
                as:"subscribers"
            }
        },
        {
            $addFields:{
                    subscribersCount:{
                        $size:"$subscribers"
                },
            }
        }
    ])
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        { videoStats, subscriberStats },
        "User dashboard fetched successfully"
    ))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {userId} = req.params
    if(!userId){
        throw new ApiError(400,"UserId not available")
    }
    const userVideo = await Video.aggregate([
        {
            $match:{
                owner : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        },
    ]) 
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        userVideo,
        "User dashboard fetched successfully"
    ))
})

export {
    getChannelStats, 
    getChannelVideos
}
