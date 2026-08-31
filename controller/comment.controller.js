import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User} from "../models/userModel.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    //getVideoComments

    // Wrong query — Comment.findById(videoId) looks for a comment whose _id equals videoId. But videoId is the video's ID, not a comment's ID. You need Comment.find({ video: videoId }) to get all comments belonging to that video.
    // Pagination unused — You pull page and limit from the query string but never actually use them anywhere (no .skip(), .limit(), or aggregation paginate). So they're dead code right now.
    // No existence check for the video — If someone passes a videoId that doesn't exist, you still just query comments (which will return empty) instead of telling the user "video not found."
    // No owner/user info attached — Usually you'd want to show who wrote each comment (populate the owner field), which isn't happening here.
const {videoId} = req.params
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
})
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    //     addComment
    // No response sent back — After Comment.create(...), there's no res.status(...).json(...). The request will just hang forever from the client's perspective — this is the biggest bug.
    // Missing owner field — You're not saving who made the comment (usually req.user._id from auth middleware). So you'll have comments with no author.
    // No validation on content — If content is empty or missing, you're still trying to create a comment. Should check if(!content?.trim()) and throw an ApiError.
    // No check that the video exists — Similar to above, you could be attaching a comment to a videoId that doesn't exist in the DB at all.
    // No error handling if Comment.create fails — Not necessarily needed since asyncHandler will catch thrown errors, but if create returns falsy/null (rare, but possible in some edge cases) you don't guard against it.
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

    );
    return res .status(200).json(new ApiResponse(200,comment,"Comment added successfully"))
})
   const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const comment = await Comment.findByIdAndUpdate({
                    video:videoId
            },
            {
                $set:{
                    content:content,
                }
            },
            {
                new:true
            }
    )
    return res .status(200).json(new ApiResponse(200,"Comment updated successfully"))
})
const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {videoId} = req.params
    const comment = await Comment.findByIdAndDelete({video:videoId},
        {
            $unset:{
                content:content,
            }
        },
        {
            new :true
        }
    ); 
    return res .status(200).json(new ApiResponse(200,"Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }
