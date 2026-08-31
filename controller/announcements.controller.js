// import mongoose, { isValidObjectId } from "mongoose"
// import {Announcements} from "../models/announcements.model.js"
// import {User} from "../models/userModel.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const createTweet = asyncHandler(async (req, res) => {
//     //TODO: create tweet
//     const {content} = req.body

//     if(!content){
//         throw new ApeError(400,"Content required")
//     }
//     const tweet = await Tweet.create({
//         content :content,
// }); 
//     return res .status(200).json(new ApiResponse(200,tweet,"Tweet created scuccessfully"))
// })

// // const getUserTweets = asyncHandler(async (req, res) => {
// //     // TODO: get user tweets
// //     const {userId}=req.params
// //     const tweet = await Tweet.aggregate([
// //         {
// //             $match:{
// //                 owner: new mongoose.Types.ObjectId(userId)
// //             }
// //         },
// //         {
// //             $lookup:{
// //                 from:"users",
// //                 localField:"tweets",
// //                 foreignField:"username"
// //             }
// //         }
// //     ]);
// //     return res .status(200).json(new ApiResponse(200,tweet,"Tweet fetched succesfully"))
// // })

// const getUserTweets = asyncHandler(async (req, res) => {
//     const { userId } = req.params

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//         throw new ApiError(400, "Invalid userId")
//     }

//     const tweets = await Tweet.aggregate([
//         {
//             $match: {
//                 owner: new mongoose.Types.ObjectId(userId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "owner",
//                 foreignField: "_id",
//                 as: "ownerDetails"
//             }
//         },
//         {
//             $addFields: {
//                 ownerDetails: {
//                     $first: "$ownerDetails"
//                 }
//             }
//         }
//     ])

//     return res
//         .status(200)
//         .json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
// })

// const updateTweet = asyncHandler(async (req, res) => {
//     //TODO: update tweet
//     const{ tweetId }= req.params
//     const {content} = req.body
//     if(!content){
//         throw new ApeError(400,"Content required")
//     }
//     //tweetId → identifies which tweet document to fetch (usually from req.params)
//     //owner (on that tweet document) → identifies which user created it
    
//     const tweet = await Tweet.findById(tweetId)
//     if(!tweet){
//         throw new ApiError(400,"Tweet not found")
//     }
//     if(tweet.owner.toString() !== req.user._id.toString()){
//         throw new ApiError(400,"You are not authorized to update this tweet")
//     }
//     const updatedTweet = await Tweet.findByIdAndUpdate(
//         tweetId,
//         {
//             $set:{
//                 content:content,
//             }
//         },{
//             new:true
//         }
//     );return res .status(200).json(new ApiResponse(200,updatedTweet,"Tweet updated Successfully"))
// })

// const deleteTweet = asyncHandler(async (req, res) => {
//     //TODO: delete tweet
//     const{ tweetId }= req.params
//     //const {content} = req.body
//     // if(!content){
//     //     throw new ApeError(400,"Content required")
//     // }

//     //tweetId → identifies which tweet document to fetch (usually from req.params)
//     //owner (on that tweet document) → identifies which user created it
    
//     const tweet = await Tweet.findById(tweetId)
//     if(!tweet){
//         throw new ApiError(400,"Tweet not found")
//     }
//     if(tweet.owner.toString() !== req.user._id.toString()){
//         throw new ApiError(400,"You are not authorized to delete this tweet")
//     }
//     const deletedTweet = await Tweet.findByIdAndDelete(
//         tweetId,
//         {
//             $unset:{
//                 content:content,
//             }
//         },
//         {
//             new:true
//         }
//     );
//     return res 
//     .status(200).json(new ApiResponse(200,deletedTweet,"Tweet deleted Successfully"))
// })

// export {
//     createTweet,
//     getUserTweets,
//     updateTweet,
//     deleteTweet
// }

import { isValidObjectId } from "mongoose";
import { Announcements } from "../models/announcement.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAnnouncement = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const announcement = await Announcements.create({
        content,
        owner: req.user?._id
    });

    if (!announcement) {
        throw new ApiError(500, "Something went wrong while creating the announcement");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, announcement, "Announcement created successfully"));
});

const getUserAnnouncements = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const announcements = await Announcements.find({ owner: userId }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, announcements, "User announcements fetched successfully"));
});

const updateAnnouncement = asyncHandler(async (req, res) => {
    const { announcementId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(announcementId)) {
        throw new ApiError(400, "Invalid announcement id");
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const announcement = await Announcements.findById(announcementId);

    if (!announcement) {
        throw new ApiError(404, "Announcement not found");
    }

    if (announcement.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this announcement");
    }

    announcement.content = content;
    await announcement.save();

    return res
        .status(200)
        .json(new ApiResponse(200, announcement, "Announcement updated successfully"));
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { announcementId } = req.params;

    if (!isValidObjectId(announcementId)) {
        throw new ApiError(400, "Invalid announcement id");
    }

    const announcement = await Announcements.findById(announcementId);

    if (!announcement) {
        throw new ApiError(404, "Announcement not found");
    }

    if (announcement.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this announcement");
    }

    await Announcements.findByIdAndDelete(announcementId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Announcement deleted successfully"));
});

export {
    createAnnouncement,
    getUserAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
};