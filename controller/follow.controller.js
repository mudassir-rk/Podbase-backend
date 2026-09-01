import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/userModel.js"
import { Follow } from "../models/followModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleFollow = asyncHandler(async (req, res) => {
    const {creatorId} = req.params

    if(!isValidObjectId(creatorId)){
        throw new ApiError(400, "creatorId is not valid")
    }

    if(creatorId.toString() === req.user._id.toString()){
        throw new ApiError(400, "You are not allowed to follow yourself")
    }

    const existingFollow = await Follow.findOne({
        following: creatorId,
        follower: req.user._id,
    })

    if(existingFollow){
        await Follow.findByIdAndDelete(existingFollow._id)
        return res.status(200).json(
            new ApiResponse(200, {following: false}, "Unfollowed successfully")
        )
    }

    const newFollow = await Follow.create({
        following: creatorId,
        follower: req.user._id,
    })

    return res.status(200).json(
        new ApiResponse(200, newFollow, "Followed successfully")
    )
})

const getUserCreatorFollowers = asyncHandler(async (req, res) => {
    const {creatorId} = req.params

    if(!isValidObjectId(creatorId)){
        throw new ApiError(400, "Invalid creator Id")
    }

    // const followers = await Follow.find({
    //     following: creatorId,
    // })
const followers = await Follow.aggregate([
    {
        $match: {
            following: new mongoose.Types.ObjectId(creatorId)
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "follower",
            foreignField: "_id",
            as: "followerDetails"
        }
    },
    {
        $addFields: {
            totalCount: {
                $size: "$followerDetails"
            }
        }
    },
    {
        $unwind: "$followerDetails"//this will convert the array of followerDetails into a single object for each document in the result set. If there are multiple followerDetails, it will create multiple documents in the result set, one for each followerDetail.
        //for ex:- before -->followerDetails: [ { fullName: "Alice" } ] After -->followerDetails: { fullName: "Alice" }
    },
    {
        $project: {
            _id: 0,
            fullName: "$followerDetails.fullName",
            username: "$followerDetails.username",
            avatar:   "$followerDetails.avatar"
        }
    },
       
])
const totalCount = followers.length
    return res.status(200).json(
        new ApiResponse(200, { followers, totalCount }, "List of followers fetched successfully")
    )
})

const getFollowedCreators = asyncHandler(async (req, res) => {
    const {followerId} = req.params

    if(!isValidObjectId(followerId)){
        throw new ApiError(400, "Invalid follower Id")
    }

    const following = await Follow.find({
        follower: followerId,
    })

    return res.status(200).json(
        new ApiResponse(200, following, "List of followed creators fetched successfully")
    )
})

export {
    toggleFollow,
    getUserCreatorFollowers,
    getFollowedCreators
}