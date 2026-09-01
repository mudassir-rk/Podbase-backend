import mongoose from "mongoose"
import {Video} from "../models/videoModel.js"
import {Follow} from "../models/followModel.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/userModel.js"

const getCreatorStats = asyncHandler(async (req, res) => {
    
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        throw new ApiError(400, "Invalid UserId")
    }

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1
            }
        }
    ])

    const followerStats = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followed",
                as: "followers"
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "following"
            }
        },
        {
            $addFields: {
                followersCount: { $size: "$followers" },
                followingCount: { $size: "$following" }
            }
        },
        {
            $project: {
                followersCount: 1,
                followingCount: 1
            }
        }
    ])

    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        followersCount: followerStats[0]?.followersCount || 0,
        followingCount: followerStats[0]?.followingCount || 0
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            stats,
            "Creator stats fetched successfully"
        ))
})

const getCreatorVideos = asyncHandler(async (req, res) => {


    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        throw new ApiError(400, "Invalid UserId")
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
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
                ownerDetails: { $first: "$ownerDetails" }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                videoFile: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                "ownerDetails.fullName": 1,
                "ownerDetails.username": 1,
                "ownerDetails.avatar": 1,
                "ownerDetails.coverImage": 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            videos,
            "Creator videos fetched successfully"
        ))
})

export { getCreatorStats, getCreatorVideos }
