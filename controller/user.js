import { asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { verifyJWT } from "../middleware/auth.js";
import { User } from "../models/userModel.js"
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

    // const generateAccessTokenAndRefreshToken = async(userId) =>{
    //     try{
    //         const user = await User.findById(userId)
    //         const AccessToken = user.generateAccessToken()
    //         const RefreshToken = user.generateRefreshToken()

    //         user.refreshToken = refreshToken
    //         await user.save // tumhare paas already ek Mongoose document instance hai (DB se fetch kiya hua). Uske field ko directly modify karke .save() call karna sabse simple tareeka hai partial update karne ka — findByIdAndUpdate() ka alternative.
    //         ({ validateBeforeSave:false})// Mongoose by default .save() par schema ke saare validators (required fields, min length, custom validators, etc.) run karta hai. Yaha sirf refreshToken field update ho raha hai — password, email jaise doosre required fields dobara validate karne ki zarurat nahi (aur agar validation chal jaye, toh galti se error throw ho sakta hai kyunki password field yaha touch nahi ho raha but validator phir bhi check kar sakta hai). Isliye validation skip kar diya taaki sirf ye ek field save ho jaye bina kisi unrelated validation error ke.

    //         return {accessToken,refresToken}
    //     }
    //     catch(error){
    //         {
                
    //             console.log(error)
                
    //         }
    //     }
    // }
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
// const loginUser = asyncHandler(async (req,res) =>{
//     const {username,password} = req.body 
   
//     if(!username ){
//         return res.status(400).json({ // also be written as use of ApiError
//             success:false,
//             message:"Please provide all the required fields"
//         })}
//    // const user = await User.findOne({$or:[{username:username},{email:email}]})
//    const user = await User.findOne({username:username})
//    //console.log("Stored hashed password:", user.password)
//     if(!user){
//         return res.status(404).json({
//             success:false,
//             message:"User not found"
//         })
//     }
//     console.log("user before check:", user)  
// let isPasswordValid;
// try {
//   isPasswordValid = await user.isPasswordCorrect(password)
// } catch (error) {
//   console.log(error)
// }
//      if(!isPasswordValid){
//         return res.status(401).json({
//             success:false,
//             message:"Invalid credentials"
//         })}
//    //const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
// // 1. Call the function and store the raw result
// const tokenData = await generateAccessTokenAndRefreshToken(user._id);

// // 2. Check if the result is undefined or missing properties
// if (!tokenData || !tokenData.accessToken) {
//     return res.status(500).json({ message: "Failed to generate tokens" });
// }

// // 3. Now it is safe to destructure
// const { AccessToken, RefreshToken } = tokenData;
//     // console.log(accessToken)
//     const userData = await User.findById(user._id).select("-password -refreshToken")
//     return res.status(200).json(
//         new ApiResponse(200,
//             {user:userData,accessToken,refreshToken},
//             "User logged in successfully"))
//     const options  = { //for cookies
//         httpOnly:true,
//         secure:true
//     }
//     return res.status(200)
//     .cookie("refreshToken",refreshToken, options)
//     .cookie("accessToken",accessToken,options)
//     .json(new ApiResponse(200,
//         // {user:loggedInUser,accessToken,refreshToken}
//         "User logged In succesfully"
// ))
// })
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

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
        httpOnly: true,
        secure: true
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
            )
        );
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
    secure: true
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, options, "User logged out"))
})    
export {registerUser,loginUser,logout}