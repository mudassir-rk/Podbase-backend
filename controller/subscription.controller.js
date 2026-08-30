import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/userModel.js"
import { Subscription } from "../models/subscriptionModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"channelId is not Valid")
    }
    if(channelId.toString() !== req.user._id.toString()){
        // throw new ApiError(400,"U are not allowed to subscribe Yourself")
    
    const subs = await Subscription.findOne({
        channel:channelId,
        subscriber:req.user._id,
    })
    // inside subs either null or {
    //   _id: "64abc123...",
    //   channel: "64def456...",
    //   subscriber: "64ghi789...",
    //   createdAt: "2026-08-15T10:30:00Z",
    //   updatedAt: "2026-08-15T10:30:00Z",
    //   __v: 0
    // }

    //whole bcz i want doc Id with channelID
    if(subs){
        
        await Subscription.findByIdAndDelete(subs._id)
    }
    else{
        await Subscription.create(
            {
                channel:channelId,
                subscriber:req.user._id,
            })
    }
    return res.status(200).json(new ApiResponse(200,subs,"Subscription"))
    }
    else{
        throw new ApiError(400,"u are not allowed to sub")
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel Id")
    }
    
    const subscribers = await Subscription.find({
        channel :channelId,
        subscriber :req.user._id,
    })
    return res .status(200).json(new ApiResponse(200,subscribers,"list of channels who u subscribes"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
