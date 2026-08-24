import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {userId} = req.params
    if(!videoId){
        throw new ApiError(400,"VideoId not found of comment")
    }
    const {page = 1, limit = 10} = req.query
    const comment = await Comment.findById({video:videoId})
    const commenteduser = await Comment.aggregate([
        {
        owner: new mongoose.Types.ObjectId(userId)
        },
        {// To get the user of comment 
            $lookup:{
                form:"users",
                localfield:"owner",
                foreign:"_id",
                as:"ownerDetail"
            }
        },
        {
            $project:{
                username:1,
                fullname:1,
                email:1
            }
        }
    ])
    return res .status(200).json(new ApiResponse(200,{comment,commenteduser},"Comment fetched successfully"))
})
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId,userId} = req.params
    const{content} = req.body
    if (!content){
        throw new ApiError(400,"content is required")
    }
    const comment = await Comment.create(
        {
            content:content,
            video:videoId,
            owner: userId
        }
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
   
})
