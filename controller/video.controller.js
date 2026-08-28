import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/videoModel.js"
import {User} from "../models/userModel.js"
import{ verifyJWT} from "../middleware/auth.js"
// import {Video} from "../models/videoModel.js"
// import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    // if(query=="thumbnail"){
        
    // }

    const videoswiththumbnail = await Video.find(req.query)
    if(!videoswiththumbnail){
        throw new ApiError(400,"Query fetching for Video-thumbnail failed")
    }
    const pg = Number(req.query.page) || 1;
    const lmt = Number(req.query.limit) || 3;

    const skip = (pg - 1)*lmt;

    const apiData = apiData.skip(skip).limit(limit);
    
    return res.status(200).json(new ApiResponse(200,"Video shown success"))
})

const publishAVideo = asyncHandler(async (req, res) => {

    // TODO: get video, upload to cloudinary, create video
    //const {videId}
    // const {userId} = req.params
    
    // if(!videoId){
    //     throw new ApiError(400,"videoId required")
    // }
    // No owner ship 
    // const auth = await Video.findById(videoId)

    // if (auth.owner.toString() !== req.user._id.toString()) {
    // throw new ApiError(403, "You are not authorized to update video")}

    const { title, description} = req.body
    if(!title || !description){
        throw new ApiError(400,"fields of publish video not found")
    }
    // console.log("req.files:", req.files);
    // console.log("req.body:", req.body);
    if (!req.files || !req.files.video || req.files.video.length === 0) {
        throw new ApiError(400, "Video file is required for publishing it");
        }
    const videoLocalPath = req.files.video[0].path;
    const videoNw = await uploadOnCloudinary(videoLocalPath)
    if(!videoNw){
        throw new ApiError(400,"VideoNw not getting to cloudinary")
    }

    if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0){
        throw new ApiError(400,"Thumbnail file is required for publishing it")
    }
    const thumbnailLocalPath = req.files.thumbnail[0].path;
    const thumbnailNw = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnailNw){
        throw new ApiError(4001,"thumbnailNw not getting to cloudinary")
    }
    const newVideo = await Video.create(
        {   
            title:title,
            description:description,
            video:videoNw?.url,
            owner:req.user._id,
            thumbnail:thumbnailNw?.url
        }
    )
    return res.status(200).json(new ApiResponse(200,newVideo,"Video published successfully "))

    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    // const video = await Video.findById(videoId)
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Videoid field not found in get")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to get this  video")}
    
    return res .status(200).json(new ApiResponse(200,video,"Video fetched by Id successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    const { videoId } = req.params

    const { title, description } = req.body

    if (!videoId) {
        throw new ApiError(400, "VideoId required")
    }
    if (!title || !description) {
        throw new ApiError(403, "title required")
    }

    const auth = await Video.findById(videoId)
    if (!auth) {
        throw new ApiError(404, "Video not found")
    }
    if (auth.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update video")
    }

    if (!req.files || !req.files.video || req.files.video.length === 0) {
        throw new ApiError(400, "Video file is required")
    }
    
    const videoLocalPath = req.files.video[0].path
    const videoNw = await uploadOnCloudinary(videoLocalPath)
    if (!videoNw) {
        throw new ApiError(400, "VideoNw not getting to cloudinary")
    }

    if (!req.files || !req.files.thumbnail || req.files.thumbnail.length === 0) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    const thumbLocalPath = req.files.thumbnail[0].path
    const thumbNw = await uploadOnCloudinary(thumbLocalPath)
    if (!thumbNw) {
        throw new ApiError(400, "Thumbnail not uploaded to cloudinary")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                video: videoNw.url,
                thumbnail: thumbNw.url
            }
        },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"))
})
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new ApiError(400,"video id not found")
    }
    const video = await Video.findByIdAndDelete(videoId)
    return res.status(200).json(new ApiResponse(200,"Video Deleted successfully"))
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
