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

    const followers = await Follow.find({
        following: creatorId,
    })

    return res.status(200).json(
        new ApiResponse(200, followers, "List of followers fetched successfully")
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