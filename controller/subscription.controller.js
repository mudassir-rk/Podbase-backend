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
    // const subs = await Subscription.findById(SubscriptionId
    // )
    const subs = await Subscription.findOne({
        channel:channeId,
        subscriber:req.user._id,
    })
    //whole bcz i want doc Id with channelID
    if(!subs){
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
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
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
