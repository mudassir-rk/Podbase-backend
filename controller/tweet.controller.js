import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if(!content){
        throw new ApeError(400,"Content required")
    }
    const tweet = await Tweet.create({
        content :content,
}); 
    return res .status(200).json(new ApiResponse(200,tweet,"Tweet created scuccessfully"))
})

// const getUserTweets = asyncHandler(async (req, res) => {
//     // TODO: get user tweets
//     const {userId}=req.params
//     const tweet = await Tweet.aggregate([
//         {
//             $match:{
//                 owner: new mongoose.Types.ObjectId(userId)
//             }
//         },
//         {
//             $lookup:{
//                 from:"users",
//                 localField:"tweets",
//                 foreignField:"username"
//             }
//         }
//     ]);
//     return res .status(200).json(new ApiResponse(200,tweet,"Tweet fetched succesfully"))
// })

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
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
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const{ tweetId }= req.params
    const {content} = req.body
    if(!content){
        throw new ApeError(400,"Content required")
    }
    //tweetId → identifies which tweet document to fetch (usually from req.params)
    //owner (on that tweet document) → identifies which user created it
    
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"Tweet not found")
    }
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400,"You are not authorized to update this tweet")
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content:content,
            }
        },{
            new:true
        }
    );return res .status(200).json(new ApiResponse(200,updatedTweet,"Tweet updated Successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const{ tweetId }= req.params
    //const {content} = req.body
    // if(!content){
    //     throw new ApeError(400,"Content required")
    // }

    //tweetId → identifies which tweet document to fetch (usually from req.params)
    //owner (on that tweet document) → identifies which user created it
    
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"Tweet not found")
    }
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400,"You are not authorized to delete this tweet")
    }
    const deletedTweet = await Tweet.findByIdAndDelete(
        tweetId,
        {
            $unset:{
                content:content,
            }
        },
        {
            new:true
        }
    );
    return res 
    .status(200).json(new ApiResponse(200,deletedTweet,"Tweet deleted Successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
