import { asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJWT } from "../middleware/auth.js";
import { User } from "../models/userModel.js"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found for token generation");
        }

        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

       
        user.refreshToken = refreshToken;

        
        await user.save({ validateBeforeSave: false });


        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error inside generateAccessTokenAndRefreshToken:", error);
        throw error; 
    }
}
const registerUser = asyncHandler(async (req,res) =>{
    const {email,username,password,fullName} = req.body
    
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
    //const avatarLocalPath = req.files?.avatar[0]?.path; // ?.[0] optional chaining array index ke liye bhi use ho rahi hai, taaki agar avatar undefined ho toh crash na ho.

    if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
    throw new ApiError(400, "Avatar file is required");
    }

    const avatarLocalPath = req.files.avatar[0].path;

    if(!req.files || !req.files.coverImage || req.files.coverImage.length === 0) {
        throw new ApiError(400, "Cover image file is required");
    }
    const coverImageLocalPath = req.files.coverImage[0].path;

    if(!avatarLocalPath) {
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
            message: "Avatar file is required while uploading on cloudinary"
        })
    }
    const newUser = await User.create({ // create user in db
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", 
        email, 
        password,
        username: username.toLowerCase()
    })
   const createdUser = await User.findById(newUser._id).select("-password -refreshToken") // '-' used to remove pwd and rfsh token
   if(!createdUser){
    return res.status(500).json({
        success:false,
        message:"User creation failed"
    })}
   return res.status(201).json(new ApiResponse(201,createdUser,"User created successfully"))
})
const loginUser = asyncHandler(async (req, res) => {
    const { username,password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }
    
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'Lax'
    };
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            ));
});
const logout = asyncHandler(async(req,res) =>{

  await User.findByIdAndUpdate( 
    req.user._id,
    {
      $unset: { refreshToken: 1 }
    },
    { new: true }
  )
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, options, "User logged out"))
});
const refresh_AccessToken = asyncHandler(async (req,res)=>{
    const incomingrefreshToken = req.cookies?.refreshToken
    console.log("result breakdown:",incomingrefreshToken)
    if(!incomingrefreshToken){
        throw new ApiError(401,"Refresh token is missing")
    }
    let user;
    try {
        const decodedToken = jwt.verify(
            incomingrefreshToken , process.env.REFRESH_TOKEN_SECRET
        )
        user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        if(incomingrefreshToken!== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    } catch(error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
   
    const options ={
        httpOnly : true,
        secure : true
    }
    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    return res 
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{accessToken , refreshToken},"access token refreshed "))
}) 
const changeCurrentPassword = asyncHandler(async(req,res) =>{
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user._id) //user_id come from auth middleware bcz of next(),it is possible bcz user's must logs'in to change it's paswd   
    console.log(user)
    try {
        const paswdChecking = await user.isPasswordCorrect(oldPassword)//used from userModel it checks password --> gives true or false
        console.log("Something",paswdChecking)
        if(!paswdChecking){
            throw new ApiError(401,"Invalid old password")
        }
        user.password = newPassword
        await user.save({validateBeforeSave:"false"})
    } catch (error) {
        
    } 
    return res.status(200).json(new ApiResponse(200,"Password changed succcesfully"))
})
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})
const updateAccountDetails = asyncHandler(async(req,res)=>{
const {fullName,email} = req.body
if(!fullName || !email){
    throw new ApiError(400,"All fields are required")
}
const user = User.findByIdAndUpdate(req.user?._id,
    {
        $set:{
            fullName,
            email
    }
    },
        {new:true}
).select("-password");
return res.status(200).json(new ApiResponse(200,"Account details Updated Succesfully"))
})
const updateAvatarImage = asyncHandler(async(req,res)=>{
    
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image not found")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar cloudinary")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {   $set :
            {
                avatar: avatar.url
            }
        },
        {new:true}
    )
    return res.status(200).json(new ApiResponse(200,user,"avatar uploaded"))
})
const updateCoverImage = asyncHandler(async (req, res) => {
    
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "CoverImage file not found");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage?.url) {
        throw new ApiError(400, "Error while uploading CoverImage to cloudinary");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "CoverImage uploaded successfully"));
});


const getUserProfile = asyncHandler(async(req, res) => {
    const {username} = req.params
    if(!username?.trim()){  
        throw new ApiError(400, "username is missing")
    }

    const profile = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()?.trim()
            }
        },
        {
           
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followers"
            }
        },
        {
           
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "following"
            }
        },
        {
            $addFields: {
                followersCount: {
                    $size: "$followers"
                },
                followingCount: {
                    $size: "$following"
                },
                isFollowing: {
                    $cond: {
                        if: { $in: [req.user?._id, "$followers.follower"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                followersCount: 1,
                followingCount: 1,
                isFollowing: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if(!profile?.length){
        throw new ApiError(404, "user does not exist")
    }

    return res.status(200).json(
        new ApiResponse(200, profile[0], "User profile fetched successfully")
    )
})
const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                //req.user._id-- not directly bcz , Aggregation are not used methods of mongoose to extact orig Id 
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{ 
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHist",
                pipeline:[
                    {  
                       $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                            {
                                $project:{
                                    fullName:1,
                                    username:1,
                                    avatar:1
                                }
                            }
                        ]
                       } 
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])
    //console.log(user)
    //console.log(owner)
    return res.status(200).json(new ApiResponse(200,user[0].watchHistory,
        "WatchHistory fetched succesflly"
    ))
})
export {registerUser,loginUser,logout,refresh_AccessToken,changeCurrentPassword,updateAccountDetails,updateAvatarImage,updateCoverImage,getUserProfile,getWatchHistory,getCurrentUser};
