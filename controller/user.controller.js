import { asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJWT } from "../middleware/auth.js";
import { User } from "../models/userModel.js"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// STEPS TO REGISTER USER---->>
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
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found for token generation");
        }

        // 1. Corrected casing to match return variables
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // 2. Assign correctly named variable
        user.refreshToken = refreshToken;

        // 3. Clean .save() syntax
        await user.save({ validateBeforeSave: false });

        // 4. Return matching variable names
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error inside generateAccessTokenAndRefreshToken:", error);
        throw error; 
    }
}
const registerUser = asyncHandler(async (req,res) =>{
    const {email,username,password,fullName} = req.body
    //console.log("username",username);
    
    if(!email || !username || !password){
        return res.status(400).json({ // also be written as use of ApiError
            success:false,
            message:"Please provide all the required fields"
        })}
    // If no User present similar OR no any First user It simply --> it gives null     
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
            message: "Avatar file is required"
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
    //STEPS TO LOGIN USER-->>
    // get username or email and pasword from req body ->data
    // validation - not empty
    // check if user exists: username, email
    // check for password match
    // generate access token and refresh token
    // save refresh token in db
    // return res with access token and refresh tokenh
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
    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    // Fetch user without sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'Lax'
    };
    // Send response with cookies and JSON body together
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

  await User.findByIdAndUpdate( // bcz rfrshToken store on db 
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
    //to send refreshToken to cookies options are required before gen or after
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
        await user.save({validateBeforeSave:"false"})//refrence in usermodel defined functn --> saves the updated password 
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
    //request from auth middleware required=>>>>> Client request bhejta hai apne login cookie ke saath — "kaun sa user hai" nahi jaanta =>>>> (middleware) verifyJWT us cookie ke token ko decode karke DB me exact user dhoondh leta hai
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
    //Removed the try/catch — since this is wrapped in asyncHandler, thrown errors (including ApiError) should be caught by your global error-handling middleware instead of being silently swallowed.
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
const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {username}= req.params
        if(!username?.trim()){  
        throw new ApiError(400,"username is missing")
    }
    // match method in aggregationUser.find({username})
    const channel = await User.aggregate([{
        $match:{
            username: username?.toLowerCase()?.trim()
            }
        },
        {
        // interchange concept bcz --> channel  + subxiber = 1 Document in which channel may be high proportion of same no. and user may  be high prption of diffrnt no.
        // so count same thing distinct come with itself from docm
            $lookup:{
                from:"subscriptions",
                localField: "_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField: "_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
            {
                $addFields:{
                    subscribersCount: {
                            $size: "$subscribers"
                        },
                    subscribedToCount: {
                            $size: "$subscribedTo" 
                        },
                    isSubscribed:{
                        $cond:{
                            if:{$in:[req.user?._id,"$subscribers.subscriber"]},//in array of subs find for object of sub
                            then:true,
                            else:false
                        }
                    }  
                    
                }
        },
        {
    $project:{
        fullName:1,
        username:1,
        subscribersCount:1,
        subscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1
    }
}
    ])
    console.log("username param:", username);
    console.log("channel result:", channel);
    // if(!channel?.length){
    //     throw new ApiError(404,"channel does not exists")
    // }
return res.status(200).json(new ApiResponse(200,channel,"User channel created fetched successfully"))
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
            $lookup:{ //from users to videos
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHist",
                pipeline:[
                    {   //from video to users
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
        {//to easier to find owner from array
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
export {registerUser,loginUser,logout,refresh_AccessToken,changeCurrentPassword,updateAccountDetails,updateAvatarImage,updateCoverImage,getUserChannelProfile,getWatchHistory,getCurrentUser};
