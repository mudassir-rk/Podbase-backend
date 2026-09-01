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

    const remvideo = await Playlist.findById(playlistId)
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

const updatePlaylist = asyncHandler(async (req, res) => {
    
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
