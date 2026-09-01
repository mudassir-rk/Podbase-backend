import {ApiError} from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import cookieParser from 'cookie-parser'

export const verifyJWT = asyncHandler (async(req,res,next) =>{
    
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("Header:", req.header("Authorization")) // <- this is probably your log
        console.log(token)
        if(!token){
        throw new ApiError(401,"Unathorized request")
        }

        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken)
        // matches accesstokens of users and memory
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        // console.log(user)
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }

        req.user = user;
        next()
        //console.log("Cookies:", req.cookies)
console.log("Header:", req.header("Authorization"))
})
