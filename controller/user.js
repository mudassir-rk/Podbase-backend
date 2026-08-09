import { asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import {ApiResponse} from "../utils/ApiResponse.js"
    //STEPS TO REGISTER USER-->>
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    //To check each step, we can use console log for it.

const registerUser = asyncHandler(async (req,res,next) =>{
    const {email,username,password,fullName} = req.body
    // console.log("email",email);
    console.log("username",username);
    console.log("password",password);
   
    if(!email || !username || !password){
        return res.status(400).json({ // also be written as use of ApiError
            success:false,
            message:"Please provide all the required fields"
        })}
    const userExists = await User.findOne({$or:[{email:email},{username:username}]})
    if(userExists){
        return res.status(409).json({
            success:false,
            message:"User with email or username already exists"
        })
    }
    console.log("req.files", req.files);
    // if (existedUser) {
    //     throw new ApiError(409, "User with email or username already exists")
    // }
    // //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path; // ?.[0] optional chaining array index ke liye bhi use ho rahi hai, taaki agar avatar undefined ho toh crash na ho.
    // if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
    // throw new ApiError(400, "Avatar file is required");
    // }
    // const avatarLocalPath = req.files.avatar[0].path;

    if(!req.files || !req.files.coverImage || req.files.coverImage.length === 0) {
        throw new ApiError(400, "Cover image file is required");
    }
    const coverImageLocalPath = req.files.coverImage[0].path;

    if (!avatarLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Avatar file is required"
        })
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        return res.status(400).json({
            success: false,
            message: "Avatar file is required"
        })
    }

    const newUser = await User.create({ // create user in db
        fullName,
        // avatar: avatar.url,
        // coverImage: coverImage?.url || "", 
        email, 
        password,
        username: username.toLowerCase()
    })
   const createdUser = await User.findById(newUser._id).select("-password -refreshToken") // '-' used to remove pwd and rfsh token
   if(!createdUser){
    return res.status(500).json({
        success:false,
        message:"User creation failed"
    })
   }
   return res.status(201).json(new ApiResponse(201,createdUser,"User created successfully"))
})
export {registerUser}