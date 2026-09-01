import mongoose from "mongoose"
import {Video} from "../models/videoModel.js"
import {Follow} from "../models/followModel.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/userModel.js"

const getCreatorStats = asyncHandler(async (req, res) => {
    const {userId} = req.params

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
    
    const follwerStats = await User.aggregate([
        {
            $match:{
                 _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"follows",
                localfield: "_id",
                foreignfield:"creator",
                as:"followers"
            }
        },
        {
            $addFields:{
                    followersCount:{
                        $size:"$followers"
                },
            }
        }
    ])
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        { videoStats, followerStats },
        "User dashboard fetched successfully"
    ))
})

const getCreatorVideos = asyncHandler(async (req, res) => {
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
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails"
                        }
                    },
                    {
                        $addFields: {
                            ownerDetails: {
                                $first: "$ownerDetails"
                            }
                        }
                    },
                {
                $project:{
                    fullName:1,
                    username:1,
                    avatar:1,
                    coverImage:1,
                    email:1
                }
            }

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
    getCreatorStats, 
    getCreatorVideos

}
