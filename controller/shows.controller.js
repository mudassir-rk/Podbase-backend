import mongoose from "mongoose"
import { Shows } from "../models/shows.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

//1.crud on cover image
//2.crud on title
//3.crud on description

const addDetails = asyncHandler(async(req,res)=>{
    const {title,description} = req.body 
    if(!title || !description){
        return res.status(400).json(new ApiResponse(400,"Fields requires for title and description"))
    }
    const creation = await Shows.create({
        title:title,
        description:description,
        owner:req.user._id,
        //coverimageurl
    })
})

if(!req.files || !req.files.coverImage || req.files.coverImage.length===0){
    throw new ApiError(401,"CoverImage file is required")
}
const CoverImageLocalPath = req.files.coverImage[0].path;

const coverImage = await uploadOnCloudinary(CoverImageLocalPath)
if(!coverImage){
    return res.status(400).json(new ApiResponse(400,"Error while uploading cover img on cloudinary"))
}

// check what happen if someone reuploaded  the coverImage