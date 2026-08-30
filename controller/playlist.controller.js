import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/videoModel.js"

import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/userModel.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name){
        throw new ApiError(400,"name of playlist not found")
    }
    if(!description){
        throw new ApiError(400,"description of playlist not found")
    }
    //TODO: create playlist
    const newplaylist = await Playlist.create({
        name: name,
        description: description, 
        owner:req.user._id,
    })
    return res 
    .status(200)
    .json(new ApiResponse(200,newplaylist,"Playlist created successfully"))
    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
  
    //TODO: get user playlists

// 1. Decide what "get user playlist" actually means
// Do you want:

// All playlists created by a user? (probably this)
// Or one specific playlist?

// Since you said "using userId" (not playlistId), you're fetching all playlists owned by that user.

// 2. Which field connects Playlist → User?
// Go check your Playlist schema — there should be a field like owner that stores a User._id. That's your filter key.

// 3. Do you even need aggregate here?
// Ask yourself: do you just want the playlists as-is, or do you also want extra info like:

// number of videos in each playlist
// thumbnail/preview of first video
// total views across the playlist

// If it's just "get playlists where owner = userId" → plain Playlist.find({ owner: userId }) is enough.
// If you want computed fields (video count, etc.) → now you're in aggregate() territory.

// 4. Validate the userId
// Before querying — is userId a valid Mongo ObjectId? What happens if garbage is passed in req.params? You may want to check/convert it (similar to how you did new mongoose.Types.ObjectId(...) in your first draft).

// 5. Match stage (if using aggregate)
// Your first pipeline stage should filter playlists belonging to that owner — this is the aggregate equivalent of find({owner: userId}).

// 6. Optional lookup stage
// If you want video details/count per playlist, this is where $lookup comes in — joining playlists to videos collection, similar to what you attempted earlier (but now correctly).

// 7. Optional computed fields
// If you want "total videos" or "total duration" per playlist, think about $addFields + $size (for count) or $sum (for duration) — but only if you actually need these; don't over-engineer if simple find() suffices.

// 8. Response
// Don't forget to actually check: what if the user has zero playlists? Is an empty array a valid success response,

    const playlist = await Playlist.aggregate([
        {
            $match:{
                owner : new mongoose.Types.ObjectId(userId)
            }
        },
        {   $lookup:{
                from :"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videosInPlaylist"
            }
        },
        {
            $addFields:{
                videosInPlaylistcount :{
                    $size:"$videosInPlaylist"
                }
            }
        },
    ])
    return res .status(200).json(new ApiResponse(200,playlist,"Playlists fetched by user successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to add video in this playlist")
    }
    return res 
    .status(200)
    .json( new ApiResponse(200,playlist,"Playlist fetched succesfully"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const {playlistId, videoId} = req.params

    const vidplaylist = await Playlist.findById(playlistId)
    console.log(req.user._id)
    if(!vidplaylist){
        throw new ApiError(400,"playlist not found")
    }
//     if (vidplaylist.owner.toString() !== req.user._id.toString()) {
//     throw new ApiError(403, "You are not authorized to add video in this playlist")
    
// }
    const video = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet:{
                videos : videoId
            }
        },
        {new:true}
    )

    // const video = await Playlist.aggregate([
    //     {
    //         $match:{
    //             _id:new mongoose.Types.ObjectId(playlistId)
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"videos",
    //             localField:"playlists",
    //             foreignField:"videoFile",
    //             as:"newvideos",
    //             pipeline:[
    //         {   //from playlist to users
    //                    $lookup:{
    //                     from:"users",
    //                     localField:"owner",
    //                     foriegnField:"_id",
    //                     as:"owner",
    //                     pipeline:[
    //                         {
    //                             $project:{
    //                                 fullName:1,
    //                                 username:1,
    //                                 avatar:1
    //                             }
    //                         }
    //                     ]
    //                 }
    //         }]
    //     }
    // }
    // ])
    return res
        .status(200)
        .json(new ApiResponse(200 ,video ,"Video added updated successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const remvideo = await Playlist.findId(playlistId)
    if(!remvideo){
        throw new ApiError(400,"playlist Id are not present")
    }
    if (remvideo.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist")
    }
    const video = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos : videoId
            }
        },{
            new:true
        }
    )
    return res
        .status(200)
        .json(new ApiResponse(200 ,video ,"Video removed successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const vidplaylist = await Playlist.findById(playlistId)
    if(!vidplaylist){
        throw new ApiError(400,"playlist not found")
    }
    if (vidplaylist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to del this playlist")
    } 
    const delplaylist = await Playlist.findByIdAndDelete(playlistId,
        {
            $unset:{
               playlist:playlistId
            }
        }
    )
    return res
        .status(200)
        .json(new ApiResponse(200, delplaylist, "Playlist deleted successfully"))
})

// const updatePlaylist = asyncHandler(async (req, res) => {
//     
//     const {playlistId} = req.params
//     const {name, description} = req.body
//     //TODO: update playlist
//     if(!name){
//         throw new ApiError(400,"Name of Playlist not Found")
//     }
//     if(!description){
//         throw new ApiError(400,"description of playlist not found")
//     }
    
//     const playlist = await Playlist.findByIdAndUpdate(
//         playlistId,
//     {
//         $set:
//         {
//             name: name,
//             description:description
//         }
//     },
//     {new :true}
// ).select("-password")
//     return res
//         .status(200)
//         .json(new ApiResponse(200, "Playlist uploaded successfully"));

const updatePlaylist = asyncHandler(async (req, res) => {
    //req.params = values extracted from the URL path itself, based on the :paramName placeholders you define when setting up the route.
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!name) {
        throw new ApiError(400, "Name of Playlist not found")
    }
    if (!description) {
        throw new ApiError(400, "Description of playlist not found")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    //checks actual logged in user id 
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name:name,
                description:description
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
