// import mongoose from "mongoose"
// import { Shows } from "../models/shows.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// //1.crud on cover image
// //2.crud on title
// //3.crud on description

// const addDetails = asyncHandler(async(req,res)=>{
//     const {title,description} = req.body 
//     if(!title || !description){
//         throw new ApiError(400,"Fields requires for title and description")
//     }
//     const creation = await Shows.create({
//         title:title,
//         description:description,
//         owner:req.user._id,
//         //coverimageurl
//     })
//     return res.status(200).json(new ApiResponse(200,creation,"added details successfully"))
// })

// // if(!req.files || !req.files.coverImage || req.files.coverImage.length===0){
// //     throw new ApiError(401,"CoverImage file is required")
// // }
// // const CoverImageLocalPath = req.files.coverImage[0].path;

// // const coverImage = await uploadOnCloudinary(CoverImageLocalPath)
// // if(!coverImage){
// //     // return res.status(400).json(new ApiResponse(400,"Error while uploading cover img on cloudinary"))
// // }

// // check what happen if someone reuploaded  the coverImage

// export {addDetails}
import mongoose, {isValidObjectId} from "mongoose"
import {Show} from "../models/shows.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

// create a new show
const addDetails = asyncHandler(async (req, res) => {
    const {title, description} = req.body

    if(!title?.trim()){
        throw new ApiError(400, "Title is required")
    }

    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage?.url){
        throw new ApiError(400, "Error while uploading cover image")
    }

    const show = await Show.create({
        title,
        description: description || "",
        coverImage: coverImage.url,
        owner: req.user._id
    })

    if(!show){
        throw new ApiError(500, "Something went wrong while creating the show")
    }

    return res.status(201).json(
        new ApiResponse(201, show, "Show created successfully")
    )
})

// get a single show by id
const getShowById = asyncHandler(async (req, res) => {
    const {showId} = req.params

    if(!isValidObjectId(showId)){
        throw new ApiError(400, "Invalid show Id")
    }

    const show = await Show.findById(showId).populate("owner", "username fullName avatar")

    if(!show){
        throw new ApiError(404, "Show not found")
    }

    return res.status(200).json(
        new ApiResponse(200, show, "Show fetched successfully")
    )
})

// update show details (title, description, coverImage)
const updateShow = asyncHandler(async (req, res) => {
    const {showId} = req.params
    const {title, description} = req.body

    if(!isValidObjectId(showId)){
        throw new ApiError(400, "Invalid show Id")
    }

    const show = await Show.findById(showId)

    if(!show){
        throw new ApiError(404, "Show not found")
    }

    if(show.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to update this show")
    }

    const updateFields = {}
    if(title?.trim()) updateFields.title = title
    if(description !== undefined) updateFields.description = description

    const coverImageLocalPath = req.file?.path
    if(coverImageLocalPath){
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        if(!coverImage?.url){
            throw new ApiError(400, "Error while uploading cover image")
        }
        updateFields.coverImage = coverImage.url
    }

    const updatedShow = await Show.findByIdAndUpdate(
        showId,
        {$set: updateFields},
        {new: true}
    )

    return res.status(200).json(
        new ApiResponse(200, updatedShow, "Show updated successfully")
    )
})

// delete a show
const deleteShow = asyncHandler(async (req, res) => {
    const {showId} = req.params

    if(!isValidObjectId(showId)){
        throw new ApiError(400, "Invalid show Id")
    }

    const show = await Show.findById(showId)

    if(!show){
        throw new ApiError(404, "Show not found")
    }

    if(show.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to delete this show")
    }

    await Show.findByIdAndDelete(showId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Show deleted successfully")
    )
})

export {
    addDetails,
    getShowById,
    updateShow,
    deleteShow
}